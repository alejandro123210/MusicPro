/* eslint-disable no-undef */
import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DateBar from './DateBar';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

export default function topBar({userData, showDateBar = true, page}) {
  onSettingsPressed = () => {
    Actions.Settings({userData: userData});
  };

  var title;
  if (page === 'undecided') {
    title = 'Requests';
  } else if (page === 'confirmed') {
    title = 'Schedule';
  } else if (page === 'teachers') {
    title = 'Teachers';
  } else if (page === 'messages') {
    title = 'Messages';
  } else if (page === 'availability configurator') {
    title = 'Set Availability';
  }

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <TouchableOpacity onPress={() => onSettingsPressed()}>
            <Image
              source={require('../Assets/settings.png')}
              style={styles.messagingIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      {showDateBar ? <DateBar /> : <View />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight / 9,
    backgroundColor: '#274156',
    justifyContent: 'flex-end',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  titleText: {
    paddingLeft: 20,
    fontSize: 25,
    color: 'white',
  },
  messagingIcon: {
    height: 25,
    width: 25,
    tintColor: 'white',
    marginRight: 15,
    marginBottom: 10,
  },
});
