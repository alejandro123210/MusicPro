import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TextInput,
  Keyboard,
  TouchableOpacity,
} from 'react-native';

let deviceWidth = Dimensions.get('window').width;

export const SearchBar = ({onChangeText, onChangeSubject, subject}) => {
  const [thisSubject, setSubject] = useState(subject);
  const subjects = ['Math', 'Language', 'Music'];
  const changeSubject = () => {
    const currentIndex = subjects.indexOf(thisSubject);
    const nextIndex = (currentIndex + 1) % subjects.length;
    setSubject(subjects[nextIndex]);
    onChangeSubject(subjects[nextIndex]);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => onChangeText(text)}
        onSubmitEditing={() => Keyboard.dismiss()}
        placeholder="search"
        placeholderTextColor="gray"
      />
      <TouchableOpacity
        onPress={() => changeSubject()}
        style={styles.subjectContainer}>
        <Text style={styles.subjectText}>{thisSubject}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: 45,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 5,
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: '#D3D3D3',
    height: 40,
    width: deviceWidth * 0.75,
    borderRadius: 10,
    textAlign: 'center',
    marginLeft: 10,
  },
  subjectContainer: {
    margin: 5,
    backgroundColor: '#274156',
    width: deviceWidth * 0.2,
    borderRadius: 20,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  subjectText: {
    color: 'white',
    padding: 5,
  },
});
