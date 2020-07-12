/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-alert */
import React from 'react';
import {
  StyleSheet,
  Text,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
// import {Actions} from 'react-native-router-flux';
import * as firebase from 'firebase';
import SubjectCell from '../subComponents/TableCells/SubjectCell';
import {Actions} from 'react-native-router-flux';

class Register_Subject extends React.Component {
  state = {
    subject: '',
    subjectsList: [],
    input: undefined,
    dbSubjects: [],
  };

  componentDidMount() {
    var subjectsRef = firebase.database().ref('subjects/');
    subjectsRef.once('value').then((dataSnapshot) => {
      var data = dataSnapshot.val();
      var subjectsList = [];
      for (var key in data) {
        const subjectObject = {
          title: data[key],
          selected: false,
          key,
        };
        subjectsList.push(subjectObject);
      }
      this.setState({subjectsList, dbSubjects: data});
    });
  }

  onSubmit = () => {
    var subject;
    var subjectsList = this.state.subjectsList;
    for (var index in subjectsList) {
      if (subjectsList[index].selected === true) {
        subject = subjectsList[index].title;
      }
    }
    if (subject !== undefined) {
      if (this.props.userType === 'teacher') {
        //   this.addSubjectsToDb(subjects);
        Actions.Register_Instrument({
          userType: this.props.userType,
          userInfo: this.props.userInfo,
          subject,
        });
      } else {
        this.registerStudent(subject);
      }
    } else {
      alert('whoops, you have to select a subject!');
    }
  };

  registerStudent = (subject) => {
    var user = firebase.auth().currentUser;
    var db = firebase.database();
    var ref = db.ref(`users/${user.uid}/info/`);
    try {
      ref.set({
        email: user.email,
        uid: user.uid,
        name: user.displayName,
        userType: 'student',
        photo: user.photoURL,
        lessons: [],
        subject,
      });

      const url = `https://musicpro-262117.ue.r.appspot.com/newCustomer/${user.email}/${user.uid}`;
      fetch(url)
        .then((response) => response.json())
        .then((responseData) => {
          const status = responseData.status;
          if (status === 'done') {
            ref
              .once('value')
              .then(function (snapshot) {
                var userData = snapshot.val();
                Actions.StudentMain({userData: userData});
              })
              .catch(function (error) {
                alert(error);
              });
          } else {
            throw 'node server ran into an error';
          }
        })
        .done();
    } catch (error) {
      console.log(error);
      alert('Sorry! There was an error creating your account');
    }
  };

  //   addSubjectsToDb = (userSubjects) => {
  //     var db = firebase.database();
  //     var subjectsRef = db.ref('subjects/');
  //     for (var x in userSubjects) {
  //       if (!this.state.dbSubjects.toString().includes(userSubjects[x].key)) {
  //         subjectsRef.push(userSubjects[x].title);
  //       }
  //     }
  //   };

  //   addSubject = () => {
  //     var subjectsList = this.state.subjectsList;
  //     const subjectObject = {
  //       title: this.state.subject.trim(),
  //       selected: true,
  //     };
  //     subjectsList.push(subjectObject);
  //     this.setState({subjectsList, subject: ''});
  //     this.state.input.clear();
  //   };

  setSelected = (subject) => {
    var subjectsList = this.state.subjectsList;
    subjectsList.forEach(function (subjectInArray) {
      subjectInArray.selected = false;
    });
    const index = subjectsList.indexOf(subject);
    if (!subject.selected) {
      subjectsList[index].selected = true;
    } else {
      subjectsList[index].selected = false;
    }
    this.setState({subjectsList});
  };

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <KeyboardAwareScrollView
        style={{backgroundColor: '#274156'}}
        resetScrollToCoords={{x: 0, y: 0}}
        contentContainerStyle={styles.container}
        scrollEnabled={false}
        keyboardShouldPersistTaps="never">
        <Text style={styles.questionText}>
          {this.props.userType === 'teacher'
            ? 'What general subject do you teach?'
            : 'What subject do you want to learn?'}
        </Text>
        <FlatList
          data={this.state.subjectsList}
          keyExtractor={(item, index) => item.title}
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => (
            <SubjectCell
              selected={item.selected}
              title={item.title}
              onPress={() => this.setSelected(item)}
            />
          )}
          //   ListFooterComponent={
          //     <View style={styles.promptContainer}>
          //       <TextInput
          //         style={styles.textInput}
          //         onChangeText={(text) => this.setState({subject: text})}
          //         placeholder="Other"
          //         textAlign="center"
          //         placeholderTextColor="gray"
          //         ref={(input) => {
          //           this.state.input = input;
          //         }}
          //       />
          //       <TouchableOpacity
          //         style={styles.addTextContainer}
          //         onPress={() => this.addSubject()}>
          //         <Text style={styles.addText}>Add</Text>
          //       </TouchableOpacity>
          //     </View>
          //   }
        />
        <TouchableOpacity onPress={() => this.onSubmit()}>
          <Text style={styles.doneButton}>Done!</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    );
  }
}

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#274156',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  questionText: {
    fontSize: 30,
    paddingTop: 200,
    color: 'white',
    textAlign: 'center',
  },
  flatList: {
    height: deviceHeight / 2,
    width: deviceWidth,
    alignItems: 'center',
    // justifyContent: 'center',
  },
  promptContainer: {
    height: 40,
    backgroundColor: 'white',
    borderRadius: 10,
    width: deviceWidth * 0.8,
    marginTop: 20,
    flexDirection: 'row',
  },
  addTextContainer: {
    // alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 10,
  },
  addText: {
    fontSize: 20,
    color: '#274156',
  },
  textInput: {
    flex: 1,
    color: 'black',
  },
  doneButton: {
    color: 'white',
    fontSize: 20,
    marginBottom: 50,
  },
});

//this lets the component get imported other places
export default Register_Subject;
