import React from 'react';
import { Text, View, StyleSheet, Image, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Actions } from 'react-native-router-flux';


let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

//required props: 
//name
//imageURL

class ProfileBar extends React.Component {

    onPress = () => {
        console.log(this.props.userData['name'])
        {if (this.props.userData['userType'] == 'student'){
            Actions.SettingsForStudents({userData: this.props.userData});
        }
        else{
            Actions.SettingsForTeachers({userData: this.props.userData});
        }}
    }

    render(){
        return(
            <View style={styles.topBar}>
              <View style={styles.imageContainer}>
                <Image
                  source={{ uri: this.props.image }}
                  style={styles.imageMain}
                />
              </View>
              <View style={styles.nameContainer}>
                <Text style={styles.profileText}>{this.props.name}</Text>
                <TouchableOpacity onPress={() => this.onPress()}>
                    <Text style={styles.settingsText}>Settings</Text>
                </TouchableOpacity>
              </View>
            </View>
        );
    }
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
    }
})

export default ProfileBar;