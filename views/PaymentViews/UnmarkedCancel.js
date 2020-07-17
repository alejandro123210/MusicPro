import React from 'react';
import LargePrompt from '../subComponents/LargePrompt';
import {reportLesson} from '../subComponents/BackendComponents/BackendFunctions';
import {Actions} from 'react-native-router-flux';

const UnmarkedCancel = ({userData}) => {
  const submitReport = (description) => {
    reportLesson(description, userData);
    Actions.SendPayment({userData});
  };
  return (
    <LargePrompt
      donePressed={(text) => submitReport(text)}
      title="Explain what happened and give us the details of the lesson and we'll help you ASAP"
    />
  );
};

export default UnmarkedCancel;
