import React from 'react'
import { View, StyleSheet, TextInput, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


class LargePrompt extends React.Component{

    state = {
        title: this.props.title,
        description: ''
    }

    render(){
        return(
            <KeyboardAwareScrollView 
            style={{ backgroundColor: '#274156' }}
            resetScrollToCoords={{ x: 0, y: 0 }}
            contentContainerStyle={styles.container}
            scrollEnabled={false}
            keyboardShouldPersistTaps={'always'}
            >
            <Text style={styles.titleText}>{this.state.title}</Text>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    multiline={true} 
                    onChangeText={(description) => this.setState({description: description})}
                    ref={input => { this.textInput = input }}
                    blurOnSubmit={false}
                    returnKeyType='go'
                />
            </View>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => this.props.donePressed(this.state.description)}>
              <Text style={styles.doneText}>Done</Text>
            </TouchableOpacity>
          </KeyboardAwareScrollView>
        )
    }

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#274156',
      // justifyContent: 'center',
      alignItems: 'center'
    },
    titleText: {
      fontSize: 30,
      color: 'white',
      marginTop: 30
    },
    inputContainer: {
      borderRadius: 30,
      backgroundColor: 'white',
      height: 200,
      width: '80%',
      paddingTop: 1,
      marginTop: 30,
    },
    input: {
        flex: 1,
        color: 'gray',
        margin: 10
    },
    buttonContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 20
    },
    doneText: {
      fontSize: 20,
      color: 'white'
    },
});

export default LargePrompt