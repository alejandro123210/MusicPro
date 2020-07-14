import {Share, Platform} from 'react-native';

export const share = (userData) => {
  userData.userType === 'teacher' ? shareProfile(userData) : shareApp();
};

//if a teacher shares the app
const shareProfile = (userData) => {
  const url = `https://rehearse-c7c14.firebaseapp.com/DeepLink/${userData.uid}`;
  const message =
    Platform.OS === 'android'
      ? `I'm singed up with MusicPro! Find my profile here: ${url}`
      : "I'm singed up with MusicPro! Find my profile here: ";
  Share.share({
    message,
    title: 'MusicPro',
    //iOS only
    url,
  });
};

//if a student shares the app
const shareApp = () => {
  const url = 'https://rehearse-c7c14.firebaseapp.com/DeepLink/1';
  const message =
    Platform.OS === 'android'
      ? `I'm singed up with MusicPro! Find local music teachers here: ${url}`
      : "I'm singed up with MusicPro! Find local music techers here: ";
  Share.share({
    message,
    title: 'MusicPro',
    //iOS only
    url,
  });
};
