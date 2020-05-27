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

export default function TopBar({userData, showDateBar = true}) {
  onSettingsPressed = () => {
    Actions.Settings({userData: userData});
  };

  return (
    <View>
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>MusicPro</Text>
          <TouchableOpacity onPress={() => onSettingsPressed()}>
            <Image
              source={require('../Assets/settings.png')}
              style={styles.messagingIcon}
            />
          </TouchableOpacity>
        </View>
      </View>
      <DateBar />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: deviceHeight / 10,
    backgroundColor: '#274156',
    justifyContent: 'flex-end',
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
