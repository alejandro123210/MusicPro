import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView, Image, TextInput, Alert } from "react-native";
import ProfileBar from './subComponents/ProfileBar'
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import ScheduledEventCell from "./subComponents/ScheduledEventCell";
import TimeCell from './subComponents/TimeCell';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'
import DayBar from './subComponents/DayBar'


let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class TeacherAvailabilityConfigurator extends React.Component {

  //we need the calendar to show the same list of objects every time, all of the possible times
  //we need the screen to load the users availability for all of those times, even if they didn't set it yet
  //we need the times to change depending on the day
  //it will require some type of if empty logic

  state = {
    date: "",
    day: "Mon",
    times:{
      Mon:[],
      Tue:[],
      Wed:[],
      Thu:[],
      Fri:[],
      Sat:[],
      Sun:[]
    },
  };

  componentDidMount() {
    console.log("TeacherAvailabilityConfigurator mounted")
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    var timesList = [   
      {
            name: '7 AM - 8 AM',
            available: false,
            key: 0
        },
        {
            name: '8 AM - 9 AM',
            available: false,
            key: 1
        },
        {
            name: '9 AM - 10 AM',
            available: false,
            key: 2
        },
        {
            name: '10 AM - 11 AM',
            available: false,
            key: 3
        },
        {
            name: '11 AM - 12 PM',
            available: false,
            key: 4
        },
        {
            name: '12 PM - 1 PM',
            available: false,
            key: 5
        },
        {
            name: '1 PM - 2 PM',
            available: false,
            key: 6
        },
        {
            name: '2 PM - 3 PM',
            available: false,
            key: 7
        },
        {
            name: '3 PM - 4 PM',
            available: false,
            key: 8
        },
        {
            name: '4 PM - 5 PM',
            available: false,
            key: 9
        },
        {
          name: '5 PM - 6 PM',
          available: false,
          key: 10
        },
        {
          name: '6 PM - 7 PM',
          available: false,
          key: 11
        },
        {
          name: '7 PM - 8 PM',
          available: false,
          key: 12
        },
        {
          name: '8 PM - 9 PM',
          available: false,
          key: 13
        },
    ]
    mondayTimes = JSON.parse(JSON.stringify( timesList ))
    tuesdayTimes = JSON.parse(JSON.stringify( timesList ))
    wednesdayTimes = JSON.parse(JSON.stringify( timesList ))
    thursdayTimes = JSON.parse(JSON.stringify( timesList ))
    fridayTimes = JSON.parse(JSON.stringify( timesList ))
    saturdayTimes = JSON.parse(JSON.stringify( timesList ))
    sundayTimes = JSON.parse(JSON.stringify( timesList ))
    weekTimes = this.state.times
    weekTimes["Mon"] = mondayTimes
    weekTimes["Tue"] = tuesdayTimes
    weekTimes["Wed"] = wednesdayTimes
    weekTimes["Thu"] = thursdayTimes
    weekTimes["Fri"] = fridayTimes
    weekTimes["Sat"] = saturdayTimes
    weekTimes["Sun"] = sundayTimes
    this.setState({
      date: year + "-" + month + "-" + date,
      today: year + "-" + month + "-" + date,
      times: weekTimes,
      Mon: mondayTimes,
      Tue: tuesdayTimes
    })
    console.log("component did mount")
    this.loadTimes(this)
  };

  loadTimes = (that) => {
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData['uid']}/info/availability`)
    ref.on('value', function(snapshot) {
      //all lessons for user in database
      var availabilityData = (JSON.parse(JSON.stringify(snapshot.val())));
      if(snapshot.val() != null){
        that.setState({times: availabilityData})
      }
    });
  }


  onCellPress = (time) => {
    if(time.available == true){
      time.available = false
    } else {
      time.available = true
    }
    listOfTimes = this.state.times
    listOfTimes[this.state.day][time.key] = time
    this.setState({ times: listOfTimes })
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData['uid']}/info/`)
    ref.update({ availability: this.state.times })
    // this.configureMonthlyAvailability(listOfTimes)
  }

  // configureMonthlyAvailability = (availability) => {
  //   var moment = require('moment');
  //   var startDate = moment().format('YYYY-MM-DD')
  //   var endDate = moment().add(60, 'days').format('YYYY-MM-DD')
  //   var dateArray = this.getDates(startDate, endDate)
  //   var db = firebase.database();
  //   for (i = 0; i<60; i++){
  //     dayOfWeek = new Date(dateArray[i]).getDay()
  //     dayTimes = []
  //     switch(dayOfWeek) {
  //       case 0: 
  //         dayTimes = availability["Mon"] 
  //         break
  //       case 1: 
  //         dayTimes = availability["Tue"]
  //         break
  //       case 2: 
  //         dayTimes = availability["Wed"]
  //         break
  //       case 3: 
  //         dayTimes = availability["Thu"]
  //         break
  //       case 4: 
  //         dayTimes = availability["Fri"]
  //         break
  //       case 5: 
  //         dayTimes = availability["Sat"]
  //         break
  //       case 6: 
  //         dayTimes = availability["Sun"]
  //         break
  //     }
      
  //     var ref = db.ref(`users/${this.props.userData['uid']}/info/realAvailability/${dateArray[i]}`)
  //     ref.set(dayTimes)
  //   }
  //   // var lessonsList = this.loadLessons()
  //   // for (lesson in lessonsList){
  //   //   console.log(lesson.date)
  //   //   console.log(lesson.timeKey)
  //   //   this.updateCalendar(false, lesson)
  //   // }
  // }


