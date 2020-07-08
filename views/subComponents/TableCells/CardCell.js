/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';

const CardCell = ({card, onPress, active}) => {
  var expDate;
  var title;
  if (card) {
    var year = card.expYear.toString().substr(2);
    expDate = `expires ${card.expMonth}/${year}`;
    title = `${card.brand} ending in ${card.last4}`;
  }

  return (
    <View style={[styles.shadow, {paddingBottom: card ? 0 : 40}]}>
      <TouchableOpacity
        style={styles.container}
        activeOpacity={0.7}
        onPress={() => onPress()}>
        {card ? (
          <View style={styles.cardInfo}>
            <View style={styles.cardText}>
              <Text style={styles.titleText}>{title}</Text>
              <Text style={styles.expiryText}>{expDate}</Text>
            </View>
            <Image
              source={require('../../Assets/checkmark.png')}
              style={[
                styles.checkmark,
                {tintColor: active ? '#274156' : 'white'},
              ]}
            />
          </View>
        ) : (
          <Text style={styles.addNewText}>Add Card</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const deviceWidth = Dimensions.get('window').width;
// const deviceHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 0.2},
    shadowOpacity: 0.3,
    shadowRadius: 5,
    width: deviceWidth,
    alignItems: 'center',
    paddingTop: 10,
  },
  container: {
    width: deviceWidth - 20,
    height: 60,
    // borderColor: 'gray',
    // borderWidth: 0.3,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
  },
  cardInfo: {
    width: deviceWidth - 20,
    paddingLeft: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardText: {
    flexDirection: 'column',
  },
  titleText: {
    fontSize: 17,
  },
  expiryText: {
    fontSize: 13,
    color: 'gray',
  },
  checkmark: {
    height: 20,
    width: 20,
    marginRight: 20,
  },
  addNewText: {
    fontSize: 17,
    color: '#274156',
  },
});

export default CardCell;
