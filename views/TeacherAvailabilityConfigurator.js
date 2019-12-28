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

class TeacherAvailabilityConfigurator extends React.Component {
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
            name: '7 AM - 8 AM',
            key: 0
        },
        {
            name: '8 AM - 9 AM',
            key: 1
        },
        {
            name: '9 AM - 10 AM',
            key: 2
        },
        {
            name: '10 AM - 11 AM',
            key: 3
        },
        {
            name: '11 AM - 12 PM',
            key: 4
        },
        {
            name: '12 PM - 1 PM',
            key: 5
        },
        {
            name: '1 PM - 2 PM',
            key: 6
        },
        {
            name: '2 PM - 3 PM',
            key: 7
        },
        {
            name: '3 PM - 4 PM',
            key: 8
        },
        {
            name: '4 PM - 5 PM',
            key: 9
        },
        {
          name: '5 PM - 6 PM',
          key: 9
        },
        {
          name: '6 PM - 7 PM',
          key: 9
        },
        {
          name: '7 PM - 8 PM',
          key: 9
        },
        {
          name: '8 PM - 9 PM',
          key: 9
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
      date:
         year + "-" + month + "-" + date,
    });
  };


  onCellPress = (time) => {

  }



  render() {
    return (
      <View style={styles.container}>
        <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
        />
        <Agenda
          loadItemsForMonth={(month) => {console.log('trigger items loading')}}
          onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          onDayPress={(day)=>{console.log('day pressed')}}
          onDayChange={(day)=>{console.log('day changed')}}
          selected={this.state.date}
          hideArrows = {false}
          minDate={this.state.date}
          pagingEnabled={true}
          pastScrollRange={1}
          futureScrollRange={2}
          renderItem={(item, firstItemInDay) => {return (<View />);}}
          renderDay={(day, item) => {return (<View />);}}
          renderEmptyDate={() => {return (<View />);}}
          renderEmptyData = {() => {return (  
            <View style={{borderTopColor: 'gray', borderTopWidth: 0.3, flex: 1}}>
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
            );}}
          rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
          hideKnob={false}
          theme={{agendaKnobColor: 'gray'}}
          markedDates = {{
              [this.state.date]: {selected: true},
          }}   
        />
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
