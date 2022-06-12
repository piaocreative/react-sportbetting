import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import {NavigationContainer} from '@react-navigation/native'
import Navigation from './src/navigation'
import {Provider} from 'react-redux'
import createStore from './src/redux/store'
import {widthPercentageToDP as wp,heightPercentageToDP as hp} from 'react-native-responsive-screen'

const store = createStore();

export default function App() {
  return (
  <View style={styles.container}>
    <Provider store={store}>
      <NavigationContainer>
          <Navigation/>
      </NavigationContainer>
    </Provider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp('100'),
    height:hp('100') - 15,
    backgroundColor: '#fff'
  },
});
