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
        studentName: this.props.studentName,
        teacherName: this.props.teacherName,
        instruments: this.props.instruments,
        time: this.props.time,
        date: this.props.date,
        studentImage: this.props.studentImage,
        teacherImage: this.props.teacherImage,
        status: this.props.status,
        userType: this.props.userType,

        backgroundColor: '',
        image: '',
        name: ''
    }
    
    componentDidMount(){
        if(this.state.status == 'confirmed'){
            this.setState({backgroundColor: '#274156'})
        } else {
            this.setState({backgroundColor: '#25A21F'})
        }
        if(this.state.userType == 'teacher'){
            this.setState({
                image: this.state.studentImage,
                name: this.state.studentName
            })
        } else {
            this.setState({
                image: this.state.teacherImage,
                name: this.state.teacherName
            })
        }
    }

    render(){
        return(
            <View style={styles.shadow}>
                <TouchableOpacity 
                    style={[styles.cellContainer, {backgroundColor: this.state.backgroundColor}]} 
                    onPress={() => this.props.onPress()}
                    delayPressIn={70}
                    activeOpacity={0.8}
                >
                    <View style={styles.textContainer}>
                        <Text style={styles.nameText}>Lesson with {this.state.name}</Text>
                        <Text style={styles.infoText}>{this.state.date}</Text>
                        <Text style={styles.infoText}>{this.props.time}</Text>
                        <Text style={styles.infoText}>{this.state.instruments.join(', ')}</Text>
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
        width: deviceWidth - 10,
        height: 110,
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
        marginTop: 20
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

export default ScheduledEventCell;