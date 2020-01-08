import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';

//required props:
//name
//key

//required props are name, key, date, lastmessage

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

const TimeCell = props => {
    
    state = {
        backgroundColor: props.backgroundColor,
        fontColor: props.fontColor
    }
    
    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={[styles.cellView, {backgroundColor: state.backgroundColor}]}>
                <Text style={[styles.timeText, {color: state.fontColor}]}>{props.name}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    cellView: {
        height: deviceHeight / 8,
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