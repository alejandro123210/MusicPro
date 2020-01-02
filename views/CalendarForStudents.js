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
    inputValue: "",
    teacherDashDisplay: "block",
    teacherProfileScrollDisplay: "none",   
    selectedDay: '', 
    inputValue: '',
    data: [],
    teacher: 
    [
        {
            name: '10 AM - 12 AM',
            key: 0
        },
        {
            name: '12 PM - 2 PM',
            key: 1
        },
        {
            name: '4 PM - 6 PM',
            key: 2
        },
        {
            name: '8 PM - 10 PM',
            key: 3
        },
        {
            name: 'Not available',
            key: 4
        },
        {
            name: 'Not available',
            key: 5
        },
        {
            name: 'Not available',
            key: 6
        },
        {
            name: 'Not available',
            key: 7
        },
    ]

  };

  componentDidMount() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    this.setState({
      //Setting the value of the date time
      date: year + "-" + month + "-" + date,
    });
  };


  handleTextChange = inputValue => {
    this.setState({ inputValue });
  };

  onScheduledEventPressed = () => {
      alert("Cancel event?")
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
              this.setState({ date: day['dateString'] })
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
              [this.state.date]: {selected: true},
            }}            
          />
        
        <ScrollView>
          {this.state.teacher.map(list => (
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
