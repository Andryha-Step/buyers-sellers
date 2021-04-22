// components/dashboard.js

import React, { Component } from 'react';
import { StyleSheet, View, Text, Button,AsyncStorage ,Platform, Dimensions} from 'react-native';
import firebase from '../database/fireBase';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TouchableOpacity } from "react-native-gesture-handler";


const radio_props = [
  {label: 'I want to buy a home', value: 0 },
  {label: 'I want to sell my house', value: 1 },
];

const {width, height} = Dimensions.get('window')
export default class Dashboard extends Component {
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


  async componentDidMount() {

  }

  onCheck = (value) => {

    this.setState({
      value: value,
    })

  }
  onSubmit = () => {

    if( this.state.value === 1) {
      this.props.navigation.navigate('SellerRegister')
    } else {
      this.props.navigation.navigate('BuyerRegister')
    }
  }
  render() {


    return (
      <View style={styles.container}>
        <Text style={styles.title}>Please select what you need</Text>

        <RadioForm
          style={{justifyContent: 'space-between', height: 90,}}
          radio_props={radio_props}
          initial={this.state.value}
          onPress={(value) => this.onCheck(value)}
          buttonColor={'#3eadac'}
          selectedButtonColor={'#3eadac'}

        />

        <TouchableOpacity style={styles.submit} onPress={this.onSubmit}>
          <Text style={styles.textStyle}>Submit</Text>
        </TouchableOpacity>
        {/*<Button*/}
        {/*  color="#3740FE"*/}
        {/*  title="Logout"*/}
        {/*  onPress={() => this.signOut()}*/}
        {/*/>*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },

  container: {
    flex: 1,
    display: "flex",
    paddingTop: Platform.OS === 'ios' ?  130 : 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
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
    color: '#fff',
    fontSize: 15,
  }
});
