import { SERVER_URL } from '../utils/constants';
import {
    Alert
} from 'react-native';


const fetchOrder = async (token: string, navigation: { navigate: (p: string) => void }, type: string): Promise<void> => {

    let body = {
        token: token
    }

    return await fetch(`${SERVER_URL}/courier/order/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(result => {
            return result.json();
        })
        .then(async (result) => {
            if (result.msg) {
                // do nothing
            } else {
                // await navigation('order');
                if (type === 'accept') {
                    await acceptOrder(result._id, token, navigation);
                } else {
                    await cancelOrder(result._id, token, navigation)
                }
            }
        })
        .catch(error => {
            console.log('ERROR :: ', error);
        });
}


const acceptOrder = async (order_id: string, token: string | undefined, navigation: { navigate: (p: string) => void }): Promise<void> => {


    let body = {
        _id: order_id,
        token: token
    }

    await fetch(`${SERVER_URL}/courier/accept/order`, {
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
            if (res.msg === 'success accepted') {
                navigation.navigate('order');
            }
        })
        .catch(err => {
            throw new Error(err);
        })
}

const cancelOrder = async (orderid: string, token : string | undefined, navigation: { navigate: (p: string) => void }) => {

    let body = {
        _id: orderid,
        token: token
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
                return navigation.navigate('order');   
            }
        })
        .catch(err => {
            throw new Error(err);
        })
}

export {
    fetchOrder
}