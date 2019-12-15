import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ImageBackground, Dimensions} from 'react-native';
import { Actions } from 'react-native-router-flux';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class LaunchScreen extends React.Component {

    loginPressed = () => {
        // we give login all the props to not get an error, but they are not used
        Actions.Login({
            alreadyRegistered: true,
            instrument: '',
            description: '',
            usertype: ''
        });
    }

    signupPressed = () => {
        Actions.Register();
    }
    
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>MusicPro</Text>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.loginPressed()} style={styles.button} activeOpacity={.6}>
                        <Text style={styles.buttonText}>login</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.signupPressed()} style={styles.button} activeOpacity={.6}>
                        <Text style={styles.buttonText}>sign up</Text>
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
        alignItems: 'center'
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column-reverse',
        height: '100%',
        width: '100%',
    },
    button: {
        height: 50,
        width: '95%',
        backgroundColor: 'white',
        marginBottom: 20,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
    },
    buttonText: {
        fontSize: 30,
        color: 'black'
    },
    title: {
        fontSize: 70,
        paddingTop: '40%',
        color: 'white',
    }
});

//this lets the component get imported other places
export default LaunchScreen;