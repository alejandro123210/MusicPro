import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, Image } from 'react-native';
import { Rating } from 'react-native-ratings';
import InstrumentTag from '../subComponents/instrumentTag';
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'

let deviceWidth = Dimensions.get('window').width;

class RequestLessonDetail extends React.Component {

  //we call most of the props here to see what data we have access to 
  state = {
    userData: this.props.userData,
    teacher: this.props.teacher,
    date: this.props.date,
    time: this.props.time,
    dateAndTime: '',

    selectedInstruments: []
  }

  componentDidMount(){
    var moment = require('moment');
    var dateInPlainEnglish = moment(this.state.date).format('MMMM Do')
    var dateAndTime = dateInPlainEnglish + ' at ' + this.state.time 
    this.setState({ dateAndTime })
  }

  confirmRequest = () => {
    if(this.state.selectedInstruments.length > 0){
      var studentName = this.props.userData['name']
      var studentIDNum = this.props.userData['uid']
      var teacherImage = this.props.teacher.photo;
      var studentImage = this.props.userData['photo']
      var teacherName = this.props.teacher.name;
      var teacherIDNum = this.props.teacher.uid;
      var date = this.props.date
      var time = this.props.time
      var timeKey = ''
      if(time == "7 AM - 8 AM"){
        timeKey = 0
      } else if (time == "8 AM - 9 AM"){
        timeKey = 1
      } else if (time == '9 AM - 10 AM'){
        timeKey = 2
      } else if (time == '10 AM - 11 AM'){
        timeKey = 3
      } else if (time == '11 AM - 12 PM'){
        timeKey = 4
      } else if (time == '12 PM - 1 PM'){
        timeKey = 5
      } else if (time == '1 PM - 2 PM'){
        timeKey = 6
      } else if (time == '2 PM - 3 PM'){
        timeKey = 7
      } else if (time == '3 PM - 4 PM'){
        timeKey = 8
      } else if (time == '4 PM - 5 PM'){
        timeKey = 9
      } else if (time == '5 PM - 6 PM'){
        timeKey = 10
      } else if (time == '6 PM - 7 PM'){
        timeKey = 11
      } else if (time == '7 PM - 8 PM'){
        timeKey = 12
      } else if (time == '8 PM - 9 PM'){
        timeKey = 13
      } 
      // console.log("Request confirmed for " + this.props.teacher.uid);
      var db = firebase.database();
      var teacherRef = db.ref(`users/${this.props.teacher.uid}/info/lessons/${date}`)
      var studentRef = db.ref(`users/${studentIDNum}/info/lessons/${date}`)
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
        selectedInstruments: this.state.selectedInstruments,
        teacherImage: teacherImage,
        studentImage: studentImage,
        date: date,
        time: time,
        status: 'undecided',
        timeKey: timeKey
      }
      teacherRef.child(teacherLessonRequestKey).update(lessonData)
      studentRef.child(studentLessonRequestKey).update(lessonData)
      Actions.StudentLessonRequest({userData: this.props.userData})

      //start a conversation just
      var moment = require('moment')
      var currentDate = moment().format('MM-DD-YYYY')
      let userMessageData = {
        lastMessageAt: currentDate,
        userName: lessonData.teacherName,
        userPhoto: lessonData.teacherImage
      }
      let otherUserMessageData = {
        lastMessageAt: currentDate,
        userName: this.state.userData['name'],
        userPhoto: this.state.userData['photo']
      }
      var userRef = db.ref(`Messages/${this.state.userData['uid']}/${lessonData.teacherIDNum}/`)
      var otherUserRef = db.ref(`Messages/${lessonData.teacherIDNum}/${this.state.userData['uid']}/`)
      userRef.update(userMessageData)
      otherUserRef.update(otherUserMessageData)
    } else {
      alert('you have to pick an instrument!')
    }


  }

  selectInstrument = (instrument) => {
    var selectedInstruments = this.state.selectedInstruments
    if(instrument.selected == true){
      selectedInstruments.push(instrument.instrument)
      this.setState({selectedInstruments})
    } else {
      selectedInstruments.pop(instrument.instrument)
      this.setState({selectedInstruments})
    }
  }
  

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.imageContainer}>
          <Image 
              source={{ uri: this.state.teacher.photo }}
              style={styles.imageMain}
            />
          </View>
          <Rating 
            count={5}
            startingValue={this.state.teacher.starCount}
            style={{padding: 15}}
            imageSize={30}
            // onFinishRating={(rating) => this.quickRate(rating)}
            readonly ={true}
          />
          <Text style={styles.title}>Lesson with {this.state.teacher.name}</Text>
          <Text style={styles.time}>on {this.state.dateAndTime}</Text>
          <Text style={styles.onWhatInstrumentText}> On what instrument? </Text>
          <View style={styles.line}/>
          <View style={styles.instrumentsContainer}>
            {this.state.teacher.instruments.map(instrument => (
              <InstrumentTag
                instrument={instrument}
                colorOfCell = '#274156'
                type = 'highlightable'
                onPress = {(thisInstrument) => this.selectInstrument(thisInstrument)}
                key = {this.state.teacher.instruments.findIndex(instrumentinArray => instrument == instrumentinArray)}
              />
            ))}
          </View>
          <View style={styles.outerButtonContainer}>
            <TouchableOpacity style={styles.buttonContainer} onPress={() => this.confirmRequest()}>
              <Text style={{fontSize: 20, color: 'white'}}>Confirm Request</Text>
            </TouchableOpacity>
          </View>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white'
    // backgroundColor: '#274156',
  },
  imageContainer: {
    width: deviceWidth / 3,
    alignItems: "center",
    paddingTop: 20
  },
  imageMain: {
    width: deviceWidth / 3,
    height: deviceWidth / 3,
    borderRadius: 100,
    marginTop: 5
  },
  title: {
    fontSize: 30,
    marginTop: 30
    // color: '#274156'
  },
  time: {
    marginTop: 10
  },
  onWhatInstrumentText: {
    paddingTop: 60, 
    fontSize: 20
  },
  line: {
    height: 0.3, 
    width: deviceWidth, 
    backgroundColor: 'gray', 
    marginTop: 10
  },
  instrumentsContainer: {
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
  },
  outerButtonContainer: {
    flexDirection: 'column-reverse', 
    flex: 1, 
    marginBottom: 50
  },
  buttonContainer: {
    backgroundColor: '#274156',
    width: deviceWidth - 20,
    borderRadius: 10,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center'
  }
});


//this lets the component get imported other places
export default RequestLessonDetail;