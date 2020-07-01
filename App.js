/* eslint-disable react-native/no-inline-styles */

//@format
//@flow strict-local

import React from 'react';
import {Router, Scene} from 'react-native-router-flux';
import {Image, View} from 'react-native';

//login views
import LaunchScreen from './views/LoginViews/LaunchScreen';
import Login from './views/LoginViews/Login';
import Register from './views/LoginViews/Register';
import Register_Instrument from './views/LoginViews/Register_Instrument';
import Register_Description from './views/LoginViews/Register_Description';
import Register_Location from './views/LoginViews/Register_Location';

//teacher views
import TeacherAvailabilityConfigurator from './views/TeacherViews/TeacherAvailabilityConfigurator';
import LessonRequests from './views/TeacherViews/LessonRequests';
import TeacherDash from './views/TeacherViews/TeacherDash';

//student views
import StudentLessonRequests from './views/StudentViews/StudentLessonRequests';
import CalendarForStudents from './views/StudentViews/CalendarForStudents';
import StudentDash from './views/StudentViews/StudentDash';
import ListOfTeachers from './views/StudentViews/ListOfTeachers';
import TeacherInfo from './views/StudentViews/TeacherInfo';
import ReviewTeacher from './views/StudentViews/ReviewTeacher';
import RequestLessonDetail from './views/StudentViews/RequestLessonDetail';

//settings views
import ReportBugsPage from './views/SettingsViews/ReportBugsPage';
import SuggestFeaturePage from './views/SettingsViews/SuggestFeaturePage';
import Settings from './views/SettingsViews/Settings';
import EditProfile from './views/SettingsViews/EditProfile';

//chat views
import Chat from './views/MessagingViews/Chat';
import ChatsList from './views/MessagingViews/ChatsList';
import PaymentsScreen from './views/SettingsViews/PaymentsScreen';

//Create a dedicated class that will manage the icon
function CalendarIcon() {
  return (
    <View
      style={{
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('./views/Assets/calendar.png')}
        style={{height: 20, width: 20}}
      />
    </View>
  );
}

function TeachersIcon() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('./views/Assets/teacher.png')}
        style={{height: 20, width: 20}}
      />
    </View>
  );
}

function BellIcon() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('./views/Assets/bell.png')}
        style={{height: 20, width: 20}}
      />
    </View>
  );
}

function RequestIcon() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('./views/Assets/request.png')}
        style={{height: 20, width: 20}}
      />
    </View>
  );
}

function EditIcon() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('./views/Assets/edit.png')}
        style={{height: 20, width: 20}}
      />
    </View>
  );
}

function ChatIcon() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
      }}>
      <Image
        source={require('./views/Assets/message.png')}
        style={{height: 20, width: 20}}
      />
    </View>
  );
}

export default function App() {
  const firebase = require('firebase');
  const firebaseConfig = {
    apiKey: 'AIzaSyBxNgaiPS_gdg_M-A7TMsFEwJjmqg88sRA',
    authDomain: 'rehearse-c7c14.firebaseapp.com',
    databaseURL: 'https://rehearse-c7c14.firebaseio.com',
    projectId: 'rehearse-c7c14',
    storageBucket: 'rehearse-c7c14.appspot.com',
    messagingSenderId: '506122331327',
    appId: '1:506122331327:web:b720a916641a314907120a',
    measurementId: 'G-180GGXR061',
  };
  // eslint-disable-next-line no-unused-vars
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  //we only seem to need to configure ios, android does it automatically
  // NativeModules.CustomFCMModuleiOS.configureFirebase();

  return (
    <Router>
      <Scene key="root">
        <Scene key="LaunchScreen" component={LaunchScreen} hideNavBar={true} />
        <Scene
          key="Login"
          component={Login}
          hideNavBar={true}
          gesturesEnabled={false}
        />
        <Scene
          key="EditProfile"
          component={EditProfile}
          hideNavBar={false}
          gesturesEnabled={true}
        />
        <Scene
          key="PaymentsScreen"
          component={PaymentsScreen}
          hideNavBar={false}
          gesturesEnabled={true}
        />
        <Scene
          key="CalendarForStudents"
          component={CalendarForStudents}
          hideNavBar={false}
        />
        <Scene
          key="Register_Location"
          component={Register_Location}
          hideNavBar={true}
        />
        <Scene key="Register" component={Register} hideNavBar={true} />
        <Scene
          key="Register_Instrument"
          component={Register_Instrument}
          hideNavBar={true}
        />
        <Scene
          key="Register_Description"
          component={Register_Description}
          hideNavBar={true}
        />
        <Scene
          key="ReportBugsPage"
          component={ReportBugsPage}
          hideNavBar={false}
        />
        <Scene
          key="SuggestFeaturePage"
          component={SuggestFeaturePage}
          hideNavBar={false}
        />
        <Scene key="Settings" component={Settings} hideNavBar={false} />
        <Scene key="TeacherInfo" component={TeacherInfo} hideNavBar={false} />
        <Scene
          key="ReviewTeacher"
          component={ReviewTeacher}
          hideNavBar={false}
        />
        <Scene
          key="RequestLessonDetail"
          component={RequestLessonDetail}
          hideNavBar={false}
        />
        <Scene key="Chat" component={Chat} />
        <Scene
          key="StudentMain"
          hideNavBar={true}
          tabs={true}
          activeTintColor="#274156"
          wrap={false}
          gesturesEnabled={false}>
          <Scene
            key="StudentDash"
            component={StudentDash}
            tabBarLabel="My Schedule"
            hideNavBar={true}
            gesturesEnabled={false}
            icon={CalendarIcon}
          />
          <Scene
            key="ListOfTeachers"
            component={ListOfTeachers}
            tabBarLabel="Teachers"
            hideNavBar={true}
            gesturesEnabled={false}
            icon={TeachersIcon}
          />
          <Scene
            key="StudentLessonRequest"
            component={StudentLessonRequests}
            tabBarLabel="Requests"
            hideNavBar={true}
            gesturesEnabled={false}
            icon={RequestIcon}
          />
          <Scene
            key="ChatsList"
            tabBarLabel="Chats"
            component={ChatsList}
            icon={ChatIcon}
          />
        </Scene>
        <Scene
          key="TeacherMain"
          hideNavBar={true}
          tabs={true}
          activeTintColor="#274156"
          wrap={false}
          gesturesEnabled={false}>
          <Scene
            key="TeacherDash"
            component={TeacherDash}
            tabBarLabel="My Schedule "
            hideNavBar={true}
            gesturesEnabled={false}
            icon={CalendarIcon}
          />
          <Scene
            key="LessonRequests"
            component={LessonRequests}
            tabBarLabel="Requests"
            gesturesEnabled={false}
            icon={BellIcon}
          />
          <Scene
            key="TeacherAvailabilityConfigurator"
            component={TeacherAvailabilityConfigurator}
            tabBarLabel="Set Availability"
            hideNavBar={false}
            gesturesEnabled={false}
            icon={EditIcon}
          />
          <Scene
            key="ChatsList"
            tabBarLabel="Chats"
            component={ChatsList}
            icon={ChatIcon}
          />
        </Scene>
      </Scene>
    </Router>
  );
}
