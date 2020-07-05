import React from 'react';
import WebView from 'react-native-webview';
import {View, Text, StyleSheet} from 'react-native';

const PaymentsScreen = ({userData, stripeSet}) => {
  if (stripeSet === false) {
    return (
      <WebView
        source={{
          uri: `https://connect.stripe.com/express/oauth/authorize?redirect_uri=http://192.168.1.22:3000&client_id=ca_HZ3p251sXcEdATcBE31h47C5yYEt0hfy&state=${userData.uid}&suggested_capabilities[]=transfers&stripe_user[email]=${userData.email}&stripe_user[business_type]=individual`,
        }}
      />
    );
  } else {
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
