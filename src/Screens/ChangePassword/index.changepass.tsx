import React, { useState } from 'react';
import {
    View,
    Text,
    StatusBar,
    TextInput,
    Dimensions,
    TouchableOpacity,
    Alert
} from 'react-native';
import { SERVER_URL } from '../../utils/constants';


const ChangePassword = ({ navigation, route }) => {

    const { width, height } = Dimensions.get('window');
    const { email } = route.params;
    let [oldPass, setOldPass] = useState<string>('');
    let [newPass, setNewPass] = useState<string>('');


    const submitChangePassword = async () => {

        const body = {
            email,
            new_password: newPass,
            old_password: oldPass
        };

        console.log('body :', body);

        console.log('server url ', SERVER_URL + '/change-password');

        await fetch(`${SERVER_URL}/change-password`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json();
            })
            .then(res => {
                if (res.msg === 'password changed') {
                    Alert.alert('Pesan Sistem', 'password berhasil di ubah');
                } else {
                    Alert.alert('Pesan Sistem', 'password gagal di ubah, coba lagi');
                }
            })
            .catch(err => {
                console.log('connection error changing password', err)
                Alert.alert('Pesan Sistem', 'Masalah koneksi, silahkan coba lagi');
            })
    };
    return (
        <View style={{ paddingTop: StatusBar.currentHeight, flex: 1, backgroundColor: 'white' }}>
            <View style={{ padding: 16, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Password Lama</Text>
                    <TextInput onChangeText={(v) => setOldPass(v)} style={{ padding: 10, borderWidth: 1, borderRadius: 7, marginTop: 5, width: width - (16 * 2) - 100 }} />
                </View>
                <View style={{ marginTop: 15, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20 }}>Password Baru</Text>
                    <TextInput onChangeText={(v) => setNewPass(v)} style={{ padding: 10, borderWidth: 1, borderRadius: 7, marginTop: 5, width: width - (16 * 2) - 100 }} />
                </View>

                <TouchableOpacity onPress={() => submitChangePassword()} style={{ marginTop: 15, padding: 10, borderWidth: 1, borderRadius: 7, backgroundColor: 'blue' }}>
                    <Text style={{ fontSize: 20, letterSpacing: .5, color: 'white' }}>SIMPAN</Text>
                </TouchableOpacity>

                <View style={{ padding: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Lupa password ? Kontak ke 0896 9063 9639 | Whatsapp</Text>
                </View>
            </View>
        </View>
    )
};

export default ChangePassword;