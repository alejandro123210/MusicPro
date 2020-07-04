/* eslint-disable no-alert */
import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import TopBar from '../subComponents/TopBar';
import stripe from 'tipsi-stripe';
import TeacherCell from '../subComponents/TableCells/TeacherCell';
import * as firebase from 'firebase';
import {CreditCardInput} from 'react-native-credit-card-input';

class SendPayment extends React.Component {
  state = {
    userData: this.props.userData,
    paymentInfo: this.props.paymentInfo,
    teacher: {},
    cardInfo: {},
  };

  componentDidMount() {
    var db = firebase.database();
    var ref = db.ref(`users/XVPbjnyjDBULxFQpOwrDM01dwfh1/info`);
    ref.once('value').then((snapshot) => {
      const teacher = snapshot.val();
      this.setState({teacher});
    });
  }

  setCardInfo = (cardInfo) => {
    this.setState({cardInfo});
  };

  sendIntent = async () => {
    try {
      const token = await stripe.paymentRequestWithCardForm({
        // Only iOS support this options
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: 'Enappd Store',
            line1: 'Canary Place',
            line2: '3',
            city: 'Macon',
            state: '',
            country: 'Estonia',
            postalCode: '31217',
            email: 'admin@enappd.com',
          },
        },
      });
      const params = {
        type: 'card',
        amount: 6000,
        currency: 'usd',
        card: token.card.cardId.toString(),
        numer: token.card.cardId.toString(),
        returnURL: 'musicpro://home',
      };
      const source = await stripe.createSourceWithParams(params);
      console.log(source);
      const http = new XMLHttpRequest();
      const amount = 6000;
      const url = `http://localhost:5000/newPayment?token=${source}?vendorID=${this.state.teacher.stripeID}?amount=${amount}`;
      http.open('get', url);
      http.send();
      http.onreadystatechange = () => {
        console.log(http.response.text);
      };
    } catch (error) {
      alert(error);
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
        <ScrollView contentContainerStyle={styles.container}>
          {/* <CreditCardInput onChange={(cardInfo) => setCardInfo(cardInfo)} />
          <TouchableOpacity>
            <Text>Hello world</Text>
          </TouchableOpacity> */}
          <TeacherCell
            image={this.state.teacher.photo}
            name={this.state.teacher.name}
            instruments={this.state.teacher.instruments}
            avgStars={
              this.state.teacher.avgStars !== undefined
                ? this.state.teacher.avgStars.avgRating
                : 0
            }
            numberOfReviews={
              this.state.teacher.avgStars !== undefined
                ? this.state.teacher.avgStars.numberOfReviews
                : 0
            }
            location={this.state.teacher.location}
            price={this.state.teacher.price}
            onPress={() => this.sendIntent()}
            onBookPressed={() => this.sendIntent()}
            uid={this.state.teacher.uid}
            distance={null}
            type={'pay'}
          />
          <View />
        </ScrollView>
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
