//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Alert, Platform } from "react-native";
import ProfileBar from "../subComponents/ProfileBar";
import ScheduledEventCell from "../subComponents/ScheduledEventCell";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'
import DateBar from '../subComponents/DateBar'
import { loadLessons, cancelLessons } from '../subComponents/BackendComponents/BackendFunctions'


let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class LessonRequests extends React.Component {

  state = {
    //this list is pulled from the db
    lessonsList: []
  };
  
  componentDidMount() {
    console.log('LessonRequests mounted')
    loadLessons(this.props.userData, 'undecided', this)
  };

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
        {text: 'Deny', onPress: () => cancelLessons(lesson)}
      ],
      {cancelable: true},
    );
  }

  acceptLesson = (lesson) => {
    var db = firebase.database();
    db.ref(`users/${lesson.teacherID}/info/lessons/${lesson.date}/${lesson.teacherLessonKey}`).update({status: 'confirmed'});
    db.ref(`users/${lesson.studentID}/info/lessons/${lesson.date}/${lesson.studentLessonKey}`).update({status: 'confirmed'});
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
          {this.state.lessonsList.length == 0 ? 
          (<View>
            <Text>
              No requests yet
            </Text>
          </View>
          )
          :
          (
            <View>
            {this.state.lessonsList.map(lesson => (
            <ScheduledEventCell 
                name = { lesson.studentName }
                time = { lesson.time }
                date = { lesson.date }
                image = { lesson.studentImage.slice(1,-1) }
                instruments = { lesson.instruments }
                confirmed = {false}
                onPress = {() => this.onScheduledEventPressed(lesson) }
                key = {lesson.key}
            />
          ))}
          </View>
          )
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
export default LessonRequests;
