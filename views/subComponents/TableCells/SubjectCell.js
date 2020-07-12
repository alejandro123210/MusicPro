import React from 'react';
import {
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Text,
  Image,
  View,
} from 'react-native';

const SubjectCell = ({title, selected, onPress}) => {
  return (
    <TouchableOpacity
      style={styles.container}
      activeOpacity={0.7}
      onPress={() => onPress()}>
      <Text style={styles.text}>{title}</Text>
      {selected ? (
        <Image
          source={require('../../Assets/checkmark.png')}
          style={styles.checkmark}
        />
      ) : (
        <View style={styles.checkmark} />
      )}
    </TouchableOpacity>
  );
};

const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: deviceWidth - 20,
    backgroundColor: '#274156',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    marginTop: 20,
    flexDirection: 'row',
  },
  text: {
    color: 'white',
    fontSize: 18,
    paddingLeft: 20,
  },
  checkmark: {
    height: 20,
    width: 20,
    marginRight: 20,
    tintColor: 'white',
  },
});

export default SubjectCell;
