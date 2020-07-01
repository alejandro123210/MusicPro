import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {CreditCardInput} from 'react-native-credit-card-input';

const PaymentsScreen = ({userData}) => {
  const [cardInfo, setCardInfo] = useState();

  const submitPressed = () => {
    Keyboard.dismiss();
    console.log(cardInfo);
  };

  return (
    <FlatList
      data={userData.cards}
      keyExtractor={(item, index) => item.number}
      renderItem={({item}) => <Text>{item}</Text>}
      ListEmptyComponent={
        <View style={styles.container}>
          <View style={styles.spacer} />
          <CreditCardInput onChange={(info) => setCardInfo(info)} />
          <TouchableOpacity onPress={() => submitPressed()}>
            <Text>Submit</Text>
          </TouchableOpacity>
        </View>
      }
    />
  );
};

export default PaymentsScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  spacer: {
    height: 30,
  },
});
