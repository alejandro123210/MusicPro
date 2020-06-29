/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React, {Component, Fragment} from 'react';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';

export default class LoginController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pushData: [],
      loggedIn: false,
      profileURL: props.profileURL,
    };
  }
  componentDidMount() {
    console.log('login controller mounted');
  }

  componentWillUnmount() {
    console.log('Login Controller unmounted');
  }

  _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      let profileURL = this.state.profileURL;
      console.log('has play services');
      const userInfo = await GoogleSignin.signIn();
      console.log('user info is present');
      this.setState({userInfo: userInfo, loggedIn: true});
      console.log('state set with userinfo, logged in set to true');
      // alert()
      var db = firebase.database();
      console.log('database reference made');
      var problemWithLogin = false;
      const googleCredential = firebase.auth.GoogleAuthProvider.credential(
        userInfo.idToken,
      );
      console.log('auth credential obtained');
      var isUserSignedInAlready = false;
      console.log('user is not fully signed in yet');
      firebase
        .auth()
        .signInWithCredential(googleCredential)
        .then((appUser) => {
          console.log('firebase attempting sign in');
          var user = firebase.auth().currentUser;
          var ref = db.ref(`users/${user.uid}/info/`);
          // ref.on("value", function(snapshot) {

          // }, function (errorObject) {
          //   alert("The read failed: " + errorObject.code);
          // });
          ref.once('value').then(function (snapshot) {
            console.log('reading the database');
            if (snapshot.val() == null) {
              console.log('user not fully signed up');
              //if the user does not have data in the database:
              //the user at this point has an account in auth, but we need to create the data for the database
              Actions.Register({userInfo: userInfo, profileURL});
            } else {
              console.log('user fully signed up');
              //if the user DOES have data in the database:
              var userData = snapshot.val();
              //this is the user type (teacher/student)
              var userType = JSON.stringify(userData.userType);
              //here if the function finds if the user is a student/teacher, it loads each respective view
              console.log(userType);
              if (userType == '"student"' && userData != null) {
                //if the user is a student
                Actions.StudentMain({userData: userData, profileURL});
                console.log('student Main Called');
                return;
                // Actions.popTo('StudentMain', {userData: userData})
                // alert('login controller was called')
              } else if (userData != null) {
                //if the user is a teacher
                Actions.TeacherMain({userData: userData, profileURL});
                console.log('teacher main called');
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
        alert(error.code);
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        alert(error.code);
      } else {
        // some other error happened
        alert(error.code);
      }
    }
  };

  getCurrentUserInfo = async () => {
    try {
      let profileURL = this.state.profileURL;
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
        .then((appUser) => {
          var user = firebase.auth().currentUser;
          var db = firebase.database();
          var ref = db.ref(`users/${user.uid}/info/`);
          ref.once('value').then(function (snapshot) {
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
                Actions.StudentMain({userData: userData, profileURL});
                console.log('studentmain called');

                // Actions.popTo('StudentMain', {userData: userData})
                // alert('Login Controller was called')
              } else if (userType == '"teacher"') {
                //if the user is a teacher
                Actions.TeacherMain({userData: userData, profileURL});
                console.log('teachermain called');

                // Actions.popTo('TeacherMain', {userData: userData})
                // alert('Login Controller was called')
              }
            } else {
              Actions.Register({userInfo: userInfo, profileURL});
            }
          });
        });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        // user has not signed in yet
        this.setState({loggedIn: false});
        console.log(error);
      } else {
        // some other error
        this.setState({loggedIn: false});
        alert(error);
        console.log(error);
      }
    }
  };

  // signOut = async () => {
  //   try {
  //     await GoogleSignin.revokeAccess();
  //     await GoogleSignin.signOut();
  //     this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

  render() {
    return (
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={() => this._signIn()}
        disabled={this.state.isSigninInProgress}
      />
    );
  }
}
