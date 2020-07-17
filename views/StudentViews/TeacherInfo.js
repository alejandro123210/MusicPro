/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-undef */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Image,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import * as firebase from 'firebase';
import InstrumentTag from '../subComponents/instrumentTag';
import {Rating} from 'react-native-ratings';
import {Actions} from 'react-native-router-flux';
import ReviewBox from '../subComponents/TableCells/ReviewBox';

let deviceWidth = Dimensions.get('window').width;

class TeacherInfo extends React.Component {
  state = {
    teacher: this.props.teacher,
    // userData: this.props.userData,
    allTeacherData: {
      name: '',
      location: '',
      description: '',
      instruments: [],
      photo: this.props.teacher.photo,
      uid: '',
      reviewRating: 5,
      reviews: [],
    },
  };

  componentDidMount() {
    //here I load in all the teachers data from firebase
    //it seems more efficient than loading in every teacher and all their reviews in the previous screen
    var db = firebase.database();
    //we format the data a bit so the screen can be accessed from multiple places (Chat.js)
    var ref = db.ref(`users/${this.state.teacher.uid}/info`);
    ref.once('value').then((snapshot) => {
      var teacherData = JSON.parse(JSON.stringify(snapshot.val()));
      var reviews = [];
      var reviewStars = [];
      if (teacherData.reviews != null) {
        for (let review in teacherData.reviews) {
          reviews.push(teacherData.reviews[review]);
          reviewStars.push(teacherData.reviews[review].starCount);
        }
      }
      let allTeacherData = {
        name: teacherData.name,
        price: teacherData.price,
        location: teacherData.location,
        description: teacherData.description,
        instruments: teacherData.instruments,
        photo: teacherData.photo,
        uid: teacherData.uid,
        stripeID: teacherData.stripeID,
        avgStars:
          teacherData.avgStars !== undefined
            ? teacherData.avgStars.avgRating
            : 0,
        numberOfReviews:
          teacherData.avgStars !== undefined
            ? teacherData.avgStars.numberOfReviews
            : 0,
        reviews: reviews,
        subject: teacherData.subject,
      };
      this.setState({allTeacherData});
    });
  }

  onBookPressed = () => {
    Actions.CalendarForStudents({
      userData: this.props.userData,
      teacher: this.state.teacher,
    });
  };

  onLeaveReviewPressed = () => {
    Actions.ReviewTeacher({
      userData: this.props.userData,
      teacher: this.state.teacher,
    });
  };

  onMessagePressed = () => {
    Actions.Chat({
      userData: this.props.userData,
      otherUser: this.state.teacher,
    });
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={styles.container}
        backgroundColor="white"
        bounces={false}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: this.state.allTeacherData.photo}}
            style={styles.imageMain}
          />
        </View>
        <Text style={styles.nameText}>{this.state.allTeacherData.name}</Text>
        {this.state.allTeacherData.numberOfReviews !== 0 ? (
          <View style={{flexDirection: 'row'}}>
            <Rating
              count={5}
              startingValue={this.state.allTeacherData.avgStars}
              style={{paddingTop: 10}}
              imageSize={25}
              readonly={true}
            />
            <Text style={styles.numberOfReviewsText}>
              ({this.state.allTeacherData.numberOfReviews})
            </Text>
          </View>
        ) : (
          <View style={{paddingTop: 10, paddingLeft: 3}}>
            <Text style={styles.noReviews}>New</Text>
          </View>
        )}
        <Text style={styles.descriptionText}>
          {this.state.allTeacherData.description}
        </Text>
        <View style={styles.grid}>
          {this.state.allTeacherData.instruments.map((instrument) => (
            <InstrumentTag
              key={instrument}
              instrument={instrument}
              onPress={() => {}}
              colorOfCell="#274156"
            />
          ))}
        </View>
        {this.props.userData.userType === 'student' ? (
          <View>
            <TouchableOpacity
              onPress={() => this.onBookPressed()}
              activeOpacity={0.7}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>
                Book a lesson (₹{this.state.allTeacherData.price}/hr)
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onLeaveReviewPressed()}
              activeOpacity={0.7}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Leave a review</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => this.onMessagePressed()}
              activeOpacity={0.7}
              style={styles.buttonContainer}>
              <Text style={styles.buttonText}>Send a message</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View />
        )}

        <View style={styles.reviewsTitleContainer}>
          <Text style={styles.reviewsTitleText}> Reviews: </Text>
        </View>
        <View style={styles.writtenReviewContainer}>
          {this.state.allTeacherData.reviews.map((review) => (
            <ReviewBox
              key={`${review.name}${review.description}${review.starCount}`}
              name={review.name}
              review={review.description}
              starCount={review.starCount}
            />
          ))}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  imageContainer: {
    width: deviceWidth / 3,
    alignItems: 'center',
    paddingTop: 20,
  },
  imageMain: {
    width: deviceWidth / 3,
    height: deviceWidth / 3,
    borderRadius: 100,
    marginTop: 5,
  },
  noReviews: {
    color: 'green',
    fontSize: 18,
  },
  numberOfReviewsText: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 5,
    color: 'gray',
    fontSize: 17,
  },
  nameText: {
    fontSize: 20,
    paddingTop: 20,
  },
  nameAndPrice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    color: 'gray',
    paddingLeft: 10,
    marginTop: 20,
    fontSize: 18,
  },
  descriptionText: {
    padding: 20,
    textAlign: 'center',
  },
  grid: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    height: 50,
    width: deviceWidth - 20,
    backgroundColor: '#274156',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    paddingBottom: 4,
  },
  reviewsTitleContainer: {
    flexDirection: 'row',
    width: deviceWidth - 10,
    marginTop: 40,
    borderBottomColor: 'black',
    borderBottomWidth: 0.3,
  },
  reviewsTitleText: {
    flex: 1,
    fontSize: 20,
    paddingLeft: 23,
  },
  writtenReviewContainer: {
    width: deviceWidth,
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: Platform.OS === 'ios' ? 'white' : '#f5f5f5',
  },
});

export default TeacherInfo;
