import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux'

class Register_Instrument extends React.Component {

    state = {
        instrument: ''
    }

    onPress = () => {
        if(this.props.userType == "student"){
            //we send all the props to login, since the user is a student, they do not need a description. 
            Actions.Login({
                userType: 'student',
                instrument: this.state.instrument,
                description: '',
                alreadyRegistered: false
            })
            // alert('userType: student')
        } else {
            Actions.Register_Description({
                instrument: this.state.instrument
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