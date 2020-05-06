/* eslint-disable eqeqeq */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {Actions} from 'react-native-router-flux';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class Register extends React.Component {
  state = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    student: true,
  };

  studentPressed = () => {
    Actions.Register_Instrument({
      userType: 'student',
      userInfo: this.props.userInfo,
    });
  };

  teacherPressed = () => {
    Actions.Register_Instrument({
      userType: 'teacher',
      userInfo: this.props.userInfo,
    });
  };

  //firebase account creation and automatic login
  // onDonePressed = () => {
  //   //if the passwords match
  //   if(this.state.password == this.state.confirmPassword){
  //     //this creates a database reference to copy the info to the database
  //     var db = firebase.database();
  //     //this creates an accessible reference to this.state, we could also use .bind(this)
  //     var name = this.state.name;
  //     var email = this.state.email;
  //     var problemWithLogin = false;
  //     //if the person is a student or a teacher
  //     if (this.state.student == true){
  //       //creates the user and adds them to the auth section of firebase
  //       firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
  //         var errorMessage = error.message;
  //         alert(errorMessage);
  //         problemWithLogin = true;
  //       }).then(function() {
  //         //brings up the users data from auth
  //         var user = firebase.auth().currentUser;
  //         //checks if there was a problem, there are better ways to do this (this is temporary)
  //         if (problemWithLogin == false){
  //           //copies the users data from auth to the database, adding the name and whether they're a student or a teacher
  //           db.ref(`users/${user.uid}/info`).set({
  //             email: user.email,
  //             uid: user.uid,
  //             name: name,
  //             userType: "student"
  //           });
  //           //this isn't perfect, will need to change
  //           var ref = db.ref(`users/${user.uid}/info/`);
  //           ref.on("value", function(snapshot) {
  //             var userData = snapshot.val();
  //             Actions.StudentMain({userData: userData});
  //           }, function (errorObject) {
  //             alert("The read failed: " + errorObject.code);
  //           });
  //         }
  //       });
  //     } else {
  //       //creates the user and adds them to the auth section of firebase
  //       firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch(function(error) {
  //         var errorMessage = error.message;
  //         alert(errorMessage);
  //         problemWithLogin = true;
  //       }).then(function() {
  //         //brings up the users data from auth
  //         var user = firebase.auth().currentUser;
  //         //checks if there was a problem, there are better ways to do this (this is temporary)
  //         if (problemWithLogin == false){
  //           //copies the users data from auth to the database, adding the name and whether they're a student or a teacher
  //           db.ref(`users/${user.uid}/info`).set({
  //             email: user.email,
  //             uid: user.uid,
  //             name: name,
  //             userType: "teacher"
  //           });
  //           //this isn't perfect, will need to change
  //           var ref = db.ref(`users/${user.uid}/info/`);
  //           ref.on("value", function(snapshot) {
  //             var userData = snapshot.val();
  //             Actions.TeacherMain({userData: userData});
  //           }, function (errorObject) {
  //             alert("The read failed: " + errorObject.code);
  //           });
  //         }
  //       });
  //     }
  //   } else {
  //     alert("Make sure the passwords match!")
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        {/* this is where the student/teacher selector goes */}
        <Text style={styles.startText}>I'm a</Text>
        <View style={styles.studentTeacherContainer}>
          <TouchableOpacity onPress={() => this.studentPressed()}>
            {this.state.student == true ? (
              <Text style={styles.studentButton}>Student</Text>
            ) : (
              <Text style={styles.studentButtonDisabled}>Student</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.teacherPressed()}>
            {this.state.student == true ? (
              <Text style={styles.teacherButtonDisabled}>Teacher</Text>
            ) : (
              <Text style={styles.teacherButton}>Teacher</Text>
            )}
          </TouchableOpacity>
        </View>
        {/* this is where the prompts go */}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#274156',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  startText: {
    fontSize: 30,
    fontFamily: 'HelveticaNeue-Medium',
    color: 'white',
  },
  studentTeacherContainer: {
    flexDirection: 'row',
    paddingTop: 20,
  },
  studentButton: {
    fontSize: 40,
    paddingRight: 20,
    color: 'grey',
    fontFamily: 'HelveticaNeue-Medium',
  },
  studentButtonDisabled: {
    fontSize: 40,
    paddingRight: 20,
    color: 'grey',
    fontFamily: 'HelveticaNeue-Medium',
  },
  teacherButton: {
    fontSize: 40,
    paddingLeft: 20,
    color: 'white',
    fontFamily: 'HelveticaNeue-Medium',
  },
  teacherButtonDisabled: {
    fontSize: 40,
    paddingLeft: 20,
    color: 'grey',
    fontFamily: 'HelveticaNeue-Medium',
  },
  promptsContainer: {
    alignItems: 'center',
  },
  textInputStyle: {
    fontSize: 24,
    color: 'black',
    fontFamily: 'HelveticaNeue-Medium',
    margin: 10,
  },
  userInfoInput: {
    height: deviceHeight * 0.08,
    width: deviceWidth * 0.9,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    borderRadius: 10,
  },
  doneButton: {
    height: deviceHeight * 0.09,
    width: deviceHeight * 0.11,
    backgroundColor: '#2c2828',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});
//this lets the component get imported other places
export default Register;
