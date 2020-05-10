//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from 'react';
import LessonList from '../subComponents/LessonList';
import {registerFCM} from '../subComponents/BackendComponents/BackendFunctions';

class TeacherDash extends React.Component {
  componentDidMount() {
    registerFCM(this.props.userData);
  }

  render() {
    return <LessonList userData={this.props.userData} lessonType="confirmed" />;
  }
}

export default TeacherDash;
