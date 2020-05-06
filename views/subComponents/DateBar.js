import React from 'react';
import {Text, View, StyleSheet, Dimensions} from 'react-native';

let deviceHeight = Dimensions.get('window').height;

function dateBar() {
  var date = new Date().getDate(); //Current Date
  var month = new Date().getMonth() + 1; //Current Month
  var year = new Date().getFullYear(); //Current Year
  var fullDateText = 'Today is: ' + month + '/' + date + '/' + year;

  return (
    <View style={styles.dateBar}>
      <Text style={styles.dateText}>{fullDateText}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  dateBar: {
    height: deviceHeight / 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
  },
  dateText: {
    fontSize: 18,
    color: '#838081',
    fontFamily: 'HelveticaNeue-Medium',
    marginTop: 5,
  },
});

export default dateBar;
