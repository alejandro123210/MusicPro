/* eslint-disable no-alert */
import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  RefreshControl,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import TeacherCell from '../subComponents/TableCells/TeacherCell';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';
import Geolocation from 'react-native-geolocation-service';
import TopBar from '../subComponents/TopBar';

class ListOfTeachers extends React.Component {
  state = {
    teachers: [],
    coordinates: {},
    userData: this.props.userData,
    refreshing: false,
  };

  //we may want to change this to ref.on so that the stars update, the other option is to add a refresh
  //this needs to NOT load every single user every time
  loadTeachers = async (userCoords) => {
    var db = firebase.database();
    var ref = db.ref('teachers/');
    var teachers = [];
    ref.once('value').then((snapshot) => {
      //all users in database
      var teacherData = JSON.parse(JSON.stringify(snapshot.val()));
      //for loop adds all users to state
      for (let uid in teacherData) {
        //this is the section that pulls all the teachers
        //gets the distance
        var geodist = require('geodist');
        var dist = geodist(userCoords, teacherData[uid].coordinates);
        //create the teacher object to push to the list
        var teacher = {
          name: teacherData[uid].name,
          location: teacherData[uid].location,
          instruments: teacherData[uid].instruments,
          photo: teacherData[uid].photo,
          uid: uid,
          avgStars:
            teacherData[uid].avgStars !== undefined
              ? teacherData[uid].avgStars.avgRating
              : 0,
          numberOfReviews:
            teacherData[uid].avgStars !== undefined
              ? teacherData[uid].avgStars.numberOfReviews
              : 0,
          distance: dist,
        };
        teachers.push(teacher);
        teachers.sort((a, b) => (a.distance > b.distance ? 1 : -1));
      }
      this.setState({teachers: teachers});
      this.setState({refreshing: false});
    });
  };

  findCoordinatesAndLoadTeachers = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const coordinates = {lat, lng};
        this.loadTeachers(coordinates);
      },
      (error) => console.log(error.message),
      {enableHighAccuracy: false, timeout: 20000, maximumAge: 1000},
    );
  };

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        this.findCoordinatesAndLoadTeachers();
      } else {
        alert("Sorry, we won't be able to find teachers without permission :/");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  componentDidMount() {
    console.log('ListOfTeachers mounted');
    if (Platform.OS === 'android') {
      this.requestLocationPermission();
    } else {
      this.findCoordinatesAndLoadTeachers();
    }
    // console.log(this.findCoordinates())
    // this.findCoordinates().then((coords) => console.log(coords));
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

  _onRefresh() {
    this.setState({refreshing: true});
    this.findCoordinatesAndLoadTeachers();
  }

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          userData={this.state.userData}
          page="teachers"
          showDateBar={false}
        />
        <FlatList
          contentContainerStyle={styles.flatListStyle}
          data={this.state.teachers}
          keyExtractor={(item, index) => item.uid}
          renderItem={({item}) => (
            <TeacherCell
              image={item.photo}
              name={item.name}
              instruments={item.instruments}
              avgStars={item.avgStars}
              numberOfReviews={item.numberOfReviews}
              location={item.location}
              onPress={() => this.onPress(item)}
              onBookPressed={() => this.onBookPressed(item)}
              uid={item.uid}
              distance={item.distance}
            />
          )}
          ListEmptyComponent={
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
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
    justifyContent: 'center',
  },
  loadingText: {
    color: 'gray',
    fontSize: 25,
    textAlign: 'center',
    width: 250,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  flatListStyle: {
    paddingBottom: 10,
  },
});

//this lets the component get imported other places
export default ListOfTeachers;
