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

class StudentLessonRequests extends React.Component {

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
    let that = this
    this.loadLessons(that)
  };

  loadLessons = (that) => {
    var db = firebase.database();
    var ref = db.ref(`users/${JSON.stringify(this.props.userData['uid']).slice(1, -1)}/info/lessons`)
    ref.on('value', function(snapshot) {
        //all lessons for user in database
        var lessonsListInFunction = []
        var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
        key = 0;
        //for loop adds all users to state
        for(lessonDate in lessonsData){  
          for (lessonKey in lessonsData[lessonDate]){
            if(lessonsData[lessonDate][lessonKey]['status'] == 'undecided'){
              var lessonToPush = {
                  name: lessonsData[lessonDate][lessonKey]['teacherName'],
                  time: lessonsData[lessonDate][lessonKey]['date'] + ' at ' + lessonsData[lessonDate][lessonKey]['time'],
                  key: key.toString(),
                  instrument: lessonsData[lessonDate][lessonKey]['teacherInstrument'],
                  studentID: lessonsData[lessonDate][lessonKey]['studentIDNum'],
                  teacherID: lessonsData[lessonDate][lessonKey]['teacherIDNum'],
                  teacherLessonKey: lessonsData[lessonDate][lessonKey]['teacherLessonKey'],
                  studentLessonKey: lessonsData[lessonDate][lessonKey]['studentLessonKey'],
              }
            lessonsListInFunction.push(lessonToPush)
            key += 1;
            that.setState({ lessonsList: lessonsListInFunction })
            that.forceUpdate();
          }
          }
        }
    });
  }

  onScheduledEventPressed = (lesson) => {
    // alert('pressed')
    Alert.alert(
      'Cancel Request?',
      'Are you sure you want to cancel your lesson with ' + lesson.name,
      [
        {text: 'Cancel Request', onPress: () => this.cancelRequest(lesson)},
        {
          text: 'nevermind',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  cancelRequest = (lesson) => {
    var db = firebase.database();
    db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`).remove();
    db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`).remove();
    this.loadLessons(this);
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
export default StudentLessonRequests;
