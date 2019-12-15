import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';

//required props:
//name
//key

//required props are name, key, date, lastmessage
const TimeCell = props => {


    return (
        <View style={styles.cellView}>
            {/* animates the entire cell ^ */}
            <TouchableOpacity onPress={() => props.onPress()}>
                {/* makes it selectable ^ */}
                <View style={{ flexDirection: "row" }}>
                    <View style={styles.nameAndDetails}>
                        <View style={styles.topContainer}>
                            {/* container for name/date */}
                            <Text style={styles.name} >
                                {props.name}
                            </Text>
                        </View>
                        {/* last message view */}
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    cellView: {
        height: 100,
        backgroundColor: '#ffffff',
        marginTop: 2,
        marginLeft: 2.35,
        borderRadius: 25,
        borderColor: "pink",
        //borderBottomColor: "pink",
        borderBottomWidth: 0.3,
        width: '98.9%',
    },
    nameAndDetails: {
        flexDirection: 'column',
        width: '75%',
        marginLeft: 20,
        height: 100

    },
    name: {
        fontSize: 20,
        paddingTop: 10,
        paddingRight: 1,
        fontWeight: 'bold',
    },
    detailTextView: {
        height: 60,
    },
    instrumentText: {
        textAlign: 'right',
        paddingTop: 15,
    },
    topContainer: {
        flexDirection: 'row',
        height: 40,
        justifyContent: 'space-between',
        width: '100%'

    },
    circle: {
        height: 60,
        width: 60,
        // backgroundColor: '#a9a9a9',
        borderRadius: 100000,
        marginTop: 20,
        marginLeft: 10,
    }
});

export default TimeCell;