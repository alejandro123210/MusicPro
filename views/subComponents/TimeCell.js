import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';

//required props:
//name
//key

//required props are name, key, date, lastmessage

let deviceWidth = Dimensions.get("window").width;

const TimeCell = props => {
    
    state = {
        backgroundColor: props.backgroundColor,
        fontColor: props.fontColor
    }
    
    return (
        <View>
            <TouchableOpacity 
                onPress={() => props.onPress()} 
                delayPressIn={70} 
                activeOpacity={0.9} 
                style={[styles.cellView, {backgroundColor: state.backgroundColor}]}
            >
                <Text style={[styles.timeText, {color: state.fontColor}]}>{props.name}</Text>
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

export default TimeCell;