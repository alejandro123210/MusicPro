import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Text, userData } from 'react-native';
import * as firebase from 'firebase';
import {GoogleSignin} from '@react-native-community/google-signin';
import { Actions } from 'react-native-router-flux'
 
class Settings extends React.Component {
 
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
               <View style = {styles.emptyBlock}>
               </View>
               <View style={styles.subContainer}>
                  <Image
                      source={{ uri: this.props.userData['image'] }}
                      style={styles.imageMain}
                    />
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.regularButton}>Personal Information </Text>
                   </TouchableOpacity>
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
                   <TouchableOpacity onPress={() => this.onPress()}>
                       <Text style={styles.deleteAccount}>Delete Account</Text>
                   </TouchableOpacity>
               </View>
           </View>
       );
   }
}
 
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#eee',
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
   flex: 4,
 },
 subContainer2: {
   margin: 20,
   flex: 2,
   alignItems: 'center',
   justifyContent: 'center'
 },
 subContainer: {
   margin: 20,
   flex: 8,
 },
});
 
 
//this lets the component get imported other places
export default Settings;

