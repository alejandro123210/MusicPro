//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert, Platform } from "react-native";
import ProfileBar from "../subComponents/ProfileBar";
import ScheduledEventCell from "../subComponents/ScheduledEventCell";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'
import DateBar from "../subComponents/DateBar";
import { loadLessons, loadLessonsOnce } from '../subComponents/BackendComponents/BackendFunctions'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class StudentDash extends React.Component {

  state = {
    //this list is pulled from the db
    lessonsList: []
  };
  
  componentDidMount() {
    // console.log("StudentDash Mounted")  
    loadLessons(this.props.userData, 'confirmed', this)
  };

  // this.setState({date: dateString, selectedDay: dayOfWeek}, function () {
  //   this.removeUnavailableTimes(dateString)
  //   console.log(dayOfWeek)
  // });


 

  // removePastLessons = (lesson) => {
  //   var db = firebase.database()
  //   db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}`).remove();
  //   db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}`).remove();
  // }

  // loadLessons = () => {
  //   var db = firebase.database();
  //   var ref = db.ref(`users/${this.props.userData['uid']}/info/`)
  //   let that = this
  //   var moment = require('moment');
  //   var m = moment();
  //   var currentDate = m.format('YYYY-MM-DD')
  //   ref.on('value', function(snapshot) {
  //     //all lessons for user in database
  //     if(snapshot.val() != null){
  //       var lessonsList = []
  //       var allData = (JSON.parse(JSON.stringify(snapshot.val())));
  //       var lessonsData = allData['lessons']
  //       key = 0;
  //       //for loop adds all users to state
  //       for (lessonDate in lessonsData){
  //         for (lessonKey in lessonsData[lessonDate]){
  //           if(lessonsData[lessonDate][lessonKey]['status'] == 'confirmed'){
  //             var lessonToPush = {
  //               teacherName: lessonsData[lessonDate][lessonKey]['teacherName'],
  //               studentName: lessonsData[lessonDate][lessonKey]['studentName'],
  //               time: lessonsData[lessonDate][lessonKey]['time'],
  //               key: key.toString(),
  //               timeKey: lessonsData[lessonDate][lessonKey]['timeKey'],
  //               date: lessonsData[lessonDate][lessonKey]['date'],
  //               instruments: lessonsData[lessonDate][lessonKey]['selectedInstruments'],
  //               studentID: lessonsData[lessonDate][lessonKey]['studentIDNum'],
  //               teacherID: lessonsData[lessonDate][lessonKey]['teacherIDNum'],
  //               teacherLessonKey: lessonsData[lessonDate][lessonKey]['teacherLessonKey'],
  //               studentLessonKey: lessonsData[lessonDate][lessonKey]['studentLessonKey'],
  //               teacherImage: lessonsData[lessonDate][lessonKey]['teacherImage'],
  //               studentImage: lessonsData[lessonDate][lessonKey]['studentImage']
  //             }
  //             if(lessonToPush.date < currentDate){
  //               that.removePastLessons(lessonToPush)
  //             } else {
  //               lessonsList.push(lessonToPush)
  //               key += 1;
  //             }
  //           }
  //           lessonsList.sort((a, b) => (a.timeKey > b.timeKey) ? -1 : 1)
  //           lessonsList.sort((a, b) => (a.date > b.date) ? 1 : -1)
  //           that.setState({ lessonsList: lessonsList })
  //           that.forceUpdate();
  //         }
  //       }
  //       if(lessonsData == null){
  //         that.setState({ lessonsList: lessonsList })
  //       }
  //     }
  //   });
  // }


  onScheduledEventPressed = (lesson) => {
    // alert('pressed')
    Alert.alert(
      'Cancel Lesson?',
      'are you sure you want to cancel your lesson with ' + lesson.teacherName + '?',
      [
        {text: 'Cancel Lesson', onPress: () => this.cancelLesson(lesson)},
        {
          text: 'Nevermind',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  cancelLesson = (lesson) => {
    var db = firebase.database();
    db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`).remove();
    db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`).remove();
    this.loadLessons();
    this.forceUpdate();
  }

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <View style={styles.container}>
        <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
            userData={this.props.userData}
        />
        <DateBar />
        <ScrollView>
          { this.state.lessonsList.length == 0 ? 
          (<View>
            <Text>
              No lessons yet!
            </Text>
          </View>) 
          :
          (<View>
            {this.state.lessonsList.map(lesson => (
            <ScheduledEventCell 
                name = { lesson.teacherName }
                time = { lesson.time }
                date = { lesson.date }
                image = { lesson.teacherImage }
                instruments = { lesson.instruments }
                confirmed = {true}
                onPress = {() => this.onScheduledEventPressed(lesson) }
                key = {lesson.key}
            />
          ))}
          </View>)
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    backgroundColor: Platform.OS === 'ios'? 'white' : '#f5f5f5'
  },
});

//this lets the component get imported other places
export default StudentDash;
