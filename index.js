/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import PushNotification from 'react-native-push-notification';
import AsyncStorage from '@react-native-community/async-storage';
import { navRef, dispatchDeviceToken } from './src/Routes/index.routes';
import { useDispatch } from 'react-redux';
import {
    SERVER_URL
} from './src/utils/constants';
import {
    fetchOrder
} from './src/utils/notification_actions';
import { formatRupiah } from './src/utils/functionality';

// variables


PushNotification.configure({

    // (optional) Called when Token is generated (iOS and Android)
    onRegister: function (token) {
        AsyncStorage.getItem('LOGIN_TOKEN', async (e, r) => {
            if (r) {
                let body = {
                    token: r,
                    device_token: token.token
                };

                await fetch(`${SERVER_URL}/update-device-token`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(body)
                })
                    .then(res => {
                        // do nothing
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            } else {
                return;
            }
        })
        dispatchDeviceToken({ type: 'add_device_token', token: token.token });
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification.data);

        // process the notification

        if (notification.data.type === 'ORDER_DIBATALKAN_USER') {

            PushNotification.localNotification({
                channelId: "not1",
                subText: notification.data.subtext,
                title: notification.data.title,
                bigText: `Order dibatalkan oleh ${notification.data.dari} dengan Alasan ${notification.data.alasan}`,
                message: 'Orderan dibatalkan oleh : ' + notification.data.dari,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                actions: '["OK"]',
                invokeApp: false
            });

        } else {


            PushNotification.localNotification({
                channelId: "not1",
                subText: notification.data.subtext,
                title: notification.data.title,
                bigText: `
                Ongkir : ${formatRupiah(notification.data.ongkir, 'Rp. ')} \n
                Jarak Pengirim Ke Penerima : ${notification.data.km} km \n
                Barang yg di kirim : ${notification.data.barang} 
            `,
                message: 'Orderan dari : ' + notification.data.dari,
                vibrate: true,
                vibration: 300,
                playSound: true,
                soundName: 'default',
                actions: '["Terima", "Tolak"]',
                invokeApp: false
            });
        }

        // (required) Called when a remote is received or opened, or local notification is opened
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: async function (notification) {

        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, r) => {

            if (r) {

                if (notification.action === 'Terima') {

                    await fetchOrder(r, navRef.current, "accept");

                } else if (notification.action === "OK") {

                    // do something when courier got canceled
                    await fetchOrder(r, navRef.current, "tolak")

                } else {

                    await fetchOrder(r, navRef.current, "tolak")
                    // do tolak action
                }

            } else {
                // do nothing when token is empty
            }
        })

    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
        console.error(err.message, err);
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
        alert: true,
        badge: true,
        sound: true,
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true,
});

PushNotification.createChannel(
    {
        channelId: "not1", // (required)
        channelName: "Channel", // (required)
    },
    (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
);

AppRegistry.registerComponent(appName, () => App);
