//Teacher Dash screen is the main screen on the teacher side of the app
//has to 3 link buttons but two of them link to the same screen for now
import React from 'react';
import LessonList from '../subComponents/LessonList';
import {loadLessons} from '../subComponents/BackendComponents/BackendFunctions';

class LessonRequests extends React.Component {
  state = {
    lessonsList: [],
  };

  componentDidMount() {
    loadLessons(this.props.userData, 'undecided', this);
  }

  render() {
    return (
      <LessonList
        userData={this.props.userData}
        lessonType="undecided"
        lessonsList={this.state.lessonsList}
      />
    );
  }
}

//this lets the component get imported other places
export default LessonRequests;
