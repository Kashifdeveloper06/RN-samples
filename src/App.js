
import React from 'react';
import { StyleSheet, Text, View, ImageBackground,AsyncStorage, StatusBar ,Platform, Alert } from 'react-native';
import { Provider } from 'react-redux';
import { STORE, PERSISTOR } from './store/storeConfig';
import { PersistGate } from 'redux-persist/integration/react';
import Decider from './decider';
import * as Util from './utilities'
import OneSignal from 'react-native-onesignal'; // Import package from node modules
import {NativeModules} from 'react-native';
import Modal from "react-native-modal";
import Flurry from 'react-native-flurry-sdk';


export default  class App extends React.Component{
  constructor() {
    super();
    Flurry.Builder.withAppVersion(versionName = '1.0');
    Flurry.Builder.withContinueSessionMillis(sessionMillis = 10000);
    Flurry.Builder.build('------------------','--------------------'); 
  }
  
  componentDidMount(){
    Flurry.setIAPReportingEnabled(true);
    Flurry.logEvent('app connected');
  }

  componentWillUnmount(){
  }

  
  render() {
    console.disableYellowBox = true;
    return (
      <Provider store={STORE}>
        <PersistGate persistor={PERSISTOR}>
          <Decider/>
        </PersistGate>
      </Provider >
    );
  }
}
