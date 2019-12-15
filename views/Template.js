import React from 'react';
import { View, StyleSheet } from 'react-native';

class CLASS_NAME extends React.Component {

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <View style={styles.container}>

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
export default CLASS_NAME;