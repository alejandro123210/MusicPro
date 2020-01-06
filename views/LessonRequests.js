//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert } from "react-native";
import ProfileBar from "./subComponents/ProfileBar";
import RequestedEventCell from "./subComponents/RequestedEventCell";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class LessonRequests extends React.Component {

  state = {
    date: "",
    //this list is pulled from the db
    lessonsList: []
  };
  
  componentDidMount() {
    console.log('LessonRequests mounted')
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    this.setState({
      //Setting the value of the date time
      date: "Today is: " + month + "/" + date + "/" + year
    });
    this.loadLessons()
  };

  loadLessons = () => {
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData['uid']}/info/lessons`)
    let that = this
    ref.on('value', function(snapshot) {
      //all lessons for user in database
      var lessonsList = []
      var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
      key = 0;
      for(lessonDate in lessonsData){
        for (lessonKey in lessonsData[lessonDate]){
          if(lessonsData[lessonDate][lessonKey]['status'] == 'undecided'){
            var lessonToPush = {
              name: lessonsData[lessonDate][lessonKey]['studentName'],
              time: lessonsData[lessonDate][lessonKey]['date'] + ' at ' + lessonsData[lessonDate][lessonKey]['time'],
              key: key.toString(),
              timeKey: lessonsData[lessonDate][lessonKey]['timeKey'],
              date: lessonsData[lessonDate][lessonKey]['date'],
              instruments: lessonsData[lessonDate][lessonKey]['studentInstruments'],
              studentID: lessonsData[lessonDate][lessonKey]['studentIDNum'],
              teacherID: lessonsData[lessonDate][lessonKey]['teacherIDNum'],
              teacherLessonKey: lessonsData[lessonDate][lessonKey]['teacherLessonKey'],
              studentLessonKey: lessonsData[lessonDate][lessonKey]['studentLessonKey'],
            }
            lessonsList.push(lessonToPush)
            key += 1;
          }
          that.setState({ lessonsList: lessonsList })
          that.forceUpdate();
        }
      }
      if(lessonsData == null){
        that.setState({ lessonsList: lessonsList })
      }
    });
  }


  onScheduledEventPressed = (lesson) => {
    // alert('pressed')
    Alert.alert(
      'Do you Accept?',
      'do you accept this lesson with ' + lesson.name,
      [
        {text: 'Confirm Lesson', onPress: () => this.acceptLesson(lesson)},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Deny', onPress: () => this.denyLesson(lesson)}
      ],
      {cancelable: true},
    );
  }

  acceptLesson = (lesson) => {
    var db = firebase.database();
    db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`).update({status: 'confirmed'});
    db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`).update({status: 'confirmed'});
    // this.updateCalendar(false, lesson)
    this.loadLessons();
    this.forceUpdate();
  }

  denyLesson = (lesson) => {
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
        <View style={styles.dateBar}>
          <Text style={styles.dateText}>{this.state.date}</Text>
        </View>
        <ScrollView>
          {this.state.lessonsList.map(lesson => (
            <RequestedEventCell 
                name = { lesson.name }
                time = { lesson.time }
                key = { lesson.key }
                instruments = { lesson.instruments}
                status = { lesson.status }
                onPress = {() => this.onScheduledEventPressed(lesson) }
            />
          ))}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white"
  },
  dateBar: {
    height: deviceHeight / 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderColor: "#eeeced"
  },
  dateText: {
    fontSize: 18,
    color: "#838081",
    fontFamily: "HelveticaNeue-Medium",
    marginTop: 5
  },
});

//this lets the component get imported other places
export default LessonRequests;
