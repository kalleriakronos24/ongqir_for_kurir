import React, { useState, useRef } from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ScrollView,
    Alert
} from 'react-native';
import { SERVER_URL } from '../../utils/constants';
import RBSheet from "react-native-raw-bottom-sheet";
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import SupportSection from '../../Components/Support';
import Spinner from '../../Components/Spinner/index.spinner';


// @ts-ignore
const Register = ({ navigation }) => {

    // constants 
    const options: ImagePickerOptions = {
        mediaType: 'photo',
        quality: 1.0,
        storageOptions: {
            skipBackup: true
        }
    };


    // state and vars
    /**
     * Foto KTP
     */
    let [fotoKtp, setFotoKtp] = useState<{ data: string }>({ data: '' });
    let [ktpType, setKtpType] = useState<string | undefined>();
    let [ktpFilename, setKtpFilename] = useState<string>('');


    /**
     * Foto Diri
     */
    let [fotoDiri, setFotoDiri] = useState<{ data: string }>({ data: '' });
    let [fotoDiriType, setFotoDiriType] = useState<string | undefined>();
    let [fotoDiriFilename, setFotoDiriFilename] = useState<string>('');

    /**
     * Foto STNK
     */
    let [fotoSTNK, setFotoSTNK] = useState<{ data: string }>({ data: '' });
    let [fotoSTNKType, setFotoSTNKType] = useState<string | undefined>();
    let [fotoSTNKFilename, setFotoSTNKFilename] = useState<string>('');

    let [nama, setNama] = useState<string>('');
    let [noHp, setNoHp] = useState<string>('');
    let [email, setEmail] = useState<string>('');
    let [password, setPassword] = useState<string>('');
    let [isModalVisible, setIsModalVisible] = useState<boolean>(false);
    let [emailRespCode, setEmailRespCode] = useState<number>(0);

    let [successVerif, setSuccessVerif] = useState<string>("");

    let shetRef = useRef<RBSheet>(null);

    // functions 
    const fotoKtpHandler = () => {
        ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                // const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setKtpFilename(response.fileName || response.uri.substr(response.uri.lastIndexOf('/') + 1));
                setFotoKtp(response);
                setKtpType(response.type);
            }
        });
    }

    const fotoDiriHandler = () => {
        ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                // const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setFotoDiriFilename(response.fileName || response.uri.substr(response.uri.lastIndexOf('/') + 1));
                setFotoDiri(response);
                setFotoDiriType(response.type);
            }
        });
    }

    const fotoSTNKHandler = () => {

        ImagePicker.launchImageLibrary(options, (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {

                // const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setFotoSTNKFilename(response.fileName || response.uri.substr(response.uri.lastIndexOf('/') + 1));
                setFotoSTNK(response);
                setFotoSTNKType(response.type);
            }
        });
    }


    const submitRegistForm = async () => {

        setIsModalVisible(true);

        if (!fotoKtp.data || !fotoSTNK.data || !fotoDiri.data || !nama || !noHp || !email || !password) {
            Alert.alert('Pesan Sistem', "Harap pastikan semua field ter isi sebelum meng-klik daftar");

            return;
        }


        if (password.length < 8) {
            Alert.alert('Pesan sistem', "Panjang password setidaknya harus 8 !")
            return;
        }
        let token = Math.random() * 9999 + 'abcd'

        // const formData = new FormData();

        // formData.append('name', data.name);
        // formData.append('email', data.email);
        // formData.append('alamat', data.alamat);
        // formData.append('nik', data.nik);

        // formData.append('type', data.type);
        // formData.append('password', password);

        // formData.append('fotoKtp', {
        //     uri: 'file://' + data.fotoKtp.path,
        //     filename: data.ktpFilename,
        //     type: data.ktpType
        // });
        // formData.append('fotoDiri', {
        //     uri: 'file://' + data.fotoDiri.path,
        //     filename: data.fotoDiriFilename,
        //     type: data.fotoDiriType
        // });
        let type = 'courier';

        await RNFetchBlob.fetch(
            "POST",
            `${SERVER_URL}/user/add`,
            {
                Authorization: 'Bearer' + token,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            },
            [
                {
                    name: 'name', data: nama
                },
                {
                    name: 'email', data: email
                },
                {
                    name: 'nohp', data: noHp
                },
                {
                    name: 'type', data: type
                },
                {
                    name: 'password', data: password
                },
                {
                    name: 'fotoKtp', filename: `foto-ktp-${nama.split(' ')[0]}-${noHp}-${Math.round(Math.random() * 9999)}.jpg`, data: fotoKtp.data, type: ktpType
                },
                {
                    name: 'fotoDiri', filename: `foto-diri-${nama.split(' ')[0]}-${noHp}-${Math.round(Math.random() * 9999)}.jpg`, data: fotoDiri.data, type: fotoDiriType
                },
                {
                    name: 'fotoSTNK', filename: `foto-stnk-${nama.split(' ')[0]}-${noHp}-${Math.round(Math.random() * 9999)}.jpg`, data: fotoSTNK.data, type: fotoSTNKType
                }
            ]
        )
            .then((res) => {
                return res.json();
            })
            .then(res => {

                if (res.msg === "Email Telah Digunakan") {
                    setIsModalVisible(false)
                    Alert.alert('Pesan Sistem', "Email telah digunakan, silahkan pakai email lainnya");
                    return;
                } else if (res.code === 1) {
                    setIsModalVisible(false)
                    setEmailRespCode(res.code);
                    setSuccessVerif("Pendaftaran berhasil, klik menuju login untuk login ke aplikasi");
                    shetRef.current?.open();
                    return;
                } else {
                    setIsModalVisible(false)
                    setSuccessVerif(res.msg);
                    shetRef.current?.open();
                }

            })
            .catch(err => {
                setIsModalVisible(false);
                Alert.alert('Pesan Sistem', "Masalah koneksi, silahkan coba lagi!");
                throw new Error(err);
            })
    }


    const resendEmailVerification = async () => {

        setIsModalVisible(true);

        let body = {
            email: email
        };

        await fetch(`${SERVER_URL}/user/resend-verification`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
            .then(res => {
                return res.json()
            })
            .then(res => {
                if (res.code === 0) {
                    setIsModalVisible(false)
                    setSuccessVerif(res.msg);
                }
                setEmailRespCode(res.code);
                setIsModalVisible(false)
                setSuccessVerif("Gagal mengirim ulang link verifikasi, silahkan coba lagi.");
                return;
            })
            .catch(err => {
                setEmailRespCode(1);
                setIsModalVisible(false);
                setSuccessVerif("masalah koneksi, coba lagi");

                throw new Error(err);
            })
    }


    return (
        <ScrollView style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight, paddingBottom: 50 }}>
            <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" translucent />
            <Spinner modalVisible={isModalVisible} />
            <View style={{ padding: 16, flex: 1, paddingBottom: 100 }}>
                <View style={{ height: 180, width: '100%', borderRadius: 10 }}>
                    <Image style={{ height: '100%', width: '100%', alignSelf: 'stretch', borderRadius: 10 }} source={require('../../Assets/logos/4.png')} />
                </View>
                <View style={{ marginTop: 50, alignItems: 'center', flex: 1 }}>
                    <View style={{ flexDirection: 'row' }}>
                        <TouchableOpacity activeOpacity={.8} onPress={fotoDiriHandler} style={{ padding: 15, borderRadius: 7, borderWidth: 1 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{fotoDiri.data ? 'Foto Diri Telah Dipilih' : 'Upload Pass Foto'}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={.8} onPress={fotoKtpHandler} style={{ padding: 15, borderRadius: 7, borderWidth: 1, marginLeft: 5 }}>
                            <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{fotoKtp.data ? 'Foto KTP Telah Dipilih' : 'Upload Foto SIM/KTP'}</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity activeOpacity={.8} onPress={fotoSTNKHandler} style={{ padding: 20, borderWidth: 1, borderRadius: 10, width: '100%', marginVertical: 8 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>{fotoSTNK.data ? 'Foto STNK Telah Dipilih' : 'Upload Foto STNK'}</Text>
                    </TouchableOpacity>

                    <TextInput style={{ padding: 20, borderWidth: 1, borderRadius: 10, width: '100%', marginVertical: 8, fontWeight: 'bold', textAlign: 'center' }}
                        placeholderTextColor="black"
                        placeholder="Nama Sesuai KTP"
                        onChangeText={(e) => setNama(e)}
                        value={nama} />
                    <TextInput style={{ padding: 20, borderWidth: 1, borderRadius: 10, width: '100%', marginVertical: 8, fontWeight: 'bold', textAlign: 'center' }}
                        placeholderTextColor="black"
                        placeholder="Nomor HP"
                        onChangeText={(e) => setNoHp(e)}
                        value={noHp} />
                    <TextInput style={{ padding: 20, borderWidth: 1, borderRadius: 10, width: '100%', marginVertical: 8, fontWeight: 'bold', textAlign: 'center' }}
                        placeholderTextColor="black"
                        placeholder="Alamat Email"
                        onChangeText={(e) => setEmail(e)}
                        value={email} />
                    <TextInput style={{ padding: 20, borderWidth: 1, borderRadius: 10, width: '100%', marginVertical: 8, fontWeight: 'bold', textAlign: 'center' }}
                        placeholderTextColor="black"
                        placeholder="Password"
                        value={password}
                        onChangeText={(e) => setPassword(e)} />
                    {/* <TextInput style={{ padding: 20, borderWidth: 1, borderRadius: 10, width: '100%', marginVertical: 8, fontWeight: 'bold', textAlign: 'center' }}
                        placeholderTextColor="black"
                        placeholder="Ketik ulang Password" /> */}

                    <View style={{ flexDirection: 'row', marginTop: 15 }}>
                        <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center' }}>Dengan mengklik Daftar, anda menyutujui Syarat dan Kententuan dan Kebijakan Privasi Ongqir</Text>
                    </View>
                    <TouchableOpacity onPress={() => submitRegistForm()} style={{ padding: 20, borderRadius: 10, width: '100%', marginVertical: 8, backgroundColor: 'blue', marginTop: 15 }}>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold', color: 'white', fontSize: 25 }}>Daftar</Text>
                    </TouchableOpacity>
                </View>
                <SupportSection />
            </View>
            <RBSheet ref={shetRef}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center' }}>Pendaftaran Berhasil</Text>
                    <Text style={{ marginTop: 15, color: 'blue', fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>{successVerif}</Text>
                    {
                        emailRespCode === 1 ? null : (
                            <TouchableOpacity onPress={() => resendEmailVerification()} style={{ marginTop: 20, backgroundColor: 'blue', padding: 15, borderRadius: 9, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }}>
                                <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: .5 }}>Resend Verification</Text>
                            </TouchableOpacity>
                        )
                    }

                    <TouchableOpacity onPress={() => navigation.replace('login')} style={{ marginTop: 20, backgroundColor: 'blue', padding: 15, borderRadius: 9, justifyContent: 'center', alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', letterSpacing: .5 }}>Menuju Login</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        </ScrollView>
    )
}


export default Register;