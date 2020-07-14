/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React from 'react';
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
import InstrumentTag from '../subComponents/instrumentTag';

let deviceWidth = Dimensions.get('window').width;

class Register_Instrument extends React.Component {
  state = {
    instruments: [],
    instrument: '',
    subject: this.props.subject,
  };

  onPress = () => {
    if (this.state.instruments.length !== 0) {
      Actions.Register_Location({
        instruments: this.state.instruments,
        userType: this.props.userType,
        userInfo: this.props.userInfo,
        subject: this.state.subject,
      });
    } else {
      alert('you must enter at least 1 instrument');
    }
  };

  onSubmitPressed = () => {
    const instrument = this.state.instrument.trim();
    var instruments = this.state.instruments;
    if (instrument !== '') {
      instruments.push(instrument);
      this.setState({instruments});
      this.setState({instrument: ''});
      this.textInput.clear();
      console.log(this.state.instruments);
    }
  };

  onTagPressed = (item) => {
    var instruments = this.state.instruments;
    const index = instruments.indexOf(item);
    if (index > -1) {
      instruments.splice(index, 1);
    }
    this.setState({instruments});
  };

  render() {
    return (
      <KeyboardAwareScrollView
        style={{backgroundColor: '#274156'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        keyboardShouldPersistTaps={'never'}>
        <Text style={styles.questionText}>
          What{' '}
          {this.state.subject === 'Music'
            ? 'instruments/tools'
            : this.state.subject === 'Language'
            ? 'languages'
            : 'classes'}{' '}
          do you want to teach?
        </Text>
        <View style={styles.instrumentTagScrollViewContainer}>
          <View style={styles.grid}>
            {this.state.instruments.map((instrument) => (
              <InstrumentTag
                instrument={instrument}
                onPress={() => this.onTagPressed(instrument)}
                colorOfCell="white"
                type="tappable"
                key={instrument}
              />
            ))}
          </View>
        </View>
        <View style={styles.instrumentTextInputContainer}>
          <TextInput
            style={styles.instrumentInput}
            multiline={false}
            onChangeText={(instrument) =>
              this.setState({instrument: instrument})
            }
            placeholder={
              this.state.subject === 'Music'
                ? 'Please enter 1 instrument at a time'
                : this.state.subject === 'Language'
                ? 'Please enter 1 language at a time'
                : 'Please enter 1 class at a time'
            }
            onSubmitEditing={() => this.onSubmitPressed()}
            ref={(input) => {
              this.textInput = input;
            }}
            blurOnSubmit={false}
            returnKeyType="go"
          />
          <TouchableOpacity
            style={styles.addTextContainer}
            onPress={() => this.onSubmitPressed()}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
        <View>
          <TouchableOpacity onPress={() => this.onPress()}>
            <Text style={styles.doneButton}>Next</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274156',
    alignItems: 'center',
    justifyContent: 'center',
  },
  questionText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
    paddingBottom: 40,
    width: '80%',
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    width: deviceWidth - 10,
  },
  addTextContainer: {
    // alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  addText: {
    fontSize: 20,
    color: '#274156',
  },
  instrumentTextInputContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    height: 35,
    width: '80%',
    paddingTop: 1,
    flexDirection: 'row',
  },
  instrumentInput: {
    flex: 1,
    color: 'gray',
    paddingLeft: 10,
  },
  doneButton: {
    color: 'white',
    fontSize: 20,
    paddingTop: 20,
  },
});

//this lets the component get imported other places
export default Register_Instrument;
