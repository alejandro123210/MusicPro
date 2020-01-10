import React from 'react'
import * as firebase from 'firebase'


export const loadLessons = (userData, lessonType, that) => {
    //this handles lessons that have passed
    removePastLessons = (lesson) => {
        var db = firebase.database()
        db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}`).remove();
        db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}`).remove();
    }

    var db = firebase.database();
    var ref = db.ref(`users/${userData['uid']}/info/lessons`)
    var moment = require('moment');
    var m = moment();
    var currentDate = m.format('YYYY-MM-DD')
    ref.on('value', function(snapshot) {
      //all lessons for user in database
      var lessonsList = []
      var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
      key = 0;
      //for loop adds all users to state
      for (lessonDate in lessonsData){
        for (lessonKey in lessonsData[lessonDate]){
          if(lessonsData[lessonDate][lessonKey]['status'] == lessonType){
            var lessonToPush = {
              teacherName: lessonsData[lessonDate][lessonKey]['teacherName'],
              studentName: lessonsData[lessonDate][lessonKey]['studentName'],
              time: lessonsData[lessonDate][lessonKey]['time'],
              key: key.toString(),
              timeKey: lessonsData[lessonDate][lessonKey]['timeKey'],
              date: lessonsData[lessonDate][lessonKey]['date'],
              instruments: lessonsData[lessonDate][lessonKey]['selectedInstruments'],
              studentID: lessonsData[lessonDate][lessonKey]['studentIDNum'],
              teacherID: lessonsData[lessonDate][lessonKey]['teacherIDNum'],
              teacherLessonKey: lessonsData[lessonDate][lessonKey]['teacherLessonKey'],
              studentLessonKey: lessonsData[lessonDate][lessonKey]['studentLessonKey'],
              teacherImage: lessonsData[lessonDate][lessonKey]['teacherImage'],
              studentImage: lessonsData[lessonDate][lessonKey]['studentImage'],
            }
            if(lessonToPush.date < currentDate){
              that.removePastLessons(lessonToPush)
            } else {
              lessonsList.push(lessonToPush)
              key += 1;
            }
          }
          lessonsList.sort((a, b) => (a.timeKey > b.timeKey) ? -1 : 1)
          lessonsList.sort((a, b) => (a.date > b.date) ? 1 : -1)
          that.setState({ lessonsList: lessonsList })
          that.forceUpdate();
        }
      }
      if(lessonsData == null){
        that.setState({ lessonsList: lessonsList })
      }
    });
}

export const cancelLessons = (lesson) => {
    var db = firebase.database();
    db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`).remove();
    db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`).remove();
}