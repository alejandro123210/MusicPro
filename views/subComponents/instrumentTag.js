/* eslint-disable eqeqeq */
import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

//thanks a ton Ben!

const InstrumentTag = (props) => {
  const [instrument] = useState(props.instrument);
  const [colorOfCell, setColorOfCell] = useState(props.colorOfCell);
  const [type] = useState(props.type);
  const [backgroundColor, setBackgroundColor] = useState('white');
  const [highlighted, setHighlighted] = useState(false);

  const highlight = () => {
    if (highlighted) {
      setBackgroundColor('white');
      setColorOfCell(props.colorOfCell);
      setHighlighted(false);
    } else {
      setBackgroundColor(props.colorOfCell);
      setColorOfCell('white');
      setHighlighted(true);
    }
    const thisInstrument = {
      instrument: instrument,
      selected: highlighted,
    };
    props.onPress(thisInstrument);
  };

  return (
    <View>
      {type == 'tappable' ? (
        <TouchableOpacity
          onPress={() => props.onPress()}
          style={[styles.container, {borderColor: colorOfCell}]}>
          <Text style={[styles.text, {color: colorOfCell}]}>{instrument}</Text>
        </TouchableOpacity>
      ) : type == 'highlightable' ? (
        <TouchableOpacity
          onPress={() => highlight()}
          style={[styles.container, {backgroundColor: backgroundColor}]}>
          <Text style={[styles.text, {color: colorOfCell}]}>{instrument}</Text>
        </TouchableOpacity>
      ) : (
        <View style={[styles.container, {borderColor: colorOfCell}]}>
          <Text style={[styles.text, {color: colorOfCell}]}>{instrument}</Text>
        </View>
      )}
    </View>
  );
};

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
    padding: 5,
  },
});

export default InstrumentTag;
