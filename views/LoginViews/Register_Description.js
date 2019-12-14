import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'

class Register_Description extends React.Component {

    state = {
        description: ''
    }

    onPress = () => {
        var user = firebase.auth().currentUser
        var db = firebase.database();
        var ref = db.ref(`users/${user.uid}/info/`);
        ref.set({
            email: user.email,
            uid: user.uid,
            name: JSON.stringify(this.props.userInfo['user']['name']),
            userType: "teacher",
            instrument: this.props.instrument,
            photo: JSON.stringify(this.props.userInfo['user']['photo']),
            description: this.state.description
        });
        // ref.on("value", function(snapshot) {
        //     var userData = snapshot.val();
        //     Actions.TeacherMain({userData: userData});
        // }, function (errorObject) {
        //     alert("The read failed: " + errorObject.code);
        // });
    }

    render() {
        return (
            <KeyboardAwareScrollView
            style={{ backgroundColor: '#274156' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            >
                <Text style={styles.questionText}>Describe yourself, your experience, etc</Text>
                <View style={styles.descriptionInputContainer}>
                    <TextInput 
                        style={styles.descriptionInput} 
                        multiline={true} 
                        onChangeText={(description) => this.setState({description: description})}
                        placeholder = 'I have taught for 10 years... etc'
                    />
                </View>
                <TouchableOpacity onPress={() => this.onPress()}>
                    <Text style={styles.doneButton}>Done!</Text>
                </TouchableOpacity>
            </KeyboardAwareScrollView>
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
    questionText: {
        fontSize: 30,
        color: 'white',
        textAlign: 'center'
    },
    descriptionInputContainer: {
        borderWidth: 0.5,
        borderColor: 'white',
        width: '80%',
        height: "10%",
        marginTop: 30
    },
    descriptionInput: {
        flex: 1,
        color: 'white'
    },
    doneButton: {
        color: 'white',
        fontSize: 20,
        paddingTop: 20
    }
});


//this lets the component get imported other places
export default Register_Description;