import React from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ImageBackground } from "react-native";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as firebase from 'firebase';
import LoginController from '../subComponents/BackendComponents/LoginController'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class Login extends React.Component {

  // onDonePressed = () => {
  //   //variable that tells the function if there was an error 
  //   var problemWithLogin = false;
  //   firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error){
  //     alert(error);
  //     problemWithLogin = true;
  //   }).then(function(){
  //     //this is what happens after the user is signed in
  //     //this if statement checks if there was a problem and executes if there wasn't
  //     if (problemWithLogin == false){
  //       //here we get the user data and check if they're a student or teacher
  //       var user = firebase.auth().currentUser
  //       var db = firebase.database();
  //       var ref = db.ref(`users/${user.uid}/info/`);
  //       ref.on("value", function(snapshot) {
  //         var userData = snapshot.val();
  //         //this is the user type (teacher/student)
  //         var userType = JSON.stringify(userData['userType']);
  //         //here if the function finds if the user is a student/teacher, it loads each respective view
  //         if (userType == '"student"'){
  //           //if the user is a student
  //           Actions.StudentMain({userData: userData});
  //         } else {
  //           //if the user is a teacher
  //           Actions.TeacherMain({userData: userData});
  //         }
  //       }, function (errorObject) {
  //         alert("The read failed: " + errorObject.code);
  //       });
  //     }
  //   });
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MusicPro</Text>
        <LoginController />
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#eee',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 70,
    color: 'dodgerblue',
  },
});

//this lets the component get imported other places
export default Login;
