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
import {GeoFire} from 'geofire';
import {SearchBar} from '../subComponents/SearchBar';

class ListOfTeachers extends React.Component {
  state = {
    teachers: [],
    coordinates: {},
    userData: this.props.userData,
    refreshing: false,
    searchText: '',
    teachersToShow: [],
    subject: this.props.userData.subject,
    geoQuerry: undefined,
    loadingText: 'loading...',
  };

  alertNoTeachers = () => {
    if (this.state.teachersToShow.length === 0) {
      this.setState({
        loadingText:
          'Sorry! Seems like there are no teachers of that kind in your area',
      });
    }
  };

  geoFireLoadTeachers = (userCoords) => {
    this.setState({loadingText: 'loading...'});
    setTimeout(this.alertNoTeachers, 4000);
    let db = firebase.database();
    let geoFireRef = db.ref(`geofire/${this.state.subject}`);
    var geoFire = new GeoFire(geoFireRef);
    //radius is in KM
    var geoQuerry = geoFire.query({
      center: [userCoords.lat, userCoords.lng],
      radius: 10000,
    });
    this.setState({geoQuerry});
    let that = this;
    var teachers = [];
    //geoquerry runs the code inside for each user in the range given
    geoQuerry.on('key_entered', function (key, location, distance) {
      let teachersRef = db.ref(`users/${key}/info`);
      let distanceInMiles = distance / 1.6;
      let roundedDistance = Math.round(distanceInMiles);
      teachersRef.once('value').then((data) => {
        var teacherData = data.val();
        var teacher = {
          name: teacherData.name,
          location: teacherData.location,
          instruments: teacherData.instruments,
          price: teacherData.price,
          photo: teacherData.photo,
          stripeID: teacherData.stripeID,
          uid: key,
          avgStars:
            teacherData.avgStars !== undefined
              ? teacherData.avgStars.avgRating
              : 0,
          numberOfReviews:
            teacherData.avgStars !== undefined
              ? teacherData.avgStars.numberOfReviews
              : 0,
          distance: roundedDistance,
          subject: teacherData.subject,
        };
        teachers.push(teacher);
        teachers.sort((a, b) => (a.distance > b.distance ? 1 : -1));
        that.setState({
          teachers: teachers,
          refreshing: false,
          teachersToShow: teachers,
        });
      });
    });
  };

  findCoordinatesAndLoadTeachers = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        const lng = position.coords.longitude;
        const lat = position.coords.latitude;
        const coordinates = {lat, lng};
        this.setState({coordinates});
        this.geoFireLoadTeachers(coordinates);
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
          title: 'MusicPro Location Permissions',
          message: 'We need your location so you can find you teachers!',
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
    setTimeout(() => {
      this.setState({refreshing: false});
    }, 1500);
  }

  onChangeSearch = (searchText) => {
    this.setState({searchText});
    const filteredResults = this.state.teachers.filter((teacher) => {
      const teacherData = `${teacher.name.toUpperCase()}${teacher.instruments
        .toString()
        .toUpperCase()}`;
      const textData = searchText.toUpperCase();
      return teacherData.indexOf(textData) > -1;
    });
    this.setState({teachersToShow: filteredResults});
  };

  changeSubject = async (subject) => {
    //race condition preventing
    await this.setState({subject, teachersToShow: []});
    console.log(subject);
    this.state.geoQuerry.off;
    this.geoFireLoadTeachers(this.state.coordinates);
    this.forceUpdate();

    //this is to save the search preference, may be stupid, probably should be done with realm
    firebase
      .database()
      .ref(`users/${this.state.userData.uid}/info/`)
      .update({subject});
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
          contentContainerStyle={styles.flatListStyle}
          data={this.state.teachersToShow}
          keyExtractor={(item, index) => item.uid}
          ListHeaderComponent={
            <SearchBar
              onChangeText={(text) => this.onChangeSearch(text)}
              onChangeSubject={(subject) => this.changeSubject(subject)}
              subject={this.state.subject}
            />
          }
          contentOffset={{y: 45}}
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
              price={item.price}
            />
          )}
          ListEmptyComponent={
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>{this.state.loadingText}</Text>
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
    flex: 1,
  },
});

//this lets the component get imported other places
export default ListOfTeachers;
