import React from 'react';
import { Text, StyleSheet, View, TouchableOpacity, Image, Dimensions } from 'react-native';
import { Rating } from 'react-native-ratings'
import InstrumentTag from '../instrumentTag';

let deviceWidth = Dimensions.get("window").width;

function teacherCell({image, name, location, instruments, starCount, distance, onPress, onBookPressed}){
    
    return(
        <TouchableOpacity style={styles.shadow} onPress={() => onPress()} delayPressIn={70} activeOpacity={0.7}>
            <View style={styles.container}>
                <View style={styles.topBar}>
                    <Image 
                        style={styles.circle}
                        source={{uri: image}}
                    />
                    <View style={styles.nameContainer}>
                        <Text style={styles.nameText}>{name}</Text>
                        <Rating 
                            count={5}
                            startingValue={starCount}
                            style={{paddingTop: 10}}
                            imageSize={20}
                            // onFinishRating={(rating) => this.quickRate(rating)}
                            readonly ={true}
                        />
                        <Text style={styles.locationText}>{location} (≈{distance} mi)</Text>
                    </View>
                </View>
                <View style={styles.midSection}>
                    <View style={styles.instrumentsContainer}>
                        {instruments != null? 
                            instruments.map(instrument => (
                                <InstrumentTag
                                    instrument={instrument}
                                    colorOfCell = '#274156'
                                    key = {instruments.findIndex(instrumentinArray => instrument == instrumentinArray)}
                                />
                            ))
                        :
                            <View/>
                        }
                    </View>        
                </View>
                <TouchableOpacity style={styles.bottomButtons} onPress={() => onBookPressed()} activeOpacity={0.7}>
                    <Text style={styles.bookText}>Book a lesson</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
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
    container: {
        backgroundColor: 'white',
        width: deviceWidth-20,
        borderRadius: 10,
        marginTop: 10,
    },
    topBar: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    circle: {
        height: 60,
        width: 60,
        borderRadius: 100000,
        margin: 20,
    },
    nameContainer: {
        alignItems: 'flex-start'
    },
    nameText: {
        fontSize: 20
    },
    locationText: {
        color: 'gray',
        margin: 5
    },
    midSection: {
        borderTopWidth: 0.3,
        borderTopColor: 'black',
    },
    instrumentsContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 10,
    },
    bottomButtons: {
        height: 40,
        borderTopWidth: 0.5,
        borderTopColor: 'black',
        backgroundColor: '#274156',
        borderBottomStartRadius: 10,
        borderBottomEndRadius: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bookText: {
        color: 'white',
        fontSize: 20,
    }
});

export default teacherCell;