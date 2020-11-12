import React, { useEffect, useState, useCallback, DependencyList } from 'react';
import {
    View,
    Text,
    StatusBar,
    ScrollView,
    PermissionsAndroid,
    Alert,
    RefreshControl
} from 'react-native';

import Icon from 'react-native-vector-icons/Ionicons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import io from 'socket.io-client';
import Geolocation from 'react-native-geolocation-service';
import { useIsFocused } from '@react-navigation/native'
import AsyncStorage from '@react-native-community/async-storage';
import { formatRupiah, wait, useStateCallback } from '../../utils/functionality';


// interfaces

interface Order {
    penerima: {
        address: string,
        address_detail: string,
        coords: {
            latitude: number,
            longitude: number
        },
        name: string,
        phone: string
    },
    pengirim: {
        address: string,
        address_detail: string,
        coords: {
            latitude: number,
            longitude: number
        },
        name: string,
        phone: string
    }
}

const Order = ({ navigation }) => {

    // state
    let [isLoading, setIsLoading] = useState<boolean>(true);
    let [isOnline, setIsOnline] = useState<boolean>(false);
    let [notFound, setIsNotFound] = useState<boolean>(true);
    let [order, setOrder] = useState<Order>();
    let [orderDate, setOrderDate] = useState<string>("");
    let [orderID, setOrderID] = useState<string | null | undefined>("");
    let [barang, setBarang] = useState<string>("");
    let [ongkir, setOngkir] = useState<string>("");
    let [isUserCancel, setIsUserCancel] = useState<boolean>(false);
    let [alasan, setAlasan] = useState<string>("");
    let [orderid, setOrderid] = useState<string>("");
    let [kurirAccept, setKurirAccept] = useState<boolean>(false);
    let [status1, setStatus1] = useState<boolean>(false);
    let [status2, setStatus2] = useState<boolean>(false);
    let [status3, setStatus3] = useState<boolean>(false);
    let [status4, setStatus4] = useState<boolean>(false);
    let [status, setStatus] = useState<string>("");
    let [coords, setCoords] = useState<{
        latitude: number,
        longitude: number
    }>();

    let [refresh, setRefresh] = useState<boolean>(false);

    // variables

    let intervalOrder: NodeJS.Timeout

    const isFocused = useIsFocused();


    const useIsMounted = () => {

        const isMounted = React.useRef(false)

        useEffect((): any => {

            isMounted.current = true
            return () => (isMounted.current = false)

        }, [])

        return isMounted
    }


    const mounted = useIsMounted();

    useEffect(() => {

        requestLocationPermission();
        fetchOrder()// 10 seconds

        // return () => {
        //     console.log('un mounted find order')
        //     clearInterval(intervalOrder)
        // }
    }, [isFocused]);


    // useEffect(() => {
    //     requestLocationPermission();
    //     fetchOrder();

    //     return () => {
    //         clearInterval(intervalOrder)
    //     };

    // }, [isFocused]);

    // functions

    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Onqir',
                    'message': 'Onqir mau mengakses lokasi device mu ',
                    buttonPositive: 'OK'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
            } else {
                console.log("location permission denied")
                alert("Location permission denied");
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const updateLocation = (token: string | null) => {

        Geolocation.getCurrentPosition(
            async (position) => {
                await fetch('http://192.168.43.178:8000/courier/update/location', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + Math.floor(Math.random() * 9999 + 1000)
                    },
                    body: JSON.stringify({
                        token,
                        coords: position.coords
                    })
                })
                    .then(res => {
                        return res.json();
                    })
                    .then(res => {
                        console.log('is mounted', mounted);
                        // console.log(res.msg);
                        // setCoords(position.coords);
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            },
            (err) => {
                console.log('failed to retreive user location', err);
            },
            { enableHighAccuracy: true, distanceFilter: 100, timeout: 8000 }
        )
    };

    const fetchOrder = async () => {

        return await AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then(async (res) => {
                let body = {
                    token: res
                }
                console.log('test');
                updateLocation(res);

                return await fetch('http://192.168.43.178:8000/courier/order/get', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                    .then(async result => {
                        return await result.json();
                    })
                    .then((result) => {
                        if (result.msg) {
                            console.log('this one working ?? ', result.online);
                            setIsOnline(result.online);
                            setIsNotFound(true);
                        } else {
                            console.log('this is running because the onrefresh');
                            setOrder({
                                penerima: result.penerima,
                                pengirim: result.pengirim
                            });
                            setOrderDate(result.date);
                            setOrderID(result.id);
                            setIsUserCancel(result.user_cancel);
                            setAlasan(result.alasan);
                            setOngkir(result.ongkir);
                            setBarang(result.barang);
                            setKurirAccept(result.kurir_accept);
                            setOrderid(result._id);
                            setStatus(result.delivery_status);
                            setTimeout(() => {
                                setIsLoading(false);
                            }, 2000)
                        }
                    })
                    .catch(error => {
                        console.log('ERROR :: ', error);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    };

    const cancelOrder = async () => {

        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, r: string | undefined) => {

            let body = {
                _id: orderid,
                token: r
            }
            await fetch('http://192.168.43.178:8000/courier/cancel/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
                .then(res => {
                    return res.json()
                })
                .then(res => {

                    if (res.msg === 'success canceled') {
                        Alert.alert('Pesan sistem', ' Kamu baru saja meng cancel orderan , silahkan tunggu orderan lainnya');
                        fetchOrder();
                    }
                })
                .catch(err => {
                    throw new Error(err);
                })
        })
    }

    const acceptOrder = async () => {

        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, r: string | undefined) => {

            let body = {
                _id: orderid,
                token: r
            }

            await fetch('http://192.168.43.178:8000/courier/accept/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body)
            })
                .then(res => {
                    return res.json()
                })
                .then(res => {
                    console.log(res);
                    if (res.msg === 'success accepted') {
                        setKurirAccept(true);
                    }
                })
                .catch(err => {
                    throw new Error(err);
                })

        })
    }

    const setDeliverStatus = async (status: string) => {


        let body = {
            order_id: orderid,
            status: status,
            cancelable: true,
            picked_up: false
        }

        fetch('http://192.168.43.178:8000/order/courier/set/deliver/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json();
            })
            .then(async res => {
                // return await navigation.goBack();

                console.log('set deliver status ??');
            })
            .catch(err => {
                console.log('error occured ?');
                throw new Error(err);
            })

        return onRefresh();
    };

    const setDeliverStatusPickedUp = async (status: string) => {

        let body = {
            order_id: orderid,
            status: status,
            cancelable: false,
            picked_up: true
        }

        fetch('http://192.168.43.178:8000/order/courier/set/deliver/status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                return await res.json();
            })
            .then(res => {
                // return await navigation.goBack();
                console.log('set deliverstatups picked up ?');

            })
            .catch(err => {
                console.log('error occured ?');
                throw new Error(err);
            })
        return onRefresh();
    };

    const setDoneOrder = async () => {
        // /order/single/set-to-done


        let body = {
            order_id: orderid
        }
        return fetch('http://192.168.43.178:8000/order/single/set-to-done', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(async res => {
                return await res.json();
            })
            .then(async res => {
                // return await navigation.goBack();

                return await navigation.navigate('home');
            })
            .catch(err => {
                console.log('error occured ?');
                throw new Error(err);
            })
    };


    const onRefresh = React.useCallback(() => {

        setRefresh(true);

        wait(2500).then(() => {

            fetchOrder();
            setRefresh(false);
        });


    }, [refresh])

    return (
        <ScrollView refreshControl={<RefreshControl refreshing={refresh} onRefresh={onRefresh} />}
            scrollEventThrottle={16} style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar showHideTransition='fade' barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
            <View style={{ flex: 1, padding: 16, marginBottom: 40 }}>
                <Text style={{ fontSize: 35, fontWeight: 'bold', textAlign: 'center' }}>Orderan</Text>
                {
                    orderID ? (
                        <View style={{ flex: 1 }}>
                            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Order ID {orderID}</Text>

                            <View style={{ paddingTop: 20 }}>
                                <View style={{ flexDirection: 'row' }}>
                                    <Icon name="send-outline" size={30} color="blue" />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 24 }}>Pengirim</Text>
                                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{order?.pengirim.name}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 17 }}>{order?.pengirim.address}</Text>
                                        </View>
                                        <Text style={{ fontSize: 18 }}>*Detail : {order?.pengirim.address_detail}</Text>
                                    </View>
                                </View>

                                <View style={{ flexDirection: 'row', marginTop: 40 }}>
                                    <Icon name="cube-outline" size={30} color="blue" />
                                    <View style={{ marginLeft: 10, flex: 1 }}>
                                        <Text style={{ fontSize: 24 }}>Penerima</Text>
                                        <Text style={{ fontSize: 22, fontWeight: 'bold' }}>{order?.penerima.name}</Text>
                                        <View style={{ flex: 1 }}>
                                            <Text style={{ fontSize: 17 }}>{order?.penerima.address}</Text>
                                        </View>
                                        <Text style={{ fontSize: 18 }}>*Detail : {order?.penerima.address_detail}</Text>
                                    </View>
                                </View>
                            </View>

                            <Text style={{ marginTop: 50, fontSize: 24 }}>Barang yg dikirim</Text>
                            <Text style={{ padding: 10, borderRadius: 10, fontSize: 24, textAlign: 'center', borderWidth: 1 }}>{barang}</Text>

                            <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('index_map', { pengirimCoordinate: order?.pengirim.coords, penerimaCoordinate: order?.penerima.coords, addressDetailPengirim: order?.pengirim.address_detail, addressDetailPenerima: order?.penerima.address_detail, coords: coords, pengirimDetail: order?.pengirim, penerimaDetail: order?.penerima })} style={{ marginTop: 15, flexDirection: 'row', padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
                                <Icon name="map-outline" size={30} color="white" />
                                <Text style={{ fontSize: 23, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>Map</Text>
                            </TouchableOpacity>

                            <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Biaya Ongkir</Text>

                                <Text style={{ fontSize: 40, marginTop: 15, fontWeight: '700' }}>{formatRupiah(String(ongkir), 'Rp. ')}</Text>
                            </View>
                            {
                                kurirAccept ? (
                                    <View style={{ marginTop: 20 }}>
                                        <Text style={{ fontWeight: 'bold', fontSize: 25 }}>Opsi</Text>
                                        <Text style={{ fontSize: 20 }}>Klik jika : </Text>
                                        <View style={{ marginTop: 20 }}>
                                            {
                                                status === 'belum di ambil' ? (
                                                    <TouchableOpacity onPress={() => setDeliverStatus('otw')} style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 9, borderWidth: 1 }}>
                                                        <Text style={{ fontSize: 23 }}>Menuju Lokasi Pengambilan Barang</Text>
                                                    </TouchableOpacity>
                                                ) : null
                                            }
                                            {
                                                status === 'otw' ? (
                                                    <TouchableOpacity onPress={() => setDeliverStatusPickedUp('sudah di ambil')} style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 9, marginTop: 10, backgroundColor: 'blue' }}>
                                                        <Text style={{ fontSize: 23, color: 'white' }}>Barang sudah di pickup</Text>
                                                    </TouchableOpacity>
                                                ) : null
                                            }

                                            {
                                                status === 'sudah di ambil' ? (
                                                    <TouchableOpacity onPress={() => setDeliverStatusPickedUp('sedang di antar')} style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 9, marginTop: 10, backgroundColor: 'blue' }}>
                                                        <Text style={{ fontSize: 23, color: 'white' }}>Barang dalam perjalanan</Text>
                                                    </TouchableOpacity>
                                                ) : null
                                            }

                                            {
                                                status === 'sedang di antar' ? (
                                                    <TouchableOpacity activeOpacity={.8} onPress={() => setDoneOrder()} style={{ justifyContent: 'center', alignItems: 'center', padding: 15, borderRadius: 9, backgroundColor: 'blue', marginTop: 10 }}>
                                                        <Text style={{ fontSize: 23, color: 'white' }}>Barang sudah di terima</Text>
                                                    </TouchableOpacity>
                                                ) : null
                                            }
                                        </View>
                                    </View>
                                ) : (
                                        <View style={{ flex: 1, marginTop: 20 }}>
                                            <TouchableOpacity onPress={() => acceptOrder()} style={{ marginTop: 15, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'green' }}>
                                                <Text style={{ fontSize: 23, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>Terima</Text>
                                            </TouchableOpacity>
                                            <TouchableOpacity onPress={() => cancelOrder()} style={{ marginTop: 15, padding: 10, borderRadius: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: 'red' }}>
                                                <Text style={{ fontSize: 23, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>Tolak</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                            }
                        </View>
                    ) : (
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 100 }}>
                                <Text style={{ fontSize: 30, fontWeight: 'bold', letterSpacing: .5, textAlign: 'center' }}>- Belum ada orderan masuk nih, harap tunggu sampai ada yg order :) -</Text>
                            </View>
                        )
                }
            </View>
        </ScrollView>
    )
}


export default Order;