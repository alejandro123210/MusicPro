import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';

let deviceWidth = Dimensions.get("window").width;

function scheduledEventCell({ studentName, teacherName, instruments, time, date, studentImage, teacherImage, status, userType, onPress }) {

    //get the time of the lesson
    moment = require('moment');
    dateInPlainEnglish = moment(date).format('MMMM Do')
    dateAndTime = dateInPlainEnglish + ' at ' + time 

    //image is a default in case it doesn't want to load
    //name and background color are set in the next statements
    backgroundColor = '',
    image = 'https://i.stack.imgur.com/l60Hf.png',
    name = ''
    //if it's a confirmed lesson, background color is blue, if not it is green
    if(status == 'confirmed'){
        backgroundColor = '#274156'
    } else {
        backgroundColor = '#25A21F'
    }
    //if the user is a teacher it will show the student's name, if it's a student it will show the teacher's
    if(userType == 'teacher'){
        image = studentImage,
        name = studentName
    } else {
        image = teacherImage,
        name = teacherName
    }
    
    return (
        <View style={styles.shadow}>
            <TouchableOpacity 
                style={[styles.cellContainer, {backgroundColor: backgroundColor}]} 
                onPress={() => onPress()}
                delayPressIn={70}
                activeOpacity={0.8}
            >
                <View style={styles.textContainer}>
                    <Text style={styles.nameText}>Lesson with {name}</Text>
                    <Text style={styles.infoText}>{dateAndTime}</Text>
                    {/* <Text style={styles.infoText}>{this.props.time}</Text> */}
                    <Text style={styles.infoText}>{instruments.join(', ')}</Text>
                </View>
                <Image 
                    style={styles.circle}
                    source = {{uri: image}}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'gray',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 10,
        width: deviceWidth,
        alignItems: 'center'
    },
    cellContainer: {
        width: deviceWidth - 10,
        height: 90,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 15,
        marginTop: 10
    },
    textContainer: {
        flexDirection: "column",
        paddingLeft: 10,
        marginTop: 5
    },
    nameText: {
        fontSize: 18,
        color: "white",
        fontFamily: "HelveticaNeue-Medium",
        marginTop: 5
    },
    circle: {
        height: 60,
        width: 60,
        borderRadius: 100000,
        marginRight: 20,
        marginTop: 15
    },
    infoText: {
        fontSize: 16,
        color: "white",
        fontFamily: "HelveticaNeue-Light",
        marginTop: 2,
    },
    instrumentText: {
        fontSize: 16,
        color: "white",
        fontFamily: "HelveticaNeue-Light",
        marginTop: 4,
    }
});

export default scheduledEventCell;