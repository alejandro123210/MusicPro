import React from 'react';
import { Router, Scene, Tabs } from 'react-native-router-flux';
import * as firebase from 'firebase';

import LaunchScreen from './views/LoginViews/LaunchScreen'
import Login from './views/LoginViews/Login'
import Register from './views/LoginViews/Register'
import Register_Instrument from './views/LoginViews/Register_Instrument'
import Register_Description from './views/LoginViews/Register_Description'
import StudentDash from './views/StudentDash'
import TeacherDash from './views/TeacherDash'
import Settings from './views/LoginViews/Settings'
import ListOfTeachers from './views/ListOfTeachers'
import Register_Location from './views/LoginViews/Register_Location';
import CalendarForStudents from './views/CalendarForStudents';
import TeacherAvailabilityConfigurator from './views/TeacherAvailabilityConfigurator';
import LessonRequests from './views/LessonRequests';

export default function App() {

  const firebase = require("firebase");
  const firebaseConfig = {
    apiKey: "AIzaSyBxNgaiPS_gdg_M-A7TMsFEwJjmqg88sRA",
    authDomain: "rehearse-c7c14.firebaseapp.com",
    databaseURL: "https://rehearse-c7c14.firebaseio.com",
    storageBucket: "rehearse-c7c14.appspot.com",
  };
  const firebaseApp = firebase.initializeApp(firebaseConfig);


  return (
    <Router>
      <Scene key='root'>
        {/* <Scene
          key = 'LaunchScreen'
          component = { LaunchScreen }
          hideNavBar = { true }
        /> */}
        <Scene
          key = 'Login'
          component = { Login }
          hideNavBar = { true }
        />
        <Scene 
          key = 'CalendarForStudents'
          component = { CalendarForStudents }
          hideNavBar = { false }
        />
        <Scene 
          key = 'Register_Location'
          component = { Register_Location }
          hideNavBar = {true}
        />
        <Scene
          key = 'Register'
          component = { Register }
          hideNavBar = { true }
        />
        <Scene
          key = 'Register_Instrument'
          component = { Register_Instrument }
          hideNavBar = { true }
        />
        <Scene
          key = 'Register_Description'
          component = { Register_Description }
          hideNavBar = { true }
        />
        <Scene
          key = 'Settings'
          component = { Settings }
          hideNavBar = {false}
        />
        <Scene key= 'StudentMain' hideNavBar = { true } tabs={true} wrap={false} gesturesEnabled={false}>
            <Scene 
              key = 'StudentDash'
              component = { StudentDash }
              tabBarLabel = 'My Schedule'
              hideNavBar = { true }
              gesturesEnabled = { false }
            />
            <Scene 
              key = 'ListOfTeachers'
              component = { ListOfTeachers }
              tabBarLabel = 'teachers'
              hideNavBar = { true }
              gesturesEnabled = { false }
            />
        </Scene>
        <Scene key='TeacherMain' hideNavBar = { true } tabs={true} wrap={false} gesturesEnabled={false}>
          <Scene
            key = 'TeacherDash'
            component = { TeacherDash }
            tabBarLabel = 'My Schedule'
            hideNavBar = { true }
            gesturesEnabled = { false }
          />
          <Scene
            key = 'LessonRequests'
            component = { LessonRequests }
            tabBarLabel = 'Requests'
            gesturesEnabled = { false }
          />
          <Scene 
            key = 'TeacherAvailabilityConfigurator'
            component = { TeacherAvailabilityConfigurator }
            tabBarLabel = 'Availability'
            hideNavBar = {true}
            gesturesEnabled = {false}
          />
        </Scene>
      </Scene>
    </Router>
  );
}
