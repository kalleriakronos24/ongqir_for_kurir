import React from 'react';
import {
    View,
    Text,
    Image,
    StatusBar,
    TouchableOpacity
} from 'react-native';
import SupportSection from '../../Components/Support';


const Landing = ({ navigation }: any) => {
    return (
        <View style={{ flex: 1, backgroundColor: 'white', paddingTop: StatusBar.currentHeight }}>
            <StatusBar barStyle="default" backgroundColor="rgba(0,0,0,0.251)" translucent />
            <View style={{ padding: 16, flex: 1 }}>
                <View style={{ height: 180, width: '100%', borderRadius: 10 }}>
                    <Image style={{ height: '100%', width: '100%', alignSelf: 'stretch', borderRadius: 10 }} source={require('../../Assets/logos/4.png')} />
                </View>

                <View style={{ marginTop: 15 }}>
                    <Text style={{ textAlign: 'center', fontSize: 24, fontWeight: 'bold' }}>Selamat Datang di Ongqir</Text>
                </View>

                <View style={{ marginTop: 25, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('login')} style={{ padding: 20, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', width: 140 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Masuk</Text>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity={.8} onPress={() => navigation.navigate('register')} style={{ padding: 20, borderWidth: 1, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginTop: 20, width: 140 }}>
                        <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Daftar</Text>
                    </TouchableOpacity>
                </View>

               <SupportSection/>
            </View>
        </View>
    )
}

export default Landing;
