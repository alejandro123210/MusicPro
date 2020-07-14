import React, {useState} from 'react';
import WebView from 'react-native-webview';
import {View, StyleSheet, FlatList, Platform} from 'react-native';
import CardCell from '../subComponents/TableCells/CardCell';
import GLOBAL from '../Global';
import AwesomeAlert from 'react-native-awesome-alerts';
import {
  newCard,
  getCardToken,
  getLoginLink,
} from '../subComponents/BackendComponents/HttpRequests';

const PaymentsScreen = ({userData, stripeSet, cards, inPayment}) => {
  const [, forceUpdate] = useState();
  const [errorAlert, showError] = useState(false);
  const [customAlert, showAlert] = useState(false);
  const [cardsList, setCardsList] = useState(cards);
  const [loginLink, setLoginLink] = useState();
  const createCard = async () => {
    try {
      showError(false);
      showAlert(true);
      const token = await getCardToken(userData);
      const listOfCards = await newCard(userData, token);
      if (listOfCards !== 'error') {
        if (inPayment) {
          if (listOfCards.length === 1) {
            GLOBAL.SendPayment.setState({
              buttonText: `${listOfCards[0].brand} ending in ${listOfCards[0].last4}`,
              selectedCard: listOfCards[0],
              cards: listOfCards,
            });
          }
        }
        console.log('local Array: ');
        console.log(listOfCards);
        setCardsList(listOfCards);
        showAlert(false);
      } else {
        showError(true);
      }
    } catch (error) {
      showError(true);
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
        if (inPayment) {
          GLOBAL.SendPayment.setState({
            buttonText: `${thisCardsList[index].brand} ending in ${thisCardsList[index].last4}`,
            selectedCard: thisCardsList[index],
          });
        }
      }
      setCardsList(thisCardsList);
      forceUpdate({});
    }
  };

  const requestLink = async () => {
    const link = await getLoginLink(userData);
    setLoginLink(link);
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
    //use if statement to prevent constant rerenders/server pings
    if (loginLink === undefined) {
      requestLink();
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
          show={Platform.OS === 'ios' ? customAlert : false}
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
    backgroundColor: Platform.OS === 'android' ? '#f5f5f5' : 'white',
  },
  flatlist: {
    alignItems: 'center',
    flex: 1,
  },
});
