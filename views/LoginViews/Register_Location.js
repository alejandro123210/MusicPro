/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Actions} from 'react-native-router-flux';
import Geocoder from 'react-native-geocoding';

class Register_Location extends React.Component {
  state = {
    location: '',
    coordinates: {},
    zip: '',
  };

  onPress = () => {
    // alert(this.state.zip)
    Geocoder.init('AIzaSyAupzaW4QDOYo09xPAml62_tO_8_SYKiPk');
    Geocoder.from(this.state.zip)
      .then(json => {
        var location = json.results[0].address_components[1].long_name;
        var coordinates = json.results[0].geometry.location;
        this.setState({
          location: location,
          coordinates: coordinates,
        });
        Actions.Register_Description({
          instruments: this.props.instruments,
          userType: this.props.userType,
          userInfo: this.props.userInfo,
          location: this.state.location,
          coordinates: this.state.coordinates,
        });
      })
      .catch(error => alert(error));
  };

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <KeyboardAwareScrollView
        style={{backgroundColor: '#274156'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={true}>
        <Text style={styles.questionText}>
          Where do you teach?{'\n'}(zip code only)
        </Text>
        <View style={styles.promptContainer}>
          <TextInput
            style={styles.textInput}
            onChangeText={zipCode => this.setState({zip: zipCode})}
            placeholder="zip code"
            textAlign={'center'}
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
    justifyContent: 'center',
    flexDirection: 'column',
  },
  questionText: {
    fontSize: 30,
    color: 'white',
    textAlign: 'center',
  },
  promptContainer: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
  },
  textInput: {
    flex: 1,
  },
  doneButton: {
    color: 'white',
    fontSize: 20,
    paddingTop: 20,
  },
});

//this lets the component get imported other places
export default Register_Location;
