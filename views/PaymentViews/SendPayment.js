import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Text,
  Platform,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import TopBar from '../subComponents/TopBar';
import * as firebase from 'firebase';
import LessonCell from '../subComponents/TableCells/LessonCell';
import {Actions} from 'react-native-router-flux';
import AwesomeAlert from 'react-native-awesome-alerts';
import {loadPaymentMethods} from '../subComponents/BackendComponents/HttpRequests';
import GLOBAL from '../Global';
import {
  newPaymentIntent,
  confirmPayment,
} from '../subComponents/BackendComponents/HttpRequests';

class SendPayment extends React.Component {
  state = {
    userData: this.props.userData,
    paymentInfo: this.props.paymentInfo,
    lessonsData: [],
    lessons: [],
    cardInfo: {},
    showAlert: false,
    showLoading: false,
    showError: false,
    showPopup: false,
    buttonText: 'Add Card',

    alertText: '',
    paymentToken: undefined,
    cards: undefined,
    selectedCard: undefined,
    indexOfLesson: undefined,
    lessonKey: undefined,
  };

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    GLOBAL.SendPayment = this;
    this.loadPayments();
    this.loadMethods();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    ToastAndroid.show('Back button is disabled', ToastAndroid.SHORT);
    return true;
  }

  loadMethods = async () => {
    const paymentMethods = await loadPaymentMethods(this.state.userData);
    const cards = paymentMethods;
    this.setState({cards});
    for (var index in cards) {
      if (cards[index].active === true) {
        this.setState({
          buttonText: `${cards[index].brand} ending in ${cards[index].last4}`,
          selectedCard: cards[index],
        });
        break;
      }
    }
  };

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
        Actions.StudentMain({userData: this.state.userData});
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

  confirmPayment = async () => {
    this.setState({showLoading: true});
    const status = await confirmPayment(
      this.state.paymentToken,
      this.state.selectedCard,
    );
    if (status !== 'error') {
      var lessons = this.state.lessons;
      lessons.splice(this.state.indexOfLesson, 1);
      this.removePaymentDue(lessons, this.state.lessonKey);
      this.setState({showAlert: false, showLoading: false});
    } else {
      this.setState({showError: true});
    }
  };

  showAlert = (paymentToken, indexOfLesson, lessonKey, amount) => {
    const actualAmount = (amount * 1.05).toFixed(2);
    this.setState({
      paymentToken,
      indexOfLesson,
      lessonKey,
      alertText: `Pay $${actualAmount} with ${this.state.selectedCard.brand} ending in ${this.state.selectedCard.last4}?`,
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  sendIntent = async (lesson) => {
    if (this.state.selectedCard === undefined) {
      Actions.PaymentsScreen({userData: this.state.userData, inPayment: true});
    } else {
      const {indexOfLesson, lessonKey, amount} = lesson;
      this.setState({showAlert: true});
      if (this.state.userData.cards !== null) {
        const paymentToken = await newPaymentIntent(lesson);
        this.showAlert(paymentToken, indexOfLesson, lessonKey, amount);
      } else {
        console.log('create card');
      }
    }
  };

  onPaymentMethodsPressed = () => {
    Actions.PaymentsScreen({
      userData: this.state.userData,
      cards: this.state.cards,
      inPayment: true,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <TopBar
          userData={this.state.userData}
          showDateBar={false}
          page="Send Payment"
        />
        <FlatList
          data={this.state.lessons}
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
              amount={(item.amount * 1.05).toFixed(2)}
            />
          )}
        />
        <View style={styles.popup}>
          <TouchableOpacity
            style={styles.buttonContainer}
            activeOpacity={0.7}
            onPress={() => this.onPaymentMethodsPressed()}>
            <Text style={styles.buttonText}>{this.state.buttonText}</Text>
          </TouchableOpacity>
        </View>

        <AwesomeAlert
          show={this.state.showAlert}
          showProgress={this.state.showLoading}
          title={this.state.showError ? 'Error' : 'Confirm Payment'}
          message={
            this.state.showError
              ? 'Sorry, there was an error processing your payment...'
              : this.state.alertText
          }
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          showCancelButton={true}
          showConfirmButton={true}
          cancelText="No, cancel"
          confirmText="Confirm"
          contentContainerStyle={styles.alert}
          confirmButtonColor="#274156"
          onCancelPressed={() => {
            this.hideAlert();
          }}
          onConfirmPressed={() => {
            this.confirmPayment();
          }}
        />
      </View>
    );
  }
}

const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    height: deviceHeight,
    backgroundColor: Platform.OS === 'android' ? '#f5f5f5' : 'white',
  },
  alert: {
    borderRadius: 10,
  },
  popup: {
    height: 100,
    borderTopWidth: 0.3,
    borderTopColor: 'gray',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    height: 50,
    width: deviceWidth - 20,
    backgroundColor: '#274156',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 20,
    color: 'white',
    paddingBottom: 2,
  },
  cardList: {
    paddingTop: 20,
    alignItems: 'center',
  },
});

export default SendPayment;
