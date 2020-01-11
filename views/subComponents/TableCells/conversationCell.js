import React from 'react'
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native'


function conversationCell({conversation, onCellPressed}){

    var moment = require('moment')
    var timeOfMessaage = moment(conversation.lastMessageAt).format('MM-DD-YYYY')

    return(
        //this conditional is here to prevent app from crashing on database changes
        conversation.messages != undefined? 
            <TouchableOpacity style={styles.container} onPress={() => onCellPressed()}>
                <Image
                    source = {{uri: conversation.userPhoto}}
                    style = {styles.photo}
                />
                <View style={styles.textContainer}>
                    <View style={styles.topTextContainer}>
                        <Text style={styles.name}>{conversation.userName}</Text>
                        <Text style={styles.timeText}>{timeOfMessaage}</Text>
                    </View>
                    <View style={styles.lastMessageContainer}>
                        <Text numberOfLines={2} ellipsizeMode="tail" style={styles.lastMessageText}>{conversation.messages[0]['text']}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        :
            <View/>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        height: 100,
        flexDirection: 'row',
    },
    photo: {
        height: 80,
        width: 80,
        borderRadius: 1000,
        marginLeft: 5,
        marginTop: 10,
    },
    name: {
        fontSize: 20,
        marginTop: 10,
        marginLeft: 15
    },
    textContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    topTextContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flex: 1,
        height: 40,
        alignItems: 'center',
    },
    timeText: {
        marginTop: 10,
        marginRight: 10
    },
    lastMessageContainer: {
        flex: 1,
        marginLeft: 15,
        marginRight: 10
    },
    lastMessageText:{
        color: 'gray',
        fontSize: 15,
    }
})

export default conversationCell