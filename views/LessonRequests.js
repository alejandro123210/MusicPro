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
    //TODO: load this in from firebase
    //TODO: add accept/reject/cancel functionality 

    //this list is pulled from the db
    lessonsList: []
  };
  
  componentDidMount() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year

    this.setState({
      //Setting the value of the date time
      date:
        "Today is: " + month + "/" + date + "/" + year
    });
    this.loadLessons()
  };

  loadLessons = () => {
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData['uid']}/info/lessons`)
    var lessonsList = []
    ref.once("value")
    .then((snapshot) => {
      //all lessons for user in database
      var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
      key = 0;
      //for loop adds all users to state
      for (lessonKey in lessonsData){
        if(lessonsData[lessonKey]['status'] == 'undecided'){
            var lessonToPush = {
                name: lessonsData[lessonKey]['studentName'],
                time: lessonsData[lessonKey]['date'] + ' at ' + lessonsData[lessonKey]['time'],
                key: key.toString(),
                instrument: lessonsData[lessonKey]['studentInstrument'],
                studentID: lessonsData[lessonKey]['studentIDNum'],
                teacherID: lessonsData[lessonKey]['teacherIDNum'],
                teacherLessonKey: lessonsData[lessonKey]['teacherLessonKey'],
                studentLessonKey: lessonsData[lessonKey]['studentLessonKey'],
            }
            lessonsList.push(lessonToPush)
            key += 1;
        }
      }
      this.setState({ lessonsList: lessonsList })
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
    db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.teacherLessonKey}`).update({status: 'confirmed'})
    db.ref(`users/${lesson.studentID}/info/lessons/${lesson.studentLessonKey}`).update({status: 'confirmed'})
    this.loadLessons();
    this.forceUpdate()
  }

  denyLesson = (lesson) => {

  }

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <View style={styles.container}>
        <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
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
                instrument = { lesson.instrument }
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
