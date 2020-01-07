import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, TextInput, Alert } from "react-native";
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import TimeCell from './subComponents/TimeCell';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class CalendarForStudents extends React.Component {
  state = {
    date: "",
    actualAvailability: {
      '0':[],
      '1':[],
      '2':[],
      '3':[],
      '4':[],
      '5':[],
      '6':[]
    },
    selectedDay: 0,
    teacherLessons: [],
    normalAvailability: {
      '0':[],
      '1':[],
      '2':[],
      '3':[],
      '4':[],
      '5':[],
      '6':[]
    },
  };

  componentDidMount() {
    var day = new Date().getDay()
    this.setState({selectedDay: day});
    console.log('selected day when component mounts ' + day)
    var todayDate = new Date().toISOString().slice(0,10);
    this.setState({ date: todayDate });
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.teacher['uid']}/info/`)
    let that = this
    ref.once("value")
    .then(function(snapshot){
      var availabilityListToPush = that.state.actualAvailability
      userData = JSON.parse(JSON.stringify(snapshot.val()))
      availabilityData = userData['availability']
      availabilityListToPush["0"] = availabilityData["Sun"]
      availabilityListToPush["1"] = availabilityData["Mon"]
      availabilityListToPush["2"] = availabilityData["Tue"]
      availabilityListToPush["3"] = availabilityData["Wed"]
      availabilityListToPush["4"] = availabilityData["Thu"]
      availabilityListToPush["5"] = availabilityData["Fri"]
      availabilityListToPush["6"] = availabilityData["Sat"]
      if(availabilityData != null){
        that.setState({
          actualAvailability: availabilityListToPush,
          normalAvailability: JSON.parse(JSON.stringify(availabilityListToPush)),
          teacherLessons: userData['lessons']
        })
      }
      var moment = require('moment');
      var m = moment();
      var roundUp = m.minute() || m.second() || m.millisecond() ? m.add(1, 'hour').startOf('hour') : m.startOf('hour');
      that.removeUnavailableTimes(roundUp.format('YYYY-MM-DD'))
    })
  };

  onCellPress = (time) => {
    Alert.alert(
      'Are you sure?',
      'are you sure you want to request a lesson with ' + this.props.teacher.name,
      [
        {text: 'Confirm Request', onPress: () => this.confirmLessonRequest(time)},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }

  confirmLessonRequest = (time) => {
    // Actions.RequestLessonDetail({
    //   teacher: this.props.teacher,
    //   userData: this.props.userData
    // })
    var studentName = this.props.userData['name'].slice(1,-1)
    var studentIDNum = this.props.userData['uid']
    var studentInstruments = this.props.userData['instruments']
    var teacherImage = this.props.teacher.picture;
    var studentImage = this.props.userData['photo']
    var teacherName = this.props.teacher.name;
    var teacherIDNum = this.props.teacher.uid;
    var teacherInstruments = this.props.teacher.instruments;
    var date = this.state.date
    var time = time
    var timeKey = ''
    if(time == "7 AM - 8 AM"){
      timeKey = 0
    } else if (time == "8 AM - 9 AM"){
      timeKey = 1
    } else if (time == '9 AM - 10 AM'){
      timeKey = 2
    } else if (time == '10 AM - 11 AM'){
      timeKey = 3
    } else if (time == '11 AM - 12 PM'){
      timeKey = 4
    } else if (time == '12 PM - 1 PM'){
      timeKey = 5
    } else if (time == '1 PM - 2 PM'){
      timeKey = 6
    } else if (time == '2 PM - 3 PM'){
      timeKey = 7
    } else if (time == '3 PM - 4 PM'){
      timeKey = 8
    } else if (time == '4 PM - 5 PM'){
      timeKey = 9
    } else if (time == '5 PM - 6 PM'){
      timeKey = 10
    } else if (time == '6 PM - 7 PM'){
      timeKey = 11
    } else if (time == '7 PM - 8 PM'){
      timeKey = 12
    } else if (time == '8 PM - 9 PM'){
      timeKey = 13
    } 
    // console.log("Request confirmed for " + this.props.teacher.uid);
    var db = firebase.database();
    var teacherRef = db.ref(`users/${this.props.teacher.uid}/info/lessons/${date}`)
    var studentRef = db.ref(`users/${studentIDNum}/info/lessons/${date}`)
    //we put both users names and ids so that later when the requeest is processed by the teacher 
    //both the student and teacher have their lessons updated 
    //(having both ids makes it easier to find each others profiles)
    var teacherLessonRequestKey = teacherRef.push().key
    var studentLessonRequestKey = studentRef.push().key
    var lessonData = {
      studentName: studentName,
      teacherName: teacherName,
      studentIDNum: studentIDNum,
      teacherIDNum: teacherIDNum,
      studentLessonKey: studentLessonRequestKey,
      teacherLessonKey: teacherLessonRequestKey,
      studentInstruments: studentInstruments,
      teacherInstruments: teacherInstruments,
      teacherImage: teacherImage,
      studentImage: studentImage,
      date: date,
      time: time,
      status: 'undecided',
      timeKey: timeKey
    }
    teacherRef.child(teacherLessonRequestKey).update(lessonData)
    studentRef.child(studentLessonRequestKey).update(lessonData)
    Actions.StudentLessonRequest({userData: this.props.userData})
  }

  removeUnavailableTimes = (dateString) => {
    //gets the normal user availability and parses it/stringifies it to avoid pointer problems
    var normalAvailability = JSON.parse(JSON.stringify(this.state.normalAvailability))
    //sets the state of actual availability to normal, normal is never changed, so it clears all data of lessons
    this.setState({actualAvailability: normalAvailability})
    //checks all dates for teacher's lessons, this may have to be changed if itmakes the phone slow
    for(date in this.state.teacherLessons){
      //if the date of the lessons is the same as the date string the calendar has, it checks the lesson times to remove the lesson
      if(date == dateString){ 
        for(lessonKey in this.state.teacherLessons[date]){
          //key to remove is equal to the key for the lesson time
          var keyToRemove = this.state.teacherLessons[date][lessonKey]['timeKey']
          //gets the day of the week so it knows what day to change
          var normalAvailabilityForDay = normalAvailability[this.state.selectedDay]
          //sets the availability for that time at that day to false
          normalAvailabilityForDay[keyToRemove] = false
          //sets the state so it's shown in the list
          this.setState({actualAvailability: normalAvailability})
          // this.forceUpdate()
        }
      }
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Calendar
            onDayPress={(day) => {
              //creates a date object (day) and gets the YYYY-MM-DD and turns it into a day key 0-6
              dayOfWeek = new Date(day['dateString']).getDay()
              dayOfWeek += 1
              if(dayOfWeek == 7){
                dayOfWeek = 0
              }
              var dateString = day['dateString']
              this.setState({date: dateString, selectedDay: dayOfWeek}, function () {
                this.removeUnavailableTimes(dateString)
                console.log(dayOfWeek)
              });
            }}
            minDate = { Date() }
            current = { Date() }
            monthFormat={'MMM yyyy'}
            onDayLongPress={(day) => {console.log('selected day', day)}}
            onMonthChange={(month) => {console.log('month changed', month)}}
            hideExtraDays={true}
            disableMonthChange={true}
            firstDay={1}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            markedDates = {{
              [this.state.date]: {selected: true, marked: true},
            }}            
          />
        <ScrollView>
          {this.state.actualAvailability[this.state.selectedDay].map(list => (
            list.available?
              <TimeCell
                  name = {list.name}
                  key = {list.key}
                  onPress = {() => this.onCellPress(list.name)}
              />
              :
              <View>

              </View>
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
});

//this lets the component get imported other places
export default CalendarForStudents;
