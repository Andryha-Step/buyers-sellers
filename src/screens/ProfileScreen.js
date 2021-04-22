// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button,AsyncStorage ,Platform, Dimensions} from 'react-native';
import firebase from '../../database/fireBase';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TouchableOpacity } from "react-native-gesture-handler";


const {width, height} = Dimensions.get('window')
export default class ProfileScreen extends Component {
  constructor() {
    super();
    this.state = {
      value: 0,
    }
  }

  signOut = () => {
    firebase.auth().signOut().then(() => {
      AsyncStorage.setItem('Login', JSON.stringify(false) );
      this.props.navigation.navigate('Login')
    })
      .catch(error => this.setState({ errorMessage: error.message }))
  }


  render() {

  console.log(this.props.route.params.userInfo.providerData)
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{this.props.route.params.userInfo.displayName}</Text>
        <Text style={styles.textStyle}>{this.props.route.params.userInfo.email}</Text>


        <TouchableOpacity style={styles.logout} onPress={() => this.signOut()}>
          <Text style={styles.textLogout}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },
  logout: {
    backgroundColor: '#3eadac',
    padding: 10,
    marginTop: 50,
  },
  textLogout: {
    color: '#fff',
    fontSize: 15,
  },
  container: {
    flex: 1,
    display: "flex",
    paddingTop: Platform.OS === 'ios' ?  130 : 50,
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 35,
    backgroundColor: '#fff'
  },
  title: {
    width: '100%',
    fontSize: 20,
    paddingBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  submit: {
    marginTop: 30,
    width: width - 70,
    display: "flex",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3eadac',
  },
  textStyle: {
    width: '100%',
    textAlign: 'center',
    color: '#000',
    fontSize: 15,
  }
});
