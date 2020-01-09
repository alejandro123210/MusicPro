import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import ProfileBar from './subComponents/ProfileBar'
import TeacherCell from './subComponents/TeacherCell';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux'


let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class ListOfTeachers extends React.Component {

state = {
    teachers: []
}

//TODO: make this load in teachers that are nearby specifically 

loadTeachers = async () => {
    var db = firebase.database();
    var ref = db.ref(`users/`)
    var teachers = []
    ref.once("value")
    .then((snapshot) => {
        //all users in database
        var usersData = (JSON.parse(JSON.stringify(snapshot.val())));
        var key = 0;
        //for loop adds all users to state
        for (uid in usersData){
            // alert(uid)

            //this takes all reviews and averages all the star ratings, this is inefficient, will be changed
            var averageStars = 5
            var reviewStars = []
            if(usersData[uid]['info']['reviews'] != null){
                for(review in usersData[uid]['info']['reviews']){
                    reviewStars.push(usersData[uid]['info']['reviews'][review]['starCount'])
                }
            }
            const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
            if (reviewStars.length != 0){
                averageStars = arrAvg(reviewStars)
            }

            //this is the section that pulls all the teachers
            if(JSON.stringify(usersData[uid]['info']['userType']) == '"teacher"'){
                var teacher = {
                    name: usersData[uid]['info']['name'].slice(1, -1),
                    location: usersData[uid]['info']['location'].slice(1, -1),
                    instruments: usersData[uid]['info']['instruments'],
                    picture: usersData[uid]['info']['photo'].slice(1, -1),
                    uid: uid,
                    key: key.toString(),
                    starCount: averageStars
                }
                teachers.push(teacher)
                this.setState({ teachers: teachers })
                key = key + 1;
            }
        }
    });
}

componentDidMount(){
    console.log('ListOfTeachers mounted') 
    this.loadTeachers();
}

onPress = (teacher) => {
    Actions.TeacherInfo({
        userData: this.props.userData,
        teacher: teacher
    })
}

onBookPressed = (teacher) => {
    Actions.CalendarForStudents({
        userData: this.props.userData,
        teacher: teacher
    })
}

  render() {
    return (
        <View style={styles.container}>
            <ProfileBar 
                name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
                image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
                userData={this.props.userData}
            />
            <ScrollView>
                {this.state.teachers.map(user => (
                    <TeacherCell
                        image = {user.picture}
                        name = {user.name}
                        instruments = {user.instruments}
                        starCount = {user.starCount}
                        location = {user.location}
                        onPress = {() => this.onPress(user)}
                        onBookPressed = {() => this.onBookPressed(user)}
                        uid = {user.uid}  
                        key = {user.key}                      
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
        backgroundColor:  Platform.OS === 'ios'? 'white' : '#f5f5f5',
        alignItems: 'center'
     },
});


//this lets the component get imported other places
export default ListOfTeachers;
