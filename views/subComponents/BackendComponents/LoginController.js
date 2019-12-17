import React, { Component, Fragment } from "react";
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Button, Image,} from 'react-native';
import { Header, LearnMoreLinks, Colors, DebugInstructions, ReloadInstructions,} from 'react-native/Libraries/NewAppScreen';
import { GoogleSignin, GoogleSigninButton, statusCodes } from '@react-native-community/google-signin';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'

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
    this.getCurrentUserInfo();
    // alert(this.state.userInfo)
    // alert("LoginController has mounted")
    console.log('login controller mounted')
  }

  componentWillUnmount(){
    console.log('Login Controller unmounted')
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      console.log('has play services')
      const userInfo = await GoogleSignin.signIn();
      console.log('user info is present')
      this.setState({ userInfo: userInfo, loggedIn: true });
      console.log('state set with userinfo, logged in set to true')
      // alert()
      var db = firebase.database()
      console.log('database reference made')
      var problemWithLogin = false;
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(userInfo.idToken); 
      console.log('auth credential obtained')
      var isUserSignedInAlready = false
      console.log('user is not fully signed in yet')
      firebase.auth().signInWithCredential(googleCredential)
      .then(appUser => { 
        console.log('firebase attempting sign in')
        var user = firebase.auth().currentUser
        var ref = db.ref(`users/${user.uid}/info/`);
          // ref.on("value", function(snapshot) {

          // }, function (errorObject) {
          //   alert("The read failed: " + errorObject.code);
          // });
          ref.once('value')
          .then(function(snapshot) {
            console.log('reading the database')
            if(snapshot.val() == null){
              console.log('user not fully signed up')
              //if the user does not have data in the database:
              //the user at this point has an account in auth, but we need to create the data for the database
              Actions.Register({userInfo: userInfo});
            } else {
              console.log('user fully signed up')
              //if the user DOES have data in the database:
              var userData = snapshot.val();
              //this is the user type (teacher/student)
              var userType = JSON.stringify(userData['userType']);
              //here if the function finds if the user is a student/teacher, it loads each respective view
              console.log(userType)
              if (userType == '"student"' && userData != null){
                //if the user is a student
                Actions.StudentMain({userData: userData});
                console.log('student Main Called')
                return;
                // Actions.popTo('StudentMain', {userData: userData})
                // alert('login controller was called')
              } else if (userData != null){
                //if the user is a teacher
                Actions.TeacherMain({userData: userData});
                console.log('teacher main called')
                return;
                // Actions.popTo('TeacherMain', {userData: userData})
                // alert('teacher main was called'
              }
            }
          });
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
          ref.once('value')
          .then(function(snapshot){
            //if the user DOES have data in the database:
            var userData = snapshot.val();
            // alert(userData)
            //this is the user type (teacher/student)
            if (userData != null){ //if they have data in the database
              var userType = JSON.stringify(userData['userType']);
              //here if the function finds if the user is a student/teacher, it loads each respective view
              console.log(userType)
              if (userType == '"student"'){
                //if the user is a student
                Actions.StudentMain({userData: userData});
                console.log('studentmain called')
                
                // Actions.popTo('StudentMain', {userData: userData})
                // alert('Login Controller was called')
              } else if (userType == '"teacher"'){
                //if the user is a teacher
                Actions.TeacherMain({userData: userData});
                console.log('teachermain called')
                
                // Actions.popTo('TeacherMain', {userData: userData})
                // alert('Login Controller was called')
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
        onPress={() => this._signIn()}
        disabled={this.state.isSigninInProgress} 
      />

    );
  }
}