//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from 'react';
import LessonList from '../subComponents/LessonList';

class LessonRequests extends React.Component {
  render() {
    return <LessonList userData={this.props.userData} lessonType="undecided" />;
  }
}

//this lets the component get imported other places
export default LessonRequests;
