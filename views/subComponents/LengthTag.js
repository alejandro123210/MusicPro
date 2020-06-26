import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

const LengthTag = (props) => {
  const [instrument] = useState(props.instrument);
  if (props.highlighted) {
    var backgroundColor = props.colorOfCell;
    var colorOfCell = 'white';
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.onPress()}
          style={[styles.container, {backgroundColor: backgroundColor}]}>
          <Text style={[styles.text, {color: colorOfCell}]}>{instrument}</Text>
        </TouchableOpacity>
      </View>
    );
  } else {
    var backgroundColor = 'white';
    var colorOfCell = props.colorOfCell;
    return (
      <View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => props.onPress()}
          style={[styles.container, {backgroundColor: backgroundColor}]}>
          <Text style={[styles.text, {color: colorOfCell}]}>{instrument}</Text>
        </TouchableOpacity>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  text: {
    padding: 5,
  },
});

export default LengthTag;
