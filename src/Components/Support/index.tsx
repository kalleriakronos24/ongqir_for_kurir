import React from 'react';
import {
    View,
    Text
} from 'react-native';

const SupportSection = () => {

    return (
        <View style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text>{'\u00A9'} Copyright Ongqir 2020. All Rights Reserved</Text>
            <Text style={{ marginTop: 7 }}>Support : 0896 9063 9639 | Whatsapp</Text>
        </View>
    )
}

export default SupportSection;