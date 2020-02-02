//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from "react";
import LessonList from "../subComponents/LessonList";
import {Notifications} from 'react-native-notifications'

class StudentDash extends React.Component {

  componentDidMount(){
    Notifications.registerRemoteNotifications();

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({alert: false, sound: false, badge: false});
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });
  }

  render() {
    return (
      <LessonList
        userData = {this.props.userData}
        lessonType = 'confirmed'
      />
    );
  }
}

export default StudentDash;
