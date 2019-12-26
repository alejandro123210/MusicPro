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
            name: '8 AM - 10 AM',
            key: 0
        },
        {
            name: '10 PM - 12 PM',
            key: 1
        },
        {
            name: '2 PM - 4 PM',
            key: 2
        },
        {
            name: '4 PM - 6 PM',
            key: 3
        },
        {
            name: '8 PM - 10 PM',
            key: 4
        },
        {
            name: '10 PM - 12 AM',
            key: 5
        },
        {
            name: '12 AM - 2 AM',
            key: 6
        },
        {
            name: '2 AM - 4 AM',
            key: 7
        },
        {
            name: '4 AM - 6 AM',
            key: 8
        },
        {
            name: '6 AM - 8 AM',
            key: 9
        },
    ]

  };

  componentDidMount() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    this.setState({
      //Setting the value of the date time
      date:
         year + "-" + month + "-" + date,
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
    // console.log(this.state.date)
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
        {/* <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
        /> */}
        <View style={{marginTop: deviceHeight/20}}>
        </View>
        <Calendar
        markedDates={{
          day : {selected: true, marked: true, selectedColor: 'blue'},
          '2012-05-17': {marked: true},
          '2012-05-18': {marked: true, dotColor: 'red', activeOpacity: 0},
          '2012-05-19': {disabled: true, disableTouchEvent: true}
        }}
            // Initially visible month. Default = Date()
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            //minDate={'2012-05-10'}
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            //maxDate={'2012-05-30'}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {
              // console.log('selected day', day)
              this.setState({
                date: day['dateString']
                
              })
            }}
            minDate = { Date() }
            // Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined
            current = { Date() }
            // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
            // Handler which gets executed on day long press. Default = undefined
            // onDayLongPress={(day) => {console.log('selected day', day)}}
            // Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting
            monthFormat={'MMM yyyy'}
            // Handler which gets executed on day press. Default = undefined
            onDayPress={(day) => {console.log('selected day', day)}}
            // Handler which gets executed on day long press. Default = undefined
            onDayLongPress={(day) => {console.log('selected day', day)}}
            // Handler which gets executed when visible month changes in calendar. Default = undefined
            onMonthChange={(month) => {console.log('month changed', month)}}
            // Hide month navigation arrows. Default = false  
            hideExtraDays={true}
            // If hideArrows=false and hideExtraDays=false do not switch month when tapping on greyed out
            // day from another month that is visible in calendar page. Default = false
            disableMonthChange={true}
            // If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday.
            firstDay={1}
            // Hide day names. Default = false
            hideDayNames={false}
            // Show week numbers to the left. Default = false
            showWeekNumbers={false}
            // Handler which gets executed when press arrow icon left. It receive a callback can go back month
            onPressArrowLeft={substractMonth => substractMonth()}
            // Handler which gets executed when press arrow icon left. It receive a callback can go next month
            onPressArrowRight={addMonth => addMonth()}
            
          />
        <View style={{marginTop: deviceHeight/40,alignItems: "center",
    justifyContent: "center",marginBottom: deviceHeight/40}}>
          <Text style = {styles.dateText2}>
            Click on time blocks when you are available
          </Text>
        </View>
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
