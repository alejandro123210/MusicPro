import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import TopBar from '../subComponents/TopBar';
import * as firebase from 'firebase';
import LessonCell from '../subComponents/TableCells/LessonCell';
import {Actions} from 'react-native-router-flux';

class SendPayment extends React.Component {
  state = {
    userData: this.props.userData,
    paymentInfo: this.props.paymentInfo,
    lessonsData: [],
    lessons: [],
    cardInfo: {},
  };

  componentDidMount() {
    this.loadPayments();
  }

  loadPayments() {
    var db = firebase.database();
    var ref = db.ref(`users/${this.state.userData.uid}/info/paymentsDue`);
    ref.once('value').then((snapshot) => {
      if (snapshot.exists()) {
        const lessonsData = snapshot.val();
        this.setState({lessonsData});
        var lessons = [];
        var index = 0;
        for (var key in lessonsData) {
          //we get set the index so we can remove the payment due in the front end
          lessonsData[key].indexOfLesson = index;
          //we get the actual key of the lesson so we can remove it from the db
          lessonsData[key].lessonKey = key;
          index += 1;
          lessons.push(lessonsData[key]);
        }
        this.setState({lessons});
      } else {
        Actions.StudentDash({userData: this.state.userData});
      }
    });
  }

  removePaymentDue(lessons, lessonKey) {
    this.setState({lessons});
    var db = firebase.database();
    db.ref(
      `users/${this.state.userData.uid}/info/paymentsDue/${lessonKey}`,
    ).remove();
    //we do this just in case, though will probably need to be changed
    this.loadPayments();
  }

  sendIntent = async ({
    customerID,
    vendorID,
    amount,
    indexOfLesson,
    lessonKey,
  }) => {
    if (this.state.userData.cards !== null) {
      var actualAmount = `${amount}00`;
      const newPaymentUrl = `http://localhost:5000/newPayment/${customerID}/${vendorID}/${actualAmount}`;
      fetch(newPaymentUrl)
        .then((response) => response.json())
        .then((responseData) => {
          const {paymentMethods, paymentToken} = responseData;
          console.log(paymentToken);
          var cards = [];
          for (var index in paymentMethods.data) {
            const paymentMethod = paymentMethods.data[index];
            const card = {
              paymentID: paymentMethod.id,
              last4: paymentMethod.card.last4,
            };
            cards.push(card);
          }
          const confirmPaymentUrl = `http://localhost:5000/confirm/${paymentToken}/${cards[0].paymentID}`;
          fetch(confirmPaymentUrl)
            .then((response) => response.json())
            .then((confirmData) => {
              console.log(confirmData);
              var lessons = this.state.lessons;
              lessons.splice(indexOfLesson, 1);
              this.removePaymentDue(lessons, lessonKey);
            })
            .catch((error) => console.log(error));
        })
        .catch((error) => console.log(error));
    } else {
      console.log('create card');
    }
  };

  render() {
    return (
      <View>
        <TopBar
          userData={this.state.userData}
          showDateBar={false}
          page="Send Payment"
        />
        <FlatList
          data={this.state.lessons}
          contentContainerStyle={styles.container}
          keyExtractor={(item, index) => item.studentLessonKey}
          renderItem={({item}) => (
            <LessonCell
              name={item.teacherName}
              image={item.teacherImage}
              time={item.time}
              date={item.date}
              instruments={item.instruments}
              onCancelPressed={() => this.sendIntent(item)}
              userType={'student'}
              request={false}
              payment
              lessonLength={item.lessonLength}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  titleText: {
    fontSize: 25,
  },
});

export default SendPayment;
