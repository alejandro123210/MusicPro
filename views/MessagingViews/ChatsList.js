import React from 'react';
import { View, StyleSheet, Text, ScrollView} from 'react-native';
import * as firebase from 'firebase'
import ConversationCell from '../subComponents/TableCells/conversationCell';
import { Actions } from 'react-native-router-flux';

class ChatsList extends React.Component {

    state = {
        conversations: [],
        userData: this.props.userData
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
                    lastMessageAt: conversationsData[userKey],
                    messages: conversationsData[userKey]['messages'],
                    userName: conversationsData[userKey]['userName'],
                    userPhoto: conversationsData[userKey]['userPhoto'],
                    uid: userKey
                }
                conversations.push(conversation)
            }
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

    render(){
        return(
            <ScrollView>
                {this.state.conversations.map(conversation => (
                    <ConversationCell
                        conversation = {conversation}
                        key = {this.state.conversations.findIndex(convoToFind => convoToFind == conversation)}
                        onCellPressed = {() => this.onCellPressed(conversation)}
                    />
                ))}
            </ScrollView>
        )
    }
}

export default ChatsList