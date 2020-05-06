/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import LoginController from '../subComponents/BackendComponents/LoginController';

let deviceWidth = Dimensions.get('window').width;

class Login extends React.Component {
  state = {
    loginType: 'socialMedia',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
  };

  // createAccount = () => {
  //   let that = this
  //   if (this.state.password == this.state.confirmPassword){
  //     //variable that tells the function if there was an error
  //     var problemWithLogin = false;
  //     firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password)
  //     .catch(function(error){
  //       alert(error);
  //       problemWithLogin = true;
  //     }).then(function(){
  //       //this is what happens after the user is signed in
  //       //this if statement checks if there was a problem and executes if there wasn't
  //       if (problemWithLogin == false){
  //         //create a userInfo prop so it's the same as googleSignIn
  //         const userInfo = {
  //           user: {
  //             name: that.state.fullName,
  //             photo: 'https://image.shutterstock.com/image-vector/default-avatar-profile-icon-grey-260nw-767771860.jpg'
  //           }
  //         }
  //         Actions.Register({userInfo: userInfo})
  //       }
  //     });
  //   } else {
  //     alert('make sure your passwords match!')
  //   }
  // }

  // loggedIn = async (email, password) =>{
  //   if ( email != '' && password != '' ){
  //     try{
  //       let user = await auth.signInWithEmailAndPassword(email, password);
  //       console.log('Алехандро Гонзалез');
  //       Actions.Register();
  //     }
  //     catch(error){
  //       console.log(error, 'error occured at function loggedIn');
  //     }
  //   }else{
  //     // if they are empty
  //     console.log('Missing email or password');
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>MusicPro</Text>
        <View style={{flexDirection: 'column', alignItems: 'center'}}>
          <LoginController />
        </View>
      </View>
      // <KeyboardAwareScrollView
      // style={{ backgroundColor: '#274156' }}
      // resetScrollToCoords={{ x: 0, y: 0 }}
      // contentContainerStyle={styles.container}
      // scrollEnabled={false}
      // keyboardShouldPersistTaps={'always'}
      // >
      //   <Text style={styles.title}>MusicPro</Text>
      //   { this.state.loginType == 'socialMedia' ?
      //     <View style={{flexDirection: 'column', alignItems: 'center'}}>
      //       <LoginController />
      //       <TouchableOpacity
      //         onPress={() => this.setState({loginType: 'emailRegister'})}
      //         style={styles.loginWithEmailContainer}
      //       >
      //         <Text style={styles.loginWithEmailText}>Sign up with email</Text>
      //       </TouchableOpacity>
      //       <Text style={{color: 'white', margin: 10}}> or </Text>
      //       <TouchableOpacity
      //         onPress={() => this.setState({loginType: 'emailLogin'})}
      //       >
      //         <Text style={styles.loginWithEmailText}> Login with email </Text>
      //       </TouchableOpacity>
      //     </View>
      //   : this.state.loginType == 'emailRegister' ?
      //   <View style={styles.inputsContainer}>
      //     <View style={styles.textInputContainer}>
      //       <TextInput
      //         multiline={false}
      //         onChangeText={(name) => this.setState({fullName: name})}
      //         placeholder = 'first and last name'
      //         ref={input => { this.textInput = input }}
      //         blurOnSubmit={false}
      //         style={styles.emailInput}
      //       />
      //     </View>
      //     <View style={styles.textInputContainer}>
      //       <TextInput
      //         multiline={false}
      //         onChangeText={(email) => this.setState({email: email})}
      //         placeholder = 'email'
      //         ref={input => { this.textInput = input }}
      //         blurOnSubmit={false}
      //         style={styles.emailInput}
      //       />
      //     </View>
      //     <View style={styles.textInputContainer}>
      //       <TextInput
      //         multiline={false}
      //         onChangeText={(password) => this.setState({password: password})}
      //         placeholder = 'password'
      //         ref={input => { this.textInput = input }}
      //         blurOnSubmit={false}
      //         style={styles.emailInput}
      //         secureTextEntry
      //       />
      //     </View>
      //     <View style={styles.textInputContainer}>
      //       <TextInput
      //         multiline={false}
      //         onChangeText={(confirmPassword) => this.setState({confirmPassword: confirmPassword})}
      //         placeholder = 'Confirm password'
      //         ref={input => { this.textInput = input }}
      //         blurOnSubmit={false}
      //         style={styles.emailInput}
      //         secureTextEntry
      //       />
      //     </View>
      //     <TouchableOpacity onPress = {() => this.createAccount()}>
      //       <Text style={{color: 'white', marginTop: 20, fontSize: 20}}>Singup</Text>
      //     </TouchableOpacity>
      //   </View>
      //   :
      //   <View style={styles.inputsContainer}>
      //     <View style={styles.textInputContainer}>
      //       <TextInput
      //         multiline={false}
      //         onChangeText={(email) => this.setState({email: email})}
      //         placeholder = 'email'
      //         ref={input => { this.textInput = input }}
      //         blurOnSubmit={false}
      //         style={styles.emailInput}
      //       />
      //     </View>
      //     <View style={styles.textInputContainer}>
      //       <TextInput
      //         multiline={false}
      //         onChangeText={(password) => this.setState({password: password})}
      //         placeholder = 'password'
      //         ref={input => { this.textInput = input }}
      //         blurOnSubmit={false}
      //         style={styles.emailInput}
      //         secureTextEntry
      //       />
      //     </View>
      //     <TouchableOpacity>
      //       <Text style={{color: 'white', marginTop: 20, fontSize: 20}}>Login</Text>
      //     </TouchableOpacity>
      //   </View>
      //   }
      // </KeyboardAwareScrollView>
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
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  loginWithEmailText: {
    fontSize: 20,
    color: 'white',
  },
  inputsContainer: {
    alignItems: 'center',
  },
  textInputContainer: {
    backgroundColor: 'white',
    color: 'gray',
    borderRadius: 20,
    height: 40,
    width: deviceWidth - 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  emailInput: {
    textAlignVertical: 'center',
  },
});

//this lets the component get imported other places
export default Login;
