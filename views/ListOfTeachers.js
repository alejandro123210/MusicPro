import React, { Component } from 'react';
import { View, StyleSheet, Image, Dimensions, ScrollView, TextInput } from 'react-native';
import ProfileBar from './subComponents/ProfileBar'
import TableCell from './subComponents/TableCell';
import * as firebase from 'firebase';
import { Actions } from 'react-native-router-flux'


let deviceHeight = Dimensions.get('window').height;
let deviceWidth = Dimensions.get('window').width;

class ListOfTeachers extends React.Component {

state = {
        inputValue: '',
        data: [],
        teachers: 
        [
            {
                // name: 'alexander',
                // location: 'new york',
                // instrument: 'tuba',
                // picture: '',
                // key: 0
            }
        ]
}

//TODO: make this load in teachers that are nearby specifically 

componentDidMount(){
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
            if(JSON.stringify(usersData[uid]['info']['userType']) == '"teacher"'){
                var teacher = {
                    name: JSON.stringify(usersData[uid]['info']['name']).slice(3, -3),
                    location: JSON.stringify(usersData[uid]['info']['location']).slice(3, -3),
                    instrument: JSON.stringify(usersData[uid]['info']['instrument']).slice(1, -1),
                    picture: JSON.stringify(usersData[uid]['info']['photo']).slice(3, -3),
                    key: key,
                    uid: uid
                }
                teachers.push(teacher)
                this.setState({
                    teachers: teachers
                })
                key = key + 1;
            }
        }
    });
}


handleTextChange = inputValue => {
    this.setState({ inputValue });
};

onPress = (user) => {
    Actions.CalendarForStudents({
        userData: this.props.userData,
        teacher: user
    });
}

  render() {
    return (
        <View style={styles.container}>
            <ProfileBar 
                name={JSON.stringify(this.props.userData['name']).slice(3,-3)}
                image={JSON.stringify(this.props.userData['photo']).slice(3,-3)}
                userData={this.props.userData}
            />
            <View style={styles.searchBar}>
                <Image 
                    source={{ uri: 'http://fa2png.io/media/icons/font-awesome/4-7-0/search/256/0/274156_none.png' }}
                    style={styles.searchIcon}
                />
                <TextInput
                    value={this.state.inputValue}
                    onChangeText={this.handleTextChange}
                    style={styles.searchInput}
                />
            </View>

            <ScrollView>
                {this.state.teachers.map(user => (
                    <TableCell
                        image = {user.picture}
                        name = {user.name}
                        instrument = {user.instrument}
                        location = {user.location}
                        key = {user.key}
                        onPress = {() => this.onPress(user)}
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
        backgroundColor: 'white',
     },
     searchBar:{
        height: deviceHeight/10,
        flexDirection: 'row',
        alignItems: 'center',
     },
     searchInput: {
        height: deviceHeight/18,
        width: (deviceWidth/5)*4,
        backgroundColor: '#eeeced',
        margin: 10,
        borderRadius: 10,
     },
    searchIcon:{
        width: deviceWidth/16,
        height: deviceWidth/16, 
        marginLeft: 20,
        marginRight: 5,
    },
});


//this lets the component get imported other places
export default ListOfTeachers;
