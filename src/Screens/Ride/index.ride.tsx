import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    PermissionsAndroid
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-community/async-storage';
import { SERVER_URL } from '../../utils/constants';
import SupportSection from '../../Components/Support';
import { SplashScreen } from '../Splash/index.splash';

const Ride = ({ navigation }): React.ReactElement => {

    //state
    let [address, setAddress] = useState<string>("");
    let [gmapKey, setGmapKey] = useState<string | null>(null);
    
    //variables

    //lifecycle
    useEffect(() => {

        // intervalLocation = setInterval(() => {
        //     return updateLocation();
        // }, 1000 * 5) // 1 minute


        // return () => {
        //     clearInterval(intervalLocation);
        // }
        updateLocation();

        return () => {
            // clearWatch(updateLocation)
        }

    }, []);
    useEffect(() => {

        requestLocationPermission();


        // fetch(`${SERVER_URL}/fetch-gmap-key`, {
        //     method: 'GET',
        //     headers: {
        //         'Content-Type': 'application/json'
        //     }
        // })
        //     .then(res => {
        //         return res.json()
        //     })
        //     .then(res => {

        //     })
        //     .catch(err => {
        //         throw new Error(err);
        //     })
    }, [])


    const requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Ongqir',
                    'message': 'Ongqir mau mengakses lokasi device mu ',
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

    const updateLocation = async () => {
        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, r: string | undefined) => {
            if (r) {

                fetch(`${SERVER_URL}/fetch-gmap-key`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(res => {
                        return res.json()
                    })
                    .then(res => {
                       return Geolocation.watchPosition(
                            async (position) => {
                                await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + res.key)
                                    .then((response) => response.json())
                                    .then((res) => {
                                        console.log('address :: ', res);
                                        setAddress(res.results[0]["address_components"][1]["short_name"]);
                                    });


                                await fetch(`${SERVER_URL}/courier/update/location`, {
                                    method: "POST",
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + Math.floor(Math.random() * 9999 + 1000)
                                    },
                                    body: JSON.stringify({
                                        token: r,
                                        coords: position.coords
                                    })
                                })
                                    .then(res => {
                                        return res.json();
                                    })
                                    .then(res => {
                                        console.log('msg from courier ride api ?', res.msg);
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
                            { useSignificantChanges: true, timeout: 6000 }
                        )
                    })
                    .catch(err => {
                        throw new Error(err);
                    })
            } else {
                // do nothing when the token is empty;
                console.log('TOKEN EMPTY : ', e);
            }
        })

    };


    return (
        <View style={{ flex: 1, paddingTop: StatusBar.currentHeight, backgroundColor: 'white' }}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={{
                    padding: 5,
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 10,
                    borderRadius: 20
                }}
            >
                <Icon name='arrow-back-outline' color='black' size={25} />
            </TouchableOpacity>
            <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ textAlign: 'center', fontSize: 24 }}>Kamu cukup berdiam di halaman ini untuk si Pengorder mengetahui lokasi mu sekarang ini.</Text>

                <Text style={{ marginTop: 20, fontSize: 20 }}>Lokasi mu akan terupdate otomatis jika kamu berada di halaman ini.</Text>
                <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 10 }}>Lokasi mu Sekarang ini : {address ? address : "Tidak Di ketahui"}</Text>


                <Text style={{ marginTop: 20, fontSize: 20 }}>*Catatan : Tutup halaman ini jika kamu sudah mendapatkan orderan</Text>
            </View>

            <SupportSection />
        </View>
    )
}


export default Ride;