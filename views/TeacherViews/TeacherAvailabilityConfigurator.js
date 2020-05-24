/* eslint-disable eqeqeq */
/* eslint-disable react/no-did-mount-set-state */
/* eslint-disable no-undef */
import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import ProfileBar from '../subComponents/ProfileBar';
import TimeCell from '../subComponents/TableCells/TimeCell';
import * as firebase from 'firebase';
import DayBar from '../subComponents/DayBar';

class TeacherAvailabilityConfigurator extends React.Component {
  //we need the calendar to show the same list of objects every time, all of the possible times
  //we need the screen to load the users availability for all of those times, even if they didn't set it yet
  //we need the times to change depending on the day
  //it will require some type of if empty logic

  state = {
    day: 'Mon',
    times: {
      Mon: [],
      Tue: [],
      Wed: [],
      Thu: [],
      Fri: [],
      Sat: [],
      Sun: [],
    },
  };

  componentDidMount() {
    console.log('TeacherAvailabilityConfigurator mounted');
    var timesList = [
      {
        name: '7 AM - 8 AM',
        available: false,
        key: 0,
      },
      {
        name: '8 AM - 9 AM',
        available: false,
        key: 1,
      },
      {
        name: '9 AM - 10 AM',
        available: false,
        key: 2,
      },
      {
        name: '10 AM - 11 AM',
        available: false,
        key: 3,
      },
      {
        name: '11 AM - 12 PM',
        available: false,
        key: 4,
      },
      {
        name: '12 PM - 1 PM',
        available: false,
        key: 5,
      },
      {
        name: '1 PM - 2 PM',
        available: false,
        key: 6,
      },
      {
        name: '2 PM - 3 PM',
        available: false,
        key: 7,
      },
      {
        name: '3 PM - 4 PM',
        available: false,
        key: 8,
      },
      {
        name: '4 PM - 5 PM',
        available: false,
        key: 9,
      },
      {
        name: '5 PM - 6 PM',
        available: false,
        key: 10,
      },
      {
        name: '6 PM - 7 PM',
        available: false,
        key: 11,
      },
      {
        name: '7 PM - 8 PM',
        available: false,
        key: 12,
      },
      {
        name: '8 PM - 9 PM',
        available: false,
        key: 13,
      },
    ];
    mondayTimes = JSON.parse(JSON.stringify(timesList));
    tuesdayTimes = JSON.parse(JSON.stringify(timesList));
    wednesdayTimes = JSON.parse(JSON.stringify(timesList));
    thursdayTimes = JSON.parse(JSON.stringify(timesList));
    fridayTimes = JSON.parse(JSON.stringify(timesList));
    saturdayTimes = JSON.parse(JSON.stringify(timesList));
    sundayTimes = JSON.parse(JSON.stringify(timesList));
    weekTimes = this.state.times;
    weekTimes.Mon = mondayTimes;
    weekTimes.Tue = tuesdayTimes;
    weekTimes.Wed = wednesdayTimes;
    weekTimes.Thu = thursdayTimes;
    weekTimes.Fri = fridayTimes;
    weekTimes.Sat = saturdayTimes;
    weekTimes.Sun = sundayTimes;
    this.setState({times: weekTimes});
    console.log('component did mount');
    this.loadTimes(this);
  }

  loadTimes = (that) => {
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData.uid}/info/availability`);
    ref.once('value').then((snapshot) => {
      //all lessons for user in database
      var availabilityData = JSON.parse(JSON.stringify(snapshot.val()));
      if (snapshot.val() != null) {
        that.setState({times: availabilityData});
      }
    });
  };

  onCellPress = (time) => {
    if (time.available == true) {
      time.available = false;
    } else {
      time.available = true;
    }
    listOfTimes = this.state.times;
    listOfTimes[this.state.day][time.key] = time;
    this.setState({times: listOfTimes});
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData.uid}/info/`);
    ref.update({availability: this.state.times});
  };

  setBackgroundColor = (available) => {
    if (available) {
      return '#274156';
    } else {
      return '#C8C8C8';
    }
  };

  setFontColor = (available) => {
    if (available) {
      return 'white';
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <ProfileBar userData={this.props.userData} showDateBar={false} />
        <DayBar markedDay={(day) => this.setState({day: day})} />
        <ScrollView>
          {this.state.times[this.state.day].map((time) => (
            <TimeCell
              name={time.name}
              key={time.key}
              onPress={() => this.onCellPress(time)}
              available={time.available}
              backgroundColor={this.setBackgroundColor(time.available)}
              fontColor={this.setFontColor(time.available)}
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
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

//this lets the component get imported other places
export default TeacherAvailabilityConfigurator;
