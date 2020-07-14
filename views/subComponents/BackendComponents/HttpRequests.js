import stripe from 'tipsi-stripe';

//adds a card to stripe acc, then returns list of all cards
export const newCard = async (userData, token) => {
  const newCardUrl = `https://musicpro-262117.ue.r.appspot.com/newCard/${userData.stripeID}/${token.tokenId}/`;
  const cardsList = await fetch(newCardUrl)
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
          //card object it returns
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
        return cardsData;
      } else {
        return 'error';
      }
    })
    .catch((error) => {
      return 'error';
    });
  return cardsList;
};

//this brings up that UI for cards and returns the card token
export const getCardToken = async (userData) => {
  return stripe.paymentRequestWithCardForm({
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
};

export const getLoginLink = (userData) => {
  const updateVendorURL = `https://musicpro-262117.ue.r.appspot.com/updateVendor/${userData.stripeID}`;
  return fetch(updateVendorURL)
    .then((response) => response.json())
    .then((responseData) => {
      console.log(responseData);
      return responseData.url;
    })
    .catch((error) => {
      return error;
    });
};

export const newPaymentIntent = async (lesson) => {
  const {amount, customerID, vendorID} = lesson;
  var actualAmount = `${amount}00`;
  const newPaymentUrl = `https://musicpro-262117.ue.r.appspot.com/newPayment/${customerID}/${vendorID}/${actualAmount}`;
  const paymentToken = await fetch(newPaymentUrl)
    .then((response) => response.json())
    .then((responseData) => {
      return responseData;
    })
    .catch((error) => {
      return error;
    });
  return paymentToken;
};

export const confirmPayment = async (paymentToken, paymentID) => {
  const confirmPaymentUrl = `https://musicpro-262117.ue.r.appspot.com/confirm/${paymentToken}/${paymentID}`;
  const status = await fetch(confirmPaymentUrl)
    .then((response) => response.json())
    .then((confirmData) => {
      console.log(confirmData);
      return 'done';
    })
    .catch((error) => {
      return 'error';
    });
  return status;
};

export const newCustomer = async (email, uid) => {
  const url = `https://musicpro-262117.ue.r.appspot.com/newCustomer/${email}/${uid}`;
  const status = await fetch(url)
    .then((response) => response.json())
    .then((responseData) => {
      const requestStatus = responseData.status;
      return requestStatus;
    })
    .catch((error) => {
      return 'error';
    });
  return status;
};

export const loadPaymentMethods = async (userData) => {
  console.log('loading payment methods');
  const paymentMethodsURL = `https://musicpro-262117.ue.r.appspot.com/getCustomer/${userData.stripeID}`;
  const data = await fetch(paymentMethodsURL)
    .then((response) => response.json())
    .then((responseData) => {
      const paymentMethods = responseData.cardInfo.data;
      const defaultCard = responseData.default;
      var cards = [];
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
        cards.push(card);
      }
      return cards;
    });
  return data;
};
