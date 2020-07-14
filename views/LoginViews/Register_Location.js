/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {Actions} from 'react-native-router-flux';
import Geocoder from 'react-native-geocoding';
import Geolocation from 'react-native-geolocation-service';

class Register_Location extends React.Component {
  state = {
    location: '',
    coordinates: {},
    city: '',
    state: '',
    country: '',
    fromEdit: this.props.fromEdit,
  };

  componentDidMount() {
    Geocoder.init('AIzaSyAupzaW4QDOYo09xPAml62_tO_8_SYKiPk');
    Platform.OS === 'android'
      ? this.requestLocationPermission()
      : this.findCoordinates();
  }

  onPress = () => {
    const address = `${this.state.city}, ${this.state.state}, ${this.state.country}`;
    this.reverseGeocodeFromAddress(address);
  };

  //I feel like this should be able to work with just an address too, but
  //google returns a completely different set of a data from an address :/
  reverseGeocodeFromCoords = (coords) => {
    // alert(this.state.zip)
    Geocoder.from(coords)
      .then((json) => {
        console.log(json.results[0].address_components);
        const city =
          Platform.OS === 'ios'
            ? json.results[0].address_components[0].long_name
            : json.results[0].address_components[2].long_name;
        const state =
          Platform.OS === 'ios'
            ? json.results[0].address_components[2].long_name
            : json.results[0].address_components[5].long_name;
        const country =
          Platform.OS === 'ios'
            ? json.results[0].address_components[3].long_name
            : json.results[0].address_components[6].long_name;
        this.setState({
          city,
          state,
          country,
          coordinates: json.results[0].geometry.location,
        });
      })
      .catch((error) => alert(error));
  };

  //we pass the data from the method above to this anyway, it's stupid, and will be changed
  //but I have other things to worry about atm
  reverseGeocodeFromAddress = (address) => {
    Geocoder.from(address)
      .then((json) => {
        console.log(json.results[0].address_components);
        this.setState({
          city: json.results[0].address_components[0].long_name,
          state: json.results[0].address_components[2].long_name,
          country: json.results[0].address_components[3].long_name,
          coordinates: json.results[0].geometry.location,
        });
        if (this.state.fromEdit !== true) {
          Actions.Register_Price({
            instruments: this.props.instruments,
            userType: this.props.userType,
            userInfo: this.props.userInfo,
            subject: this.props.subject,
            location: json.results[0].address_components[0].long_name,
            coordinates: json.results[0].geometry.location,
          });
        } else {
          Actions.EditProfile({
            userData: this.props.userData,
            coords: json.results[0].geometry.location,
            city: json.results[0].address_components[0].long_name,
          });
        }
      })
      .catch((error) => alert(error));
  };

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const coordinates = {lat, lng};
        this.reverseGeocodeFromCoords(coordinates);
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'MusicPro Location Permissions',
          message: 'We need your location to tell students where you teach!',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.findCoordinates();
      } else {
        alert("Sorry, we won't be able to find teachers without permission :/");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <KeyboardAwareScrollView
        style={{backgroundColor: '#274156'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={true}>
        <Text style={styles.questionText}>Where do you teach?</Text>
        <View style={styles.promptContainer}>
          <TextInput
            style={styles.textInput}
            value={this.state.city}
            onChangeText={(city) => this.setState({city})}
            placeholder="City"
            placeholderTextColor="gray"
            textAlign={'center'}
          />
        </View>
        <View style={styles.promptContainer}>
          <TextInput
            style={styles.textInput}
            value={this.state.state}
            onChangeText={(state) => this.setState({state})}
            placeholder="State"
            placeholderTextColor="gray"
            textAlign={'center'}
          />
        </View>
        <View style={styles.promptContainer}>
          <TextInput
            style={styles.textInput}
            value={this.state.country}
            onChangeText={(country) => this.setState({country})}
            placeholder="Country"
            placeholderTextColor="gray"
            textAlign={'center'}
          />
        </View>
        <TouchableOpacity onPress={() => this.onPress()}>
          <Text style={styles.doneButton}>Next</Text>
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
    color: 'black',
  },
  doneButton: {
    color: 'white',
    fontSize: 20,
    paddingTop: 20,
  },
});

//this lets the component get imported other places
export default Register_Location;
