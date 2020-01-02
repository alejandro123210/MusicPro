import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'

class Register_Instrument extends React.Component {

    state = {
        instrument: 'I currently selected no instruments'
    }

    //TODO: make this work differently so the user isn't typing a list in a text box

    onPress = () => {
        if(this.props.userType == "student"){
            var user = firebase.auth().currentUser
            var db = firebase.database();
            var ref = db.ref(`users/${user.uid}/info/`);
            ref.set({
                email: user.email,
                uid: user.uid,
                name: JSON.stringify(this.props.userInfo['user']['name']),
                userType: "student",
                instrument: this.state.instrument,
                photo: JSON.stringify(this.props.userInfo['user']['photo']),
                lessons: []
            });
            ref.once('value').then(function (snapshot){
                var userData = snapshot.val();
                Actions.StudentMain({userData: userData});
            }).catch(function (error){
                alert(error)
            })
            
        } else {
            Actions.Register_Location({
                instrument: this.state.instrument,
                userType: this.props.userType,
                userInfo: this.props.userInfo
            });
        }
        
    }

    render() {
        return (
            <KeyboardAwareScrollView
            style={{ backgroundColor: '#274156' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={true}
            >   
                {this.props.userType == "student"?
                <Text style={styles.questionText}>What instruments do you want to learn?</Text>
                :
                <Text style={styles.questionText}>What instruments do you want to teach?</Text>
                }
                <View style={styles.instrumentInputContainer}>
                    <TextInput 
                        style={styles.instrumentInput} 
                        multiline={true} 
                        onChangeText={(instrument) => this.setState({instrument: instrument})}
                        placeholder = 'tuba, trombone, baritone'
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
    instrumentInputContainer: {
        padding: 8,
        borderWidth: 0.5,
        borderColor: 'white',
        width: '80%',
        height: "10%",
        marginTop: 30
    },
    instrumentInput: {
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
export default Register_Instrument;