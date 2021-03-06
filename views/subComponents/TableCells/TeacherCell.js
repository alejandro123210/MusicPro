/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import InstrumentTag from '../instrumentTag';

let deviceWidth = Dimensions.get('window').width;

function teacherCell({
  image,
  name,
  location,
  instruments,
  avgStars,
  numberOfReviews,
  distance,
  onPress,
  onBookPressed,
  type,
  price,
}) {
  return (
    <TouchableOpacity
      style={styles.shadow}
      onPress={() => onPress()}
      delayPressIn={70}
      activeOpacity={0.7}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Image style={styles.circle} source={{uri: image}} />
          <View style={styles.nameContainer}>
            <View style={styles.nameAndPrice}>
              <Text style={styles.nameText}>{name}</Text>
              <Text style={styles.priceText}>₹{price}/hr</Text>
            </View>
            {numberOfReviews !== 0 ? (
              <View style={{flexDirection: 'row'}}>
                <Rating
                  count={5}
                  startingValue={avgStars}
                  style={{paddingTop: 10}}
                  imageSize={20}
                  readonly={true}
                />
                <Text style={styles.numberOfReviewsText}>
                  ({numberOfReviews})
                </Text>
              </View>
            ) : (
              <View style={{paddingTop: 10, paddingLeft: 3}}>
                <Text style={styles.noReviews}>New</Text>
              </View>
            )}
            {distance !== null ? (
              <Text style={styles.locationText}>
                {location} (≈{distance} mi)
              </Text>
            ) : (
              <View />
            )}
          </View>
        </View>
        <View style={styles.midSection}>
          <View style={styles.instrumentsContainer}>
            {instruments != null ? (
              instruments.map((instrument) => (
                <InstrumentTag
                  instrument={instrument}
                  colorOfCell="#274156"
                  key={instruments.findIndex(
                    (instrumentinArray) => instrument == instrumentinArray,
                  )}
                />
              ))
            ) : (
              <View />
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.bottomButtons}
          onPress={() => onBookPressed()}
          activeOpacity={0.7}>
          <Text style={styles.bookText}>
            {type === 'share' ? 'Share profile' : 'Book a lesson'}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: 'gray',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 10,
    width: deviceWidth,
    alignItems: 'center',
  },
  noReviews: {
    color: 'green',
  },
  numberOfReviewsText: {
    flexDirection: 'row',
    paddingTop: 10,
    paddingLeft: 5,
    color: 'gray',
    fontSize: 15,
  },
  container: {
    backgroundColor: 'white',
    width: deviceWidth - 20,
    borderRadius: 10,
    marginTop: 10,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  circle: {
    height: 60,
    width: 60,
    borderRadius: 100000,
    margin: 20,
  },
  nameContainer: {
    alignItems: 'flex-start',
  },
  nameAndPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: deviceWidth / 1.5,
  },
  nameText: {
    fontSize: 20,
  },
  priceText: {
    color: 'gray',
  },
  locationText: {
    color: 'gray',
    margin: 5,
  },
  midSection: {
    borderTopWidth: 0.3,
    borderTopColor: 'gray',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  instrumentsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  bottomButtons: {
    height: 40,
    borderTopWidth: 0.5,
    borderTopColor: 'black',
    backgroundColor: '#274156',
    borderBottomStartRadius: 10,
    borderBottomEndRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookText: {
    color: 'white',
    fontSize: 20,
  },
});

export default teacherCell;
