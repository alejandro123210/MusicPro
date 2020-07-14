/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable no-undef */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  Alert,
} from 'react-native';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {GoogleSignin} from '@react-native-community/google-signin';
import {removeFCM} from '../subComponents/BackendComponents/BackendFunctions';
import {loadPaymentMethods} from '../subComponents/BackendComponents/HttpRequests';

let deviceWidth = Dimensions.get('window').width;

const settings = ({userData}) => {
  onDeletePress = () => {
    Alert.alert(
      'Are you sure?',
      'are you sure you want to delete your account?',
      [
        {text: 'Delete', onPress: () => deleteAccount()},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  signOut = async () => {
    //turns off FCM and removes the token
    removeFCM(userData);
    //removing listener
    var db = firebase.database();
    db.ref(`users/${userData.uid}/info/lessons`).off();
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      firebase
        .auth()
        .signOut()
        .then(function () {
          // Sign-out successful.
          Actions.Login({userData: null});
        })
        .catch(function (error) {
          alert('Sorry, there was a problem signing you out!');
        });
    } catch (error) {
      // console.error(error);
      alert(error);
    }
  };

  deleteAccount = async () => {
    let db = firebase.database();
    let userLessonsRef = db.ref(`users/${userData.uid}/info/lessons`);
    let userMessagesRef = db.ref(`Messages/${userData.uid}`);
    // db.ref(`teachers/${userData.uid}`).remove();
    db.ref(`geofire/${userData.subject}/${userData.uid}`).remove();
    //this turns off the listener that's created by loadLessons
    userLessonsRef.off();
    userLessonsRef.once('value').then((snapshot) => {
      var lessonData = JSON.parse(JSON.stringify(snapshot.val()));
      for (date in lessonData) {
        for (lessonKey in lessonData[date]) {
          db.ref(
            `users/${lessonData[date][lessonKey].teacherIDNum}/info/lessons/${lessonData[date][lessonKey].date}/${lessonData[date][lessonKey].teacherLessonKey}`,
          ).remove();
        }
      }
      db.ref(`users/${userData.uid}`).remove();
    });
    userMessagesRef.once('value').then((snapshot) => {
      var messagesData = JSON.parse(JSON.stringify(snapshot.val()));
      for (userID in messagesData) {
        db.ref(`Messages/${userID}/${userData.uid}`).remove();
        console.log(userID);
      }
      userMessagesRef.remove();
    });
    var user = firebase.auth().currentUser;
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    user.delete().then(
      function () {
        Actions.Login({userData: null});
        alert('Account has been deleted');
      },
      function (error) {
        // An error happened.
      },
    );
  };

  const paymentsScreen = async () => {
    if (userData.userType === 'teacher') {
      var db = firebase.database();
      var ref = db.ref(`users/${userData.uid}/info/stripeID`);
      ref.once('value').then((dataSnapshot) => {
        var stripeSet;
        if (dataSnapshot.val() !== null) {
          stripeSet = true;
          Actions.PaymentsScreen({userData, stripeSet});
        } else {
          stripeSet = false;
          Actions.PaymentsScreen({userData, stripeSet});
        }
      });
    } else {
      const paymentMethods = await loadPaymentMethods(userData);
      const cards = paymentMethods;
      Actions.PaymentsScreen({userData, stripeSet: true, cards});
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{uri: userData.photo}} style={styles.imageMain} />
      </View>
      <Text style={styles.nameText}>{userData.name}</Text>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => onDeletePress()}>
          <Text style={styles.deleteAccountText}> Delete Account </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => signOut()}>
          <Text style={styles.logoutText}> Logout </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => Actions.ReportBugsPage({userData})}>
          <Text style={{fontSize: 15}}> Report a Bug </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => paymentsScreen()}>
          <Text style={{fontSize: 15}}> Payments </Text>
        </TouchableOpacity>
        {userData.userType === 'teacher' ? (
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => Actions.EditProfile({userData})}>
            <Text style={{fontSize: 15}}> Edit Profile </Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  imageContainer: {
    width: deviceWidth / 3,
    alignItems: 'center',
    paddingTop: 20,
  },
  imageMain: {
    width: deviceWidth / 3,
    height: deviceWidth / 3,
    borderRadius: 100,
    marginTop: 5,
  },
  nameText: {
    fontSize: 20,
    paddingTop: 20,
    width: deviceWidth - 10,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    width: deviceWidth - 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    height: 50,
    width: deviceWidth,
    backgroundColor: 'white',
  },
  bottomButtonsContainer: {
    flexDirection: 'column-reverse',
    flex: 1,
    marginBottom: 30,
  },
  logoutText: {
    color: '#00aced',
    fontSize: 15,
  },
  deleteAccountText: {
    color: 'red',
    fontSize: 15,
  },
});

export default settings;
