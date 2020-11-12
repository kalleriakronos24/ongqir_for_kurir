import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import io from 'socket.io-client';
import { useIsFocused } from '@react-navigation/native';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { formatRupiah } from '../../utils/functionality';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import PushNotification from 'react-native-push-notification';
import { SERVER_URL } from '../../utils/constants';

const socket = io(SERVER_URL, {
    "transports": ['websocket'],
    upgrade: false
});


type UserData = {
    fullname: string,
    no_hp: string,
    email: string,
    fotoDiri: string,
    courier_info: {
        balance: number
    },
    active_order: string
}


const Home = ({ navigation }) => {

    const dispatch = useDispatch();
    let [userData, setUserData] = useState<UserData>({
        fullname: '',
        no_hp: '',
        email: '',
        courier_info: {
            balance: 0
        },
        active_order: '',
        fotoDiri: ''
    });
    
    let [isLoading, setIsLoading] = useState<boolean>(true);

    const useIsMounted = () => {

        const isMounted = React.useRef(false)

        useEffect((): any => {

            isMounted.current = true
            return () => (isMounted.current = false)

        }, [])

        return isMounted
    }

    const mounted = useIsMounted();

    const isFocused = useIsFocused();

    let intervalOrder: NodeJS.Timeout;


    const test: any = async () => {


        let body = {
            message: {
                data: {
                    testing: 'HELLOOOO BROOO'
                }
            },
            device_token: 'c3Kr40h6QHOX2YJwi8xCeY:APA91bGwPaFtiI3FvPBNJgFFV6kxssFJU3jnmI4mZRsVWUV0vSyrv2srpNLBpmWaHvrY9l5vAeMBVkoFAj6dy3vuDl6mvm0l0_LVIErboBmV8g9g1jSNMxVtbukqRv6TvMT3xk5wmvf4'
        };

        return await fetch(`${SERVER_URL}/testing123`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                console.log('berhasil ', res);
            })
            .catch(err => {
                console.log('error :: ', err);
            })
    }

    useEffect(() => {

        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({ interval: 10000, fastInterval: 5000 })
            .then(data => {
                if (data === 'already-enabled')
                    return
                console.log('is this running ?')
                // The user has accepted to enable the location services
                // data can be :
                //  - "already-enabled" if the location services has been already enabled
                //  - "enabled" if user has clicked on OK button in the popup
            }).catch(err => {
                console.log(err.msg);
                // The user has not accepted to enable the location services or something went wrong during the process
                // "err" : { "code" : "ERR00|ERR01|ERR02", "message" : "message"}
                // codes : 
                //  - ERR00 : The user has clicked on Cancel button in the popup
                //  - ERR01 : If the Settings change are unavailable
                //  - ERR02 : If the popup has failed to open
            });


        intervalOrder = setInterval(() => {
            if (mounted) {
                console.log('interval home running every 10s');
                fetchUserByToken()
            }
        }, 1000 * 10) // 10 seconds


        return () => {
            console.log('unmounted home');
            clearInterval(intervalOrder);
        }
    }, []);

    useEffect(() => {
        fetchUserByToken();

        clearInterval(intervalOrder);
    }, [isFocused])

    const fetchUserByToken = async () => {


        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, result: string | undefined) => {
            await socket.emit('userConnected', result);
            await fetch(`${SERVER_URL}/user/single/` + result, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(res => {
                    return res.json();
                })
                .then(res => {
                    setTimeout(() => {
                        setIsLoading(false);
                    }, 2000)
                    setUserData(res.data);
                })
                .catch(err => {
                    console.log('USER FETCH ERROR', err);
                    throw new Error(err);
                })
        });
    };

    const logoutHandler = async () => {

        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, r) => {
            let body: { token: string | undefined } = {
                token: r
            }

            if (r) {
                await fetch(`${SERVER_URL}/courier/logout`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(body)
                }).then(res => {
                    return res.json()
                })
                    .then(async res => {
                        if (res.msg === 'success') {
                            await AsyncStorage.removeItem('LOGIN_TOKEN');
                            dispatch({ type: 'LOGOUT' });

                            await navigation.replace('landing');
                        }
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            }
        })


    }

    return isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator color="blue" size="large" />
        </View>
    ) : (
            <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
                <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" translucent />
                <View style={{ padding: 16, flex: 1, alignItems: 'center' }}>
                    <View style={{ height: 150, width: 150, borderRadius: 150 / 2 }}>
                        <Image source={{ uri: userData.fotoDiri }} style={{
                            borderRadius: 150 / 2,
                            height: '100%',
                            alignSelf: 'stretch',
                            width: '100%'
                        }} />
                    </View>

                    <View style={{ paddingVertical: 20 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', textAlign: 'center' }}>{userData.fullname}</Text>
                        <Text style={{ fontSize: 20, fontWeight: '500', textAlign: 'center' }}>{userData.no_hp}</Text>
                        <Text style={{ textAlign: 'center', fontSize: 20 }}>{userData.email}</Text>
                        <TouchableOpacity activeOpacity={.8} onPress={() => logoutHandler()} style={{ flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ fontSize: 24, marginRight: 10 }}>Keluar</Text>
                            <Icon name="exit-outline" size={30} />
                        </TouchableOpacity>
                    </View>

                    <View style={{ padding: 10, borderRadius: 10, borderWidth: 1, flex: 1, width: '100%', alignItems: 'center' }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', letterSpacing: .5 }}>Saldo Deposit</Text>
                        <Text style={{ marginTop: 15, fontWeight: 'bold', letterSpacing: .5, fontSize: 35, textAlign: 'center' }}>{formatRupiah(String(userData.courier_info.balance), 'Rp. ')},-</Text>

                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity activeOpacity={.8} onPress={() => userData.courier_info.balance === 0 ? Alert.alert('Pesan Sistem', 'Saldo mu tidak cukup untuk mendapatkan atau mencari orderan,... silahkan isi saldo mu terlebih dahulu') : navigation.navigate('order')} style={{ marginVertical: 20, padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: 'blue' }}>
                                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>Orderan</Text>
                            </TouchableOpacity>
                            {
                                userData.active_order ? (
                                    <View>
                                        <Text style={{ fontSize: 50, color: 'red' }}>*</Text>
                                    </View>
                                ) : null
                            }
                        </View>

                        <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                            <TouchableOpacity activeOpacity={.8} onPress={() => test()} style={{ marginVertical: 20, padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: 'green' }}>
                                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>Tambah Saldo</Text>
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('order_history')} style={{ marginVertical: 20, padding: 25, justifyContent: 'center', alignItems: 'center', borderRadius: 15, backgroundColor: 'blue' }}>
                                <Text style={{ color: 'white', fontSize: 25, fontWeight: 'bold' }}>Riwayat Orderan</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        )
}

export default Home;