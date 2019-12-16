import React, { Component, Fragment } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Image,} from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import * as firebase from 'firebase'
import {Actions} from 'react-native-router-flux'

export default class LoginController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
      loggedIn: false
    }
  }
  componentDidMount() {
    GoogleSignin.configure({
      webClientId: '506122331327-cobrmqrn49efksceiebado4s3nmmi5g7.apps.googleusercontent.com', 
      offlineAccess: true, 
      hostedDomain: '', 
      forceConsentPrompt: true, 
      iosClientId: '506122331327-ioaoru8o5prnmdfl40r5jo94kqhb6aa0.apps.googleusercontent.com'
    });
    // this.getCurrentUserInfo();
    // alert(this.state.userInfo)
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      this.setState({ userInfo: userInfo, loggedIn: true });
      // alert()
      var db = firebase.database()
      var problemWithLogin = false;
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken); 
      firebase.auth().signInWithCredential(googleCredential)
        .then(appUser => { 
          var user = firebase.auth().currentUser
          var ref = db.ref(`users/${user.uid}/info/`);
            ref.on("value", function(snapshot) {
              if(snapshot.val() == null){
                //if the user does not have data in the database:
                //the user at this point has an account in auth, but we need to create the data for the database
                Actions.Register({userInfo: userInfo});
              } else {
                //if the user DOES have data in the database:
                var userData = snapshot.val();
                //this is the user type (teacher/student)
                var userType = JSON.stringify(userData['userType']);
                //here if the function finds if the user is a student/teacher, it loads each respective view
                if (userType == '"student"' && userData != null){
                  //if the user is a student
                  Actions.StudentMain({userData: userData});
                  // alert('login controller called')
                } else if (userData != null){
                  //if the user is a teacher
                  Actions.TeacherMain({userData: userData});
                  // alert('login controller called')
                }
              }
            }, function (errorObject) {
              alert("The read failed: " + errorObject.code);
            });

          // // alert(user.uid)
          // if (this.props.alreadyRegistered == true){
          //   var ref = db.ref(`users/${user.uid}/info/`);
          //   ref.on("value", function(snapshot) {
          //     var userData = snapshot.val();
          //     //this is the user type (teacher/student)
          //     var userType = JSON.stringify(userData['userType']);
          //     //here if the function finds if the user is a student/teacher, it loads each respective view
          //     if (userType == '"student"' && userData != null){
          //       //if the user is a student
          //       Actions.StudentMain({userData: userData});
          //     } else if (userData != null){
          //       //if the user is a teacher
          //       Actions.TeacherMain({userData: userData});
          //     }
          //   }, function (errorObject) {
          //     alert("The read failed: " + errorObject.code);
          //   });
          // } else {
          //   if(this.props.userType == "student"){
          //     //checks if there was a problem, there are better ways to do this (this is temporary)
          //     if (problemWithLogin == false){
          //       //copies the users data from auth to the database, adding the name and whether they're a student or a teacher
          //       db.ref(`users/${user.uid}/info`).set({
          //         email: user.email,
          //         uid: user.uid,
          //         name: JSON.stringify(userInfo['user']['name']),
          //         userType: "student",
          //         instrument: this.props.instrument,
          //         photo: JSON.stringify(userInfo['user']['photo'])
          //       });
          //       //this isn't perfect, will need to change
          //       var ref = db.ref(`users/${user.uid}/info/`);
          //       ref.on("value", function(snapshot) {
          //         var userData = snapshot.val();
          //         Actions.StudentMain({userData: userData});
          //       }, function (errorObject) {
          //         alert("The read failed: " + errorObject.code);
          //       });
          //     }
          //   } else if(this.props.userType == "teacher"){
          //     //checks if there was a problem, there are better ways to do this (this is temporary)
          //     if (problemWithLogin == false){
          //       //copies the users data from auth to the database, adding the name and whether they're a student or a teacher
          //       db.ref(`users/${user.uid}/info`).set({
          //         email: user.email,
          //         uid: user.uid,
          //         name: JSON.stringify(userInfo['user']['name']),
          //         userType: "teacher",
          //         instrument: this.props.instrument,
          //         description: this.props.description,
          //         photo: JSON.stringify(userInfo['user']['photo'])
          //       });
          //       //this isn't perfect, will need to change
          //       var ref = db.ref(`users/${user.uid}/info/`);
          //       ref.on("value", function(snapshot) {
          //         var userData = snapshot.val();
          //         Actions.TeacherMain({userData: userData});
          //       }, function (errorObject) {
          //         alert("The read failed: " + errorObject.code);
          //       });
          //     }
          //   }
          // }
      });
      
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
        alert(error)
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert(error)
      } else {
        // some other error happened
        alert(error)
      }
    }
  };

  getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      this.setState({ userInfo });
      // alert(userInfo)
      //auto login:
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken);     
      firebase.auth().signInWithCredential(googleCredential)
        .then(appUser => { 
          var user = firebase.auth().currentUser
          var db = firebase.database();
          var ref = db.ref(`users/${user.uid}/info/`);
          ref.on("value", function(snapshot) {
            //if the user DOES have data in the database:
            var userData = snapshot.val();
            // alert(userData)
            //this is the user type (teacher/student)
            if (userData != null){ //if they have data in the database
              var userType = JSON.stringify(userData['userType']);
              //here if the function finds if the user is a student/teacher, it loads each respective view
              if (userType == '"student"'){
                //if the user is a student
                Actions.StudentMain({userData: userData});
              } else if (userType == '"teacher"'){
                //if the user is a teacher
                Actions.TeacherMain({userData: userData});
              }
            } else {
              Actions.Register({userInfo: userInfo});
            }
          });
        })
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({ loggedIn: false });
        // alert(error.code)
      } else {
        // some other error
        this.setState({ loggedIn: false });
        alert(error)
      }
    }
  };

  signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
    } catch (error) {
      console.error(error);
    }
  };

  render() {
    return (
      <GoogleSigninButton
        style={{ width: 192, height: 48 }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={this._signIn}
        disabled={this.state.isSigninInProgress} 
      />

    );
  }
}