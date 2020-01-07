import React from 'react'
import { View, StyleSheet, Dimensions, Image, Text, ScrollView, TouchableOpacity } from 'react-native'
import * as firebase from 'firebase'
import InstrumentTag from './subComponents/instrumentTag';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { Actions } from 'react-native-router-flux'
import ReviewBox from './subComponents/ReviewBox';



let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;


class TeacherInfo extends React.Component {

    state = {
        teacher: this.props.teacher,
        userData: this.props.userData,
        allTeacherData: {
            name: '',
            location: '',
            description: '',
            instruments: [],
            photo: this.props.teacher['photo'],
            uid: '',
            reviewRating: 5,
            reviews: []
        },
    }

    componentDidMount(){
        //here I load in all the teachers data from firebase
        //it seems more efficient than loading in every teacher and all their reviews in the previous screen
        var db = firebase.database()
        var ref = db.ref(`users/${this.state.teacher['uid']}/info`)
        ref.once("value")
        .then((snapshot) => {
            var teacherData = JSON.parse(JSON.stringify(snapshot.val()))
            var reviews = []
            var reviewStars = []
            var averageStars = 5
            if(teacherData['reviews'] != null){
                for(review in teacherData['reviews']){
                    reviews.push(teacherData['reviews'][review])
                    reviewStars.push(teacherData['reviews'][review]['starCount'])
                }
            }
            const arrAvg = arr => arr.reduce((a,b) => a + b, 0) / arr.length
            if (reviewStars.length != 0){
                averageStars = arrAvg(reviewStars)
            }
            let allTeacherData = {
                name: teacherData['name'].slice(1, -1),
                location: teacherData['location'],
                description: teacherData['description'],
                instruments: teacherData['instruments'],
                photo: teacherData['photo'].slice(1, -1),
                uid: teacherData['uid'],
                reviewRating: averageStars,
                reviews: reviews
            }
            this.setState({ allTeacherData })
        })

    }

    onBookPressed = () => {
        Actions.CalendarForStudents({
            userData: this.props.userData,
            teacher: this.state.teacher
        });
    }
    
    onLeaveReviewPressed = () => {
        Actions.ReviewTeacher({
            userData: this.props.userData,
            teacher: this.state.teacher
        })
    }

    // quickRate = (rating) => {
    //     console.log(rating)
    // }

    render(){
        return(
            <ScrollView contentContainerStyle={styles.container} backgroundColor='white' bounces={false}>
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: this.state.allTeacherData.photo }}
                        style={styles.imageMain}
                    />
                </View>
                <Text style={styles.nameText}>{this.state.allTeacherData.name}</Text>
                <Rating 
                    count={5}
                    startingValue={this.state.allTeacherData.reviewRating}
                    style={{padding: 10}}
                    imageSize={30}
                    // onFinishRating={(rating) => this.quickRate(rating)}
                    readonly ={true}
                />
                <Text style={styles.descriptionText}>{this.state.allTeacherData.description}</Text>
                <View style={styles.grid}>
                    {this.state.allTeacherData.instruments.map(instrument => (
                        <InstrumentTag
                            instrument={instrument}
                            onPress={() => {}}
                            colorOfCell = '#274156'
                        />
                    ))}
                </View>
                <TouchableOpacity onPress={() => this.onBookPressed()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Book a lesson</Text> 
                </TouchableOpacity> 
                <TouchableOpacity onPress={() => this.onLeaveReviewPressed()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>Leave a Review</Text>
                </TouchableOpacity>
                <View style={styles.reviewsTitleContainer}>
                    <Text style={styles.reviewsTitleText}> Reviews: </Text>
                </View>
                <View style={styles.writtenReviewContainer}>
                    {this.state.allTeacherData.reviews.map(review => (
                        <ReviewBox
                            name = {review.name}
                            review = {review.description}
                            starCount = {review.starCount}
                        />
                    ))}
                </View> 
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
        // justifyContent: 'center',
    },
    imageContainer: {
        width: deviceWidth / 3,
        alignItems: "center",
        paddingTop: 20
    },
    imageMain: {
        width: deviceWidth / 3,
        height: deviceWidth / 3,
        borderRadius: 100,
        marginTop: 5
    },
    nameText: {
        fontSize: 20,
        paddingTop: 20
    },
    descriptionText: {
        padding: 20,
        textAlign: 'center'
    },
    grid: {
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: 10,
    },
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        margin: 10,
        borderTopWidth: 0.3,
        borderBottomWidth: 0.3,
        borderBottomColor: 'gray',
        height: 50,
        width: deviceWidth,
        backgroundColor: '#274156'
        
    },
    buttonText: {
        fontSize: 20,
        color: 'white'
    },
    reviewsTitleContainer: {
        flexDirection: 'row',
        width: deviceWidth - 10,
        marginTop: 40,
        borderBottomColor: 'black',
        borderBottomWidth: 0.3
    },
    reviewsTitleText: {
        flex: 1,
        fontSize: 20,
        paddingLeft: 10
    },
    writtenReviewContainer: {
        width: deviceWidth,
        alignItems: 'center',
        paddingBottom: 40
    }
})

export default TeacherInfo;