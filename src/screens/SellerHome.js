// components/dashboard.js

import React, {useState}  from 'react';
import { StyleSheet, View, Text,TextInput, Button,AsyncStorage ,Platform, Dimensions} from 'react-native';
import RadioForm, {RadioButton, RadioButtonInput, RadioButtonLabel} from 'react-native-simple-radio-button';
import { TouchableOpacity } from "react-native-gesture-handler";
import firebase from "../../database/fireBase";


const {width, height} = Dimensions.get('window')

const radio_props = [
  {label: 'Yes', value: 0 },
  {label: 'No', value: 1},

];

const SellerHome = (props) => {
  const [radioValue, setRadioValue] = useState(0)
  const [address, setAddress] = useState('')
  const [price, setPrice] = useState('')
  const [timeFrame, setTimeFrame] = useState('')
  const [whereNew, setWhereNew] = useState('')




  const onSubmit = () => {
    const userId = firebase.auth().currentUser.uid
    firebase
      .database()
      .ref('users/' + userId + '/')
      .update({
        homeQuery: {
          address: address,
          price: price,
          timeFrame: timeFrame,
          whereNew: whereNew,
        }
      })
      .then((data) => {
        console.log('Saved Data', data)
        props.navigation.navigate('AboutRivenn', {userInfo: props.route.params.userInfo})
      })
      .catch((error) => {
        console.log('Storing Error', error)
      })

  }

  return (
    <View style={styles.container}>
      <View style={styles.wrapper}>

        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>My Address: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setAddress(value)}
            value={address}
          />
        </View>
        <View style={styles.inputItem}>
          <Text style={styles.inputTitle}>Price: </Text>
          <TextInput
            style={styles.input}
            onChangeText={(value) => setPrice(value)}
            value={price}
          />
        </View>

        <View style={styles.inputItem}>
          <Text style={{width: '40%',fontSize: 17}}>Timeframe to sell: </Text>
          <TextInput
            style={{width: '60%',padding:0, borderBottomWidth: 1, borderColor: '#3eadac', fontSize: 17,}}
            onChangeText={(value) => setTimeFrame(value)}
            value={timeFrame}
          />
        </View>
        <View style={styles.radioItem}>
          <Text style={styles.radioTitle}>Do you need to buy another home?</Text>
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
                      labelStyle={{fontSize: 17, color: '#000'}}
                    />
                  </RadioButton>
                })
              }
            </RadioForm>
          </View>
          <View style={styles.inputItem}>
            <Text style={{width: '40%',fontSize: 17}}>if Yes, where: </Text>
            <TextInput
              style={{width: '60%', borderBottomWidth: 1, borderColor: '#3eadac', fontSize: 17,}}
              onChangeText={(value) => setWhereNew(value)}
              value={whereNew}
            />
          </View>
        </View>

      </View>



      <View style={styles.buttonWrapper}>
        {/*<TouchableOpacity style={styles.submit} onPress={() => props.navigation.goBack() }>*/}
        {/*  <Text style={styles.textStyle}>Previous</Text>*/}
        {/*</TouchableOpacity>*/}
        <TouchableOpacity style={styles.submit} onPress={() => onSubmit()}>
          <Text style={styles.textStyle}>Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SellerHome
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
    fontWeight: '600',
    paddingBottom: 30,
    textAlign: 'center',
    color: '#000',
  },
  uploadBtn: {
    marginTop: 10,
    borderColor: '#3eadac',
    borderWidth: 1,
    padding: 10,
  },
  uploadText: {
    textTransform: 'uppercase',
    fontSize: 17,
    color: '#3eadac'
  },
  requiresWrapper: {
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  requiresTitle: {
    textTransform: 'uppercase',
    fontWeight: '600',
    fontSize: 17,
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
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  radioItem: {
    marginTop: 20,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
    textAlign: 'left',
  },
  input: {
    width: '70%',
    padding: 0,
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
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  submit: {
    marginTop: 30,
    width: width/2 - 30,
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