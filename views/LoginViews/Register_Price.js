/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Actions} from 'react-native-router-flux';

const Register_Price = ({
  instruments,
  userType,
  userInfo,
  coordinates,
  location,
  subject,
}) => {
  const [price, setPrice] = useState();

  const onPress = () => {
    if (price !== undefined) {
      Actions.Register_Description({
        instruments,
        userType,
        userInfo,
        location,
        coordinates,
        price,
        subject,
      });
    } else {
      alert('You need to enter a cost!');
    }
  };

  return (
    // this is just random filler for the template, but this is where what the user sees is rendered
    <KeyboardAwareScrollView
      style={{backgroundColor: '#274156'}}
      resetScrollToCoords={{x: 0, y: 0}}
      contentContainerStyle={styles.container}
      scrollEnabled={true}>
      <Text style={styles.questionText}>
        How much do you charge per hour in INR? (30 minute lessons are half that
        cost)
      </Text>
      <View style={styles.promptContainer}>
        <TextInput
          style={styles.textInput}
          onChangeText={(thisPrice) => setPrice(Math.round(thisPrice))}
          placeholder="200"
          textAlign={'center'}
          placeholderTextColor="gray"
          keyboardType="number-pad"
        />
      </View>
      <TouchableOpacity onPress={() => onPress()}>
        <Text style={styles.doneButton}>Next</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274156',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  questionText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    width: deviceWidth * 0.8,
  },
  promptContainer: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    width: deviceWidth * 0.8,
    marginTop: 20,
  },
  textInput: {
    flex: 1,
    color: 'black',
  },
  doneButton: {
    color: 'white',
    fontSize: 20,
    paddingTop: 20,
  },
});

//this lets the component get imported other places
export default Register_Price;
