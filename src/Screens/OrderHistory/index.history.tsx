import React, { useState, useEffect } from 'react'
import { View, Text, ActivityIndicator, StatusBar, Image, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatRupiah } from '../../utils/functionality';


// interface

interface UserData {
    fullname: string,
    foto_diri: string,
    courier_info: {
        balance: number,
        status: boolean
    },
    email: string,
    no_hp: string
}

interface Items {
    delivery_status: string,
    distance: number,
    ongkir: number,
    order_date: string,
    order_id: string,
    penerima: {
        address: string,
        address_detail: string,
        name: string,
        phone: string
    },
    pengirim: {
        address: string,
        address_detail: string,
        name: string,
        phone: string
    },
    status: boolean,
    waktu_barang_terkirim: string,
    user_cancel: boolean,
    courier_cancel: boolean
}

const OrderHistory = ({ navigation, route }) => {

    let [isLoading, setIsLoading] = useState<boolean>(true);

    let [userData, setUserData] = useState<UserData>();
    let [orderItems, setOrderItems] = useState<Items[]>();
    let [count, setCount] = useState<number>(0);
    let [transaksi, setTransaksi] = useState<number>(0);

    useEffect(() => {
        getUserOrder();
    }, []);


    const getUserOrder = () => {

        AsyncStorage.getItem('LOGIN_TOKEN', (e, r) => r)
            .then((res) => {
                let body = {
                    token: res
                };

                fetch('http://192.168.43.178:8000/order/courier/get/done/all', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                })
                    .then(result => {
                        return result.json();
                    })
                    .then((result) => {
                        setUserData(result.data);
                        setOrderItems(result.items);
                        setCount(result.count);
                        setTransaksi(result.transaksi);

                        setTimeout(() => {
                            setIsLoading(false);
                        }, 2000);
                    })
                    .catch(error => {
                        throw new Error(error);
                    })
            })
            .catch(err => {
                throw new Error(err);
            })
    }
    let [refresh, setRefresh] = useState(false);

    const onRefresh = React.useCallback(() => {
        setRefresh(true);
        getUserOrder();
        wait(2000).then(() => setRefresh(false))
    }, [refresh]);

    const wait = (timeout: number) => {
        return new Promise((resolve, reject) => {
            setTimeout(resolve, timeout);
        })
    }
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle='dark-content' translucent backgroundColor='rgba(0,0,0,0.251)' animated />
            {
                isLoading ? (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <Text style={{ fontSize: 20, fontWeight: '600', letterSpacing: 0.5 }}>Loading...</Text>
                        <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                            <ActivityIndicator size='large' color='blue' />
                        </View>
                    </View>
                ) : (
                        <>
                            <ScrollView style={{ flex: 1 }} scrollEventThrottle={16} refreshControl={<RefreshControl refreshing={false} onRefresh={onRefresh} />}>

                                <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
                                    <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" />
                                    <View style={{ padding: 16, flex: 1 }}>
                                        <View style={{ justifyContent: 'center', flex: 1 }}>
                                            <View style={{ height: 140, width: '100%', borderRadius: 10 }}>
                                                <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10 }} source={require('../../Assets/logos/4.png')} />
                                            </View>
                                        </View>

                                        <View style={{
                                            marginTop: 10,
                                            borderBottomWidth: 1,
                                            borderBottomColor: 'black'
                                        }} />

                                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                                            <View style={{ height: 140, width: 140, borderRadius: 10 }}>
                                                <Image style={{ alignSelf: 'stretch', height: '100%', width: '100%', borderRadius: 10 }} source={{ uri: userData?.foto_diri }} />
                                            </View>
                                            <View style={{ flex: 1, paddingHorizontal: 20 }}>
                                                <Text style={{ fontSize: 20 }}>{userData?.fullname}</Text>
                                                <Text style={{ fontSize: 24, fontWeight: 'bold' }}>{userData?.email}</Text>
                                                <Text style={{ fontSize: 20, letterSpacing: .5 }}>{userData?.no_hp}</Text>
                                                <Text>Total Orderan Berhasil : {count}</Text>
                                            </View>
                                        </View>
                                        <View style={{
                                            marginTop: 20,
                                            borderBottomWidth: 1,
                                            borderBottomColor: 'black'
                                        }} />

                                        <View style={{ flex: 1, padding: 16 }}>
                                            <Text style={{ fontSize: 19, fontWeight: '600' }}>History Orderan -- {count}</Text>
                                            {
                                                orderItems?.map((v, i) => {
                                                    return (
                                                        <View key={i} style={{ padding: 8, flex: 1 }}>
                                                            <View>
                                                                <Text style={{ fontSize: 20 }}>tgl : {v.order_date}</Text>
                                                                <View style={{ marginTop: 6 }}>
                                                                    <Text style={{ fontSize: 20 }}>Pengirim</Text>
                                                                    <View style={{ padding: 6 }}>
                                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{v.pengirim.name}  -  {v.pengirim.phone}</Text>
                                                                        <Text>{v.pengirim.address}</Text>
                                                                    </View>

                                                                </View>
                                                                <View style={{ marginTop: 6 }}>
                                                                    <Text style={{ fontSize: 20 }}>Penerima</Text>
                                                                    <View style={{ padding: 6 }}>
                                                                        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{v.penerima.name}  -  {v.penerima.phone}</Text>
                                                                        <Text>{v.penerima.address}</Text>
                                                                    </View>
                                                                </View>
                                                                {
                                                                    v.user_cancel || v.courier_cancel ? (
                                                                        <>
                                                                            <Text style={{ fontSize: 20 }}>Ongkir : {formatRupiah(String(v.ongkir), 'Rp. ')}</Text>
                                                                            <Text style={{ fontSize: 20 }}>Status : {v.status ? 'Barang sudah terkirim' : 'Barang belum terkirim'}</Text>
                                                                            <Text style={{ fontSize: 20, color: 'red', textDecorationLine: 'underline' }}>Orderan di Batalkan oleh kedua pihak</Text>
                                                                        </>
                                                                    ) : (
                                                                            <>
                                                                                <Text style={{ fontSize: 20 }}>Ongkir : {formatRupiah(String(v.ongkir), 'Rp. ')}</Text>
                                                                                <Text style={{ fontSize: 20 }}>Saldo Terpakai : {formatRupiah(String(v.ongkir * (15 / 100)), 'Rp. ')}</Text>
                                                                                <Text style={{ fontSize: 20 }}>Status : {v.status ? 'Barang sudah terkirim' : 'Barang belum terkirim'}</Text>
                                                                                <Text style={{ fontSize: 20 }}>Barang terkirim pada : {v.waktu_barang_terkirim}</Text>
                                                                            </>
                                                                        )
                                                                }
                                                            </View>

                                                            <View style={{
                                                                marginTop: 20,
                                                                borderBottomWidth: 1,
                                                                borderBottomColor: 'black',
                                                                marginBottom: 15

                                                            }} />

                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                </View>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>Total Saldo Terpakai </Text>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold', fontSize: 20 }}>{formatRupiah(String(transaksi), 'Rp. ')}</Text>
                                <View style={{ marginTop: 15, marginHorizontal: 15, marginBottom: 5 }}>
                                    <TouchableOpacity activeOpacity={.7} onPress={() => navigation.navigate('home')} style={{ padding: 6, justifyContent: 'center', alignItems: 'center', backgroundColor: 'blue', height: 45, borderRadius: 10, marginBottom: 30 }}>
                                        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, letterSpacing: .5 }}>Back to home</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </>
                    )
            }
        </View >
    )
}

export default OrderHistory
