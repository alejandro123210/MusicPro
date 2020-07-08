import React from 'react';
import {View, StyleSheet, Dimensions, TextInput, Keyboard} from 'react-native';

let deviceWidth = Dimensions.get('window').width;

export const SearchBar = ({onChangeText}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        onChangeText={(text) => onChangeText(text)}
        onSubmitEditing={() => Keyboard.dismiss()}
        placeholder="search"
        placeholderTextColor="gray"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: deviceWidth,
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 5,
  },
  textInput: {
    backgroundColor: '#D3D3D3',
    height: 40,
    width: deviceWidth - 10,
    borderRadius: 10,
    textAlign: 'center',
  },
});