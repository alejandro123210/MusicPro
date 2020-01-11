import React from 'react';
import { View } from 'react-native';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'
import LargePrompt from '../subComponents/LargePrompt';

class Register_Description extends React.Component {

    state = {
        description: ''
    }

    onPress = (description) => {
        var user = firebase.auth().currentUser
        var db = firebase.database();
        var ref = db.ref(`users/${user.uid}/info/`);
        ref.set({
            email: user.email,
            uid: user.uid,
            name: this.props.userInfo['user']['name'],
            userType: "teacher",
            instruments: this.props.instruments,
            photo: this.props.userInfo['user']['photo'],
            location: this.props.location,
            coordinates: this.props.coordinates,
            description: description,
            lessons: [],
            availability: []
        });
        ref.once('value').then(function (snapshot){
            var userData = snapshot.val();
            Actions.TeacherMain({userData: userData});
        }).catch(function (error){
            alert(error)
        })
    }

    render() {
        return (
            <LargePrompt
                donePressed = {(description) => this.onPress(description)}
                title = 'Describe yourself, your experience, etc'
            />
        );
    }
}


//this lets the component get imported other places
export default Register_Description;