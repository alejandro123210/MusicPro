/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import {Rating} from 'react-native-ratings';
import InstrumentTag from '../subComponents/instrumentTag';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import {sendNotification} from '../subComponents/BackendComponents/BackendFunctions';
import LengthTag from '../subComponents/LengthTag';

let deviceWidth = Dimensions.get('window').width;

class RequestLessonDetail extends React.Component {
  //we call most of the props here to see what data we have access to
  state = {
    userData: this.props.userData,
    teacher: this.props.teacher,
    date: this.props.date,
    time: this.props.time,
    hourAvailable: this.props.hourAvailable,
    dateAndTime: '',
    selectedInstruments: [],
    selectedLength: '1 hour',
    lengthOptions: [
      {title: '1 hour', highlighted: true, index: 0},
      {title: '30 minutes', highlighted: false, index: 1},
    ],
  };

  componentDidMount() {
    var moment = require('moment');
    var dateInPlainEnglish = moment(this.state.date).format('MMMM Do');
    var dateAndTime = `${dateInPlainEnglish} at ${this.state.time}`;
    this.setState({dateAndTime});

    if (this.state.hourAvailable === false) {
      this.setState({
        selectedLength: '30 minutes',
        lengthOptions: [{title: '30 minutes', highlighted: true, index: 1}],
      });
    }
  }

  confirmRequest = () => {
    if (this.state.selectedInstruments.length > 0) {
      let studentName = this.state.userData.name;
      let studentIDNum = this.state.userData.uid;
      let teacherImage = this.state.teacher.photo;
      let studentImage = this.state.userData.photo;
      let teacherName = this.state.teacher.name;
      let teacherIDNum = this.state.teacher.uid;
      let lessonLength = this.state.selectedLength;
      let selectedInstruments = this.state.selectedInstruments;
      let date = this.state.date;
      let time = this.state.time;
      var timeKey = '';
      if (time === '7:00 AM') {
        timeKey = 0;
      } else if (time === '7:30 AM') {
        timeKey = 1;
      } else if (time === '8:00 AM') {
        timeKey = 2;
      } else if (time === '8:30 AM') {
        timeKey = 3;
      } else if (time === '9:00 AM') {
        timeKey = 4;
      } else if (time === '9:30 AM') {
        timeKey = 5;
      } else if (time === '10:00 AM') {
        timeKey = 6;
      } else if (time === '10:30 AM') {
        timeKey = 7;
      } else if (time === '11:00 AM') {
        timeKey = 8;
      } else if (time === '11:30 AM') {
        timeKey = 9;
      } else if (time === '12:00 PM') {
        timeKey = 10;
      } else if (time === '12:30 PM') {
        timeKey = 11;
      } else if (time === '1:00 PM') {
        timeKey = 12;
      } else if (time === '1:30 PM') {
        timeKey = 13;
      } else if (time === '2:00 PM') {
        timeKey = 14;
      } else if (time === '2:30 PM') {
        timeKey = 15;
      } else if (time === '3:00 PM') {
        timeKey = 16;
      } else if (time === '3:30 PM') {
        timeKey = 17;
      } else if (time === '4:00 PM') {
        timeKey = 18;
      } else if (time === '4:30 PM') {
        timeKey = 19;
      } else if (time === '5:00 PM') {
        timeKey = 20;
      } else if (time === '5:30 PM') {
        timeKey = 21;
      } else if (time === '6:00 PM') {
        timeKey = 22;
      } else if (time === '6:30 PM') {
        timeKey = 23;
      } else if (time === '7:00 PM') {
        timeKey = 24;
      } else if (time === '7:30 PM') {
        timeKey = 25;
      } else if (time === '8:00 PM') {
        timeKey = 26;
      } else if (time === '8:30 PM') {
        timeKey = 27;
      }
      var db = firebase.database();
      var teacherRef = db.ref(
        `users/${this.state.teacher.uid}/info/lessons/${date}`,
      );
      var studentRef = db.ref(`users/${studentIDNum}/info/lessons/${date}`);
      //we put both users names and ids so that later when the requeest is processed by the teacher
      //both the student and teacher have their lessons updated
      //(having both ids makes it easier to find each others profiles)
      var teacherLessonRequestKey = teacherRef.push().key;
      var studentLessonRequestKey = studentRef.push().key;
      var lessonData = {
        studentName: studentName,
        teacherName: teacherName,
        studentIDNum: studentIDNum,
        teacherIDNum: teacherIDNum,
        studentLessonKey: studentLessonRequestKey,
        teacherLessonKey: teacherLessonRequestKey,
        selectedInstruments: selectedInstruments,
        teacherImage: teacherImage,
        studentImage: studentImage,
        date: date,
        time: time,
        status: 'undecided',
        timeKey: timeKey,
        lessonLength: lessonLength,
      };
      teacherRef.child(teacherLessonRequestKey).update(lessonData);
      studentRef.child(studentLessonRequestKey).update(lessonData);
      sendNotification(teacherIDNum, studentName, 'lesson-requested');
      Actions.StudentLessonRequest({userData: this.state.userData});
      //start a conversation
      var moment = require('moment');
      var currentDate = moment().format();
      let userMessageData = {
        lastMessageAt: currentDate,
        userName: lessonData.teacherName,
        userPhoto: lessonData.teacherImage,
      };
      let otherUserMessageData = {
        lastMessageAt: currentDate,
        userName: this.state.userData.name,
        userPhoto: this.state.userData.photo,
      };
      var userRef = db.ref(
        `Messages/${this.state.userData.uid}/${lessonData.teacherIDNum}/`,
      );
      var otherUserRef = db.ref(
        `Messages/${lessonData.teacherIDNum}/${this.state.userData.uid}/`,
      );
      userRef.update(userMessageData);
      otherUserRef.update(otherUserMessageData);
    } else {
      alert('you have to pick an instrument!');
    }
  };

