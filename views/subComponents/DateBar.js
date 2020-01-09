import React from 'react'
import {Text, View, StyleSheet, Dimensions } from 'react-native'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class DateBar extends React.Component{

    state = {
        date: ''
    }

    componentDidMount(){
        var date = new Date().getDate(); //Current Date
        var month = new Date().getMonth() + 1; //Current Month
        var year = new Date().getFullYear(); //Current Year
        this.setState({
          //Setting the value of the date time
          date: "Today is: " + month + "/" + date + "/" + year
        });
    }

    render(){
        return(
            <View style={styles.dateBar}>
                <Text style={styles.dateText}>{this.state.date}</Text>
            </View>
        )
    }

}

const styles = StyleSheet.create({
  dateBar: {
    height: deviceHeight / 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'white',
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray'
  },
  dateText: {
    fontSize: 18,
    color: "#838081",
    fontFamily: "HelveticaNeue-Medium",
    marginTop: 5
  },
})

export default DateBar