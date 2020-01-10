import React from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import {Calendar } from 'react-native-calendars';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
import HoursCell from "../subComponents/HoursCell";

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
      '6':[],
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
      '6':[],
    },
  };

  componentDidMount() {
    var day = new Date().getDay()
    this.setState({selectedDay: day});
    var todayDate = new Date().toISOString().slice(0,10);
    this.setState({ date: todayDate });
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.teacher['uid']}/info/`)
    let that = this
    ref.once("value")
    .then(function(snapshot){
      var availabilityListToPush = that.state.actualAvailability
      userData = JSON.parse(JSON.stringify(snapshot.val()))
      if(userData['availability'] != null){
        availabilityData = userData['availability']
        availabilityListToPush["0"] = availabilityData["Sun"]
        availabilityListToPush["1"] = availabilityData["Mon"]
        availabilityListToPush["2"] = availabilityData["Tue"]
        availabilityListToPush["3"] = availabilityData["Wed"]
        availabilityListToPush["4"] = availabilityData["Thu"]
        availabilityListToPush["5"] = availabilityData["Fri"]
        availabilityListToPush["6"] = availabilityData["Sat"]
        that.setState({
          actualAvailability: availabilityListToPush,
          normalAvailability: JSON.parse(JSON.stringify(availabilityListToPush)),
          teacherLessons: userData['lessons']
        })
      }
      var moment = require('moment');
      var m = moment();
      //certain times of day are not working because I'm not quite sure how the calendar api configured certain things.
      //this roundUp variable may have to be used and may not, I'm still not sure 
      var roundUp = m.minute() || m.second() || m.millisecond() ? m.add(1, 'hour').startOf('hour') : m.startOf('hour');
      that.removeUnavailableTimes(m.format('YYYY-MM-DD'))
    })
  };

  onCellPress = (time) => {
    Actions.RequestLessonDetail({
      teacher: this.props.teacher,
      userData: this.props.userData,
      time: time,
      date: this.state.date
    })
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
            style={{borderBottomWidth: 0.3, borderBottomColor: '#C8C8C8'}}
            hideDayNames={false}
            showWeekNumbers={false}
            onPressArrowLeft={substractMonth => substractMonth()}
            onPressArrowRight={addMonth => addMonth()}
            markedDates = {{
              [this.state.date]: {selected: true, marked: true},
            }}            
        />
        <ScrollView contentContainerStyle={{alignItems: 'center', paddingBottom: 20}}>
          {this.state.actualAvailability[this.state.selectedDay].map(time => (
            time.available?
              <HoursCell
                  name = {time.name}
                  onPress = {() => this.onCellPress(time.name)}
                  key = {this.state.actualAvailability[this.state.selectedDay].findIndex(timeInArray => time == timeInArray)}
              />
              :
              <View />
          ))}
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
export default CalendarForStudents;