  selectInstrument = ({selected, instrument}) => {
    var selectedInstruments = this.state.selectedInstruments;
    if (selected === false) {
      selectedInstruments.push(instrument);
      this.setState({selectedInstruments});
    } else {
      selectedInstruments.pop(instrument);
      this.setState({selectedInstruments});
    }
    console.log(this.state.selectedInstruments);
  };

  setLength = (length) => {
    if (this.state.lengthOptions.length !== 1) {
      var lengthOptions = this.state.lengthOptions;
      length.highlighted = !length.highlighted;
      lengthOptions[length.index] = length;
      //if the person selects a tag to auto deselect the other one
      if (length.index === 1) {
        lengthOptions[0].highlighted = false;
      } else {
        lengthOptions[1].highlighted = false;
      }
      //if the person is deselecting the tag to auto select the other one
      if (length.highlighted === false && length.index === 1) {
        lengthOptions[0].highlighted = true;
        this.setState({selectedLength: lengthOptions[0].title});
      } else if (length.highlighted === false && length.index === 0) {
        lengthOptions[1].highlighted = true;
        this.setState({selectedLength: lengthOptions[1].title});
      }
      this.setState({lengthOptions});
      //set the state for the selected tag
      if (length.highlighted === true) {
        this.setState({selectedLength: length.title});
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            source={{uri: this.state.teacher.photo}}
            style={styles.imageMain}
          />
        </View>
        {this.state.teacher.numberOfReviews !== 0 ? (
          <Rating
            count={5}
            startingValue={this.state.teacher.avgStars.avgRating}
            style={{padding: 15}}
            imageSize={30}
            // onFinishRating={(rating) => this.quickRate(rating)}
            readonly={true}
          />
        ) : (
          <View style={styles.spacer} />
        )}

        <Text style={styles.title}>Lesson with {this.state.teacher.name}</Text>
        <Text style={styles.time}>on {this.state.dateAndTime}</Text>
        <Text style={styles.onWhatInstrumentText}> On what instrument? </Text>
        <View style={styles.line} />
        <View style={styles.instrumentsContainer}>
          {this.state.teacher.instruments.map((instrument) => (
            <InstrumentTag
              instrument={instrument}
              colorOfCell="#274156"
              type="highlightable"
              onPress={(thisInstrument) =>
                this.selectInstrument(thisInstrument)
              }
              key={instrument}
            />
          ))}
        </View>
        <Text style={styles.onWhatInstrumentText}>For</Text>
        <View style={styles.line} />
        <View style={styles.instrumentsContainer}>
          {this.state.lengthOptions.map((length) => (
            <LengthTag
              instrument={length.title}
              colorOfCell="#274156"
              highlighted={length.highlighted}
              onPress={() => this.setLength(length)}
              key={length.title}
            />
          ))}
        </View>
        <View style={styles.outerButtonContainer}>
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={() => this.confirmRequest()}>
            <Text style={{fontSize: 20, color: 'white'}}>Confirm Request</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    // backgroundColor: '#274156',
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
  title: {
    fontSize: 30,
    marginTop: 10,
    width: deviceWidth - 20,
    textAlign: 'center',
    // color: '#274156'
  },
  time: {
    marginTop: 20,
  },
  onWhatInstrumentText: {
    paddingTop: 60,
    fontSize: 20,
  },
  line: {
    height: 0.4,
    width: deviceWidth,
    backgroundColor: 'gray',
    marginTop: 10,
  },
  instrumentsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  outerButtonContainer: {
    flexDirection: 'column-reverse',
    flex: 1,
    marginBottom: 50,
  },
  buttonContainer: {
    backgroundColor: '#274156',
    width: deviceWidth - 20,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  spacer: {
    height: 30,
  },
});

//this lets the component get imported other places
export default RequestLessonDetail;
