import React from "react";
import { Text, View, StyleSheet, Dimensions, ScrollView } from "react-native";
import ProfileBar from './subComponents/ProfileBar'
import ScheduledEventCell from "./subComponents/ScheduledEventCell";
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoding';



let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class StudentDash extends React.Component {

  state = {
    date: "",
    inputValue: "",
    teacherDashDisplay: "block",
    teacherProfileScrollDisplay: "none",    

    //TODO: load this in from firebase
    //TODO: add cancel lesson functionality
    lessonsList: [
      {
        name: "Grace Jacobs",
        time: "11 - 12 PM",
        instrument: "guitar",
        key: 0
      },
      {
        name: "Alexander Kamanev",
        time: "1-2 PM",
        instrument: "tuba",
        key: 1
      }
    ]
  };

  componentDidMount() {
    var date = new Date().getDate(); //Current Date
    var month = new Date().getMonth() + 1; //Current Month
    var year = new Date().getFullYear(); //Current Year
    this.setState({
      //Setting the value of the date time
      date:
        "Today is: " + month + "/" + date + "/" + year
    });
    // alert('componentDidMount')
    //get location
    this.findCoordinates();
  };

  findCoordinates = () => {
    Geolocation.getCurrentPosition(
      position => {
        const location = JSON.stringify(position);
        // alert(location)
        this.setState({ location });
      },
      error => Alert.alert(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    );
  };

  handleTextChange = inputValue => {
    this.setState({ inputValue });
  };

  onScheduledEventPressed = () => {
      alert("Cancel event?")
  }

  render() {
    return (
      <View style={styles.container}>
        <ProfileBar 
            name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
            image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
        />
        <View style={styles.dateBar}>
          <Text style={styles.dateText}>{this.state.date}</Text>
        </View>
        <ScrollView>
          {this.state.lessonsList.map(student => (
            <ScheduledEventCell 
                name = { student.name }
                time = { student.time }
                key = {student.key}
                instrument = {student.instrument}
                onScheduledEventPressed = {() => this.onScheduledEventPressed()}
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
  dateText: {
    fontSize: 18,
    color: "#838081",
    fontFamily: "HelveticaNeue-Medium",
    marginTop: 5
  }
});

//this lets the component get imported other places
export default StudentDash;