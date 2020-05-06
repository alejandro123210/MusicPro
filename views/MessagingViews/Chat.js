/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {View} from 'react-native';
import {GiftedChat, Bubble} from 'react-native-gifted-chat';
import * as firebase from 'firebase';

class Chat extends React.Component {
  state = {
    messages: [],
    userData: this.props.userData,
    otherUser: this.props.otherUser,
  };

  componentDidMount() {
    var db = firebase.database();
    var ref = db.ref(
      `Messages/${this.state.userData.uid}/${
        this.state.otherUser.uid
      }/messages`,
    );
    let that = this;
    ref.on('value', function(snapshot) {
      var messageData = JSON.parse(JSON.stringify(snapshot.val()));
      var messages = [];
      // eslint-disable-next-line no-undef
      for (message in messageData) {
        // eslint-disable-next-line no-undef
        messages.push(messageData[message]);
      }
      that.setState({messages});
    });
  }

  componentWillUnmount() {
    console.log('unmounted');
    var db = firebase.database();
    db.ref(
      `Messages/${this.state.userData.uid}/${
        this.state.otherUser.uid
      }/messages`,
    ).off();
  }

  onSend = async (messages = []) => {
    var firstMessage = false;
    if (this.state.messages.length == 0) {
      firstMessage = true;
    }

    await this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
    var messagesToPush = this.state.messages;
    var db = firebase.database();
    var userRef = db.ref(
      `Messages/${this.state.userData.uid}/${this.state.otherUser.uid}/`,
    );
    var otherUserRef = db.ref(
      `Messages/${this.state.otherUser.uid}/${this.state.userData.uid}/`,
    );
    var moment = require('moment');
    var lastMessageAt = moment().format();
    // userRef.set(moment().format())
    // otherUserRef.set(moment().format())
    if (firstMessage) {
      let userMessageData = {
        lastMessageAt: lastMessageAt,
        messages: messagesToPush,
        userName: this.state.otherUser.name,
        userPhoto: this.state.otherUser.photo,
      };
      let otherUserMessageData = {
        lastMessageAt: lastMessageAt,
        messages: messagesToPush,
        userName: this.state.userData.name,
        userPhoto: this.state.userData.photo,
      };
      userRef.set(userMessageData);
      otherUserRef.set(otherUserMessageData);
    } else {
      userRef.update({messages: messagesToPush, lastMessageAt});
      otherUserRef.update({messages: messagesToPush, lastMessageAt});
    }
  };

  avatarPressed = () => {
    //     if(this.state.userData['userType'] == 'student'){
    //         const teacher = {
    //             uid: this.state.otherUser.uid
    //         }
    //         Actions.TeacherInfo({teacher: teacher})
    //     }
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#274156',
          },
        }}
      />
    );
  }

  render() {
    return (
      <View style={{backgroundColor: 'white', flex: 1}}>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          user={{
            _id: this.state.userData.uid,
            name: this.state.userData.name,
            avatar: this.state.userData.photo,
          }}
          onPressAvatar={() => this.avatarPressed()}
          showAvatarForEveryMessage={false}
          renderBubble={this.renderBubble}
        />
      </View>
    );
  }
}

export default Chat;
