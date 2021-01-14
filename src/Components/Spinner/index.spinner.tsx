import React from 'react';
import {
    View,
    Modal,
    Text,
    ActivityIndicator
} from 'react-native';

type Props = {
    modalVisible : boolean
}

const Spinner = ({ modalVisible }: Props ) => {

    return (
        <Modal
            style={{
                flex: 1
            }}
            animationType="fade"
            transparent={true}
            visible={modalVisible}>
            <View style={{
                flex: 1,
                backgroundColor:'rgba(0,0,0,0.8)',
                backfaceVisibility: 'visible',
                justifyContent: 'center',
                alignItems: 'center',
                padding: 16,
            }}>
                <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', textAlign: 'center' }}>Memproses data mu ke server ...</Text>
                <ActivityIndicator color="white" size="large" />
            </View>
        </Modal>
    )
};


export default Spinner;