import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {Actions} from 'react-native-router-flux';
import DateBar from './DateBar';
import {share} from './BackendComponents/Share';

let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

export default function topBar({userData, showDateBar = true, page}) {
  const onSettingsPressed = () => {
    Actions.Settings({userData});
  };

  const onSharePressed = async () => {
    share(userData);
  };

  //TODO: change this so that it just uses the page as the heading
  var title;
  var hideSettingsButton = false;
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
  } else if (page === 'Send Payment') {
    title = 'Payment Due';
    hideSettingsButton = true;
  }

  return (
    <View>
      <StatusBar backgroundColor="#274156" />
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.titleText}>{title}</Text>
          <View style={styles.iconContainer}>
            {hideSettingsButton ? (
              <View />
            ) : (
              // eslint-disable-next-line react-native/no-inline-styles
              <View style={{flexDirection: 'row-reverse'}}>
                <TouchableOpacity onPress={() => onSettingsPressed()}>
                  <Image
                    source={require('../Assets/settings.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onSharePressed()}>
                  <Image
                    source={require('../Assets/shareicon.png')}
                    style={styles.icon}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
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
  iconContainer: {
    flexDirection: 'row-reverse',
  },
  icon: {
    height: 25,
    width: 25,
    tintColor: 'white',
    marginRight: 15,
    marginBottom: 10,
  },
});
