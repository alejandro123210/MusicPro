import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class SuggestFeaturePage extends React.Component {

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <View style={styles.container}>
        <Text> HUi</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#274156',
  }
});


//this lets the component get imported other places
export default SuggestFeaturePage;