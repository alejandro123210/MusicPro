import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {View, StyleSheet, FlatList} from 'react-native';
import stripe from 'tipsi-stripe';
import CardCell from '../subComponents/TableCells/CardCell';
import GLOBAL from '../Global';
import AwesomeAlert from 'react-native-awesome-alerts';

const PaymentsScreen = ({userData, stripeSet, cards, setSelected}) => {
  const [, forceUpdate] = useState();
  const [errorAlert, showError] = useState(false);
  const [customAlert, showAlert] = useState(false);
  const [cardsList, setCardsList] = useState(cards);
  const [loginLink, setLoginLink] = useState();
  const createCard = async () => {
    try {
      showError(false);
      showAlert(true);
      const token = await stripe.paymentRequestWithCardForm({
        smsAutofillDisabled: true,
        requiredBillingAddressFields: 'full',
        prefilledInformation: {
          billingAddress: {
            name: userData.name,
            line1: '',
            line2: '',
            city: '',
            state: '',
            country: '',
            postalCode: '',
            email: userData.email,
          },
        },
      });
      console.log(token);
      const newCardUrl = `https://musicpro-262117.ue.r.appspot.com/newCard/${userData.stripeID}/${token.tokenId}/${userData.uid}`;
      fetch(newCardUrl)
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData.code);
          if (responseData.code !== 'card_declined') {
            const paymentMethods = responseData.cardInfo.data;
            const defaultCard = responseData.default;
            var cardsData = [];
            console.log('stripe data: ');
            console.log(paymentMethods, defaultCard);
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
            // if it's the first payment method added
            if (cardsData.length === 1) {
              GLOBAL.SendPayment.setState({
                buttonText: `${cardsData[0].brand} ending in ${cardsData[0].last4}`,
                selectedCard: cardsData[0],
                cards: cardsData,
              });
            }
            console.log('local Array: ');
            console.log(cardsData);
            setCardsList(cardsData);
            showAlert(false);
          } else {
            // showAlert(false);
            showError(true);
            // alert('there was a problem with verifying your card');
          }
        })
        .catch((error) => {
          showError(true);
        });
      // loadMethods();
    } catch (error) {
      showError(true);
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
          uri:
            'https://connect.stripe.com/express/oauth/authorize?' +
            'redirect_uri=https://rehearse-c7c14.firebaseapp.com/&' +
            'client_id=ca_HZ3p251sXcEdATcBE31h47C5yYEt0hfy&' +
            `state=${userData.uid}&` +
            'suggested_capabilities[]=transfers&' +
            `stripe_user[email]=${userData.email}&` +
            'stripe_user[business_type]=individual&' +
            `stripe_user[url]=https://rehearse-c7c14.firebaseapp.com/DeepLink/${userData.uid}`,
        }}
      />
    );
  } else if (stripeSet && userData.userType === 'teacher') {
    const updateVendorURL = `https://musicpro-262117.ue.r.appspot.com/updateVendor/${userData.stripeID}`;
    //use if statement to prevent constant rerenders/server pings
    if (loginLink === undefined) {
      fetch(updateVendorURL)
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          setLoginLink(responseData.url);
        });
    }
    return (
      <WebView
        source={{
          uri: loginLink,
        }}
      />
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
          show={customAlert}
          showProgress={!errorAlert}
          title="Adding Card..."
          message={
            errorAlert ? 'there was a problem verifying your card.' : undefined
          }
          closeOnTouchOutside={errorAlert}
          closeOnHardwareBackPress={false}
          contentContainerStyle={styles.alert}
          confirmButtonColor="#274156"
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
