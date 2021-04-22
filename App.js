// App.js

import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './src/Login';
import Signup from './src/SignUp';
import Dashboard from './src/Dashboard';
import BuyerRegister from "./src/screens/BuyerRegister";
import SellerRegister from "./src/screens/SellerRegister";
import HomeRegister from "./src/screens/HomeRegister";
import AboutRivenn from "./src/screens/AboutRivenn";
import PaymentScreen from "./src/screens/PaymentScreen";
import SellerHome from "./src/screens/SellerHome";
import ProfileScreen from "./src/screens/ProfileScreen";



const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
      }}>
      {/*<Stack.Screen*/}
      {/*  name="Signup"*/}
      {/*  component={Signup}*/}
      {/*  options={({ navigation }) => ({*/}
      {/*    title: 'Awesome app',*/}
      {/*    headerLeft: () => (*/}
      {/*      <DrawerButton onPress={() => navigation.goBack()} />*/}
      {/*    ),*/}
      {/*  })}*/}
      {/*/>*/}
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
      />
      <Stack.Screen
        name="Dashboard"
        component={Dashboard}
      />
      <Stack.Screen
        name="BuyerRegister"
        component={BuyerRegister}
      />
      <Stack.Screen
        name="HomeRegister"
        component={HomeRegister}
      />
      <Stack.Screen
        name="SellerRegister"
        component={SellerRegister}
      />
      <Stack.Screen
        name="AboutRivenn"
        component={AboutRivenn}
      />
      <Stack.Screen
        name="PaymentScreen"
        component={PaymentScreen}
      />
      <Stack.Screen
        name="SellerHome"
        component={SellerHome}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
