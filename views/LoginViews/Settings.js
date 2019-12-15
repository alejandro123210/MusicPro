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
          this.setState({ user: null, loggedIn: false }); // Remember to remove the user from your app's state as well
          Actions.Login();
          alert("logged out")
        } catch (error) {
          console.error(error);
          alert(error)
        }
    };

    render() {
        return (
            // this is just random filler for the template, but this is where what the user sees is rendered
            <View style={styles.container}>
                <TouchableOpacity onPress={() => this.onPress()}>
                    <Text style={styles.logoutButton}>Logout</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#274156',
      alignItems: 'center',
      justifyContent: 'center'
  },
  logoutButton: {
      fontSize: 20,
      color: 'white'
  }
});


//this lets the component get imported other places
export default Settings;