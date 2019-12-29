import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
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
                <View style={styles.subContainer}>
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
                        <Text style={styles.regularButton}>Report Bug or Suggest Feature </Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.onPress()}>
                        <Text style={styles.logoutButton}>Log out</Text>
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
  regularButton: {
    margin: 5,
    fontSize: 20,
    color: 'black'
  }

});


//this lets the component get imported other places
export default Settings;