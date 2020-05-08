/* eslint-disable eqeqeq */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {Text, StyleSheet, View, TouchableOpacity} from 'react-native';

class DayBar extends React.Component {
  state = {
    selected: 'Mon',
  };

  componentDidMount() {
    this.props.markedDay(this.state.selected);
  }

  setDay = (day) => {
    this.setState({selected: day});
    this.props.markedDay(day);
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Mon')}>
          {this.state.selected == 'Mon' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Mon</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Mon</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Tue')}>
          {this.state.selected == 'Tue' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Tue</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Tue</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Wed')}>
          {this.state.selected == 'Wed' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Wed</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Wed</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Thu')}>
          {this.state.selected == 'Thu' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Thu</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Thu</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Fri')}>
          {this.state.selected == 'Fri' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Fri</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Fri</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Sat')}>
          {this.state.selected == 'Sat' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Sat</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Sat</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.dayContainer}
          onPress={() => this.setDay('Sun')}>
          {this.state.selected == 'Sun' ? (
            <View style={styles.highlightedCircle}>
              <Text style={{color: 'white'}}>Sun</Text>
            </View>
          ) : (
            <View style={styles.notHighlightedCircle}>
              <Text>Sun</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '10%',
    borderBottomWidth: 0.3,
    borderBottomColor: 'gray',
    flexDirection: 'row',
  },
  dayContainer: {
    width: '14.28%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notHighlightCircle: {
    borderRadius: 100,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightedCircle: {
    borderRadius: 100,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#33AFFF'
    backgroundColor: '#274156',
  },
});

export default DayBar;
