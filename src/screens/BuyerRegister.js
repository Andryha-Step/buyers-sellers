// components/dashboard.js

import React, {useState}  from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  AsyncStorage,
  Dimensions,
  Platform,
  ScrollView, Alert,
} from "react-native";
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from '../../database/fireBase'

const {width, height} = Dimensions.get('window')

const radio_props = [
  {label: 'Cash', value: 'Cash' },
  {label: 'Conventional Loan', value: 'Conventional Loan' },
  {label: 'FHA Loan', value: 'FHA Loan' },
  {label: 'VA Loan', value: 'VA Loan' },
  {label: 'Rural Development', value: 'Rural Development' },
  {label: 'Other', value: 'Other' },
];

const BuyerRegister = (props) => {
  const [isLogged, setIsLogged] = useState('')

  const [errorMessage, setErrorMesasge] = useState('')
  const [radioValue, setRadioValue] = useState('Cash')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState(false)
  const [mobile, setMobile] = useState('')
  const [password, setPassword] = useState('')
  const [describe, setDescribe] = useState('')

  const validateEmail = (email) => {
    console.log(email);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    if (reg.test(email) === false) {
      console.log("Email is Not Correct");
      setEmailError(true)
      setEmail(email)
      return false;
    }
    else {
      setEmailError(false)
      setEmail(email)
      console.log("Email is Correct");
    }
  }
  const registerUser = () => {
    if(email === '' || password === '') {
      Alert.alert('Enter details to signup!')
    } else {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((res) => {
          res.user.updateProfile({
            displayName: firstName + ' ' + lastName,
            phoneNumber: mobile,

          })
          console.log('registered', res.user.uid)
          setIsLogged(true)
          AsyncStorage.setItem('Login', JSON.stringify(isLogged))
          if(res.user.uid) {
            const userId = res.user.uid
            firebase
              .database()
              .ref('users/' + userId + '/')
              .set({
                firstName: firstName,
                lastName: lastName,
                userType: 'Buyer',
                email: email,
                mobileNumber: mobile,
                financing: radioValue,
              })
              .then((data) => {
                props.navigation.navigate('HomeRegister', {uid: userId, userInfo: res.user})
              })
              .catch((error) => {
                console.log('Storing Error', error)
              })
          }
        })
        .catch(error => {
          setErrorMesasge(error.message)
          Alert.alert(
            error.message,
            "",
            [
              {
                text: "Login",
                onPress: () => props.navigation.navigate('Login')
              },
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
            ]
          );
          console.log(error.message)
        })
    }
  }

  const onSubmit = () => {
    registerUser()

  }

  return (
    <View style={styles.container}>
      <ScrollView style={{width: width - 40,}}  showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Register as Buyer</Text>

      <View style={styles.wrapper}>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>First Name: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setFirstName(value)}
            value={firstName}
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Last Name: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setLastName(value)}
            value={lastName}
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Email: </Text>
          <TextInput
            style={styles.input}
            autoCompleteType={'email'}
            onChangeText={(value) => validateEmail(value)}
            value={email}
          />
        </View>
        {emailError && <Text style={styles.errorText}>Email is not valid</Text>}
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Phone: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setMobile(value)}
            keyboardType={'phone-pad'}
            value={mobile}
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Password: </Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={val => setPassword(val)}
            maxLength={15}
            secureTextEntry={true}
          />
        </View>


        <View style={styles.radioItem}>
          <Text style={styles.radioTitle}>Financing information </Text>
          <View style={styles.radioWrapper}>
            <RadioForm
              style={styles.radioForm}
            >
            {
              radio_props.map((obj, i) => {
               return  <RadioButton labelHorizontal={true} key={i}  wrapStyle={{width: '50%',marginTop: 10,}} >
                  {/*  You can set RadioButtonLabel before RadioButtonInput */}
                  <RadioButtonInput
                    obj={obj}
                    index={i}
                    isSelected={radioValue === obj.value}
                    onPress={(value) => setRadioValue(value)}
                    buttonInnerColor={'#3eadac'}
                    buttonOuterColor={'#3eadac'}
                    buttonSize={15}
                    buttonStyle={{}}

                  />
                  <RadioButtonLabel
                    obj={obj}
                    index={i}
                    labelHorizontal={true}
                    onPress={(value) => setRadioValue(value)}
                    labelStyle={{fontSize: 13, color: '#000'}}
                  />
                </RadioButton>
            })
            }
            </RadioForm>
          </View>
          {radioValue == 'Other' &&  <TextInput
            placeholder={'Describe'}
            style={styles.inputDescribe}
            onChangeText={(value) => setDescribe(value)}
            value={describe}
            multiple
          />}
        </View>
      </View>



      <View style={styles.buttonWrapper}>
        <TouchableOpacity style={styles.submit} onPress={() => props.navigation.goBack() }>
          <Text style={styles.textStyle}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submit} onPress={() => onSubmit()}>
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>
      </View>
      </ScrollView>
    </View>
  )
}

export default BuyerRegister
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
  wrapper: {
    width: '100%',
  },
  inputItem: {
    display: "flex",
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioForm: {
    marginTop: 15,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    flexWrap: 'wrap',
  },
  radioItem: {
    flexDirection: 'column',
    marginTop: 15,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  radioWrapper: {
    width: '100%',
  },
  inputTitle: {
    width: '30%',
    fontSize: 17,

  },
  radioTitle: {
    width: '100%',
    paddingTop: 10,
    fontSize: 17,
    textAlign: 'center',
  },
  input: {
    padding: 0,
    width: '70%',
    borderBottomWidth: 1,
    borderColor: '#3eadac',
    fontSize: 17,
  },
  inputDescribe: {
    width: '100%',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#3eadac',
    fontSize: 17,
    marginTop: 15,
  },
  buttonWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  submit: {
    marginTop: 30,
    width: width/2 - 50,
    display: "flex",
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3eadac',
  },
  textStyle: {
    textTransform:'uppercase',
    fontWeight: '500',
    color: '#fff',
    fontSize: 15,
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});
