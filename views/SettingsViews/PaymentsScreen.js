import React from 'react';
import WebView from 'react-native-webview';
import {View, Text, StyleSheet} from 'react-native';
import stripe from 'tipsi-stripe';

const PaymentsScreen = ({userData, stripeSet}) => {
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
    const url = `http://localhost:5000/newCard/${userData.stripeID}/${token.tokenId}/${userData.uid}`;
    console.log(token);
    try {
      fetch(url).done();
    } catch (error) {
      console.log(error);
    }
  };

  if (stripeSet === false) {
    return (
      <WebView
        source={{
          uri: `https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://192.168.1.22:3000&client_id=ca_HZ3p251sXcEdATcBE31h47C5yYEt0hfy&state=${userData.uid}&suggested_capabilities[]=transfers&stripe_user[email]=${userData.email}&stripe_user[business_type]=individual`,
        }}
      />
    );
  } else if (stripeSet && userData.userType === 'student') {
    createCard();
    return (
      <View style={styles.container}>
        <Text>done</Text>
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
});
