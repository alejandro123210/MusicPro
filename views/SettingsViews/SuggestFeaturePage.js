/* eslint-disable eqeqeq */
import React from 'react';
import LargePrompt from '../subComponents/LargePrompt';
import * as firebase from 'firebase';
import {Actions} from 'react-native-router-flux';

class SuggestFeaturePage extends React.Component {
  uploadData = (description) => {
    var db = firebase.database();
    var ref = db.ref('suggestedFeatures');
    ref.push(description);
    if (this.props.userData.userType == 'student') {
      Actions.StudentMain({userData: this.props.userData});
    } else {
      Actions.TeacherMain({userData: this.props.userData});
    }
  };

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <LargePrompt
        donePressed={(description) => this.uploadData(description)}
        title="Suggest a Feature"
      />
    );
  }
}

//this lets the component get imported other places
export default SuggestFeaturePage;
