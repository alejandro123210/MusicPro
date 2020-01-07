import React from 'react';
import { View, StyleSheet, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Actions } from 'react-native-router-flux'
import * as firebase from 'firebase'
import InstrumentTag from '../subComponents/instrumentTag';

class Register_Instrument extends React.Component {

    state = {
        instruments: [],
        instrument: ''
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
                instruments: this.state.instruments,
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
                instruments: this.state.instruments,
                userType: this.props.userType,
                userInfo: this.props.userInfo
            });
        }
        
    }

    onSubmitPressed = () => {
        let instrument = this.state.instrument
        var instruments = this.state.instruments
        if(instrument != ''){
            instruments.push(instrument)
            this.setState({ instruments })
            this.setState({ instrument: '' })
            this.textInput.clear()
            console.log(this.state.instruments)
        }
    }

    onTagPressed = () => {
        var instruments = this.state.instruments
        instruments.splice(instruments.indexOf('B'), 1);
        this.setState({ instruments })
    }

    render() {
        return (
            <KeyboardAwareScrollView
                style={{ backgroundColor: '#274156' }}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.container}
                scrollEnabled={false}
                keyboardShouldPersistTaps={'always'}
            >   
                {this.props.userType == "student"?
                <Text style={styles.questionText}>What instruments do you want to learn?</Text>
                :
                <Text style={styles.questionText}>What instruments do you want to teach?</Text>
                }
                <View style={styles.instrumentTagScrollViewContainer}>
                    <ScrollView horizontal={true} keyboardShouldPersistTaps={'always'} bounces={false}>
                        {this.state.instruments.map(instrument => (
                            <InstrumentTag
                                instrument={instrument}
                                onPress={() => this.onTagPressed(instrument)}
                                colorOfCell = 'white'
                            />
                        ))}
                    </ScrollView>
                </View>
                <View style={styles.instrumentTextInputContainer}>
                    <TextInput 
                        style={styles.instrumentInput} 
                        multiline={false} 
                        onChangeText={(instrument) => this.setState({instrument: instrument})}
                        placeholder = 'Please enter 1 instrument at a time'
                        onSubmitEditing={() => this.onSubmitPressed()}
                        ref={input => { this.textInput = input }}
                        blurOnSubmit={false}
                        returnKeyType='go'
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
        textAlign: 'center',
        paddingBottom: 40
    },
    instrumentTagScrollViewContainer: {
        // backgroundColor: 'black',
        height: 45,
        width: '100%',
        paddingBottom: 10
    },
    instrumentTextInputContainer: {
        borderRadius: 30,
        backgroundColor: 'white',
        height: 35,
        width: '80%'
    },
    instrumentInput: {
        flex: 1,
        color: 'gray',
        paddingLeft: 10
    },
    doneButton: {
        color: 'white',
        fontSize: 20,
        paddingTop: 20
    }
});


//this lets the component get imported other places
export default Register_Instrument;