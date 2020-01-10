import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image, Dimensions, Text, Alert } from 'react-native';
import * as firebase from 'firebase';
import {GoogleSignin} from '@react-native-community/google-signin';
import { Actions } from 'react-native-router-flux'
 
let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;


class SettingsForStudents extends React.Component {

  onDeletePress = () => {
    Alert.alert(
      'Are you sure?',
      'are you sure you want to delete your account?',
      [
        {text: 'Delete', onPress: () => this.deleteAccount()},
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  }
  
  onPress = () => {
      this.signOut()
  }

  changeInfo = () =>{
    Actions.StudentsPersonalInfo({userData: this.props.userData});
  }
  goToFAQPage = () =>{
    Actions.FAQPage();
  }
  goToAboutUsPAge = () =>{
    Actions.AboutUsPage()
  }
  goToReportBugsPage = () =>{
    Actions.ReportBugsPage({userData: this.props.userData})
  }
  goToSuggestFeaturePage = () =>{
    Actions.SuggestFeaturePage({userData: this.props.userData})
  }


  signOut = async () => {
      try {
        await GoogleSignin.revokeAccess();
        await GoogleSignin.signOut();
        this.setState({ user: null }); // Remember to remove the user from your app's state as well
        firebase.auth().signOut().then(function() {
          // Sign-out successful.
          Actions.Login({userData: null});
        
        }).catch(function(error) {
          alert('Sorry, there was a problem signing you out!')
        });
      } catch (error) {
        console.error(error);
        alert(error)
      }
    };

    
  deleteAccount = async () => {
    var db = firebase.database()
    var userLessonsRef = db.ref(`users/${this.props.userData['uid']}/info/lessons`)
    userLessonsRef.once("value")
    .then((snapshot) => {
      var lessonData = JSON.parse(JSON.stringify(snapshot.val()))
      for(date in lessonData){
        for(lessonKey in lessonData[date]){
          db.ref(`users/${lessonData[date][lessonKey]['teacherIDNum']}/info/lessons/${lessonData[date][lessonKey]['date']}/${lessonData[date][lessonKey]['teacherLessonKey']}`).remove()
        }
      }
      db.ref(`users/${this.props.userData['uid']}`).remove()
    })
    // Alejandro please review my code!
    var user = firebase.auth().currentUser;
    await GoogleSignin.revokeAccess();
    await GoogleSignin.signOut();
    this.setState({ user: null }); 
    user.delete().then(function() {
      Actions.Login({userData: null});
      alert("Account has been deleted")
    }, function(error) {
      // An error happened.
    });
  };
 
   componentDidMount(){
       // alert('settings mounted')
   }
 
   componentWillUnmount(){
       // alert('settings unmounted')
   }
 
   //TODO: create all of the functionality and front end for this page
 
   render() {
       return (
           // this is just random filler for the template, but this is where what the user sees is rendered
           <View style={styles.container}>
            <TouchableOpacity onPress={() => this.changeInfo()} activeOpacity={0.7}>
             <View style={styles.profileContainer}>
                <View style ={styles.imageContainer}>
                      <Image
                          source={{ uri: JSON.stringify(this.props.userData['photo']).slice(3,-3)}}
                          style={styles.imageMain}
                      />
                  </View>
                  <View style = {styles.descriptionContainer}>
                      <Text style={styles.regularButton}>{JSON.stringify(this.props.userData['name']).slice(3,-3)}</Text>
                      {/* ONLY FOR TEACHERS <Text style={styles.statusBar}>{JSON.stringify(this.props.userData['location']).slice(3,-3)}</Text> */}
                      <Text style={styles.statusBar}>{capitalize(JSON.stringify(this.props.userData['userType']).slice(1,-1))}</Text>
                      <Text style={styles.statusBar}>{JSON.stringify(this.props.userData['instruments'])}</Text>
                      {/* <Text style={styles.statusBar}>{JSON.stringify(this.props.userData['description']).replace('"','').replace('"','')}</Text> */}
                  </View>
                </View>
            </TouchableOpacity>     
                  <View style = {styles.emptyBlock}>
                  </View>
               <View style={styles.subContainer}>
                  <View style={styles.buttonContainer}>
                   <TouchableOpacity onPress={() => this.goToAboutUsPAge()} activeOpacity={0.7}>
                      <View style={styles.buttonView}>
                        <Text style={styles.regularButton}>About Us</Text>
                      </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.goToFAQPage()} activeOpacity={0.7}>
                    <View style={styles.buttonView}>
                       <Text style={styles.regularButton}>FAQ</Text>
                    </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.goToReportBugsPage()} activeOpacity={0.7}>
                    <View style={styles.buttonView}>
                       <Text style={styles.regularButton}>Report Bugs </Text>
                    </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.goToSuggestFeaturePage()} activeOpacity={0.7}>
                    <View style={styles.buttonView}>
                       <Text style={styles.regularButton}>Suggest Feature </Text>
                    </View>
                   </TouchableOpacity>
                  </View>
               </View>
               <View style = {styles.subContainer2}>
                   <TouchableOpacity onPress={() => this.onPress()} activeOpacity={0.7}>
                    <View style={styles.buttonView}>
                       <Text style={styles.logoutButton}>Log out</Text>
                    </View>
                   </TouchableOpacity>
                   <TouchableOpacity onPress={() => this.onDeletePress()} activeOpacity={0.7}>
                    <View style={styles.buttonView}>
                       <Text style={styles.deleteAccount}>Delete Account</Text>
                    </View>
                   </TouchableOpacity>
               </View>
           </View>
       );
   }
}

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
} 

const locationPretty = (s) => {

  s = s.toLowerCase()
  let array = s.split(' ')
  for (i = 0; i < 2; i++) {
    capitalize(array[i])
  }
  return array.toString()
} 
 
const styles = StyleSheet.create({
 container: {
   flex: 1,
   backgroundColor: '#eee',
   alignItems: 'center',
   justifyContent: 'center'
 },
 logoutButton: {
   margin: 5,
   fontSize: 20,
   color: '#00aced'
 },
 deleteAccount: {
   margin: 5,
   fontSize: 20,
   color: '#a40000'
 },
 regularButton: {
   margin: 5,
   fontSize: 20,
   color: 'black'
 },
 emptyBlock: {
   flex: 1,
 },
 subContainer2: {
   margin: 20,
   flex: 2,
   alignItems: 'center',
   justifyContent: 'center'
 },
 subContainer: {
   flex: 1,
   alignItems: 'center',
   justifyContent: 'center',
   margin: 20,
   flex: 4,
 },
 imageContainer: {
  width: deviceWidth / 4,
  alignItems: "center",
},
imageMain: {
  width: deviceWidth / 4,
  height: deviceWidth / 4,
  borderRadius: 50,
  marginTop: 5
},
statusBar: {
  fontSize: 19,
  color: "grey",
},
profileContainer: {
  alignItems: 'center',
  justifyContent: 'center',
  height: deviceHeight/7,
  width: deviceWidth,
  backgroundColor: 'white',
  flexDirection: 'row',
  borderBottomColor: '#D3D3D3',
  borderBottomWidth: 1,
},
descriptionContainer: {
  alignItems: 'center',
  justifyContent: 'center',
},
buttonView: {
  alignItems: 'center',
  justifyContent: 'center',
  width: deviceWidth,
  height: deviceHeight/20,
  backgroundColor: 'white',
  borderRadius: 10,
  borderColor: 'black',
  margin: 5,
},
buttonContainer:{
  flex: 1,
}
});
 
 
//this lets the component get imported other places
export default SettingsForStudents;

