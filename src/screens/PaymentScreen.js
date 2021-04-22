// components/dashboard.js

import React, { useState } from 'react';
import { StyleSheet, View, Text, Button, AsyncStorage, Dimensions, PLatform, TextInput, Platform } from "react-native";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TouchableOpacity } from "react-native-gesture-handler";



const {width, height} = Dimensions.get('window')
const radio_props = [
  {label: 'Standart: 4.99$ / one time fee', value: 0 },
  {label: 'premium: 14.99 / one time fee', value: 1 },
];

const PaymentScreen = (props) => {
  const [value, setValue] = useState(0)
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment</Text>

      <View style={styles.radioWrapper}>
        <RadioForm
          style={{justifyContent: 'space-between', height: 100,}}
          radio_props={radio_props}
          initial={value}
          onPress={(value) => setValue(value)}
          buttonColor={'#3eadac'}
          selectedButtonColor={'#3eadac'}
        />
      </View>

      <TouchableOpacity style={styles.submit} onPress={() => props.navigation.navigate('ProfileScreen', {userInfo: props.route.params.userInfo})}>
        <Text style={styles.textStyle}>I'ready to have Rivenn help me find a home</Text>
      </TouchableOpacity>
      {/*<Button*/}
      {/*  color="#3740FE"*/}
      {/*  title="Logout"*/}
      {/*  onPress={() => this.signOut()}*/}
      {/*/>*/}
    </View>
  )
}

export default PaymentScreen
const styles = StyleSheet.create({
  buttonWrap: {
    backgroundColor: 'red',
    top: 100,
  },
  container: {
    flex: 1,
    display: "flex",
    paddingTop: Platform.OS === 'ios' ?  100 : 50,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    padding: 20,
    backgroundColor: '#fff'
  },
  title: {
    width: '100%',
    fontSize: 20,
    paddingBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  inputItem: {
    width: '100%',
    marginTop: 10,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  inputTitle: {
    fontSize: 17,
  },
  uploadBtn: {
    borderColor: '#3eadac',
    borderWidth: 1,
    padding: 10,
  },
  uploadText: {
    textTransform: 'uppercase',
    fontSize: 15,
    color: '#3eadac'
  },
  radioWrapper: {
    marginTop: 20,
  },
  submit: {
    marginTop: 30,
    width: width - 40,
    display: "flex",
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3eadac',
  },
  textStyle: {
    color: '#fff',
    fontSize: 17,
  }
});
