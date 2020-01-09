import React from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ImageBackground, TouchableHighlight } from "react-native";
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

  registerUser = (email, password) => {

    console.log(email,password);  
  
    firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((userOnj) => console.log('made an account for you!'))
      .catch((error => console.log('error')));
      // pass any data you want
      Actions.Register()
    
  }

  loggedIn = async (email, password) =>{
    if ( email != '' && password != '' ){
      try{
        let user = await auth.signInWithEmailAndPassword(email, password);
        console.log('Алехандро Гонзалез');
        Actions.Register();
      }
      catch(error){
        console.log(error, 'error occured at function loggedIn');
      }
    }else{
      // if they are empty 
      console.log('Missing email or password');
    }
  }

  state={
    emailLoginView: false

  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MusicPro</Text>
        { this.state.emailLoginView == false ?
        (
        <View>
        <LoginController />
          <TouchableHighlight
              onPress={() => this.setState({emailLoginView: true})}
              style={styles.loginWithEmailContainer}>
              <Text style={styles.loginWithEmailContainer} >Log in With Email</Text>
            </TouchableHighlight>
        </View>
        ) : (
          <View>
            <View >
              <Text> Email: </Text>
              <TextInput
              onChangeText = {(text) => this.setState({email: text})} 
              value={this.state.email}
              style={styles.loginWithEmailContainer}
              />
            </View>
            <Text> Password: </Text>
              <View>
                <TextInput
                onChangeText = {(text) => this.setState({password: text})} 
                secureTextEntry={true} 
                value={this.state.password}
                style={styles.loginWithEmailContainer}
                />
              </View> 
          <TouchableHighlight
            onPress={() => this.registerUser(this.state.email,this.state.password)}
            style={{backgroundColor: 'grey'}}>
            <Text>Sign Up</Text>
          </TouchableHighlight>
          <TouchableHighlight
            onPress={() => this.loggedIn(this.state.email,this.state.password)}
            style={{backgroundColor: 'grey'}}>
            <Text>Log In</Text>
          </TouchableHighlight>
          <Text style={{fontSize:30, color: 'white'}}>Or continue with</Text>
          <LoginController />
          <TouchableHighlight
            onPress={() => this.setState({emailLoginView: false})}
            style={{backgroundColor: 'grey'}}>
            <Text>Back</Text>
          </TouchableHighlight>  
        </View>)
        }
      </View>
      
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#274156',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 70,
    color: 'white',
  },
  loginWithEmailContainer: {
    color: 'white',
    fontSize: 22,
  },
  instrumentTextInputContainer: {
    borderRadius: 30,
    backgroundColor: 'white',
    height: 35,
    width: '80%',
    paddingTop: 1
},
});

//this lets the component get imported other places
export default Login;
