import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StatusBar,
    TextInput,
    ToastAndroid
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { SERVER_URL } from '../../utils/constants';

interface Body {
    password: string,
    email: string,
    token: string
}

const Login = ({ navigation }) => {

    let [password, setPassword] = useState<string>("");
    let [email, setEmail] = useState<string>("");
    let [isloginError, setIsLoginError] = useState<boolean>(false);
    let [errorMsg, setErrorMsg] = useState<string>("");
    let [isPasswordHide, setPasswordHide] = useState<boolean>(true);

    const dispatch = useDispatch();
    const device = useSelector(state => state.device);
    const { device_token } = device;

    const body: Body = {
        password: password,
        email: email,
        token: device_token
    };

    const submitLogin = () => {


        if (password === '') {
            setIsLoginError(true);
            setErrorMsg('Password tidak boleh kosong');
            return
        }

        fetch(`${SERVER_URL}/user/login`, {
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
                if (res.code === 'ERR_LOGIN_1') {
                    setIsLoginError(true);
                    setErrorMsg('Username atau password tidak ditemukan.');
                    return;
                }
                if (res.code === 'ERR_LOGIN_2') {
                    setIsLoginError(true);
                    setErrorMsg('Password do not match');
                    return;
                }

                const { tokenA } = res;
                console.log('LOGIN TOKEN : ', tokenA);
                dispatch({ type: 'LOGIN_TOKEN', tokenA });
                AsyncStorage.setItem('LOGIN_TOKEN', tokenA);
                navigation.replace('home');
            })
            .catch(err => {
                console.log('Login error ::: ', err);
                setIsLoginError(true);
                setErrorMsg('Network Error');
                return;
            })
    }


    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" translucent />
            <View style={{ padding: 16, flex: 1 }}>
                <View style={{ height: 180, width: '100%', borderRadius: 10 }}>
                    <Image style={{ height: '100%', width: '100%', alignSelf: 'stretch', borderRadius: 10 }} source={require('../../Assets/logos/4.png')} />
                </View>
                <View style={{ marginTop: 50, justifyContent: 'center', alignItems: 'center' }}>
                    <TextInput style={{
                        padding: 15,
                        borderRadius: 9,
                        width: '100%',
                        borderWidth: 1
                    }}
                        placeholder="Email"
                        placeholderTextColor="black"
                        onChangeText={(v) => setEmail(v)} />
                    <View style={{
                        flexDirection: 'row',
                        borderWidth: 1,
                        borderRadius: 8,
                        width: '100%',
                        alignItems: 'center',
                        marginTop: 15
                    }}>

                        <TextInput
                            style={{
                                padding: 12,
                                width: '90%'
                            }}
                            placeholder="Input Password ..."
                            textContentType='password'
                            secureTextEntry={isPasswordHide ? true : false}
                            placeholderTextColor="black"
                            onChangeText={(v) => setPassword(v)} />
                        <TouchableOpacity onPress={() => setPasswordHide(!isPasswordHide)} activeOpacity={.7} style={{ padding: 6 }}>
                            <Icon name={`eye${isPasswordHide ? '-off-' : '-'}outline`} color='blue' size={24} />
                        </TouchableOpacity>
                    </View>


                    {
                        isloginError ? (
                            <Text style={{ color: 'red', fontWeight: 'bold', fontSize: 20 }}>{errorMsg}</Text>
                        ) : null
                    }

                    <TouchableOpacity style={{ padding: 7 }} onPress={() => ToastAndroid.showWithGravity('Fitur lupa password belum tersedia', ToastAndroid.LONG, ToastAndroid.BOTTOM)}>
                        <Text style={{ textAlign: 'center', color: 'blue', fontWeight: 'bold', fontSize: 20 }}>Lupa Password ?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity activeOpacity={.8} onPress={() => submitLogin()} style={{ padding: 15, borderRadius: 9, backgroundColor: 'blue', width: '100%', marginTop: 50 }}>
                        <Text style={{ fontSize: 25, fontWeight: 'bold', letterSpacing: .5, color: 'white', textAlign: 'center' }}>Masuk</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
};

export default Login;