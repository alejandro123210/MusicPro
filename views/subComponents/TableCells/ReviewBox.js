import React from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { Rating } from 'react-native-ratings'

let deviceWidth = Dimensions.get("window").width;

function reviewBox({name, review, starCount }){
    return(
        <View style={styles.shadow}>
            <View style={styles.container}>
                <View style={styles.title}>
                    <Text style={styles.reviewerName}>{name}</Text>
                    <Rating
                        count={5}
                        startingValue={starCount}
                        style={{paddingRight: 20}}
                        imageSize={18}
                        // onFinishRating={(rating) => this.quickRate(rating)}
                        readonly ={true}
                    />
                </View>
                <View style={styles.description}>
                    <Text>{review}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    shadow: {
        shadowColor: 'gray',
        shadowOffset: {width: 0, height: 0.3},
        shadowOpacity: 0.4,
        shadowRadius: 10,
        width: deviceWidth,
        alignItems: 'center'
    },
    container: {
        width: deviceWidth-20,
        marginTop: 20,        
        borderRadius: 10,
        backgroundColor: 'white'
    },
    title: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 20,
        paddingTop: 10
    },
    reviewerName: {
        fontSize: 18,
    },
    description: {
        width: deviceWidth - 20,
        padding: 10
    }
})

export default reviewBox