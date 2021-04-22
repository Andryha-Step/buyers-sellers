// components/login.js

import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  Alert,
  ActivityIndicator,
  AsyncStorage,
} from 'react-native';
import firebase from '../database/fireBase';
import { TouchableOpacity } from "react-native-gesture-handler";

export default class Login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      isLoading: false,
      isLogged: false,
    };
  }
  async componentDidMount() {

  }

  updateInputVal = (val, prop) => {
    const state = this.state;
    state[prop] = val;
    this.setState(state);
  };

  userLogin = () => {
    if (this.state.email === '' && this.state.password === '') {
      Alert.alert('Enter details to signin!');
    } else {
      this.setState({
        isLoading: true,
      });
      firebase
        .auth()
        .signInWithEmailAndPassword(this.state.email, this.state.password)
        .then(res => {
          console.log(res);
          console.log('User logged-in successfully!');
          this.setState({
            isLoading: false,
            isLogged: true,
            email: '',
            password: '',
          });
          this.props.navigation.navigate('ProfileScreen', { userInfo: res.user});
          AsyncStorage.setItem('Login', JSON.stringify(this.state.isLogged));
        })
        .catch(error => {
          this.setState({errorMessage: error.message});
          console.log(errorMessage);
          alert(errorMessage);
          this.props.navigation.navigate('Login');
        });
    }
  };

  render() {
    if (this.state.isLoading) {
      return (
        <View style={styles.preloader}>
          <ActivityIndicator size="large" color="#9E9E9E" />
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.inputStyle}
          placeholder="Email"
          value={this.state.email}
          onChangeText={val => this.updateInputVal(val, 'email')}
        />
        <TextInput
          style={styles.inputStyle}
          placeholder="Password"
          value={this.state.password}
          onChangeText={val => this.updateInputVal(val, 'password')}
          maxLength={15}
          secureTextEntry={true}
        />

          <TouchableOpacity style={styles.loginBtn} onPress={() => this.userLogin()}>
                <Text style={styles.btnText}>Login</Text>
          </TouchableOpacity>


        <Text
          style={styles.loginText}
          onPress={() => this.props.navigation.navigate('Dashboard')}>
          Don't have account? Click here to signup
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 35,
    paddingTop: 0,
    backgroundColor: '#fff',
  },
  inputStyle: {
    width: '100%',
    marginBottom: 15,
    paddingBottom: 15,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderColor: '#3eadac',
    fontSize: 17,
  },
  loginBtn: {
    backgroundColor: '#3eadac',
    textAlign: 'center',
    alignItems: 'center',
    padding: 5,
  },
  btnText: {
    color: '#fff',
    fontSize: 17,
  },
  loginText: {
    color: '#000',
    marginTop: 25,
    opacity: 0.5,
    textAlign: 'center',
  },
  preloader: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});
