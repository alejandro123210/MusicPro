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
        {/* <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
        /> */}
        <View style={{marginTop: deviceHeight/20}}>
        </View>
        <Agenda
          // callback that gets called when items for a certain month should be loaded (month became visible)
          loadItemsForMonth={(month) => {console.log('trigger items loading')}}
          // callback that fires when the calendar is opened or closed
          onCalendarToggled={(calendarOpened) => {console.log(calendarOpened)}}
          // callback that gets called on day press
          onDayPress={(day)=>{console.log('day pressed')}}
          // callback that gets called when day changes while scrolling agenda list
          onDayChange={(day)=>{console.log('day changed')}}
          // initially selected day
          selected={this.state.date}
          hideArrows = {false}
          // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
          minDate={this.state.date}
          pagingEnabled={true}

          // // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
          // maxDate={'2012-05-30'}
          // Max amount of months allowed to scroll to the past. Default = 50
          pastScrollRange={50}
          // Max amount of months allowed to scroll to the future. Default = 50
          futureScrollRange={50}
          // specify how each item should be rendered in agenda
          renderItem={(item, firstItemInDay) => {return (<View />);}}
          // specify how each date should be rendered. day can be undefined if the item is not first in that day.
          renderDay={(day, item) => {return (<View />);}}
          // specify how empty date content with no items should be rendered
          renderEmptyDate={() => {return (<View />);}}
          // specify how agenda knob should look like
          // renderKnob={() => {return (<View style={{height: 100}}/>);}}
          // specify what should be rendered instead of ActivityIndicator
          renderEmptyData = {() => {return (<View />);}}
          // specify your item comparison function for increased performance
          rowHasChanged={(r1, r2) => {return r1.text !== r2.text}}
          // Hide knob button. Default = false
          hideKnob={false}
          // By default, agenda dates are marked if they have at least one item, but you can override this if needed
          
          // If provided, a standard RefreshControl will be added for "Pull to Refresh" functionality. Make sure to also set the refreshing prop correctly.
          onRefresh={() => console.log('refreshing...')}
          // Set this true while waiting for new data from a refresh
          refreshing={false}
          // Add a custom RefreshControl component, used to provide pull-to-refresh functionality for the ScrollView.
          refreshControl={null}
          // agenda theme
          theme={{agendaKnobColor: 'gray'}}
          markedDates = {{
              [this.state.date]: {selected: true},
          }}   
          // agenda container style
          style={{}}
        />
        {/* <ScrollView>
          {this.state.teacher.map(list => (
              <TimeCell
                  name = {list.name}
                  key = {list.key}
                  onPress = {() => this.onCellPress(list.name)}
              />
          ))}
        </ScrollView> */}
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
