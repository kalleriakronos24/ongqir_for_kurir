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
import { SERVER_URL, GOOGLE_MAPS_APIKEY } from '../../utils/constants';

const Ride = ({ navigation }): React.ReactElement => {


    //state
    let [address, setAddress] = useState<string>("");


    //variables
    let intervalLocation: NodeJS.Timeout;


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

    }, [])


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

    const updateLocation = async () => {
        await AsyncStorage.getItem('LOGIN_TOKEN', async (e, r: string | undefined) => {
            if (r) {
                return Geolocation.watchPosition(
                    async (position) => {
                        console.log('is this running ???????');
                        await fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + position.coords.latitude + ',' + position.coords.longitude + '&key=' + GOOGLE_MAPS_APIKEY)
                            .then((response) => response.json())
                            .then((res) => {
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
                    { enableHighAccuracy: true, useSignificantChanges: true, timeout: 6000 }
                )
            } else {
                // do nothing when the token is empty;
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
        </View>
    )
}


export default Ride;