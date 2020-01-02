import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';

const DayBar = props => {

    var selected = ''
    var mondayBackground = ''
    var tuesdayBackground = ''
    var wednesdayBackground = ''
    var thursdayBackground = '' 
    var fridayBackground = ''
    var saturdayBackground = ''
    var sundayBackground = ''

    setDay = (day) => {
        selected = day
        if(selected == "Mon"){
            mondayBackground = 'blue'
        }
        console.log(selected)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Mon")}>
                <View style={[styles.highlightCircle, {backgroundColor: mondayBackground}]}>
                    <Text>Mon</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Tue")}>
                <View style={[styles.highlightCircle, {backgroundColor: tuesdayBackground}]}>
                    <Text>Tue</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Wed")}>
                <View style={[styles.highlightCircle, {backgroundColor: wednesdayBackground}]}>
                    <Text>Wed</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Thu")}>
                <View style={[styles.highlightCircle, {backgroundColor: thursdayBackground}]}>
                    <Text>Thu</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Fri")}>
                <View style={[styles.highlightCircle, {backgroundColor: fridayBackground}]}>
                    <Text>Fri</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Sat")}>
                <View style={[styles.highlightCircle, {backgroundColor: saturdayBackground}]}>
                    <Text>Sat</Text>
                </View>   
            </TouchableOpacity>
            <TouchableOpacity style={styles.dayContainer} onPress={() => this.setDay("Sun")}>
                <View style={[styles.highlightCircle, {backgroundColor: sundayBackground}]}>
                    <Text>Sun</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        height: '10%',
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
        flexDirection: 'row'
    },
    dayContainer: {
        width: '14.28%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    highlightCircle: {
        borderRadius: 100,
        height: 50,
        width: 50,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default DayBar