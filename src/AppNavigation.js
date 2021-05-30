import React, { useState, useEffect } from 'react';
import {Text, Image, View, TouchableOpacity, ImageBackground, StyleSheet} from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MapScreen from "./screens/Seller/MapScreen";
import ProfileScreen from "./screens/ProfileScreen";

import ProfileIcon from '../src/assets/user.svg'
import Login from "./Login";
import SellerHome from "../src/screens/SellerHome";
import AddressScreen from "./screens/AddressScreen";
import PropertyScreen from "./screens/Seller/PropertyScreen";


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function ProfileStack() {
  return (
    <Stack.Navigator
      initialRouteName={'ProfileScreen'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}
    >
      <Stack.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="SellerHome"
        component={SellerHome}
      />
      <Stack.Screen
        name="AddressScreen"
        component={AddressScreen}
      />
    </Stack.Navigator>
  );
}

function PropertyStack() {
  return (
    <Stack.Navigator
      initialRouteName={'PropertyScreen'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}
    >
      <Stack.Screen
        name="Propertycreen"
        component={PropertyScreen}
        options={{
          gestureEnabled: false
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
      />
      <Stack.Screen
        name="SellerHome"
        component={SellerHome}
      />
      <Stack.Screen
        name="AddressScreen"
        component={AddressScreen}
      />
    </Stack.Navigator>
  );
}

function MapStack() {
  return (
    <Stack.Navigator
      initialRouteName={'MapScreen'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true
      }}
    >
      <Stack.Screen
        name="MapScreen"
        component={MapScreen}
        options={{
          gestureEnabled: false
        }}
      />

    </Stack.Navigator>
  );
}


function BottomTabs() {
  return (
    <Tab.Navigator
      initialRouteName={'Dashboard'}
      activeColor="rgba(97, 109, 120, 0.6)"
      tabBarOptions={{
        showIcon: true,
        activeTintColor: '#fff',
        inactiveTintColor: '#000',
        activeBackgroundColor: '#3eadac',
        inactiveBackgroundColor: 'rgba(62, 173, 172, 0.7)',
        tabStyle: {
          height: 80,
          padding: 20,
          justifyContent: 'center',
          alignItems: 'center',
        },
        labelStyle: {
          fontSize: 15,
        },
        style: {
          height: 80,
          bottom: 0,
          elevation: 0,
          borderTopWidth: 0
        }
      }}
      shifting={false}
    >
      <Tab.Screen
        name="Map"
        component={MapStack}
        options={{
          tabBarLabel: 'Map',
          // tabBarIcon: ({ focused, color }) =>
          //   focused ?  <ProfileIcon fill={'#fff'} /> : <ProfileIcon  />
        }}
      />
      <Tab.Screen
        name="Property"
        component={PropertyStack}
        options={{
          tabBarLabel: 'Property',
          // tabBarIcon: ({ focused, color }) =>
          //   focused ?  <ProfileIcon fill={'#fff'} /> : <ProfileIcon  />
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          // tabBarIcon: ({ focused, color }) => focused ?  <ProfileIcon fill={'#fff'} /> : <ProfileIcon fill={"#000"} />
        }}
      />
    </Tab.Navigator>
  );
}

const SellerNavigator = (props) => {
  return (
    <Stack.Navigator
      initialRouteName={'MapScreen'}
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen name="MainStack" component={BottomTabs} />
    </Stack.Navigator>
  );
};


export default SellerNavigator;
