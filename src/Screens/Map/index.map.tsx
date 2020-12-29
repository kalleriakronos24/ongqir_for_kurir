import {
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    ActivityIndicator,
    Image,
    Dimensions
} from 'react-native';

import React, { useState, useEffect, useRef, MutableRefObject } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';

import MapView, { Marker, MapViewProps, } from 'react-native-maps';
import { ModalMap } from '../../Components/Modal/map_modal';
import MapViewDirections from 'react-native-maps-directions';
import Geolocation, { clearWatch, stopObserving } from 'react-native-geolocation-service';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBORtT7wcFXxJFDsoerlhCiX7ZkcdX4LSk';

const { width, height } = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const IndexMap = ({ navigation, route }) => {

    const { pengirimCoordinate, penerimaCoordinate, addressDetailPengirim, addressDetailPenerima, coords, pengirimDetail, penerimaDetail } = route.params;

    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <View style={{ flex: 1, padding: 16, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ padding: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Lokasi Pengambilan Barang</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('pengirim_map', { pengirimCoordinate: pengirimCoordinate, detail: addressDetailPengirim, coords, pengirimDetail })} style={{ flexDirection: 'row', backgroundColor: 'green', padding: 10, borderRadius: 6 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginRight: 10, color: 'white' }}>Lihat di Map</Text>
                        <Icon name="map-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>

                <View style={{ padding: 30, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderRadius: 10, marginTop: 20 }}>
                    <Text style={{ fontSize: 20, marginBottom: 10 }}>Lokasi Pengantaran Barang</Text>

                    <TouchableOpacity onPress={() => navigation.navigate('penerima_map', { penerimaCoordinate: penerimaCoordinate, detail: addressDetailPenerima, coords, penerimaDetail })} style={{ flexDirection: 'row', backgroundColor: 'green', padding: 10, borderRadius: 6 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', marginRight: 10, color: 'white' }}>Lihat di Map</Text>
                        <Icon name="map-outline" size={30} color="white" />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}


interface Coordinate {
    latitude: number,
    longitude: number
}

const PengirimMap = ({ navigation, route }) => {

    // parameters 
    const { pengirimCoordinate, detail, pengirimDetail } = route.params;

    //state 
    let [isLoading, setIsLoading] = useState<boolean>(true);
    let [currentCoordinate, setCurrentCoordinate] = useState<{
        latitude: number,
        longitude: number
    }>({
        latitude: 0,
        longitude: 0
    });


    let [distance, setDistance] = useState<number>(0);
    let [estimation, setEstimation] = useState<number>(0);

    // refs
    let mapRef = useRef<MapView>(null);


    // functions

    const mapFitToCoordinates = (coords: Coordinate, distance: number, estimation: number): any => {

        console.log('does this working ?');
        setDistance(distance);
        setEstimation(Math.floor(estimation));


        mapRef.current?.fitToSuppliedMarkers(
            [
               "pengirim"
            ],
            {
                edgePadding: {
                    top: 250,
                    right: 250,
                    left: 250,
                    bottom: 250
                }
            }
        );

    };

    // lifecycle
    useEffect(() => {


        console.log('pengirim coord', pengirimCoordinate);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
        // let watchId = Geolocation.watchPosition(
        //     async (position) => {
        //         setCurrentCoordinate({
        //             longitude: position.coords.longitude,
        //             latitude: position.coords.latitude
        //         });
        //     },
        //     (err) => {
        //         console.log('failed to retreive user location', err)
        //     },
        //     { enableHighAccuracy: false, distanceFilter: 300, interval: 10000 }
        // )

        // return () => {
        //     Geolocation.clearWatch(watchId);
        //     console.log('unmounted pengirim');
        // }
    })


    return isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='blue' />
        </View>
    ) : (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
                <View key={1} style={{ flex: 1, position: 'relative' }}>
                    <MapView
                        initialRegion={{
                            latitude: -0.496953,
                            longitude: 117.143931,
                            longitudeDelta: 0.008,
                            latitudeDelta: 0.008
                        }}
                        showsUserLocation={true}
                        showsCompass={false}
                        onLayout={() => mapFitToCoordinates(pengirimCoordinate, 0, 0)}
                        ref={mapRef} style={{ flex: 1 }}>

                        <Marker coordinate={pengirimCoordinate} title="Lokasi Pengirim" identifier="pengirim" description="titik lokasi pengiriman barang" />
                    </MapView>

                    <ModalMap
                        title="Pengirim"
                        addressDetail={detail}
                        estimasi={estimation}
                        detail={pengirimDetail} />
                </View>
            </View>
        )
}

const PenerimaMap = ({ navigation, route }) => {
    // parameters 
    const { penerimaCoordinate, detail, coords, penerimaDetail } = route.params;

    //state 
    let [isLoading, setIsLoading] = useState<boolean>(true);
    let [currentCoordinate, setCurrentCoordinate] = useState<{
        latitude: number,
        longitude: number
    }>();
    let [distance, setDistance] = useState<number>(0);
    let [estimation, setEstimation] = useState<number>(0);



    // refs
    let mapRef = useRef<MapView>(null);


    // functions

    const mapFitToCoordinates = (coords: Coordinate, distance: number, estimation: number): any => {


        setDistance(distance);
        setEstimation(Math.floor(estimation));

        mapRef.current?.fitToSuppliedMarkers(
            [
                "penerima"
            ],
            {
                edgePadding: {
                    top: 250,
                    right: 250,
                    left: 250,
                    bottom: 250
                },
                animated: true
            }
        );

    };

    // lifecycle
    useEffect(() => {

        // setIsLoading(false);
        setTimeout(() => {
            setIsLoading(false);
        }, 1000)
        // Geolocation.getCurrentPosition(
        //     async (position) => {
        //         setCurrentCoordinate({
        //             longitude: position.coords.longitude,
        //             latitude: position.coords.latitude
        //         });
        //     },
        //     (err) => {
        //         console.log('failed to retreive user location', err)
        //     },
        //     { enableHighAccuracy: false, timeout: 8000 }
        // )

        // return () => {
        //     // Geolocation.clearWatch(watchId);
        // }
    })

    return isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
            <ActivityIndicator size='large' color='blue' />
        </View>
    ) : (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <StatusBar animated barStyle='default' backgroundColor='rgba(0,0,0,0.251)' />
                <View key={1} style={{ flex: 1, position: 'relative' }}>
                    <MapView
                        initialRegion={{
                            latitude: -0.496953,
                            longitude: 117.143931,
                            longitudeDelta: 0.008,
                            latitudeDelta: 0.008
                        }}
                        showsUserLocation={true}
                        showsCompass={false}
                        onLayout={() => mapFitToCoordinates(penerimaCoordinate, 0, 0)}
                        ref={mapRef} style={{ flex: 1 }}>
                        {/* 
                        <MapViewDirections
                            origin={currentCoordinate}
                            waypoints={[]}
                            destination={penerimaCoordinate}
                            apikey={GOOGLE_MAPS_APIKEY}
                            strokeWidth={7}
                            strokeColor="blue"
                            optimizeWaypoints={true}
                            onStart={(params) => {
                                console.log(`Started routing between "${params.origin}" and "${params.destination}"`);
                            }}
                            onReady={result => {
                                console.log(`Distance: ${result.distance} km`)
                                console.log(`Duration: ${result.duration} min.`)
                                mapFitToCoordinates(penerimaCoordinate, result.distance, result.duration)
                            }}
                            onError={(errorMessage) => {
                                console.log('error routing', errorMessage);
                                // console.log('GOT AN ERROR');
                            }} /> */}
                        <Marker coordinate={penerimaCoordinate} title="Lokasi Penerima" identifier="penerima" description="titik lokasi Penerima barang" />
                    </MapView>

                    <ModalMap
                        title="Penerima"
                        addressDetail={detail}
                        estimasi={estimation}
                        detail={penerimaDetail} />
                </View>
            </View>
        )
};


export {
    IndexMap,
    PengirimMap,
    PenerimaMap
}