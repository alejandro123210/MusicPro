/* eslint-disable no-alert */
//this component handles all cases where there is a list of lessons being loaded,
//it loads the lessons, handles all taps, and renders the entire screen for:
// TeacherDash, StudentDash, LessonRequests, StudentLessonRequests

import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  Share,
} from 'react-native';
import {
  cancelLessons,
  sendNotification,
} from './BackendComponents/BackendFunctions';
import * as firebase from 'firebase';
import LessonCell from './TableCells/LessonCell';
import TopBar from './TopBar';
import TeacherCell from './TableCells/TeacherCell';
import {Actions} from 'react-native-router-flux';

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
  let acceptLesson = (lesson) => {
    sendNotification(lesson.studentID, lesson.teacherName, 'request-accepted');
    var db = firebase.database();
    db.ref(
      `users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`,
    ).update({status: 'confirmed'});
    db.ref(
      `users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`,
    ).update({status: 'confirmed'});
    //add the confirmed lesson to the list of lessons for the server to see,
    //it's organized by timestamp for efficiency
    db.ref(
      `lessons/${lesson.endingTimeStamp}/${lesson.studentID}/${lesson.studentLessonKey}`,
    ).set(lesson);
  };

  const onSharePressed = async () => {
    const accountLink = `musicpro://${userData.uid}`;
    if (userData.availability !== undefined) {
      try {
        const result = await Share.share({
          message: `I'm singed up with MusicPro! find my profile here: ${accountLink}`,
          title: 'MusicPro',
        });
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
            console.log(result.activityType);
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {
        alert(error.message);
      }
    } else {
      alert("You may want to set up when you're available first!");
    }
  };

  const onProfilePressed = () => {
    let teacher = {
      name: userData.name,
      location: userData.location,
      instruments: userData.instruments,
      photo: userData.photo,
      uid: userData.uid,
      price: userData.price,
      avgStars:
        userData.avgStars !== undefined ? userData.avgStars.avgRating : 0,
      numberOfReviews:
        userData.avgStars !== undefined ? userData.avgStars.numberOfReviews : 0,
    };
    Actions.TeacherInfo({userData, teacher});
  };

  return (
    <View style={styles.container}>
      <TopBar userData={userData} page={lessonType} />
      {lessonsList.length !== 0 ? (
        <FlatList
          data={lessonsList}
          contentContainerStyle={styles.flatListStyle}
          keyExtractor={(item, index) =>
            userData.userType === 'student'
              ? item.studentLessonKey
              : item.teacherLessonKey
          }
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
              lessonLength={item.lessonLength}
            />
          )}
        />
      ) : (
        <View style={styles.noLessonsContainer}>
          {userData.userType === 'student' ? (
            <Text style={styles.noLessonsText}>
              {lessonType === 'undecided'
                ? 'No lesson requests at the moment'
                : 'No confirmed lessons at the moment'}
            </Text>
          ) : (
            <TeacherCell
              image={userData.photo}
              name={userData.name}
              instruments={userData.instruments}
              avgStars={
                userData.avgStars !== undefined
                  ? userData.avgStars.avgRating
                  : 0
              }
              numberOfReviews={
                userData.avgStars !== undefined
                  ? userData.avgStars.numberOfReviews
                  : 0
              }
              location={userData.location}
              price={userData.price}
              onPress={() => onProfilePressed(userData)}
              onBookPressed={() => onSharePressed(userData)}
              uid={userData.uid}
              distance={null}
              type={'share'}
            />
          )}
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
