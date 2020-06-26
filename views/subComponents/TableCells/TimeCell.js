import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

//required props:
//name
//key

//required props are name, key, date, lastmessage

let deviceWidth = Dimensions.get('window').width;

function timeCell({backgroundColor, name, fontColor, onPress}) {
  return (
    <View>
      <TouchableOpacity
        onPress={() => onPress()}
        delayPressIn={70}
        activeOpacity={0.9}
        style={[styles.cellView, {backgroundColor: backgroundColor}]}>
        <Text style={styles.timeText}>{name}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cellView: {
    height: 110,
    marginLeft: 5,
    marginRight: 5,
    marginTop: 10,
    borderRadius: 10,
    width: deviceWidth / 2.15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  timeText: {
    fontSize: 20,
    color: 'white',
  },
});

export default timeCell;
