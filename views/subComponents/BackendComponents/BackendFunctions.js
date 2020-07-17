import * as firebase from 'firebase';
import {Platform, NativeModules} from 'react-native';
import {GeoFire} from 'geofire';
import {Actions} from 'react-native-router-flux';

export const registerFCM = (userData) => {
  var fcm_token;
  console.log('registering FCM');
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
    NativeModules.CustomFCMModuleiOS.getFCMToken((token) => {
      fcm_token = token;
      var db = firebase.database();
      db.ref(`users/${userData.uid}/info/`).update({fcm_token: fcm_token});
    });
  }
};

export const removeFCM = (userData) => {
  if (Platform.OS === 'android') {
    NativeModules.CustomFCMModule.removeFCMToken((obj, error) => {
      console.log(error);
    });
  }
  var db = firebase.database();
  db.ref(`users/${userData.uid}/info/fcm_token`).set({});
};

export const sendNotification = (recipientID, senderName, type) => {
  const notificationObject = {
    recipientID: recipientID,
    senderName: senderName,
    type: type,
  };
  var db = firebase.database();
  db.ref('NotificationQueue/').push(notificationObject);
};

export var loadLessons = (userData, lessonType, that) => {
  //this handles lessons that have passed (pass in entire lesson object)
  const removePastLesson = (lesson) => {
    const {teacherID, studentID, date} = lesson;
    var db = firebase.database();
    db.ref(`users/${teacherID}/info/lessons/${date}`).remove();
    db.ref(`users/${studentID}/info/lessons/${date}`).remove();
  };

  var db = firebase.database();
  var ref = db.ref(`users/${userData.uid}/info/lessons`);
  var moment = require('moment');
  var currentTime = moment().unix();
  ref.on('value', function (snapshot) {
    //all lessons for user in database
    var lessonsList = [];
    var lessonsData = JSON.parse(JSON.stringify(snapshot.val()));
    var key = 0;
    //for loop adds all users to state
    for (var lessonDate in lessonsData) {
      for (var lessonKey in lessonsData[lessonDate]) {
        if (lessonsData[lessonDate][lessonKey].status === lessonType) {
          const lessonToPush = {
            status: lessonsData[lessonDate][lessonKey].status,
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
            lessonLength: lessonsData[lessonDate][lessonKey].lessonLength,
            vendorID: lessonsData[lessonDate][lessonKey].vendorID,
            customerID: lessonsData[lessonDate][lessonKey].customerID,
            amount: lessonsData[lessonDate][lessonKey].amount,
            endingTimeStamp: lessonsData[lessonDate][lessonKey].endingTimeStamp,
          };
          if (lessonToPush.endingTimeStamp < currentTime) {
            removePastLesson(lessonToPush);
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
    endingTimeStamp,
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
  db.ref(
    `lessons/${endingTimeStamp}/${studentID}/${studentLessonKey}`,
  ).remove();
};

export const updateTeacherList = (uid) => {
  var db = firebase.database();
  var userDataRef = db.ref(`users/${uid}/info`);
  // var teacherData = {};
  userDataRef.once('value').then((snapshot) => {
    var data = JSON.parse(JSON.stringify(snapshot.val()));
    //set up geofire here so that teachers will load efficiently based on location
    const geoFireRef = db.ref(`geofire/${data.subject}`);
    var geoFire = new GeoFire(geoFireRef);
    geoFire.set(uid, [data.coordinates.lat, data.coordinates.lng]);
    //     //here we add the data to the teachers section of the database
    //     //so that they will load for students
    //     if (data.reviews !== undefined) {
    //       teacherData = {
    //         avgStars: data.avgStars,
    //         description: data.description,
    //         coordinates: data.coordinates,
    //         name: data.name,
    //         location: data.location,
    //         instruments: data.instruments,
    //         photo: data.photo,
    //         uid: data.uid,
    //         price: data.price,
    //       };
    //     } else {
    //       //we add the case if the teacher has no reviews to prevent non stop warnings
    //       teacherData = {
    //         description: data.description,
    //         coordinates: data.coordinates,
    //         name: data.name,
    //         location: data.location,
    //         instruments: data.instruments,
    //         photo: data.photo,
    //         uid: data.uid,
    //         price: data.price,
    //       };
    //     }
    //     db.ref(`teachers/${uid}/`).set(teacherData);
  });
};

export const checkPaymentsDue = (userData) => {
  console.log('turning on the payments check');
  var db = firebase.database();
  var paymentsRef = db.ref(`users/${userData.uid}/info/paymentsDue`);
  paymentsRef.on('value', function (snapshot) {
    if (snapshot.exists()) {
      Actions.SendPayment({userData});
      console.log('turning off the payments check');
      paymentsRef.off();
    }
  });
};

export const reportLesson = (description, userData) => {
  const report = {
    user: userData.uid,
    description,
  };
  var db = firebase.database();
  db.ref('reports').push(report);
};
