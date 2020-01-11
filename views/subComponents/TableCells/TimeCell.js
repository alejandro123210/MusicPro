import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';

//required props:
//name
//key

//required props are name, key, date, lastmessage

let deviceWidth = Dimensions.get("window").width;

function timeCell({backgroundColor, name, fontColor, onPress}){

    return (
        <View>
            <TouchableOpacity 
                onPress={() => onPress()} 
                delayPressIn={70} 
                activeOpacity={0.9} 
                style={[styles.cellView, {backgroundColor: backgroundColor}]}
            >
                <Text style={[styles.timeText, {color: fontColor}]}>{name}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cellView: {
        height: 110,
        marginTop: 5,
        borderRadius: 15,
        width: deviceWidth - 10,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
    },
    timeText:{
        fontSize: 20,
        color: 'black'
    }
});

export default timeCell;