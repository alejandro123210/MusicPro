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
    timeList:[   
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
  };

  componentDidMount() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    console.log(date)
    this.setState({
      //Setting the value of the date time
      date: year + "-" + month + "-" + date,
      today: year + "-" + month + "-" + date,
    });
    this.loadTimes(this)
  };

  loadTimes = (that) => {
    var db = firebase.database();
    var ref = db.ref(`users/${this.props.userData['uid']}/info/availability`)
    ref.on('value', function(snapshot) {
      //all lessons for user in database
      var availabilityList = []
      var availabilityData = (JSON.parse(JSON.stringify(snapshot.val())));
      key = 0;
      //for loop adds all users to state
      for (day in availabilityData){
        availabilityList.push(day)
        console.log(day)
        that.setState({ timeList: availabilityList })
        that.forceUpdate();
      }
    });
  }


  onCellPress = (time) => {
    if(time.available == true){
      time.available = false
    } else {
      time.available = true
    }
    timeList = this.state.timeList
    timeList[time.key] = time
    this.setState({ timeList: timeList })
  }

  //sets the background color of the cell
  setBackground = (available) => {
    if(available){
      return 'green'
    } else {
      return 'white'
    }
  }



  render() {
    return (
      <View style={styles.container}>
        <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
        />
        <DayBar
          markedDay = {(day) => this.setState({day: day})}
        />
        <ScrollView>
          {this.state.timeList.map(time => (
              <TimeCell
                  name = {time.name}
                  key = {time.key}
                  onPress = {() => this.onCellPress(time)}
                  backgroundColorOfCell = {this.setBackground(time.available)}
              />
          ))}
        </ScrollView>
        {/* <Agenda
          loadItemsForMonth={(month) => {}}
          onCalendarToggled={(calendarOpened) => {}}
          onDayPress={(day) => {
              // console.log('selected day', day['dateString'])
              this.setState({
                date: day['dateString'],
              })
          }}
          onDayChange={(day)=>{console.log('day changed')}}
          current = { Date() }
          hideArrows = {false}
          minDate={this.state.today}
          pagingEnabled={true}
          pastScrollRange={1}
          futureScrollRange={2}
          renderEmptyData = {() => {return (  
            <View style={{borderTopColor: 'gray', borderTopWidth: 0.3, flex: 1}}>
              <ScrollView>
                {this.state.timeList.map(time => (
                    <TimeCell
                        name = {time.hours}
                        key = {time.key}
                        onPress = {() => this.onCellPress(time)}
                        backgroundColorOfCell = {this.setBackground(time.available)}
                    />
                ))}
              </ScrollView>
            </View> 
            );}}
          rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
          hideKnob={false}
          theme={{agendaKnobColor: 'gray'}}
          markedDates = {{
              [this.state.date]: {selected: true},
          }}   
        /> */}
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
  },
  dateText2: {
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    color: "black",
    fontFamily: "HelveticaNeue-Medium",
    marginTop: 5
}
});

//this lets the component get imported other places
export default TeacherAvailabilityConfigurator;
