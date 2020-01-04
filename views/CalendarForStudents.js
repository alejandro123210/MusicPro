import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, TextInput, Alert } from "react-native";
import ProfileBar from './subComponents/ProfileBar'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import ScheduledEventCell from "./subComponents/ScheduledEventCell";
import TimeCell from './subComponents/TimeCell';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class CalendarForStudents extends React.Component {
  state = {
    date: "",
    availabilityList: {
        '0':[],
        '1':[],
        '2':[],
        '3':[],
        '4':[],
        '5':[],
        '6':[]
    },
    selectedDay: "0"
  };

  componentDidMount() {
    var todayDate = new Date().toISOString().slice(0,10);
    this.setState({ date: todayDate });
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.teacher['uid']}/info/availability`)
    var availabilityListToPush = this.state.availabilityList
    let that = this
    ref.once("value")
    .then(function(snapshot){
      availabilityData = JSON.parse(JSON.stringify(snapshot.val()))
      availabilityListToPush["0"] = that.removeUnavailableTimes(availabilityData["Mon"])
      availabilityListToPush["1"] = that.removeUnavailableTimes(availabilityData["Tue"])
      availabilityListToPush["2"] = that.removeUnavailableTimes(availabilityData["Wed"])
      availabilityListToPush["3"] = that.removeUnavailableTimes(availabilityData["Thu"])
      availabilityListToPush["4"] = that.removeUnavailableTimes(availabilityData["Fri"])
      availabilityListToPush["5"] = that.removeUnavailableTimes(availabilityData["Sat"])
      availabilityListToPush["6"] = that.removeUnavailableTimes(availabilityData["Sun"])
      if(availabilityData != null){
        that.setState({
          availabilityList: availabilityListToPush
        })
      }
    })
  };

  removeUnavailableTimes = (day) => {
    timesToAdd = []
    for (key in day){
      if(day[key]['available'] == true){
        timesToAdd.push(day[key])
      }
    }
    return timesToAdd
  }

  onCellPress = (time) => {
    // console.log('the user has selected: ')
    console.log(this.state.date)
    // console.log(time)
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
    var studentName = this.props.userData['name'].slice(1,-1)
    var studentIDNum = this.props.userData['uid']
    var studentInstrument = this.props.userData['instrument']
    var teacherName = this.props.teacher.name;
    var teacherIDNum = this.props.teacher.uid;
    var teacherInstrument = this.props.teacher.instrument;
    var date = this.state.date
    var time = time
    // console.log("Request confirmed for " + this.props.teacher.uid);
    var db = firebase.database();
    var teacherRef = db.ref(`users/${this.props.teacher.uid}/info/lessons`)
    var studentRef = db.ref(`users/${studentIDNum}/info/lessons`)
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
      studentInstrument: studentInstrument,
      teacherInstrument: teacherInstrument,
      date: date,
      time: time,
      status: 'undecided'
    }
    teacherRef.child(teacherLessonRequestKey).update(lessonData)
    studentRef.child(studentLessonRequestKey).update(lessonData)
    Actions.StudentLessonRequest({userData: this.props.userData})
  }

  render() {
    return (
      <View style={styles.container}>
        <Calendar
            onDayPress={(day) => {
              dayOfWeek = new Date(day['dateString']).getDay()
              this.setState({ 
                date: day['dateString'], 
                selectedDay: dayOfWeek
              })
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
          {this.state.availabilityList[this.state.selectedDay].map(list => (
              <TimeCell
                  name = {list.name}
                  key = {list.key}
                  onPress = {() => this.onCellPress(list.name)}
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
    height: deviceHeight / 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 3,
    borderColor: "#eeeced"
  },
  searchBar:{
    height: deviceHeight/10,
    flexDirection: 'row',
    alignItems: 'center',
 },
  dateText: {
    fontSize: 18,
    color: "#838081",
    fontFamily: "HelveticaNeue-Medium",
    marginTop: 5
  }
});

//this lets the component get imported other places
export default CalendarForStudents;
