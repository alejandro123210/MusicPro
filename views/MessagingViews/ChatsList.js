import React from 'react';
import { View, StyleSheet, Text, ScrollView, Alert, FlatList } from 'react-native';
import * as firebase from 'firebase';
import ConversationCell from '../subComponents/TableCells/conversationCell';
import { Actions } from 'react-native-router-flux';
import ProfileBar from '../subComponents/ProfileBar';

class ChatsList extends React.Component {

    state = {
        conversations: [],
        userData: this.props.userData,
    }
    
    componentDidMount(){
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
            <View style={styles.container}>
                <ProfileBar
                    userData = {this.state.userData}
                />
                <FlatList
                    data={this.state.conversations}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem = {({ item }) => (
                        <ConversationCell
                            conversation={item}
                            onCellPressed = {() => this.onCellLongPressed(item)}
                            onCellLongPressed = {() => this.onCellLongPressed(item)}
                        />
                    )}
                />
            </View>
            :
            <View style={styles.container}>
                <ProfileBar
                    userData = {this.state.userData}
                />
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <Text style={{color: 'gray', textAlign: 'center', fontSize: 30}}>No messages</Text>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, 
        backgroundColor: Platform.OS === 'ios'? 'white' : '#f5f5f5'
    },
})
export default ChatsList