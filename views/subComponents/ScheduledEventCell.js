import React from 'react';
import { Text, View, StyleSheet, Dimensions, TouchableOpacity, Image } from 'react-native';
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

class ScheduledEventCell extends React.Component {

    state = {
        name: this.props.name,
        instruments: this.props.instruments,
        time: this.props.time,
        date: this.props.date,
        image: this.props.image,
        confirmed: this.props.confirmed,

        backgroundColor: ''
    }
    
    componentDidMount(){
        if(this.state.confirmed == true){
            this.setState({backgroundColor: '#274156'})
        } else {
            this.setState({backgroundColor: 'green'})
        }
    }

    render(){
        return(
            <View style={styles.shadow}>
                <TouchableOpacity style={[styles.cellContainer, {backgroundColor: this.state.backgroundColor}]} onPress={() => this.props.onPress()}>
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>Lesson with {this.state.name}</Text>
                        <Text style={styles.infoText}>{this.state.date}</Text>
                        <Text style={styles.infoText}>{this.props.time}</Text>
                    </View>
                    <Image 
                        style={styles.circle}
                        source = {{uri: this.state.image}}
                    />
                </TouchableOpacity>
            </View>
        );
    }
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
        width: deviceWidth - 5,
        height: deviceHeight / 8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderRadius: 15,
        borderWidth: 1,
        borderBottomWidth: 2,
        borderColor: "grey",
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
        margin: 20,
        paddingRight: 20
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
        marginLeft: 10
    }
});

export default ScheduledEventCell;