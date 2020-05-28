/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable eqeqeq */
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
  };

  onPress = () => {
    if (this.state.instruments.count != 0) {
      Actions.Register_Location({
        instruments: this.state.instruments,
        userType: this.props.userType,
        userInfo: this.props.userInfo,
      });
    } else {
      alert('you must enter at least 1 instrument');
    }
  };

  onSubmitPressed = () => {
    let instrument = this.state.instrument;
    var instruments = this.state.instruments;
    if (instrument != '') {
      instruments.push(instrument);
      this.setState({instruments});
      this.setState({instrument: ''});
      this.textInput.clear();
      console.log(this.state.instruments);
    }
  };

  onTagPressed = () => {
    var instruments = this.state.instruments;
    instruments.splice(instruments.indexOf('B'), 1);
    this.setState({instruments});
  };

  render() {
    return (
      <KeyboardAwareScrollView
        style={{backgroundColor: '#274156'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        keyboardShouldPersistTaps={'always'}>
        {this.props.userType == 'student' ? (
          <Text style={styles.questionText}>
            What instruments do you want to learn?
          </Text>
        ) : (
          <Text style={styles.questionText}>
            What instruments do you want to teach?
          </Text>
        )}
        <View style={styles.instrumentTagScrollViewContainer}>
          <View style={styles.grid}>
            {this.state.instruments.map((instrument) => (
              <InstrumentTag
                instrument={instrument}
                onPress={() => this.onTagPressed(instrument)}
                colorOfCell="white"
                type="tappable"
                key={this.state.instruments.findIndex(
                  (instrumentinArray) => instrument == instrumentinArray,
                )}
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
            placeholder="Please enter 1 instrument at a time"
            onSubmitEditing={() => this.onSubmitPressed()}
            ref={(input) => {
              this.textInput = input;
            }}
            blurOnSubmit={false}
            returnKeyType="go"
          />
        </View>
        <View>
          <TouchableOpacity onPress={() => this.onPress()}>
            <Text style={styles.doneButton}>Done!</Text>
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
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    width: deviceWidth - 10,
  },
  // instrumentTagScrollViewContainer: {
  //     // backgroundColor: 'black',
  //     height: 45,
  //     width: '100%',
  //     paddingBottom: 10
  // },
  instrumentTextInputContainer: {
    borderRadius: 30,
    backgroundColor: 'white',
    height: 35,
    width: '80%',
    paddingTop: 1,
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
