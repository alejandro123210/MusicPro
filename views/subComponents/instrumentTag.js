import React, {useState, useEffect} from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'

// function instrumentTag({ instrument, colorOfCell, type, onPress }){

//     // var highlighted = false
//     const [highlighted, setHighlighted] = useState()
//     const [thisColorOfCell, setColor] = useState();
//     const [backgroundColorOfCell, setBackgroundColorOfCell] = useState()

//     useEffect(() => {
//         if(highlighted == undefined){
//             setHighlighted(false)
//             setColor(colorOfCell)
//             setBackgroundColorOfCell('white')
//         }
//     })

//     highlight = () => {
//         if(highlighted){
//             setBackgroundColorOfCell('white')
//             setColor(colorOfCell)
//             setHighlighted(false)
//         } else {
//             setBackgroundColorOfCell(colorOfCell)
//             setColor('white')
//             setHighlighted(true)
//         }
//         const instrument = {
//             instrument: instrument,
//             selected: highlighted
//         }
//         console.log('highlighted ' + highlighted)
//         // onPress(instrument)
//     }

//     return(
//         <View>
//             {type == 'tappable'?
//                 <TouchableOpacity 
//                     onPress={() => onPress()}
//                     style={[styles.container, {borderColor: thisColorOfCell}]}
//                 >
//                     <Text style={[styles.text, {color: thisColorOfCell}]}>{instrument}</Text>
//                 </TouchableOpacity>
//             : type == 'highlightable' ?
//                 <TouchableOpacity 
//                     onPress={() => highlight()} 
//                     style={[styles.container, {borderColor: thisColorOfCell, backgroundColor: backgroundColorOfCell}]}
//                 >
//                     <Text style={[styles.text, {color: thisColorOfCell}]}>{instrument}</Text>
//                 </TouchableOpacity>
//             :
//                 <View style={[styles.container, {borderColor: thisColorOfCell}]}>
//                     <Text style={[styles.text, {color: thisColorOfCell}]}>{instrument}</Text>
//                 </View>
//             }
//         </View>
//     )

// }


class InstrumentTag extends React.Component{

    state = {
        instrument: this.props.instrument,
        colorOfCell: this.props.colorOfCell,
        type: this.props.type,

        backgroundColor: 'white',
        highlighted: false
    }

    highlight = () => {
        if(this.state.highlighted){
            this.setState({
                backgroundColor: 'white',
                colorOfCell: this.props.colorOfCell,
                highlighted: false
            })
        } else {
            this.setState({
                backgroundColor: this.props.colorOfCell,
                colorOfCell: 'white',
                highlighted: true
            })
        }
        const instrument = {
            instrument: this.state.instrument,
            selected: this.state.highlighted
        }
        this.props.onPress(instrument)
    }

    render(){
        return(
            <View>
                {this.state.type == 'tappable'?
                    <TouchableOpacity 
                        onPress={() => this.props.onPress()}
                        style={[styles.container, {borderColor: this.state.colorOfCell}]}
                    >
                        <Text style={[styles.text, {color: this.state.colorOfCell}]}>{this.state.instrument}</Text>
                    </TouchableOpacity>
                : this.state.type == 'highlightable' ?
                    <TouchableOpacity 
                        onPress={() => this.highlight()} 
                        style={[styles.container, {backgroundColor: this.state.backgroundColor}]}
                    >
                        <Text style={[styles.text, {color: this.state.colorOfCell}]}>{this.state.instrument}</Text>
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