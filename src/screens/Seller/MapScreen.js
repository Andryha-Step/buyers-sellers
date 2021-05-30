// components/dashboard.js
import React, { useEffect,useState } from 'react';
import { StyleSheet, View, Text, Button,AsyncStorage ,Platform, Dimensions, Image} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import firebase from '../../../database/fireBase';
import database from "@react-native-firebase/database";
import auth from "@react-native-firebase/auth";
import { useIsFocused } from '@react-navigation/native';







const {width, height} = Dimensions.get('window')
const MapScreen = (props) => {
  const isFocused = useIsFocused();

  const [userId , setUserId] = useState(null)
  const [userData , setUserData] = useState(null)
  const [addressList, setAddressList] = useState([])

  useEffect(() => {
    database()
      .ref('users/' + userId)
      .once('value')
      .then(snapshot => {
        if(snapshot.val() !== null ) {
          setUserData(snapshot.val())
          setAddressList([snapshot.val().homes])
        }
      }).catch(error => console.log(error, 'user Data error'))
  }, [isFocused])
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [])

  useEffect(() => {
    database()
      .ref('users/' + userId)
      .once('value')
      .then(snapshot => {
        console.log('User Map screen: ', snapshot.val());
        if(snapshot.val() !== null ) {
          setUserData(snapshot.val())
          setAddressList([snapshot.val().homes])
        } else {
          console.log( 'user not register')
        }

      }).catch(error => console.log(error, 'user Data error'))
  }, [userId])

  const onAuthStateChanged = (user) => {

    if(user) {
      setUserId(user.uid)
    }
    if(!user) {
      props.navigation.navigate('Login')
    }
  }
    const markerList = addressList.map(item => Object.values(item))
    return (
      <View style={styles.container}>
        <MapView
          style={{ flex: 1 }}
          initialRegion={{
            latitude: 50.4501,
            longitude: 30.523,
            latitudeDelta: 0.5,
            longitudeDelta: 0.5
          }}
        >
          {markerList.flat().map((marker, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: marker.coordinate.lat,
                longitude: marker.coordinate.lng
              }}
              title={marker.address}
            >
              <Image
                source={require('../../assets/seller-marker.png')}
                style={{width: 20, height: 30}}
                resizeMode="contain"
              />
            </Marker>
          ))}

        </MapView>

      </View>
    );
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
    backgroundColor: 'red',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
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
export default MapScreen
