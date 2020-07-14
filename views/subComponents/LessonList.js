//this component handles all cases where there is a list of lessons being loaded,
//it loads the lessons, handles all taps, and renders the entire screen for:
// TeacherDash, StudentDash, LessonRequests, StudentLessonRequests

import React, {useState} from 'react';
import {Text, View, StyleSheet, FlatList, Platform} from 'react-native';
import {
  cancelLessons,
  sendNotification,
} from './BackendComponents/BackendFunctions';
import * as firebase from 'firebase';
import LessonCell from './TableCells/LessonCell';
import TopBar from './TopBar';
import TeacherCell from './TableCells/TeacherCell';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import {share} from './BackendComponents/Share';

const LessonList = ({userData, lessonType, lessonsList}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertTitle, setAlertTitle] = useState();
  const [showConfirm, setShowConfirm] = useState(true);
  const [alertMessage, setAlertMessage] = useState();
  const [confirmText, setConfirmText] = useState('Cancel lesson');
  const [option, setOption] = useState();
  const [selectedLesson, setSelectedLesson] = useState();
  const options = {
    0: 'studentCancelLesson',
    1: 'studentCancelRequest',
    2: 'teacherDenyRequest',
    3: 'teacherCancelLesson',
    4: 'set up stripe',
  };

  const onDenyOrCancelPressed = (lesson) => {
    setSelectedLesson(lesson);
    if (userData.userType === 'student' && lessonType === 'confirmed') {
      setAlertTitle('Cancel Lesson?');
      setAlertMessage(
        `Are you sure you want to cancel your lesson with ${lesson.teacherName}?`,
      );
      setOption(options[0]);
    } else if (userData.userType === 'student' && lessonType === 'undecided') {
      setAlertTitle('Cancel Request?');
      setAlertMessage(
        `Are you sure you want to cancel your request with ${lesson.teacherName}?`,
      );
      setOption(options[1]);
    } else if (userData.userType === 'teacher' && lessonType === 'undecided') {
      setAlertTitle('Are you sure?');
      setAlertMessage(
        `Are you sure you want to deny this lesson with ${lesson.studentName}?`,
      );
      setOption(options[2]);
      setConfirmText('Deny Request');
    } else if (userData.userType === 'teacher' && lessonType === 'confirmed') {
      setAlertTitle('Cancel Lesson?');
      setAlertMessage(
        `Are you sure you want to cancel your lesson with ${lesson.studentName}?`,
      );
      setOption(options[3]);
    }
    setShowAlert(true);
    // Alert.alert(
    //   title,
    //   message,
    //   [
    //     {
    //       text: 'Cancel Lesson',
    //       onPress: () => {
    //         switch (option) {
    //           case options[0]:
    //             cancelLessons(lesson, userData.userType, 'lesson-cancelled');
    //             break;
    //           case options[1]:
    //             cancelLessons(lesson, userData.userType, 'request-cancelled');
    //             break;
    //           case options[2]:
    //             cancelLessons(lesson, userData.userType, 'request-denied');
    //             break;
    //           case options[3]:
    //             cancelLessons(lesson, userData.userType, 'lesson-cancelled');
    //             break;
    //         }
    //       },
    //     },
    //     {
    //       text: 'Nevermind',
    //       onPress: () => console.log('Cancel Pressed'),
    //       style: 'cancel',
    //     },
    //   ],
    //   {cancelable: true},
    // );
  };

  //lesson is passed
  const acceptLesson = (lesson) => {
    //if stripe is not configured:
    if (userData.stripeID === undefined) {
      setAlertTitle('Set up Payments');
      setAlertMessage(
        'Before you can accept a lesson, set up your bank so you can recieve payments',
      );
      setOption(options[4]);
      setConfirmText('Complete Registration');
      setShowAlert(true);
    } else {
      var db = firebase.database();
      sendNotification(
        lesson.studentID,
        lesson.teacherName,
        'request-accepted',
      );
      db.ref(
        `users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`,
      ).update({status: 'confirmed', vendorID: userData.stripeID});
      db.ref(
        `users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`,
      ).update({status: 'confirmed', vendorID: userData.stripeID});
      //add the confirmed lesson to the list of lessons for the server to see,
      //it's organized by timestamp for efficiency
      lesson.vendorID = userData.stripeID;
      db.ref(
        `lessons/${lesson.endingTimeStamp}/${lesson.studentID}/${lesson.studentLessonKey}`,
      ).set(lesson);
    }
  };

  const onSharePressed = async () => {
    if (userData.availability !== undefined) {
      share(userData);
    } else {
      setAlertTitle('Whoops');
      setShowConfirm(false);
      setAlertMessage('You have to set up your available times first!');
      setShowAlert(true);
    }
  };

  const onProfilePressed = () => {
    const teacher = {
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
              amount={item.amount}
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
      <AwesomeAlert
        show={showAlert}
        showProgress={false}
        title={alertTitle}
        message={alertMessage}
        closeOnTouchOutside={true}
        closeOnHardwareBackPress={true}
        // showCancelButton={true}
        showConfirmButton={showConfirm}
        cancelText="Nevermind"
        confirmText={confirmText}
        contentContainerStyle={styles.alert}
        confirmButtonColor="#274156"
        onDismiss={() => {
          setShowAlert(false);
          setShowConfirm(true);
        }}
        onConfirmPressed={() => {
          switch (option) {
            case options[0]:
              cancelLessons(
                selectedLesson,
                userData.userType,
                'lesson-cancelled',
              );
              setShowAlert(false);
              break;
            case options[1]:
              cancelLessons(
                selectedLesson,
                userData.userType,
                'request-cancelled',
              );
              setShowAlert(false);
              break;
            case options[2]:
              cancelLessons(
                selectedLesson,
                userData.userType,
                'request-denied',
              );
              setShowAlert(false);
              break;
            case options[3]:
              cancelLessons(
                selectedLesson,
                userData.userType,
                'lesson-cancelled',
              );
              setShowAlert(false);
              break;
            case options[4]:
              Actions.PaymentsScreen({userData});
              setShowAlert(false);
              break;
          }
        }}
      />
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
  alert: {
    borderRadius: 10,
  },
});

export default LessonList;
