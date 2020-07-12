/* eslint-disable no-alert */
/* eslint-disable react-native/no-inline-styles */
import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import InstrumentTag from '../subComponents/instrumentTag';
import {Rating} from 'react-native-ratings';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import * as firebase from 'firebase';
import Geocoder from 'react-native-geocoding';
import {Actions} from 'react-native-router-flux';
import ImagePicker from 'react-native-image-picker';
import {updateTeacherList} from '../subComponents/BackendComponents/BackendFunctions';

let deviceWidth = Dimensions.get('window').width;

//orceUpdate hook
function useForceUpdate() {
  const [, setValue] = useState(0); // integer state
  return () => setValue((x) => ++x); // update the state to force render
}

//image picker options
const options = {
  title: 'Select Pic',
  quality: 0.3,
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

const EditProfile = ({userData}) => {
  //variable defining
  const forceUpdate = useForceUpdate();
  const [description, setDescription] = useState(userData.description);
  const [instrument, setInstrument] = useState('');
  const [zip, setZip] = useState('');
  const [input, setInput] = useState();
  const [photo, setPhoto] = useState(userData.photo);
  const [price, setPrice] = useState(userData.price);
  //parse and strinigfy to avoid pointer issues
  const [instruments, setInstruments] = useState(
    JSON.parse(JSON.stringify(userData.instruments)),
  );

  //when the user enters a new instrument
  const addInstrument = (text) => {
    setInstrument(text);
    var thisInstruments = instruments;
    thisInstruments.push(instrument);
    setInstruments(thisInstruments);
    input.clear();
  };

  //when the user taps a tag
  const removeInstrument = (item) => {
    if (instruments.length !== 1) {
      const index = instruments.indexOf(item);
      if (index > -1) {
        instruments.splice(index, 1);
      }
      console.log(instruments);
      setInstruments(instruments);
      forceUpdate();
    } else {
      alert('You have to teach at least 1 instrument!');
    }
  };

  const pickImage = () => {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = 'data:image/jpeg;base64,' + response.data;
        userData.photo = source;
        setPhoto(source);
      }
    });
  };

  //when the user saves changes
  const saveChanges = () => {
    let db = firebase.database();
    let userRef = db.ref(`users/${userData.uid}/info`);
    //this is an incredibly stupid way to do this, but I did it, difference is minimal tho
    if (zip !== '') {
      Geocoder.init('AIzaSyAupzaW4QDOYo09xPAml62_tO_8_SYKiPk');
      Geocoder.from(zip)
        .then((json) => {
          const location = json.results[0].address_components[1].long_name;
          const coordinates = json.results[0].geometry.location;
          userRef.update({
            description,
            coordinates,
            location,
            instruments,
            photo,
            price,
          });
          userData.description = description;
          userData.coordinates = coordinates;
          userData.location = location;
          userData.instruments = instruments;
          userData.photo = photo;
          userData.price = price;
          updateTeacherList(userData.uid);
          Actions.TeacherMain({userData});
        })
        .catch((error) =>
          alert("Sorry! There's a probelm with the zip code you entered"),
        );
    } else {
      userRef.update({
        description,
        instruments,
        photo,
        price,
      });
      userData.description = description;
      userData.instruments = instruments;
      userData.photo = photo;
      userData.price = price;
      updateTeacherList(userData.uid);
      Actions.TeacherMain({userData});
    }
  };

  if (userData.userType === 'teacher') {
    return (
      <KeyboardAwareScrollView
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={true}
        extraScrollHeight={50}
        keyboardShouldPersistTaps={'never'}>
        <TouchableOpacity
          onPress={() => pickImage()}
          style={styles.imageContainer}>
          <Image source={{uri: userData.photo}} style={styles.imageMain} />
        </TouchableOpacity>
        {userData.avgStars !== undefined ? (
          <View style={{flexDirection: 'row'}}>
            <Rating
              count={5}
              startingValue={userData.avgStars.avgRating}
              style={{paddingTop: 10}}
              imageSize={25}
              readonly={true}
            />
            <Text style={styles.numberOfReviewsText}>
              ({userData.avgStars.numberOfReviews})
            </Text>
          </View>
        ) : (
          <View style={{paddingTop: 10, paddingLeft: 3}}>
            <Text style={styles.noReviews}>No Reviews</Text>
          </View>
        )}
        <Text style={styles.nameText}>{userData.name}</Text>
        <Text style={styles.sectionHeader}>Description:</Text>
        <View style={styles.line} />
        <TextInput
          style={styles.descriptionInput}
          value={description}
          onSubmitEditing={() => Keyboard.dismiss()}
          onChangeText={(text) => setDescription(text)}
          placeholder="I have been a teacher for 3 years etc... "
          placeholderTextColor="gray"
          multiline={true}
        />
        <Text style={styles.sectionHeader}>
          {userData.subject === 'Music'
            ? 'Instruments'
            : userData.subject === 'Language'
            ? 'Languages'
            : 'Classes'}{' '}
          (tap to remove):
        </Text>
        <View style={styles.line} />
        <View style={styles.grid}>
          {instruments.map((item) => (
            <InstrumentTag
              key={`${item}${Math.random()}`}
              instrument={item}
              onPress={() => removeInstrument(item)}
              colorOfCell="#274156"
              type="tappable"
            />
          ))}
        </View>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.instrumentInput}
            multiline={false}
            onChangeText={(text) => setInstrument(text)}
            placeholder="Please enter 1 instrument at a time"
            placeholderTextColor={'gray'}
            onSubmitEditing={(text) => addInstrument(text)}
            blurOnSubmit={false}
            ref={(ref) => setInput(ref)}
          />
          <TouchableOpacity
            style={styles.addTextContainer}
            onPress={(text) => addInstrument(text)}>
            <Text style={styles.addText}>Add</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.sectionHeader}>
          Location ({userData.location}):
        </Text>
        <View style={styles.line} />
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.instrumentInput}
            multiline={false}
            onChangeText={(text) => setZip(text)}
            placeholder="zip code"
            placeholderTextColor={'gray'}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={false}
          />
        </View>
        <Text style={styles.sectionHeader}>Price (${userData.price}/hr):</Text>
        <View style={styles.line} />
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.instrumentInput}
            multiline={false}
            onChangeText={(text) => setPrice(text)}
            placeholder="60"
            placeholderTextColor={'gray'}
            onSubmitEditing={() => Keyboard.dismiss()}
            blurOnSubmit={false}
          />
        </View>
        <View style={styles.outerButtonContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.7}
            onPress={() => saveChanges()}>
            <Text style={{fontSize: 20, color: 'white'}}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.spacer} />
      </KeyboardAwareScrollView>
    );
  } else {
    return <View />;
  }
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // justifyContent: 'center',
  },
  imageContainer: {
    width: deviceWidth / 3,
    alignItems: 'center',
    paddingTop: 20,
  },
  imageMain: {
    width: deviceWidth / 3,
    height: deviceWidth / 3,
    borderRadius: 100,
    marginTop: 5,
  },
  nameText: {
    fontSize: 20,
    paddingTop: 20,
    width: deviceWidth - 10,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 20,
    width: deviceWidth - 10,
  },
  noReviews: {
    color: 'gray',
    fontSize: 15,
    paddingTop: 12,
  },
  numberOfReviewsText: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 5,
    color: 'gray',
    fontSize: 17,
  },
  sectionHeader: {
    paddingTop: 40,
    fontSize: 20,
  },
  line: {
    height: 0.5,
    width: deviceWidth,
    backgroundColor: 'gray',
    marginTop: 10,
  },
  descriptionInput: {
    paddingLeft: 10,
    textAlignVertical: 'top',
    backgroundColor: '#f2f2f2',
    height: 150,
    width: deviceWidth - 20,
    // backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 20,
    marginTop: 20,
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
  textInputContainer: {
    borderRadius: 30,
    backgroundColor: '#f2f2f2',
    height: 35,
    width: '80%',
    paddingTop: 1,
    flexDirection: 'row',
    marginTop: 20,
  },
  instrumentInput: {
    flex: 1,
    color: 'gray',
    paddingLeft: 10,
  },
  outerButtonContainer: {
    paddingTop: 50,
  },
  buttonContainer: {
    backgroundColor: '#274156',
    width: deviceWidth - 20,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  spacer: {
    height: 80,
    width: deviceWidth,
  },
});

//this lets the component get imported other places
export default EditProfile;
