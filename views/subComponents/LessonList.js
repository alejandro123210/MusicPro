//this component handles all cases where there is a list of lessons being loaded,
//it loads the lessons, handles all taps, and renders the entire screen for:
// TeacherDash, StudentDash, LessonRequests, StudentLessonRequests

import React from 'react';
import {Text, View, StyleSheet, FlatList, Alert, Platform} from 'react-native';
import {
  cancelLessons,
  sendNotification,
} from './BackendComponents/BackendFunctions';
import * as firebase from 'firebase';
import LessonCell from './TableCells/LessonCell';
import TopBar from './TopBar';

const LessonList = ({userData, lessonType, lessonsList}) => {
  let onDenyOrCancelPressed = (lesson) => {
    if (userData.userType === 'student' && lessonType === 'confirmed') {
      Alert.alert(
        'Cancel Lesson?',
        `Are you sure you want to cancel your lesson with ${lesson.teacherName}?`,
        [
          {
            text: 'Cancel Lesson',
            onPress: () =>
              cancelLessons(lesson, userData.userType, 'lesson-cancelled'),
          },
          {
            text: 'Nevermind',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else if (userData.userType === 'student' && lessonType === 'undecided') {
      Alert.alert(
        'Cancel Request?',
        `Are you sure you want to cancel your request with ${lesson.teacherName}?`,
        [
          {
            text: 'Cancel Request',
            onPress: () =>
              cancelLessons(lesson, userData.userType, 'request-cancelled'),
          },
          {
            text: 'Nevermind',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    } else if (userData.userType === 'teacher' && lessonType === 'undecided') {
      Alert.alert(
        'Are you sure?',
        `Are you sure you want to deny this lesson with ${lesson.studentName}?`,
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Deny',
            onPress: () =>
              cancelLessons(lesson, userData.userType, 'request-denied'),
          },
        ],
        {cancelable: true},
      );
    } else if (userData.userType === 'teacher' && lessonType === 'confirmed') {
      Alert.alert(
        'Cancel Lesson?',
        `Are you sure you want to cancel your lesson with ${lesson.studentName}?`,
        [
          {
            text: 'Cancel Lesson',
            onPress: () =>
              cancelLessons(lesson, userData.userType, 'lesson-cancelled'),
          },
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

  //lesson is passed
  let acceptLesson = ({
    teacherName,
    teacherID,
    studentID,
    date,
    teacherLessonKey,
    studentLessonKey,
  }) => {
    sendNotification(studentID, teacherName, 'request-accepted');
    var db = firebase.database();
    db.ref(
      `users/${teacherID}/info/lessons/${date}/${teacherLessonKey}`,
    ).update({status: 'confirmed'});
    db.ref(
      `users/${studentID}/info/lessons/${date}/${studentLessonKey}`,
    ).update({status: 'confirmed'});
  };

  return (
    <View style={styles.container}>
      <TopBar userData={userData} page={lessonType} />
      {lessonsList.length !== 0 ? (
        <FlatList
          data={lessonsList}
          contentContainerStyle={styles.flatListStyle}
          renderItem={({item}) => (
            <LessonCell
              name={
                userData.userType === 'student'
                  ? item.teacherName
                  : item.studentName
              }
              image={
                userData.userType === 'student'
                  ? item.teacherImage
                  : item.studentImage
              }
              time={item.time}
              date={item.date}
              instruments={item.instruments}
              onConfirmPressed={() => acceptLesson(item)}
              onDenyPressed={() => onDenyOrCancelPressed(item)}
              onCancelPressed={() => onDenyOrCancelPressed(item)}
              userType={userData.userType}
              request={lessonType === 'undecided' ? true : false}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <View style={styles.noLessonsContainer}>
          <Text style={styles.noLessonsText}>
            {lessonType === 'undecided'
              ? 'No lesson requests at the moment'
              : 'No confirmed lessons at the moment'}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'white' : '#f5f5f5',
  },
  noLessonsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noLessonsText: {
    color: 'gray',
    fontSize: 25,
    textAlign: 'center',
    width: 250,
  },
  flatListStyle: {
    paddingBottom: 20,
  },
});

export default LessonList;
