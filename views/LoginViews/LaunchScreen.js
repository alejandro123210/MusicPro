/* eslint-disable eqeqeq */
import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Actions} from 'react-native-router-flux';
import {GoogleSignin} from '@react-native-community/google-signin';
import * as firebase from 'firebase';

class LaunchScreen extends React.Component {
  componentDidMount() {
    GoogleSignin.configure({
      webClientId:
        '506122331327-cobrmqrn49efksceiebado4s3nmmi5g7.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      forceConsentPrompt: true,
      iosClientId:
        '506122331327-ioaoru8o5prnmdfl40r5jo94kqhb6aa0.apps.googleusercontent.com',
    });
    this.getCurrentUserInfo();
  }

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('attempting to sign in silently');
      this.setState({userInfo});
      // alert(userInfo)
      //auto login:
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      firebase
        .auth()
        .signInWithCredential(googleCredential)
        .then(appUser => {
          var user = firebase.auth().currentUser;
          var db = firebase.database();
          var ref = db.ref(`users/${user.uid}/info/`);
          ref.once('value').then(function(snapshot) {
            //if the user DOES have data in the database:
            var userData = snapshot.val();
            // alert(userData)
            //this is the user type (teacher/student)
            if (userData != null) {
              //if they have data in the database
              var userType = JSON.stringify(userData.userType);
              //here if the function finds if the user is a student/teacher, it loads each respective view
              console.log(userType);
              if (userType == '"student"') {
                //if the user is a student
                Actions.StudentMain({userData: userData});
                console.log('studentmain called');

                // Actions.popTo('StudentMain', {userData: userData})
                // alert('Login Controller was called')
              } else if (userType == '"teacher"') {
                //if the user is a teacher
                Actions.TeacherMain({userData: userData});
                console.log('teachermain called');

                // Actions.popTo('TeacherMain', {userData: userData})
                // alert('Login Controller was called')
              }
            } else {
              Actions.Login({userInfo: userInfo});
            }
          });
        });
    } catch (error) {
      Actions.Login();
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MusicPro</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274156',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: 'white',
    fontSize: 80,
  },
});

//this lets the component get imported other places
export default LaunchScreen;
