/* eslint-disable no-undef */
import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import TeacherCell from '../subComponents/TableCells/TeacherCell';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import Geolocation from '@react-native-community/geolocation';
import TopBar from '../subComponents/TopBar';

class ListOfTeachers extends React.Component {
  state = {
    teachers: [],
    coordinates: {},
    userData: this.props.userData,
  };

  //we may want to change this to ref.on so that the stars update, the other option is to add a refresh
  //this needs to NOT load every single user every time
  loadTeachers = async () => {
    var db = firebase.database();
    var ref = db.ref('teachers/');
    var teachers = [];
    ref.once('value').then((snapshot) => {
      //all users in database
      var usersData = JSON.parse(JSON.stringify(snapshot.val()));
      //for loop adds all users to state
      for (let uid in usersData) {
        //this is the section that pulls all the teachers
        //this takes all reviews and averages all the star ratings, this is inefficient, will be changed
        var reviewStars = [];
        if (usersData[uid].reviews != null) {
          for (let review in usersData[uid].reviews) {
            reviewStars.push(usersData[uid].reviews[review].starCount);
          }
        }
        const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
        var averageStars = 5;
        if (reviewStars.length !== 0) {
          averageStars = arrAvg(reviewStars);
        }
        //gets the distance
        var geodist = require('geodist');
        var dist = geodist(this.state.coordinates, usersData[uid].coordinates);
        //create the teacher object to push to the list
        var teacher = {
          name: usersData[uid].name,
          location: usersData[uid].location,
          instruments: usersData[uid].instruments,
          photo: usersData[uid].photo,
          uid: uid,
          starCount: averageStars,
          distance: dist,
        };
        teachers.push(teacher);
        teachers.sort((a, b) => (a.distance > b.distance ? 1 : -1));
        this.setState({teachers: teachers});
      }
    });
  };

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const long = position.coords.longitude;
        const lat = position.coords.latitude;
        const coordinates = {
          lat: lat,
          lng: long,
        };
        console.log(coordinates);
        this.setState({coordinates});
      },
      (error) => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000},
    );
  };

  componentDidMount() {
    // this.setState({coordinates: {lng: -74.481544, lat: 40.796768}})
    this.findCoordinates();
    // console.log(this.findCoordinates())
    console.log('ListOfTeachers mounted');
    this.loadTeachers();
  }

  onPress = (teacher) => {
    Actions.TeacherInfo({
      userData: this.props.userData,
      teacher: teacher,
    });
  };

  onBookPressed = (teacher) => {
    Actions.CalendarForStudents({
      userData: this.props.userData,
      teacher: teacher,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          userData={this.state.userData}
          page="teachers"
          showDateBar={false}
        />
        <FlatList
          data={this.state.teachers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => (
            <TeacherCell
              image={item.photo}
              name={item.name}
              instruments={item.instruments}
              starCount={item.starCount}
              location={item.location}
              onPress={() => this.onPress(item)}
              onBookPressed={() => this.onBookPressed(item)}
              uid={item.uid}
              distance={item.distance}
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
    backgroundColor: Platform.OS === 'ios' ? 'white' : '#f5f5f5',
    alignItems: 'center',
  },
});

//this lets the component get imported other places
export default ListOfTeachers;
