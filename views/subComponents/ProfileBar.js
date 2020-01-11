import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

function profileBar({userData}){

    var name = userData['name']
    var photo = userData['photo']
    
    onMessagesPressed = () => {
        Actions.ChatsList({userData})
    }

    onSettingsPressed = () => {
        if (userData['userType'] == 'student'){
            Actions.SettingsForStudents({userData: userData});
        }
        else{
            Actions.SettingsForTeachers({userData: userData});
        }
    }

    return(
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.imageContainer} onPress={() => onSettingsPressed()}>
            <Image
              source={{ uri: photo }}
              style={styles.imageMain}
            />
          </TouchableOpacity>
          <View style={styles.nameContainer}>
            <Text style={styles.profileText}>{name}</Text>
            <TouchableOpacity onPress={() => onMessagesPressed()}>
                {/* <Text style={styles.settingsText}>Settings</Text> */}
                <Image source={require('../Assets/message.png')} style={styles.messagingIcon}/>
            </TouchableOpacity>
          </View>
        </View>
    );
}

const styles = StyleSheet.create({
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        height: deviceHeight / 6,
        width: deviceWidth,
        backgroundColor: "white",
        borderBottomWidth: 0.3,
        borderBottomColor: "grey",
        marginTop: Platform.OS === 'ios'? 10 : 0
    },
    imageContainer: {
        width: deviceWidth / 4,
        alignItems: "center",
    },
    imageMain: {
        width: deviceWidth / 5,
        height: deviceWidth / 5,
        borderRadius: 50,
        marginTop: 5
    },
    nameContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    profileText: {
        fontSize: 18,
        color: "#2c2828",
        fontFamily: "HelveticaNeue-Medium",
        marginTop: 5
    },
    settingsText: {
        paddingRight: 8,
        marginTop: 5,
        fontSize: 18
    },
    messagingIcon: {
        height: 25,
        width: 25,
        marginTop: 5,
        marginRight: 15
    }
})

export default profileBar;