//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert } from "react-native";
import ProfileBar from "./subComponents/ProfileBar";
import ScheduledEventCell from "./subComponents/ScheduledEventCell";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class StudentDash extends React.Component {

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
    let that = this;
    this.loadLessons(that)
  };

  loadLessons = (that) => {
    var db = firebase.database();
    // alert(JSON.stringify(this.props.userData['uid']))
    var ref = db.ref(`users/${JSON.stringify(this.props.userData['uid']).slice(1, -1)}/info/lessons`)
    // ref.once("value")
    // .then((snapshot) => {
    // });
    // ref.once("value")
    // .then(function(snapshot){
    //   //all lessons for user in database
    //   var lessonsList = []
    //   var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
    //   key = 0;
    //   //for loop adds all users to state
    //   for (lessonKey in lessonsData){
    //     if(lessonsData[lessonKey]['status'] == 'confirmed'){
    //       var lessonToPush = {
    //         name: lessonsData[lessonKey]['teacherName'],
    //         time: lessonsData[lessonKey]['date'] + ' at ' + lessonsData[lessonKey]['time'],
    //         key: key.toString(),
    //         instrument: lessonsData[lessonKey]['studentInstrument'],
    //         studentID: lessonsData[lessonKey]['studentIDNum'],
    //         teacherID: lessonsData[lessonKey]['teacherIDNum'],
    //         lessonKey: lessonKey
    //       }
    //       lessonsList.push(lessonToPush)
    //       key += 1;
    //     }
    //     that.setState({
    //       lessonsList: lessonsList
    //     })
    //   }
    // });
    ref.on('value', function(snapshot) {
      //all lessons for user in database
      var lessonsList = []
      var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
      key = 0;
      //for loop adds all users to state
      for (lessonKey in lessonsData){
        if(lessonsData[lessonKey]['status'] == 'confirmed'){
          var lessonToPush = {
            name: lessonsData[lessonKey]['teacherName'],
            time: lessonsData[lessonKey]['date'] + ' at ' + lessonsData[lessonKey]['time'],
            key: key.toString(),
            instrument: lessonsData[lessonKey]['teacherInstrument'],
            studentID: lessonsData[lessonKey]['studentIDNum'],
            teacherID: lessonsData[lessonKey]['teacherIDNum'],
            lessonKey: lessonKey
          }
          lessonsList.push(lessonToPush)
          key += 1;
        }
        that.setState({ lessonsList: lessonsList })
        that.forceUpdate();
      }
    });
  }


  onScheduledEventPressed = (person) => {
    // alert('pressed')
    Alert.alert(
      'Cancel Lesson?',
      'are you sure you want to cancel your lesson with ' + person.name + '?',
      [
        {text: 'Cancel Lesson', onPress: () => this.cancelLesson(person)},
        {
          text: 'Nevermind',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  cancelLesson = (person) => {

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
            <ScheduledEventCell 
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
export default StudentDash;
