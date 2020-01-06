import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'


class InstrumentTag extends React.Component{

    state = {
        instrument: this.props.instrument
    }

    render(){
        return(
            <TouchableOpacity onPress={() => this.props.onPress()}>
                <View style={styles.container}>
                    <Text style={styles.text}>{this.state.instrument}</Text>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 5,
    },
    text: {
        color: 'white',
        padding: 5
    }
});

export default InstrumentTag;