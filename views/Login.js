import React from "react";
import { View, Text, StyleSheet, TextInput, Dimensions, TouchableOpacity, ImageBackground } from "react-native";
import { Actions } from "react-native-router-flux";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import * as firebase from 'firebase';


let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class Login extends React.Component {

  state = {
    email: "",
    password: "",
  };

  onDonePressed = () => {
    //variable that tells the function if there was an error 
    var problemWithLogin = false;
    firebase.auth().signInWithEmailAndPassword(this.state.email, this.state.password).catch(function(error){
      alert(error);
      problemWithLogin = true;
    }).then(function(){
      //this is what happens after the user is signed in
      //this if statement checks if there was a problem and executes if there wasn't
      if (problemWithLogin == false){
        //here we get the user data and check if they're a student or teacher
        var user = firebase.auth().currentUser
        var db = firebase.database();
        var ref = db.ref(`users/${user.uid}/info/`);
        ref.on("value", function(snapshot) {
          var userData = snapshot.val();
          //this is the user type (teacher/student)
          var userType = JSON.stringify(userData['userType']);
          //here if the function finds if the user is a student/teacher, it loads each respective view
          if (userType == '"student"'){
            //if the user is a student
            Actions.StudentMain({userData: userData});
          } else {
            //if the user is a teacher
            Actions.TeacherMain({userData: userData});
          }
        }, function (errorObject) {
          alert("The read failed: " + errorObject.code);
        });
      }
    });
  }

  render() {
    return (
      <KeyboardAwareScrollView
      style={{ backgroundColor: '#4c69a5' }}
      resetScrollToCoords={{ x: 0, y: 0 }}
      contentContainerStyle={styles.container}
      scrollEnabled={true}
      >
      <View style={styles.container}>
        <ImageBackground
          style={styles.background}
          source={{ uri: "https://wallpaperbro.com/img/53490.jpg" }}
        >
          <Text style={styles.title}>MusicPro</Text>
            <View style={styles.inputContainer}>
                <View style={styles.userInfoInput}>
                <TextInput
                    style={styles.textInputStyle}
                    value={this.state.email}
                    placeholder="email"
                    onChangeText={email => this.setState({ email: email })}
                />
                </View>
                <View style={styles.userInfoInput}>
                <TextInput
                    style={styles.textInputStyle}
                    value={this.state.password}
                    placeholder="password"
                    onChangeText={password => this.setState({ password: password })}
                    secureTextEntry={true}
                />
                </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={() => this.onDonePressed()}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
        </ImageBackground>
      </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  background: {
    height: deviceHeight,
    width: deviceWidth,
    alignItems: "center"
  },
  title: {
    fontSize: 70,
    paddingTop: "20%",
    color: "white"
  },
  textInputStyle: {
    fontSize: 24,
    color: "#2c2828",
    fontFamily: "HelveticaNeue-Medium",
    margin: 5
  },
  inputContainer: {
    paddingTop: '60%'
  },
  userInfoInput: {
    height: deviceHeight * 0.08,
    width: deviceWidth * 0.9,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    borderRadius: 10
  },
  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "5%",
    width: "70%",
    backgroundColor: 'white',
    borderRadius: 10
  },
  buttonText: {
    fontFamily: "HelveticaNeue-Medium",
    color: "black"
  }
});

//this lets the component get imported other places
export default Login;
