//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from 'react';
import LessonList from '../subComponents/LessonList';
import {
  loadLessons,
  registerFCM,
} from '../subComponents/BackendComponents/BackendFunctions';
import {Linking} from 'react-native';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';

class TeacherDash extends React.Component {
  state = {
    lessonsList: [],
  };

  componentDidMount() {
    console.log(this.state.registeredProfileURL);
    loadLessons(this.props.userData, 'confirmed', this);
    registerFCM(this.props.userData);
    Linking.addEventListener('url', this._handleURL(this.props.userData));
    this.processInitialURL(this.props.userData);
  }

  componentWillUnmount() {
    Linking.removeAllListeners;
  }

  processInitialURL = async (userData) => {
    const url = await Linking.getInitialURL();
    if (url !== null) {
      const profileURL = url.slice(11);
      var db = firebase.database();
      let teachersRef = db.ref(`teachers/${profileURL}`);
      teachersRef.once('value').then((data) => {
        var teacherData = data.val();
        var teacher = {
          name: teacherData.name,
          location: teacherData.location,
          instruments: teacherData.instruments,
          photo: teacherData.photo,
          uid: profileURL,
          avgStars:
            teacherData.avgStars !== undefined
              ? teacherData.avgStars.avgRating
              : 0,
          numberOfReviews:
            teacherData.avgStars !== undefined
              ? teacherData.avgStars.numberOfReviews
              : 0,
        };
        Actions.TeacherInfo({teacher, userData});
      });
    }
    // The setTimeout is just for testing purpose
    setTimeout(() => {}, 10000);
  };

  _handleURL = function (userData) {
    return function curried_handleURL(event) {
      const profileURL = event.url.slice(11);
      if (profileURL !== 'home') {
        console.log(profileURL);
        var db = firebase.database();
        let teachersRef = db.ref(`teachers/${profileURL}`);
        teachersRef.once('value').then((data) => {
          var teacherData = data.val();
          var teacher = {
            name: teacherData.name,
            location: teacherData.location,
            instruments: teacherData.instruments,
            photo: teacherData.photo,
            uid: profileURL,
            avgStars:
              teacherData.avgStars !== undefined
                ? teacherData.avgStars.avgRating
                : 0,
            numberOfReviews:
              teacherData.avgStars !== undefined
                ? teacherData.avgStars.numberOfReviews
                : 0,
          };
          Actions.TeacherInfo({teacher, userData});
        });
      } else {
        Actions.TeacherDash({userData});
      }
    };
  };

  render() {
    return (
      <LessonList
        userData={this.props.userData}
        lessonType="confirmed"
        lessonsList={this.state.lessonsList}
      />
    );
  }
}

export default TeacherDash;
