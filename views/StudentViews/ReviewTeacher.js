/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AirbnbRating} from 'react-native-ratings';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {updateTeacherList} from '../subComponents/BackendComponents/BackendFunctions';

let deviceWidth = Dimensions.get('window').width;

class ReviewTeacher extends React.Component {
  state = {
    teacher: this.props.teacher,
    userData: this.props.userData,
    review: '',
    rating: 5,
  };

  onDonePressed = () => {
    var db = firebase.database();
    var ref = db.ref(`users/${this.state.teacher.uid}/info/reviews`);
    var reviewData = {
      name: this.state.userData.name,
      description: this.state.review,
      starCount: this.state.rating,
    };
    ref.push(reviewData);
    updateTeacherList(this.state.teacher.uid);
    Actions.StudentDash({userData: this.state.userData});
  };

  starRate = (rating) => {
    this.setState({rating: rating});
  };

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <KeyboardAwareScrollView
        style={{backgroundColor: '#274156'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        keyboardShouldPersistTaps={'always'}>
        <Text style={styles.topText}> Write your review </Text>
        <AirbnbRating
          count={5}
          reviews={['Terrible', 'Meh', 'Ok', 'Good', 'Great']}
          defaultRating={5}
          size={20}
          onFinishRating={(rating) => this.starRate(rating)}
        />
        <View style={styles.reviewInputContainer}>
          <TextInput
            style={styles.reviewInput}
            multiline={true}
            onChangeText={(review) => this.setState({review: review})}
            placeholder="Leave your review here..."
            ref={(input) => {
              this.textInput = input;
            }}
            blurOnSubmit={false}
            returnKeyType="go"
          />
        </View>
        <TouchableOpacity
          style={styles.buttonContainer}
          onPress={() => this.onDonePressed()}>
          <Text style={styles.doneText}>Done</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274156',
    alignItems: 'center',
  },
  topText: {
    fontSize: 30,
    color: 'white',
    paddingTop: 20,
  },
  reviewInputContainer: {
    borderRadius: 30,
    backgroundColor: 'white',
    height: 200,
    width: deviceWidth - 20,
    paddingTop: 1,
    marginTop: 30,
  },
  reviewInput: {
    flex: 1,
    color: 'gray',
    margin: 10,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  doneText: {
    fontSize: 20,
    color: 'white',
  },
});

//this lets the component get imported other places
export default ReviewTeacher;
