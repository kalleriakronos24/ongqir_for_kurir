/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useEffect } from 'react';

import NetInfo from "@react-native-community/netinfo";
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import { LogBox } from 'react-native';
import { Route } from './src/Routes/index.routes.js';
import { createStore, } from 'redux';
import Root from './src/Redux/Reducers/index.reducer';
import { CheckVersion } from './src/utils/utils';


const store = createStore(Root);

const App = () => {

  console.reportErrorsAsExceptions = false;
  useEffect(() => {
    // hide the splash screen from native ui
    SplashScreen.hide();
  }, []);
  // listen for internet changes or connectivity
  NetInfo.addEventListener(state => {
    // do something when user is connected to the internet or when disconnected
    LogBox.ignoreAllLogs(true);

  });

  /**
   * Always Check Latest Version if the app openend
   */
  CheckVersion();

  return (
    <>
      <Provider store={store}>
        <Route />
      </Provider>
    </>
  );
}


export default App;
