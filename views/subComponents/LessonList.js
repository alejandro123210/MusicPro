/* eslint-disable react-native/no-inline-styles */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
//this component handles all cases where there is a list of lessons being loaded,
//it loads the lessons, handles all taps, and renders the entire screen for:
// TeacherDash, StudentDash, LessonRequests, StudentLessonRequests

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Platform,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import ProfileBar from '../subComponents/ProfileBar';
import DateBar from '../subComponents/DateBar';
import {
  cancelLessons,
  loadLessons,
  loadLessonsOnce,
} from './BackendComponents/BackendFunctions';
import * as firebase from 'firebase';
import LessonCell from './TableCells/LessonCell';

class LessonList extends React.Component {
  state = {
    userData: this.props.userData,
    lessonType: this.props.lessonType,
    lessonsList: [],
  };

  componentDidMount() {
    loadLessons(this.state.userData, this.state.lessonType, this);
  }

  onScheduledEventPressed = (lesson) => {
    if (
      this.state.userData.userType == 'student' &&
      this.props.lessonType == 'confirmed'
    ) {
      Alert.alert(
        'Cancel Lesson?',
        'are you sure you want to cancel your lesson with ' +
          lesson.teacherName +
          '?',
        [
          {text: 'Cancel Lesson', onPress: () => cancelLessons(lesson)},
          {
            text: 'Nevermind',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else if (
      this.state.userData.userType == 'student' &&
      this.props.lessonType == 'undecided'
    ) {
      Alert.alert(
        'Cancel Request?',
        'are you sure you want to cancel your request with ' +
          lesson.teacherName +
          '?',
        [
          {text: 'Cancel Request', onPress: () => cancelLessons(lesson)},
          {
            text: 'Nevermind',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else if (
      this.state.userData.userType == 'teacher' &&
      this.props.lessonType == 'undecided'
    ) {
      Alert.alert(
        'Do you Accept?',
        'do you accept this lesson with ' + lesson.studentName,
        [
          {text: 'Confirm Lesson', onPress: () => this.acceptLesson(lesson)},
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {text: 'Deny', onPress: () => cancelLessons(lesson)},
        ],
        {cancelable: true},
      );
    } else if (
      this.state.userData.userType == 'teacher' &&
      this.props.lessonType == 'confirmed'
    ) {
      Alert.alert(
        'Cancel Lesson?',
        'are you sure you want to cancel your lesson with ' +
          lesson.studentName +
          '?',
        [
          {text: 'Cancel Lesson', onPress: () => cancelLessons(lesson)},
          {
            text: 'Nevermind',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
  };

  acceptLesson = (lesson) => {
    var db = firebase.database();
    db.ref(
      `users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`,
    ).update({status: 'confirmed'});
    db.ref(
      `users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`,
    ).update({status: 'confirmed'});
  };

  render() {
    return (
      <View style={styles.container}>
        <ProfileBar userData={this.state.userData} />
        <DateBar />
        {this.state.lessonsList.length != 0 ? (
          <ScrollView contentContainerStyle={{paddingBottom: 20}}>
            {this.state.lessonsList.map((lesson) => (
              <LessonCell
                name={
                  this.state.userData.userType == 'student'
                    ? lesson.teacherName
                    : lesson.studentName
                }
                image={
                  this.state.userData.userType == 'student'
                    ? lesson.teacherImage
                    : lesson.studentImage
                }
                time={lesson.time}
                date={lesson.date}
                instruments={lesson.instruments}
                onConfirmPressed={() => this.acceptLesson(lesson)}
                onDenyPressed={() => this.onScheduledEventPressed(lesson)}
                onCancelPressed={() => this.onScheduledEventPressed(lesson)}
                key={lesson.key}
                userType={this.state.userData.userType}
                request={this.state.lessonType == 'undecided' ? true : false}
              />
            ))}
          </ScrollView>
        ) : (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style={{color: 'gray', fontSize: 25, textAlign: 'center'}}>
              No lessons at the moment :/
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'white' : '#f5f5f5',
  },
});

export default LessonList;
