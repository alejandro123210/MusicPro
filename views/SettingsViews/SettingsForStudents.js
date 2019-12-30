import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Text, userData } from 'react-native';
import * as firebase from 'firebase';
import {GoogleSignin} from '@react-native-community/google-signin';
import { Actions } from 'react-native-router-flux'
 
let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class SettingsForStudents extends React.Component {

  onDeletePress = () => {
      this.deleteAccount()
  }
  onPress = () => {
      this.signOut()
  }

  signOut = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        this.setState({ user: null }); // Remember to remove the user from your app's state as well
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          Actions.Login();
        
        }).catch(function(error) {
          alert('Sorry, there was a problem signing you out!')
        });
      } catch (error) {
        console.error(error);
        alert(error)
      }
    };
  deleteAccount = async () => {
      // Alejandro please review my code!
      var user = firebase.auth().currentUser;
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      this.setState({ user: null }); 
      user.delete().then(function() {
        Actions.Login();
        alert("Account has been deleted")
      }, function(error) {
        // An error happened.
      });
    };
 
   componentDidMount(){
       // alert('settings mounted')
   }
 
   componentWillUnmount(){
       // alert('settings unmounted')
   }
 
   //TODO: create all of the functionality and front end for this page
 
   render() {
       return (
           // this is just random filler for the template, but this is where what the user sees is rendered
           <View style={styles.container}>
             <View style ={styles.imageContainer}>
                    <Image
                        source={{ uri: JSON.stringify(this.props.userData['photo']).slice(3,-3)}}
                        style={styles.imageMain}
                    />
                  </View>
                  <Text style={styles.regularButton}>{JSON.stringify(this.props.userData['name']).slice(3,-3)}</Text>
                  {/* ONLY FOR TEACHERS <Text style={styles.statusBar}>{JSON.stringify(this.props.userData['location']).slice(3,-3)}</Text> */}
                  <Text style={styles.statusBar}>{capitalize(JSON.stringify(this.props.userData['userType']).slice(1,-1))}</Text>
                  <Text style={styles.statusBar}>{JSON.stringify(this.props.userData['instrument']).slice(1,-1)}</Text>
                  {/* <Text style={styles.statusBar}>{JSON.stringify(this.props.userData['description']).replace('"','').replace('"','')}</Text> */}
                  <View style = {styles.emptyBlock}>
                  </View>
               <View style={styles.subContainer}>
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.regularButton}>About Us</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.regularButton}>FAQ</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.regularButton}>Report Bugs </Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.regularButton}>Suggest Feature </Text>
                   </TouchableOpacity>
               </View>
               <View style = {styles.subContainer2}>
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.logoutButton}>Log out</Text>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.onDeletePress()}>
                       <Text style={styles.deleteAccount}>Delete Account</Text>
                   </TouchableOpacity>
               </View>
           </View>
       );
   }
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
} 

const locationPretty = (s) => {

  s = s.toLowerCase()
  let array = s.split(' ')
  for (i = 0; i < 2; i++) {
    capitalize(array[i])
  }
  return array.toString()
} 
 
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: 'white',
   alignItems: 'center',
   justifyContent: 'center'
 },
 logoutButton: {
   margin: 5,
   fontSize: 20,
   color: '#00aced'
 },
 deleteAccount: {
   margin: 5,
   fontSize: 20,
   color: '#a40000'
 },
 regularButton: {
   margin: 5,
   fontSize: 20,
   color: 'black'
 },
 emptyBlock: {
   flex: 1,
 },
 subContainer2: {
   margin: 20,
   flex: 2,
   alignItems: 'center',
   justifyContent: 'center'
 },
 subContainer: {
   margin: 20,
   flex: 4,
 },
 imageContainer: {
  width: deviceWidth / 4,
  alignItems: "center",
},
imageMain: {
  width: deviceWidth / 4,
  height: deviceWidth / 4,
  borderRadius: 50,
  marginTop: 5
},
statusBar: {
  fontSize: 19,
  color: "grey",
},
});
 
 
//this lets the component get imported other places
export default SettingsForStudents;

