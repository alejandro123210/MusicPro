import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import InstrumentTag from '../instrumentTag';

let deviceWidth = Dimensions.get("window").width;

function lessonCell({ name, image, instruments, time, date, request, onDenyPressed, onCancelPressed, onConfirmPressed, userType }){

    //get the time of the lesson
    moment = require('moment');
    dateInPlainEnglish = moment(date).format('MMMM Do')
    dateAndTime = dateInPlainEnglish + ' at ' + time 

    return(
        <View style={styles.shadow}>     
            <View style={styles.container}>
                <View style={styles.title}>
                    <Image style={styles.image} source={{uri: image}}/>
                    <View style={styles.textContainer}> 
                        {request? 
                            <Text style={styles.titleText}>Lesson request from {name}</Text>
                        :
                            <Text style={styles.titleText}>Lesson with {name}</Text>
                        }
                        <Text style ={styles.dateText}>{dateAndTime}</Text>
                        <View style={styles.tagView}>
                            {instruments.map(instrument => (
                                <InstrumentTag 
                                    instrument = { instrument }
                                    colorOfCell = '#274156'
                                    key = {instruments.findIndex(instrumentToFind => instrumentToFind == instrument)}
                                />
                            ))}
                        </View>
                    </View>
                </View>
                {request && userType == 'teacher'?
                    <View style={styles.buttonsContainer}>
                        <TouchableOpacity style={styles.buttonLeft} activeOpacity={0.7} onPress={() => onDenyPressed()}>
                            <Text style={styles.buttonText}>deny</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.buttonRight} activeOpacity={0.7} onPress={() => onConfirmPressed()}>
                            <Text style={styles.buttonText}>confirm</Text>
                        </TouchableOpacity>
                    </View>
                :request && userType == 'student'?
                    <TouchableOpacity style={styles.bottomBorder} activeOpacity={0.7} onPress={() => onCancelPressed()}>
                        <Text style={styles.buttonText}>cancel request</Text>
                    </TouchableOpacity>
                :
                    <TouchableOpacity style={styles.bottomBorder} activeOpacity={0.7} onPress={() => onCancelPressed()}>
                        <Text style={styles.buttonText}>cancel lesson</Text>
                    </TouchableOpacity>
                }
            </View>
        </View>
    )
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
    container: {
        backgroundColor: 'white',
        width: deviceWidth-20,
        borderRadius: 10,
        marginTop: 10,
    },
    image:{
        height: 75,
        width: 75,
        borderRadius: 1000,
        backgroundColor: 'black',
        marginLeft: 10
    },
    title: {
        flexDirection: 'row',
        marginTop: 20,
    },
    textContainer: {
        marginLeft: 13
    },
    titleText: {
        fontSize: 25,
        width: '75%',
    },
    dateText: {
        color: '#274156',
        marginTop: 5
    },
    seperator: {
        height: 0.3,
        width: '100%',
        backgroundColor: 'black',
        marginTop: 20
    },
    tagView: {
        marginTop: 5,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    buttonsContainer: {
        flexDirection: 'row',
        marginTop: 20
    },
    buttonLeft: {
        flex: 1,
        backgroundColor: '#274156',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderBottomLeftRadius: 10,
    },
    buttonRight: {
        flex: 1,
        backgroundColor: '#274156',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        borderBottomRightRadius: 10,
        borderLeftWidth: 0.3,
        borderLeftColor: 'black'
    },
    buttonText: {
        color: 'white'
    },
    bottomBorder: {
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        backgroundColor: '#274156',
        height: 40,
        marginTop: 14,
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default lessonCell