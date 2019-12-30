import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

//required props: 
//name
//imageURL

const profileBar = props => {

    onPress = () => {
        {if ( ( JSON.stringify(props.userData['userType']).slice(1,-1) ) == 'student'){
            Actions.SettingsForStudents({userData: props.userData});
        }
        else{
            console.log(JSON.stringify(props.userData['userType']).slice(1,-1))
            Actions.SettingsForTeachers({userData: props.userData});
        }}
    }


    return(
        <View style={styles.topBar}>
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: props.image }}
              style={styles.imageMain}
            />
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.profileText}>{props.name}</Text>
            <TouchableOpacity onPress={() => this.onPress()}>
                <Text style={styles.settingsText}>Settings</Text>
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
        marginTop: 10
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
    }
})

export default profileBar;