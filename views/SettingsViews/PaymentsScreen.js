import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import stripe from 'tipsi-stripe';
import CardCell from '../subComponents/CardCell';
import GLOBAL from '../Global';
import AwesomeAlert from 'react-native-awesome-alerts';

const PaymentsScreen = ({userData, stripeSet, cards, setSelected}) => {
  const [, forceUpdate] = useState();
  const [alert, showAlert] = useState(false);
  const [cardsList, setCardsList] = useState(cards);
  const createCard = async () => {
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
    const newCardUrl = `http://localhost:5000/newCard/${userData.stripeID}/${token.tokenId}/${userData.uid}`;
    showAlert(true);
    try {
      fetch(newCardUrl)
        .then((response) => response.json())
        .then((responseData) => {
          const paymentMethods = responseData.cardInfo.data;
          const defaultCard = responseData.default;
          var cardsData = [];
          for (var index in paymentMethods) {
            const paymentMethod = paymentMethods[index];
            const card = {
              paymentID: paymentMethod.id,
              last4: paymentMethod.last4,
              brand: paymentMethod.brand,
              expMonth: paymentMethod.exp_month,
              expYear: paymentMethod.exp_year,
              active: paymentMethod.id === defaultCard ? true : false,
            };
            cardsData.push(card);
          }
          setCardsList(cardsData);
          showAlert(false);
        });
      // loadMethods();
    } catch (error) {
      showAlert(false);
      console.log(error);
    }
  };

  const selectMethod = (card) => {
    var thisCardsList = cardsList;
    for (var index in cardsList) {
      if (cardsList[index].active) {
        cardsList[index].active = false;
      }
      if (cardsList[index].paymentID === card.paymentID) {
        thisCardsList[index].active = true;
        GLOBAL.SendPayment.setState({
          buttonText: `${thisCardsList[index].brand} ending in ${thisCardsList[index].last4}`,
          selectedCard: thisCardsList[index],
        });
      }
      setCardsList(thisCardsList);
      forceUpdate({});
    }
  };

  if (!stripeSet && userData.userType === 'teacher') {
    return (
      <WebView
        source={{
          uri: `https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://192.168.1.22:3000&client_id=ca_HZ3p251sXcEdATcBE31h47C5yYEt0hfy&state=${userData.uid}&suggested_capabilities[]=transfers&stripe_user[email]=${userData.email}&stripe_user[business_type]=individual`,
        }}
      />
    );
  } else if (stripeSet && userData.userType === 'teacher') {
    //TODO: edit stripe acc
    return (
      <View style={styles.container}>
        <Text>done</Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.flatlist}
          scrollEnabled={false}
          data={cardsList}
          keyExtractor={(item, index) => item.paymentID}
          renderItem={({item}) => (
            <CardCell
              card={item}
              onPress={() => selectMethod(item)}
              active={item.active}
            />
          )}
        />
        <CardCell onPress={() => createCard()} />

        <AwesomeAlert
          show={alert}
          showProgress={true}
          title="Adding Card..."
          // message={this.state.alertText}
          closeOnTouchOutside={false}
          closeOnHardwareBackPress={false}
          // showCancelButton={true}
          // showConfirmButton={true}
          // cancelText="No, cancel"
          // confirmText="Confirm"
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
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  flatlist: {
    alignItems: 'center',
    flex: 1,
  },
});
