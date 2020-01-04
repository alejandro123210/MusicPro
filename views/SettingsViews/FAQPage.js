import React from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView } from 'react-native';


let deviceHeight = Dimensions.get("window").height;
let deviceWidth = Dimensions.get("window").width;

class FAQPage extends React.Component {

  render() {
    return (
      // this is just random filler for the template, but this is where what the user sees is rendered
      <View style={styles.container}>
        <View style={styles.titleContainer}>
            <Text style={styles.titleFont}>
                FAQ
            </Text>
        </View>
        <ScrollView>
        <View style={styles.superContainer}>
            <View styxle={styles.combinedContainer}>
                <View style={styles.questionContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterQ}>
                            Q:
                        </Text>
                        <Text style={styles.questionText}>
                            What's my profile?
                        </Text>
                    </View>
                </View>
                <View style={styles.answerContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterA}>
                            A:  
                        </Text>
                        <Text style={styles.answerText}>
                            Up your butt        
                        </Text>
                    </View> 
                </View>
            </View>
            <View styxle={styles.combinedContainer}>
                <View style={styles.questionContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterQ}>
                            Q:
                        </Text>
                        <Text style={styles.questionText}>
                            What's my profile?
                        </Text>
                    </View>
                </View>
                <View style={styles.answerContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterA}>
                            A:  
                        </Text>
                        <Text style={styles.answerText}>
                            Up your butt        
                        </Text>
                    </View> 
                </View>
            </View>
            <View styxle={styles.combinedContainer}>
                <View style={styles.questionContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterQ}>
                            Q:
                        </Text>
                        <Text style={styles.questionText}>
                            What's my profile?
                        </Text>
                    </View>
                </View>
                <View style={styles.answerContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterA}>
                            A:  
                        </Text>
                        <Text style={styles.answerText}>
                            Up your butt        
                        </Text>
                    </View> 
                </View>
            </View>
            <View styxle={styles.combinedContainer}>
                <View style={styles.questionContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterQ}>
                            Q:
                        </Text>
                        <Text style={styles.questionText}>
                            What's my profile?
                        </Text>
                    </View>
                </View>
                <View style={styles.answerContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterA}>
                            A:  
                        </Text>
                        <Text style={styles.answerText}>
                            Up your butt        
                        </Text>
                    </View> 
                </View>
            </View>
            <View styxle={styles.combinedContainer}>
                <View style={styles.questionContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterQ}>
                            Q:
                        </Text>
                        <Text style={styles.questionText}>
                            What's my profile?
                        </Text>
                    </View>
                </View>
                <View style={styles.answerContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterA}>
                            A:  
                        </Text>
                        <Text style={styles.answerText}>
                            Up your butt        
                        </Text>
                    </View> 
                </View>
            </View>
            <View styxle={styles.combinedContainer}>
                <View style={styles.questionContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterQ}>
                            Q:
                        </Text>
                        <Text style={styles.questionText}>
                            What's my profile?
                        </Text>
                    </View>
                </View>
                <View style={styles.answerContainer}>
                    <View style = {styles.textContainer}>
                        <Text style={styles.letterA}>
                            A:  
                        </Text>
                        <Text style={styles.answerText}>
                            Up your butt        
                        </Text>
                    </View> 
                </View>
            </View>
        </View>               
        </ScrollView>   
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  titleContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: deviceWidth,
    height: deviceHeight/20,
    backgroundColor: 'white',
    borderBottomColor: 'grey',
    borderBottomWidth: 0.3,
  },
  questionContainer: {
    margin: deviceHeight/40,
  },
  answerContainer: {
    marginBottom: deviceHeight/40,
  },
  combinedContainer: {
    flex : 1,
    borderWidth: deviceWidth,
    borderRadius: 1,
    borderColor: 'black',
    borderWidth: 1,  
  },
  titleFont: {
    fontSize: 32,
    color: '#4c8bf5'
  },
  superContainer: {
      flex: 3 ,
  },
  letterQ: {
      color: '#4c8bf5',
      fontSize: 30,
  },
  letterA: {
      color: '#4c8bf5',
      fontSize: 21,
  },
  textContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
  },
  questionText: {
      fontSize: 15,
  },
});


//this lets the component get imported other places
export default FAQPage;