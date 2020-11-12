import React, { useEffect, useRef, useState, Fragment } from 'react'
import {
    createStackNavigator,
    TransitionSpecs,
    HeaderStyleInterpolators,
    CardStyleInterpolators,
    CardAnimationContext
} from '@react-navigation/stack';
import {
    AppState
} from 'react-native';

import { NavigationContainer } from '@react-navigation/native';

import {
    useSelector,
    useDispatch
} from 'react-redux';
import Landing from '../Screens/Landing';
import Login from '../Screens/Login/index.login'
import Register from '../Screens/Register/index.register';
import AsyncStorage from '@react-native-community/async-storage';
import BackgroundTimer from 'react-native-background-timer';
import io from 'socket.io-client';
import { SplashScreen } from '../Screens/Splash/index.splash';
import Home from '../Screens/Home/index.home';
import Order from '../Screens/Order/index.order';
import { AddBalanceForm, CourierBalance, TransactionHistory } from '../Screens/Wallet/index.wallet';
import { IndexMap, PengirimMap, PenerimaMap } from '../Screens/Map/index.map';
import OrderHistory from '../Screens/OrderHistory/index.history';
import { SERVER_URL } from '../utils/constants';

const socket = io(SERVER_URL, {
    "transports": ['websocket'],
    upgrade: false
});

let navRef = null;
let dispatchDeviceToken = null;

const Route = () => {

    // variables

    navRef = useRef(null);
    dispatchDeviceToken = useDispatch();

    let [token, setToken] = useState(null);
    let interval;

    let login_token = useSelector(state => state.token);
    let [isLoading, setIsLoading] = useState(true);
    const dispatch = useDispatch();
    // let count = useSelector(state => state.orders.count);
    let appState = useRef(AppState.currentState);

    const Stack = createStackNavigator();


    // renders


    const handleAppStateChange = (nextAppState) => {
        AsyncStorage.getItem('LOGIN_TOKEN', (err, res) => res)
            .then((res) => {
                console.log('ini res dari logintoken storage', res);
                setToken(res);
                setIsLoading(false);
                if (
                    appState.current.match(/inactive|background/) &&
                    nextAppState === "active"
                ) {
                    console.log("App has come to the foreground!");
                    //clearInterval when your app has come back to the foreground
                    socket.emit('userConnected', res);
                    BackgroundTimer.clearInterval(interval);

                } else {
                    //app goes to background
                    console.log('app goes to background');
                    //tell the server that your app is still online when your app detect that it goes to background
                    // interval = BackgroundTimer.setInterval(() => {
                    //     // socket.emit('userConnected', res);
                    //     console.log('this shit running every 9s');
                    // }, 9000);
                    appState.current = nextAppState;
                };

                console.log("AppState", appState.current);
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        // AppState.addEventListener("change", handleAppStateChange);
        AsyncStorage.getItem('LOGIN_TOKEN', (err, res) => res)
            .then(async (res) => {

                setToken(res);
                setIsLoading(false);
            })

            .catch(err => {
                console.log(err);
            });

    }, []);

    return (
        <NavigationContainer ref={navRef}>
            <Stack.Navigator headerMode="none">

                {
                    isLoading ? (
                        <Stack.Screen name="splash" component={SplashScreen} options={{
                            headerShown: true,
                            cardShadowEnabled: false,
                            cardOverlayEnabled: false,
                            cardOverlay: false
                        }} />
                    ) : token !== null || login_token.token !== null ? (
                        <>
                            <Stack.Screen name="home" component={Home} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="order" component={Order} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="add_wallet" component={AddBalanceForm} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="transaction_out" component={CourierBalance} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="transaction_history" component={TransactionHistory} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />

                            <Stack.Screen name="index_map" component={IndexMap} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="pengirim_map" component={PengirimMap} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="penerima_map" component={PenerimaMap} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="order_history" component={OrderHistory} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />


                            { /** ???? */}
                            <Stack.Screen name="landing" component={Landing} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="login" component={Login} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                            <Stack.Screen name="register" component={Register} options={{
                                headerShown: true,
                                cardShadowEnabled: false,
                                cardOverlayEnabled: false,
                                cardOverlay: false
                            }} />
                        </>
                    ) : (
                                // not logged in screen
                                <>
                                    <Stack.Screen name="landing" component={Landing} options={{
                                        headerShown: true,
                                        cardShadowEnabled: false,
                                        cardOverlayEnabled: false,
                                        cardOverlay: false
                                    }} />
                                    <Stack.Screen name="login" component={Login} options={{
                                        headerShown: true,
                                        cardShadowEnabled: false,
                                        cardOverlayEnabled: false,
                                        cardOverlay: false
                                    }} />
                                    <Stack.Screen name="register" component={Register} options={{
                                        headerShown: true,
                                        cardShadowEnabled: false,
                                        cardOverlayEnabled: false,
                                        cardOverlay: false
                                    }} />
                                </>
                            )
                }


            </Stack.Navigator>
        </NavigationContainer>

    )
}

export {
    Route,
    navRef,
    dispatchDeviceToken
};