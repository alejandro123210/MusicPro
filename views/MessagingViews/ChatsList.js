import React from 'react';
import { View, StyleSheet, Text, ScrollView, Alert} from 'react-native';
import * as firebase from 'firebase'
import ConversationCell from '../subComponents/TableCells/ConversationCell';
import { Actions } from 'react-native-router-flux';

class ChatsList extends React.Component {

    state = {
        conversations: [],
        userData: this.props.userData,
    }
    
    componentWillMount(){
        var db = firebase.database()
        var ref = db.ref(`Messages/${this.state.userData['uid']}/`)
        let that = this
        ref.on('value', function(snapshot){
            var conversationsData = JSON.parse(JSON.stringify(snapshot.val()))
            var conversations = []
            for(userKey in conversationsData){
                let conversation = {
                    lastMessageAt: conversationsData[userKey]['lastMessageAt'],
                    messages: conversationsData[userKey]['messages'],
                    userName: conversationsData[userKey]['userName'],
                    userPhoto: conversationsData[userKey]['userPhoto'],
                    uid: userKey
                }
                conversations.push(conversation)
            }
            conversations.sort((a, b) => (a.lastMessageAt > b.lastMessageAt) ? -1 : 1)
            that.setState({conversations})
        })
    }


    onCellPressed = (conversation) => {
        var otherUser = {
            name: conversation.userName,
            photo: conversation.userPhoto,
            uid: conversation.uid
        }

        Actions.Chat({
            userData: this.props.userData,
            otherUser: otherUser,
        })
    }

    onCellLongPressed = (conversation) => {
        Alert.alert(
            'Delete Messages?',
            'are you sure you want to delete your messages with ' + conversation.userName + '?',
            [
            {text: 'delete', onPress: () => this.deleteMessages(conversation)},
            {
                text: 'Nevermind',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            ],
            {cancelable: true},
        );
    }

    deleteMessages = (conversation) => {
        var db = firebase.database()
        var userRef = db.ref(`Messages/${this.state.userData['uid']}/${conversation.uid}`)
        var otherUserRef = db.ref(`Messages/${conversation.uid}/${this.state.userData['uid']}`)
        userRef.remove()
        otherUserRef.remove()
    }

    render(){
        return(
            this.state.conversations.length != 0?
                <ScrollView>
                    {this.state.conversations.map(conversation => (
                        <ConversationCell
                            conversation = {conversation}
                            key = {this.state.conversations.findIndex(convoToFind => convoToFind == conversation)}
                            onCellPressed = {() => this.onCellPressed(conversation)}
                            onCellLongPressed = {() => this.onCellLongPressed(conversation)}
                        />
                    ))}
                </ScrollView>
            :
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'gray', textAlign: 'center', fontSize: 30}}>No messages</Text>
                </View>
            
 
        )
    }
}

export default ChatsList