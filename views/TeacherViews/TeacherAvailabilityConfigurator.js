/* eslint-disable react/no-did-mount-set-state */
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import TimeCell from '../subComponents/TableCells/TimeCell';
import * as firebase from 'firebase';
import DayBar from '../subComponents/DayBar';
import TopBar from '../subComponents/TopBar';
import {updateTeacherList} from '../subComponents/BackendComponents/BackendFunctions';

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
        name: '7:00 AM',
        available: false,
        key: 0,
      },
      {
        name: '7:30 AM',
        available: false,
        key: 1,
      },
      {
        name: '8:00 AM',
        available: false,
        key: 2,
      },
      {
        name: '8:30 AM',
        available: false,
        key: 3,
      },
      {
        name: '9:00 AM',
        available: false,
        key: 4,
      },
      {
        name: '9:30 AM',
        available: false,
        key: 5,
      },
      {
        name: '10:00 AM',
        available: false,
        key: 6,
      },
      {
        name: '10:30 AM',
        available: false,
        key: 7,
      },
      {
        name: '11:00 AM',
        available: false,
        key: 8,
      },
      {
        name: '11:30 AM',
        available: false,
        key: 9,
      },
      {
        name: '12:00 PM',
        available: false,
        key: 10,
      },
      {
        name: '12:30 PM',
        available: false,
        key: 11,
      },
      {
        name: '1:00 PM',
        available: false,
        key: 12,
      },
      {
        name: '1:30 PM',
        available: false,
        key: 13,
      },
      {
        name: '2:00 PM',
        available: false,
        key: 14,
      },
      {
        name: '2:30 PM',
        available: false,
        key: 15,
      },
      {
        name: '3:00 PM',
        available: false,
        key: 16,
      },
      {
        name: '3:30 PM',
        available: false,
        key: 17,
      },
      {
        name: '4:00 PM',
        available: false,
        key: 18,
      },
      {
        name: '4:30 PM',
        available: false,
        key: 19,
      },
      {
        name: '5:00 PM',
        available: false,
        key: 20,
      },
      {
        name: '5:30 PM',
        available: false,
        key: 21,
      },
      {
        name: '6:00 PM',
        available: false,
        key: 22,
      },
      {
        name: '6:30 PM',
        available: false,
        key: 23,
      },
      {
        name: '7:00 PM',
        available: false,
        key: 24,
      },
      {
        name: '7:30 PM',
        available: false,
        key: 25,
      },
      {
        name: '8:00 PM',
        available: false,
        key: 26,
      },
      {
        name: '8:30 PM',
        available: false,
        key: 27,
      },
    ];
    var mondayTimes = JSON.parse(JSON.stringify(timesList));
    var tuesdayTimes = JSON.parse(JSON.stringify(timesList));
    var wednesdayTimes = JSON.parse(JSON.stringify(timesList));
    var thursdayTimes = JSON.parse(JSON.stringify(timesList));
    var fridayTimes = JSON.parse(JSON.stringify(timesList));
    var saturdayTimes = JSON.parse(JSON.stringify(timesList));
    var sundayTimes = JSON.parse(JSON.stringify(timesList));
    var weekTimes = this.state.times;
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
      if (snapshot.val() !== null) {
        that.setState({times: availabilityData});
      }
    });
  };

  onCellPress = (time) => {
    if (time.available === true) {
      time.available = false;
    } else {
      time.available = true;
    }
    var listOfTimes = this.state.times;
    listOfTimes[this.state.day][time.key] = time;
    this.setState({times: listOfTimes});
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData.uid}/info/`);
    ref.update({availability: this.state.times});
    updateTeacherList(this.props.userData.uid);
  };

  setBackgroundColor = (available) => {
    if (available) {
      return '#274156';
    } else {
      return '#8fa4b5';
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
        <TopBar
          userData={this.props.userData}
          showDateBar={false}
          page="availability configurator"
        />
        <DayBar markedDay={(day) => this.setState({day: day})} />
        <FlatList
          data={this.state.times[this.state.day]}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
          contentContainerStyle={styles.flatlistStyle}
          renderItem={({item}) => (
            <TimeCell
              name={item.name}
              onPress={() => this.onCellPress(item)}
              available={item.available}
              backgroundColor={this.setBackgroundColor(item.available)}
              fontColor={this.setFontColor(item.available)}
            />
          )}
        />
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
  flatlistStyle: {
    paddingBottom: 10,
  },
});

//this lets the component get imported other places
export default TeacherAvailabilityConfigurator;
