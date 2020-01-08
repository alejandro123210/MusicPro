import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'


class InstrumentTag extends React.Component{

    state = {
        instrument: this.props.instrument,
        colorOfCell: this.props.colorOfCell,
        active: this.props.active
    }

    render(){
        return(
            <View>
                {this.state.active?
                    <TouchableOpacity onPress={() => this.props.onPress()}>
                        <View style={[styles.container, {borderColor: this.state.colorOfCell}]}>
                            <Text style={[styles.text, {color: this.state.colorOfCell}]}>{this.state.instrument}</Text>
                        </View>
                    </TouchableOpacity>
                :
                    <View style={[styles.container, {borderColor: this.state.colorOfCell}]}>
                        <Text style={[styles.text, {color: this.state.colorOfCell}]}>{this.state.instrument}</Text>
                    </View>
                }
            </View>
            
        )
    }
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 1,
        borderRadius: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 5,
    },
    text: {
        padding: 5
    }
});

export default InstrumentTag;