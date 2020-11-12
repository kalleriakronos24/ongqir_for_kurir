import React, { useRef, useState, useEffect, memo } from 'react';
import { Modalize } from 'react-native-modalize'
import {
    View,
    Text,
    TextInput,
    Dimensions,
    ActivityIndicator,
    TouchableOpacity,
    PermissionsAndroid,
    Platform,
    KeyboardAvoidingView,
    StatusBar,
    ToastAndroid
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { formatRupiah, callNumber } from '../../utils/functionality';

type ModalMapProps = {
    title: string,
    addressDetail: string,
    estimasi: number,
    detail: {
        address: string,
        phone: string,
        name: string
    }
};

export const ModalMap = ({
    title,
    addressDetail,
    estimasi,
    detail
}: ModalMapProps) => {


    const modalizeRef = useRef(null);
    const { height, width } = Dimensions.get('window');

    useEffect(() => {


    }, [])

    const modalContent = () => {
        return (
            <KeyboardAvoidingView removeClippedSubviews={true}
                style={{ flex: 1, backgroundColor: 'white' }}>
                <View style={{
                    padding: 16,
                }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Detail Lokasi {title}</Text>

                    <Text style={{ padding: 10, fontSize: 17 }}>- {addressDetail}</Text>


                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25 }}>Nama {title}</Text>

                    <Text style={{ padding: 10, fontSize: 17 }}>- {detail.name}</Text>


                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25 }}>No HP {title}</Text>


                    <View style={{ padding: 10, flexDirection: 'row' }}>

                        <Text style={{ fontSize: 17 }}>- {detail.phone}</Text>
                        <TouchableOpacity onLongPress={() => ToastAndroid.showWithGravity('Panggil Penerima', ToastAndroid.LONG, ToastAndroid.BOTTOM)} activeOpacity={.8} onPress={() => callNumber(detail.phone)} style={{ padding: 6, marginLeft: 10, borderRadius: 10, width: 150, backgroundColor: 'green', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                            <Icon name="call-outline" size={30} color="white" />
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: 'white', marginLeft: 10 }}>Panggil</Text>
                        </TouchableOpacity>
                    </View>

                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 25 }}>Lokasi {title}</Text>

                    <Text style={{ padding: 10, fontSize: 17 }}>- {detail.address}</Text>


                </View>
            </KeyboardAvoidingView>
        )
    }

    return (
        <Modalize
            ref={modalizeRef}
            alwaysOpen={200}
            modalHeight={height - (StatusBar?.currentHeight)}
            handlePosition='inside'
            scrollViewProps={{
                keyboardShouldPersistTaps: 'always',
                showsVerticalScrollIndicator: false
            }}
            modalStyle={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.45,
                shadowRadius: 16,
            }}
        >
            {modalContent()}
        </Modalize>
    )
}