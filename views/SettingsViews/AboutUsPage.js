import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

class AboutUsPage extends React.Component {

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleFont}>
                Music Pro
            </Text>
        </View>
        <View style={styles.bodyContainer}>
            <Text style={styles.bodyFont}>
                Music pro is the app that connect music educators to students! {'\n'}{'\n'}{'\n'}
                Creators: Alejandro Gonzalez and Maksym Karunos 
            </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#274156',
  },
  titleContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      backgroundColor: 'white',
      borderBottomColor: 'grey',
      borderBottomWidth: 0.3,
  },
  bodyContainer: {
      flex: 8,
      backgroundColor: 'white',
  },
  emptyBlock: {
      flex: 1, 
      backgroundColor: '#eee'
  },
  titleFont: {
      fontSize: 32,
      color: '#4c8bf5'
  },
  bodyFont: {
      padding: 10,
      fontSize: 14,
      color: 'black'
  }
});


//this lets the component get imported other places
export default AboutUsPage;