//   getDates(startDate, stopDate) {
//     var moment = require('moment');
//     moment().format();
//     var dateArray = [];
//     var currentDate = moment(startDate);
//     var stopDate = moment(stopDate);
//     while (currentDate <= stopDate) {
//         dateArray.push( moment(currentDate).format('YYYY-MM-DD') )
//         currentDate = moment(currentDate).add(1, 'days');
//     }
//     return dateArray;
// }


  // //this will change the users calendar so they are either available or not on a specific date at a specific time
  // updateCalendar = (availability, lesson) => {
  //   var db = firebase.database();
  //   var ref = db.ref(`users/${this.props.userData['uid']}/info/realAvailability/${lesson.date}/${lesson.timeKey}`)
  //   ref.update({available: availability})
  // }

  // loadLessons = () => {
  //   var db = firebase.database();
  //   var ref = db.ref(`users/${this.props.userData['uid']}/info/lessons`)
  //   var lessonsList = []
  //   ref.once("value")
  //   .then((snapshot) => {
  //     //all lessons for user in database
  //     var lessonsData = (JSON.parse(JSON.stringify(snapshot.val())));
  //     key = 0;
  //     //for loop adds all users to state
  //     for (lessonKey in lessonsData){
  //       if(lessonsData[lessonKey]['status'] == 'confirmed'){
  //           var lessonToPush = {
  //               name: lessonsData[lessonKey]['studentName'],
  //               time: lessonsData[lessonKey]['date'] + ' at ' + lessonsData[lessonKey]['time'],
  //               key: key.toString(),
  //               timeKey: lessonsData[lessonKey['timeKey']],
  //               date: lessonsData[lessonKey]['date'],
  //               instrument: lessonsData[lessonKey]['studentInstrument'],
  //               studentID: lessonsData[lessonKey]['studentIDNum'],
  //               teacherID: lessonsData[lessonKey]['teacherIDNum'],
  //               teacherLessonKey: lessonsData[lessonKey]['teacherLessonKey'],
  //               studentLessonKey: lessonsData[lessonKey]['studentLessonKey'],
  //           }
  //           lessonsList.push(lessonToPush)
  //           key += 1;
  //       }
  //       return lessonsList;
  //     }
      
  //   });
  // }

  setBackgroundColor = (available) => {
    if(available){
      return '#274156'  
    } else {
      return 'gray'
    }
  }

  setFontColor = (available) => {
    if(available){
      return 'white'
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
            userData={this.props.userData}
        />
        <DayBar
          markedDay = {(day) => this.setState({day: day})}
        />
        <ScrollView>
          {this.state.times[this.state.day].map(time => (
              <TimeCell
                  name = {time.name}
                  key = {time.key}
                  onPress = {() => this.onCellPress(time)}
                  available = {time.available}
                  backgroundColor = {this.setBackgroundColor(time.available)}
                  fontColor = {this.setFontColor(time.available)}
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
    backgroundColor: "white",
    alignItems: 'center',
    justifyContent: 'center'
  },
});

//this lets the component get imported other places
export default TeacherAvailabilityConfigurator;
