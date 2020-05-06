/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

let deviceWidth = Dimensions.get('window').width;

function largePrompt({title, donePressed}) {
  var description = '';

  return (
    <KeyboardAwareScrollView
      style={{backgroundColor: '#274156'}}
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={styles.container}
      scrollEnabled={false}
      keyboardShouldPersistTaps={'always'}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          multiline={true}
          onChangeText={enteredText => (description = enteredText)}
          blurOnSubmit={false}
          returnKeyType="go"
        />
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={() => donePressed(description)}>
        <Text style={styles.doneText}>Done</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274156',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    color: 'white',
    marginTop: 80,
    textAlign: 'center',
  },
  inputContainer: {
    borderRadius: 30,
    backgroundColor: 'white',
    height: 200,
    width: deviceWidth - 40,
    paddingTop: 1,
    marginTop: 30,
  },
  input: {
    flex: 1,
    color: 'gray',
    margin: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  doneText: {
    fontSize: 20,
    color: 'white',
    marginBottom: 300,
  },
});

export default largePrompt;
