import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

//required props: 
//name
//time
//key
//instrument
//scheduledEventPressed 
//^^ we delegate the onPress function to the view using the component because it's different when the person is a student/teacher

class RequestedEventCell extends React.Component {

    render(){
        return(
            <View key={this.props.name} style={styles.cellContainer}>
            <TouchableOpacity onPress={() => this.props.onPress()}>
                <View style={styles.nameContainer}>
                    <View style={{flexDirection: 'row', justifyContent:'space-between'}}>
                        <Text style={styles.nameText}>{this.props.name}</Text>
                        <Text style={styles.instrumentText}>{this.props.instrument}</Text>
                    </View>
                    <Text style={styles.infoText}>{this.props.time}</Text>
                </View>
            </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        flexDirection: "row",
        width: deviceWidth - 5,
        height: deviceHeight / 8,
        backgroundColor: 'green',
        borderRadius: 15,
        margin: 3,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderColor: "grey",
    },
    nameContainer: {
        width: (deviceWidth / 4) * 4,
        flexDirection: "column",
        marginLeft: 10,
        marginTop: 5
    },
    nameText: {
        fontSize: 18,
        color: "white",
        fontFamily: "HelveticaNeue-Medium",
        marginTop: 5
    },
    infoText: {
        fontSize: 16,
        color: "white",
        fontFamily: "HelveticaNeue-Light",
        marginTop: 2
    },
    instrumentText: {
        fontSize: 16,
        color: "white",
        fontFamily: "HelveticaNeue-Light",
        marginTop: 4,
        marginRight: 30
    }
});

export default RequestedEventCell;