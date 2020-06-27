/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {View, StyleSheet, Platform, Text, FlatList} from 'react-native';
import {Calendar} from 'react-native-calendars';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import HoursCell from '../subComponents/TableCells/HoursCell';

class CalendarForStudents extends React.Component {
  state = {
    date: new Date().toISOString().slice(0, 10),
    actualAvailability: {
      '0': [],
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
      '6': [],
    },
    selectedDay: new Date().getDay(),
    teacherLessons: [],
    normalAvailability: {
      '0': [],
      '1': [],
      '2': [],
      '3': [],
      '4': [],
      '5': [],
      '6': [],
    },
  };

  componentDidMount() {
    // console.log(`this.state.date: ${this.state.date}`);
    var moment = require('moment');
    var dayOfWeek = moment().day();
    this.setState({selectedDay: dayOfWeek});

    var db = firebase.database();
    var ref = db.ref(`users/${this.props.teacher.uid}/info/`);
    let that = this;
    //this is the list that will contain the teacher's availability for each hour, available = false/true
    var availabilityListToPush = this.state.actualAvailability;
    ref.once('value').then(function (snapshot) {
      const teacherData = JSON.parse(JSON.stringify(snapshot.val()));
      //if the teacher's data isn't null, we...
      if (teacherData.availability != null) {
        //availability data is the teachers availability in the DB
        var availabilityData = teacherData.availability;
        //we set each part of availabilityData to corresponding parts of availabilityListToPush
        availabilityListToPush['0'] = availabilityData.Sun;
        availabilityListToPush['1'] = availabilityData.Mon;
        availabilityListToPush['2'] = availabilityData.Tue;
        availabilityListToPush['3'] = availabilityData.Wed;
        availabilityListToPush['4'] = availabilityData.Thu;
        availabilityListToPush['5'] = availabilityData.Fri;
        availabilityListToPush['6'] = availabilityData.Sat;
        //finally, we set the state of actual availability to the data in the DB
        that.setState(
          {
            actualAvailability: availabilityListToPush,
            //we do this to avoid pointer problems
            normalAvailability: JSON.parse(
              JSON.stringify(availabilityListToPush),
            ),
            //we add the data of the teacher's lessons in order to remove those times later
            teacherLessons: teacherData.lessons,
          },
          function () {
            that.removeUnavailableTimes(that.state.date);
          },
        );
      }
      // var moment = require('moment');
      // var m = moment();
      //we remove unavailable times for teachers from their currently planned lessons
      console.log(that.state.date);
    });
  }

  //when a time is pressed, we take the user to the next screen to configure the request
  onCellPress = (time) => {
    var hourAvailable = this.state.actualAvailability[this.state.selectedDay][
      time.key + 1
    ].available;

    Actions.RequestLessonDetail({
      teacher: this.props.teacher,
      userData: this.props.userData,
      time: time.name,
      date: this.state.date,
      hourAvailable: hourAvailable,
    });
  };

  removeUnavailableTimes = (dateString) => {
    //gets the normal user availability and parses it/stringifies it to avoid pointer problems
    var normalAvailability = JSON.parse(
      JSON.stringify(this.state.normalAvailability),
    );
    //if the teacher has lessons scheduled
    if (this.state.teacherLessons !== undefined) {
      //if the teacher has lessons on this date
      if (this.state.teacherLessons[dateString] !== undefined) {
        //for each lesson on that date
        for (var lessonKey in this.state.teacherLessons[dateString]) {
          //key to remove is equal to the key for the lesson time
          var keyToRemove = this.state.teacherLessons[dateString][lessonKey]
            .timeKey;
          //gets the day of the week so it knows what day to change
          var normalAvailabilityForDay =
            normalAvailability[this.state.selectedDay];
          //sets the availability for that time at that day to false
          normalAvailabilityForDay[keyToRemove] = false;
          //sets the state so it's shown in the list
          this.setState({actualAvailability: normalAvailability});
          // this.forceUpdate()
        }
      } else {
        this.setState({actualAvailability: normalAvailability});
      }
    }
  };

  checkIfAnyAvailableTimes() {
    var anyTimesAvailable = false;
    for (var timeKey in this.state.actualAvailability[this.state.selectedDay]) {
      var time = this.state.actualAvailability[this.state.selectedDay][timeKey];
      if (time.available === true) {
        // console.log('true');
        anyTimesAvailable = true;
      }
    }
    return anyTimesAvailable;
  }

  render() {
    return (
      <View style={styles.container}>
        <Calendar
          onDayPress={(day) => {
            //creates a date object (day) and gets the YYYY-MM-DD and turns it into a day key 0-6
            var moment = require('moment');
            var dayOfWeek = moment(day.dateString).day();
            var dateString = day.dateString;
            this.setState(
              {date: dateString, selectedDay: dayOfWeek},
              function () {
                this.removeUnavailableTimes(dateString);
                console.log(dayOfWeek);
              },
            );
          }}
          minDate={Date()}
          monthFormat={'MMM yyyy'}
          onDayLongPress={(day) => {
            console.log('selected day', day);
          }}
          onMonthChange={(month) => {
            console.log('month changed', month);
          }}
          hideExtraDays={true}
          disableMonthChange={false}
          firstDay={1}
          style={styles.calendarBorder}
          hideDayNames={false}
          showWeekNumbers={false}
          onPressArrowLeft={(substractMonth) => substractMonth()}
          onPressArrowRight={(addMonth) => addMonth()}
          markedDates={{
            [this.state.date]: {selected: true, marked: true},
          }}
        />
        {this.checkIfAnyAvailableTimes() ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={this.state.actualAvailability[this.state.selectedDay]}
            keyExtractor={(item, index) => item.name}
            contentContainerStyle={styles.flatListContainer}
            renderItem={({item}) =>
              item.available ? (
                <HoursCell
                  name={item.name}
                  onPress={() => this.onCellPress(item)}
                />
              ) : (
                <View />
              )
            }
          />
        ) : (
          <View style={styles.noAvailableTimesContainer}>
            <Text style={styles.noAvailableTimesText}>
              No available times on this day
            </Text>
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Platform.OS === 'ios' ? 'white' : '#f5f5f5',
  },
  noAvailableTimesContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noAvailableTimesText: {
    color: 'gray',
    fontSize: 25,
    textAlign: 'center',
    width: 250,
  },
  calendarBorder: {
    borderBottomWidth: 0.3,
    borderBottomColor: '#C8C8C8',
  },
  flatListContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
});

//this lets the component get imported other places
export default CalendarForStudents;
