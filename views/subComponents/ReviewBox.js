import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { Rating } from 'react-native-ratings'

let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class ReviewBox extends React.Component {

    state = {
        reviewerName: this.props.name,
        review: this.props.review,
        starCount: this.props.starCount
    }

    render(){
        return(
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.reviewerName}>{this.state.reviewerName}</Text>
                    <Rating
                        count={5}
                        startingValue={this.state.starCount}
                        style={{paddingRight: 20}}
                        imageSize={18}
                        // onFinishRating={(rating) => this.quickRate(rating)}
                        readonly ={true}
                    />
                </View>
                <View style={styles.description}>
                    <Text>{this.state.review}</Text>
                </View>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        width: deviceWidth-10,
        marginTop: 20,        
        borderWidth: 0.5,
        borderRadius: 10,
        borderColor: 'black',
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 10
    },
    reviewerName: {
        fontSize: 18
    },
    description: {
        width: deviceWidth - 20,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    }
})

export default ReviewBox