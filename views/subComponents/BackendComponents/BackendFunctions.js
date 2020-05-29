import * as firebase from 'firebase';
import {Platform, NativeModules} from 'react-native';

export const registerFCM = (userData) => {
  var fcm_token;
  //registers the token in the native modules and updates the database with the user's token
  if (Platform.OS === 'android') {
    NativeModules.CustomFCMModule.getFCMToken((err, token) => {
      //if there's an error log it
      if (err !== null) {
        console.log('FCM token registration error: ' + err);
      }
      //add fcm token to user file
      fcm_token = token;
      var db = firebase.database();
      db.ref(`users/${userData.uid}/info/`).update({fcm_token: fcm_token});
    });
  } else {
    NativeModules.CustomFCMModuleiOS.getFCMToken((value) => {
      console.log('ios: ' + value);
    });
  }
};

export const removeFCM = (userData) => {
  if (Platform.OS === 'android') {
    NativeModules.CustomFCMModule.removeFCMToken((obj, error) => {
      console.log(error);
    });
  } else {
    //ios doensn't let you sign out of fcm easily without interacting with the database
    //so we do it here instead
    var db = firebase.database();
    db.ref(`users/${userData.uid}/info/fcm_token`).set({});
  }
};

export const sendNotification = (recipientID, senderName, type) => {
  let notificationObject = {
    recipientID: recipientID,
    senderName: senderName,
    type: type,
  };
  var db = firebase.database();
  db.ref('NotificationQueue/').push(notificationObject);
};

export var loadLessons = (userData, lessonType, that) => {
  //this handles lessons that have passed (pass in entire lesson object)
  let removePastLessons = ({teacherID, studentID, date}) => {
    var db = firebase.database();
    db.ref(`users/${teacherID}/info/lessons/${date}`).remove();
    db.ref(`users/${studentID}/info/lessons/${date}`).remove();
  };

  var db = firebase.database();
  var ref = db.ref(`users/${userData.uid}/info/lessons`);
  var moment = require('moment');
  var m = moment();
  var currentDate = m.format('YYYY-MM-DD');
  ref.on('value', function (snapshot) {
    //all lessons for user in database
    var lessonsList = [];
    var lessonsData = JSON.parse(JSON.stringify(snapshot.val()));
    var key = 0;
    //for loop adds all users to state
    for (var lessonDate in lessonsData) {
      for (var lessonKey in lessonsData[lessonDate]) {
        if (lessonsData[lessonDate][lessonKey].status === lessonType) {
          var lessonToPush = {
            teacherName: lessonsData[lessonDate][lessonKey].teacherName,
            studentName: lessonsData[lessonDate][lessonKey].studentName,
            time: lessonsData[lessonDate][lessonKey].time,
            key: key.toString(),
            timeKey: lessonsData[lessonDate][lessonKey].timeKey,
            date: lessonsData[lessonDate][lessonKey].date,
            instruments: lessonsData[lessonDate][lessonKey].selectedInstruments,
            studentID: lessonsData[lessonDate][lessonKey].studentIDNum,
            teacherID: lessonsData[lessonDate][lessonKey].teacherIDNum,
            teacherLessonKey:
              lessonsData[lessonDate][lessonKey].teacherLessonKey,
            studentLessonKey:
              lessonsData[lessonDate][lessonKey].studentLessonKey,
            teacherImage: lessonsData[lessonDate][lessonKey].teacherImage,
            studentImage: lessonsData[lessonDate][lessonKey].studentImage,
          };
          if (lessonToPush.date < currentDate) {
            removePastLessons(lessonToPush);
          } else {
            lessonsList.push(lessonToPush);
            key += 1;
          }
        }
        lessonsList.sort((a, b) => (a.timeKey > b.timeKey ? -1 : 1));
        lessonsList.sort((a, b) => (a.date > b.date ? 1 : -1));
        that.setState({lessonsList: []});
        that.setState({lessonsList: lessonsList});
        that.forceUpdate();
      }
    }
    if (lessonsData == null) {
      that.setState({lessonsList: lessonsList});
    }
  });
};

//this handles 'request-denied', 'request-cancelled', and 'lesson-cancelled'
//lesson, userType, type
export const cancelLessons = (
  {
    teacherID,
    studentID,
    studentName,
    teacherName,
    date,
    teacherLessonKey,
    studentLessonKey,
  },
  userType,
  type,
) => {
  if (userType === 'student') {
    sendNotification(teacherID, studentName, type);
  } else {
    sendNotification(studentID, teacherName, type);
  }

  var db = firebase.database();
  db.ref(
    `users/${teacherID}/info/lessons/${date}/${teacherLessonKey}`,
  ).remove();
  db.ref(
    `users/${studentID}/info/lessons/${date}/${studentLessonKey}`,
  ).remove();
};
