import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';

let deviceWidth = Dimensions.get("window").width;

//this class will be changed to fit in more screens
class HoursCell extends React.Component {
    
    state = {
        available: this.props.available,
        name: this.props.name,
        backgroundColor: '',
        fontColor: '',
        //needs onPress prop
    }
    
    render() {
        return (
            <View style={styles.shadow}>
                <TouchableOpacity 
                    onPress={() => this.props.onPress()} 
                    delayPressIn={70} 
                    activeOpacity={0.4} 
                    style={styles.cellView}
                >
                    <Text style={styles.timeText}>{this.state.name}</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'gray',
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.2,
        shadowRadius: 10,
        width: deviceWidth,
        alignItems: 'center'
    },
    cellView: {
        height: 110,
        marginTop: 10,
        borderRadius: 10,
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

export default HoursCell;