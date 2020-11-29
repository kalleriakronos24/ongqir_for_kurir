import React, { useEffect, useState } from 'react';

import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import ImagePicker, { ImagePickerOptions, ImagePickerResponse } from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
import Icon from 'react-native-vector-icons/Ionicons';
import { formatRupiah } from '../../utils/functionality';
import { SERVER_URL } from '../../utils/constants';
import RNPickerSelect from 'react-native-picker-select';


interface TransactionData {
    id: string,
    courier_id: {
        fullname: string
    },
    date: string,
    reference_id: string,
    amount: number,
    status: boolean,
    bukti_transfer: string
    ke: Bank,
    rejected: boolean
}
const CourierBalance = ({ navigation }) => {

    const barHeight = StatusBar.currentHeight;
    let balance = 1;
    let [data, setData] = useState<TransactionData[]>();
    let [wallet, setWallet] = useState(0);

    useEffect(() => {
        let interval = setInterval(() => {
            fetchTransactionData();
        }, 1000 * 10) // 10s

        return () => {
            clearInterval(interval);
            console.log("cleaned up");
        };
    }, []);

    useEffect(() => {
        fetchTransactionData();
    }, []);


    const fetchTransactionData = async () => {
        await AsyncStorage.getItem("LOGIN_TOKEN", async (err, token: string | undefined) => {
            await fetch(`${SERVER_URL}/get/request/add/wallet/` + token, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    console.log(res);
                    if (res.error) {
                        setData([]);
                    } else {
                        setData(res.data || []);
                        setWallet(res.wallet);
                    }
                })
                .catch((error) => {
                    throw new Error(error);
                });

        });
    };

    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "white", paddingTop: barHeight }}
        >
            <StatusBar
                barStyle="default"
                backgroundColor="rgba(0,0,0,0.251)"
                animated
                translucent
            />
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.goBack()}
                    style={{ padding: 6 }}
                >
                    <Icon name="arrow-back-outline" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16, flex: 1 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        letterSpacing: 0.7,
                        textAlign: "center",
                    }}
                >
                    You have {wallet ? formatRupiah(String(wallet), "Rp. ") : 0} Wallet
        </Text>
                {balance === 0 ? (
                    <>
                        <View
                            style={{
                                flex: 1,
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Text>You dont have enough wallet to get an orders</Text>
                            <TouchableOpacity
                                onPress={() => navigation.push("add_balance")}
                                activeOpacity={0.7}
                                style={{
                                    padding: 6,
                                    marginTop: 10,
                                    borderRadius: 6,
                                    borderWidth: 0.6,
                                    borderColor: "blue",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        letterSpacing: 0.5,
                                        fontWeight: "bold",
                                    }}
                                >
                                    Isi Wallet
                </Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                        <View style={{ padding: 10, marginTop: 20 }}>
                            <Text
                                style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 }}
                            >
                                Transaksi keluarmu akan tampil disini
                        </Text>

                            <View
                                style={{
                                    justifyContent: "space-between",
                                    flex: 1,
                                    marginTop: 10,
                                }}
                            >
                                {data?.length === 0 ? (
                                    <View
                                        style={{
                                            flex: 1,
                                            justifyContent: "center",
                                            alignItems: "center",
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 15,
                                                fontWeight: "bold",
                                                letterSpacing: 0.5,
                                                textAlign: "center",
                                                textTransform: "uppercase",
                                                marginVertical: 50,
                                            }}
                                        >
                                            -Tidak ada Transaksi Keluar ditemukan-
                                    </Text>
                                    </View>
                                ) : (
                                        data?.map((v, i) => {
                                            return (
                                                <View
                                                    style={{
                                                        padding: 10,
                                                        flexDirection: "column",
                                                        height: 200,
                                                        borderRadius: 10,
                                                        borderWidth: 0.7,
                                                        marginBottom: 10,
                                                    }}
                                                >
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            ID :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.id}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row" }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Kode Unik :{" "}
                                                        </Text>
                                                        <Text>{v.reference_id}</Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Status :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.status ? "sudah di verifikasi" : "belum di verifikasi"}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Tanggal :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.date}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            User Name :{" "}
                                                        </Text>
                                                        <Text>
                                                            {v.courier_id.fullname}
                                                        </Text>
                                                    </View>
                                                    <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                        <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                            Bukti Transfer :{" "}
                                                        </Text>
                                                        <TouchableOpacity
                                                            style={{
                                                                padding: 6,
                                                                justifyContent: "center",
                                                                alignItems: "center",
                                                                borderWidth: 1,
                                                                borderColor: "blue",
                                                                borderRadius: 6,
                                                            }}
                                                        >
                                                            <Text
                                                                style={{
                                                                    fontSize: 17,
                                                                    fontWeight: "bold",
                                                                    letterSpacing: 0.5,
                                                                }}
                                                            >
                                                                LIHAT
                                                        </Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                            );
                                        }))
                                }

                                <TouchableOpacity
                                    onPress={() => navigation.navigate("add_wallet")}
                                    activeOpacity={0.7}
                                    style={{
                                        padding: 7,
                                        borderWidth: 1,
                                        borderColor: "green",
                                        borderRadius: 10,
                                        marginTop: 6,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Isi Wallet
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => navigation.navigate("transaction_history")}
                                    activeOpacity={0.7}
                                    style={{
                                        padding: 7,
                                        borderWidth: 1,
                                        borderColor: "green",
                                        borderRadius: 10,
                                        justifyContent: "center",
                                        alignItems: "center",
                                        marginBottom: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            fontWeight: "bold",
                                            letterSpacing: 0.5,
                                        }}
                                    >
                                        Riwayat Transaksi
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
            </View>
        </ScrollView>
    );
};



const TransactionHistory = ({ navigation }) => {

    const barHeight = StatusBar.currentHeight;
    let balance = 1;
    let [data, setData] = useState<TransactionData[]>();
    let [wallet, setWallet] = useState<number>(0);
    let [isModalVisible, setIsModalVisible] = useState<boolean>(false);

    let [selectedImage, setSelectedImage] = useState<string>("");

    useEffect(() => {
        fetchTransactionData();
        return () => {
            console.log("cleaned up");
        };
    }, []);

    const fetchTransactionData = async () => {
        await AsyncStorage.getItem("LOGIN_TOKEN", async (err, token: string | undefined) => {

            await fetch(`${SERVER_URL}/get/user/transaction/done/` + token, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((res) => {
                    return res.json();
                })
                .then((res) => {
                    if (res.error) {
                        setData([]);
                    } else {
                        // console.log('transaction history res.data  :: ');
                        setData(res.data);
                        setWallet(res.wallet);
                    }
                })
                .catch((error) => {
                    throw new Error(error);
                });

        });
    };

    const selectImage = (url: string): any => {
        setIsModalVisible(true);

        return setSelectedImage(url);
    };


    return (
        <ScrollView
            style={{ flex: 1, backgroundColor: "white", paddingTop: barHeight }}
        >
            <StatusBar
                barStyle="default"
                backgroundColor="rgba(0,0,0,0.251)"
                animated
                translucent
            />
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.goBack()}
                    style={{ padding: 6 }}
                >
                    <Icon name="arrow-back-outline" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16, flex: 1 }}>
                <Text
                    style={{
                        fontSize: 18,
                        fontWeight: "bold",
                        letterSpacing: 0.7,
                        textAlign: "center",
                    }}
                >
                    You have {formatRupiah(String(wallet), "Rp. ")} Wallet
        </Text>
                <View style={{ padding: 10, marginTop: 20 }}>
                    <Text
                        style={{ fontSize: 15, fontWeight: "bold", letterSpacing: 0.5 }}
                    >
                        Riwayat Transaksi akan tampil disini
                        </Text>

                    <View
                        style={{
                            justifyContent: "space-between",
                            flex: 1,
                            marginTop: 10,
                        }}
                    >
                        {data?.length === 0 ? (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text
                                    style={{
                                        fontSize: 15,
                                        fontWeight: "bold",
                                        letterSpacing: 0.5,
                                        textAlign: "center",
                                        textTransform: "uppercase",
                                        marginVertical: 50,
                                    }}
                                >
                                    -Tidak ada Riwayat Transaksi ditemukan-
                                    </Text>
                            </View>
                        ) : (
                                data?.map((v, i) => {
                                    return (
                                        <View
                                            key={i}
                                            style={{
                                                padding: 10,
                                                flexDirection: "column",
                                                borderRadius: 10,
                                                borderWidth: 0.7,
                                                marginBottom: 10,
                                            }}
                                        >
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    ID :{" "}
                                                </Text>
                                                <Text>
                                                    {v.id}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row" }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Kode Unik :{" "}
                                                </Text>
                                                <Text>{v.reference_id}</Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Status :{" "}
                                                </Text>
                                                <Text>
                                                    {v.status ? "sudah di verifikasi" : "belum di verifikasi"}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Tanggal :{" "}
                                                </Text>
                                                <Text>
                                                    {v.date}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    User Name :{" "}
                                                </Text>
                                                <Text>
                                                    {v.courier_id.fullname}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Nominal Top up :{" "}
                                                </Text>
                                                <Text>
                                                    {formatRupiah(String(v.amount), "Rp. ")},-
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Top up di tolak Oleh Admin :{" "}
                                                </Text>
                                                <Text>
                                                    {v.rejected ? "Iya." : "Tidak."}
                                                </Text>
                                            </View>
                                            <View style={{ flexDirection: "row", paddingTop: 5 }}>
                                                <Text style={{ fontSize: 15, fontWeight: "bold" }}>
                                                    Bukti Transfer :{" "}
                                                </Text>
                                                <TouchableOpacity

                                                    onPress={() => navigation.navigate('transaction_history_image_view', { url: v.bukti_transfer })}
                                                    style={{
                                                        padding: 6,
                                                        justifyContent: "center",
                                                        alignItems: "center",
                                                        borderWidth: 1,
                                                        borderColor: "blue",
                                                        borderRadius: 6,
                                                    }}
                                                >
                                                    <Text
                                                        style={{
                                                            fontSize: 17,
                                                            fontWeight: "bold",
                                                            letterSpacing: 0.5,
                                                        }}
                                                    >
                                                        LIHAT
                                                        </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    );
                                }))
                        }

                        <TouchableOpacity
                            onPress={() => navigation.push("add_wallet")}
                            activeOpacity={0.7}
                            style={{
                                padding: 7,
                                borderWidth: 1,
                                borderColor: "green",
                                borderRadius: 10,
                                marginTop: 6,
                                justifyContent: "center",
                                alignItems: "center",
                                marginBottom: 20,
                            }}
                        >
                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: "bold",
                                    letterSpacing: 0.5,
                                }}
                            >
                                Isi Wallet
                                    </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* {
                selectedImage ? (
                    <Modal visible={isModalVisible}>
                        <View style={{ flex: 1, backgroundColor: 'black' }}>
                            <ImageViewer style={{ flex: 1, backgroundColor: 'white', height: 200, width: 200, justifyContent: 'center', alignItems: 'center' }} renderImage={() => <Image
                                style={
                                    {
                                        width: '100%',
                                        height: '100%',
                                        alignSelf: 'stretch',
                                        flex: 1,
                                        backgroundColor: 'white'
                                    }
                                }
                                source={{ uri: selectedImage }} />} />
                        </View>
                    </Modal>
                ) : null
            } */}
        </ScrollView>
    );
};

const TransactionHistoryImageView = ({ navigation, route }) => {

    const { url } = route.params
    return (
        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, padding: 16, backgroundColor: 'white' }}>
            <View style={{ height: 350, width: '100%' }}>
                <Image style={{
                    height: '100%',
                    alignSelf: 'stretch',
                    width: '100%'
                }} source={{ uri: url }} />
            </View>
        </View>
    )
}

interface Bank {
    nama_bank: string,
    no_rek: string,
    atas_nama_pemilik: string
};

interface BankSelect {
    value: Bank,
    label: Bank
};

const AddBalanceForm = ({ navigation }) => {
    let [loginToken, setLoginToken] = useState<string | undefined>('');
    let [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        AsyncStorage.getItem("LOGIN_TOKEN", (_err, res: string | undefined) => {
            setLoginToken(res);
            setLoading(false);
        });

        fetchBank();

        return () => {
            console.log('cleaned up');
        }
    }, []);

    const barHeight = StatusBar.currentHeight;
    // const { width, height } = Dimensions.get("window");
    let [imageSrc, setImageSrc] = useState<{ uri: string }>({ uri: '' });
    let [buktiTf, setBuktiTf] = useState<ImagePickerResponse>();
    let [buktiTfType, setBuktiTfType] = useState<string | undefined>('');
    let [isErrorWhenSubmitting, setIsErrorWhenSubmitting] = useState(false);
    let [banks, setBanks] = useState<Bank[] | null>(null);
    let [bankSelect, setBankSelect] = useState<BankSelect[] | null>(null);
    let [selectedBank, setSelectedBank] = useState<Bank>({
        nama_bank: "BCA",
        no_rek: "123123123123",
        atas_nama_pemilik: "UDIN"
    });

    const options: ImagePickerOptions = {
        mediaType: "photo",
        quality: 1.0,
        storageOptions: {
            skipBackup: true,
        },
    };


    const fetchBank = async () => {
        return await fetch(`${SERVER_URL}/fetch-bank`, {
            method: "GET",
        })
            .then(res => {
                return res.json();
            })
            .then(async res => {
                setBanks(res.bank);
                setBankSelect(res.bank_select);
            })
            .catch(err => {
                console.log('err when fetching bank data to the server');
            })
    };

    const openGallery = () => {
        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setImageSrc(source);

                setBuktiTf(response);
                setBuktiTfType(response.type);
            }
        });
    };

    const openCamera = () => {
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.error) {
                console.log("ImagePicker Error: ", response.error);
            } else if (response.customButton) {
                console.log("User tapped custom button: ", response.customButton);
            } else {
                const source = { uri: response.uri };
                // You can also display the image using data:
                // const source = { uri: 'data:image/jpeg;base64,' + response.data };
                setImageSrc(source);
                setBuktiTf(response);
                setBuktiTfType(response.type);
            }
        });
    };

    const rand = Math.floor(Math.random() * 899 + 100);

    const submitForm = async () => {
        let token = Math.random() * 9999 + 'abcd';

        await RNFetchBlob.fetch(
            'POST',
            `${SERVER_URL}/request/add/balance`,
            {
                Authorization: 'Bearer' + token,
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data',
            },
            [
                {
                    name: 'token',
                    data: String(loginToken),
                },
                {
                    name: 'ref',
                    data: String(rand),
                },
                {
                    name: 'buktiTransfer',
                    filename: `bukti-transfer-${token}-${Math.round(Math.random() * 9999)}.jpg`,
                    data: buktiTf?.data,
                    type: buktiTfType,
                },
                {
                    name: 'ke',
                    data: JSON.stringify(selectedBank)
                }
            ]
        )
            .then((res) => {
                return res.json();
            })
            .then((res) => {
                console.log('submit isi wallet :: ', res);
                if (res.error) {
                    setIsErrorWhenSubmitting(true);
                }
                navigation.push("transaction_out");
            })
            .catch((err) => {
                console.log("ini error ", err);
            });
    };

    const onChangeBankSelect = (value: string) => {

        switch (value) {
            case "bca":
                return setSelectedBank({
                    atas_nama_pemilik: "UDIN",
                    no_rek: "21312312312",
                    nama_bank: "BCA"
                })
            case "mandiri":
                return setSelectedBank({
                    atas_nama_pemilik: "UDIN 2",
                    no_rek: "21312312312",
                    nama_bank: "MANDIRI"
                })
            default:
                return null;
        }
    }
    return loginToken !== "" ? (
        <ScrollView
            style={{ flex: 1, backgroundColor: "white", paddingTop: barHeight }}
        >
            <StatusBar
                barStyle="default"
                backgroundColor="rgba(0,0,0,0.251)"
                animated
                translucent
            />
            <View style={{ padding: 16 }}>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => navigation.navigate('transaction_out')}
                    style={{ padding: 6 }}
                >
                    <Icon name="arrow-back-outline" size={30} />
                </TouchableOpacity>
            </View>
            <View style={{ padding: 16, flex: 1, alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 17, letterSpacing: 0.5 }}>
                    Form isi Saldo / Wallet
        </Text>

                <View style={{ marginTop: 20, flex: 1 }}>
                    <View style={{ padding: 10, marginBottom: 5 }}>

                        <View>
                            <Text>Pilih BANK</Text>

                            <RNPickerSelect
                                onValueChange={(value) => onChangeBankSelect(value)}
                                items={[
                                    { label: 'BANK BCA', value: 'bca' },
                                    { label: 'BANK MANDIRI', value: 'mandiri' },
                                ]}
                                style={{
                                    viewContainer: {
                                        borderWidth: 1,
                                        borderRadius: 10
                                    },
                                    inputAndroid: {
                                        color: 'black'
                                    },
                                    placeholder: {
                                        color: 'black'
                                    }
                                }}
                            />

                        </View>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            No. Rek Ongqir : {selectedBank.no_rek}
                        </Text>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            {selectedBank.nama_bank} | Atas Nama : {selectedBank.atas_nama_pemilik}
                        </Text>
                    </View>
                    <View style={{ padding: 10, marginBottom: 5 }}>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            Kode Unik : {rand}
                        </Text>
                        <Text
                            style={{ fontWeight: "bold", fontSize: 15, letterSpacing: 0.5 }}
                        >
                            *Gunakan kode ini di 3 angka belakang nominal kamu transaksi ATM.
              Cth : Rp. 50.{rand}{" "}
                        </Text>
                    </View>

                    <Text
                        style={{
                            fontWeight: "bold",
                            fontSize: 17,
                            letterSpacing: 0.5,
                            marginBottom: 10,
                        }}
                    >
                        Kirim Bukti Transfer
          </Text>
                    <TouchableOpacity
                        onPress={() => openGallery()}
                        style={{
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "blue",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 17,
                                letterSpacing: 0.6,
                                marginRight: 10,
                            }}
                        >
                            Import from Gallery
            </Text>
                        <Icon name="images-outline" size={30} />
                    </TouchableOpacity>
                    <View
                        style={{
                            padding: 20,
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text>---- OR ----</Text>
                    </View>

                    <TouchableOpacity
                        onPress={() => openCamera()}
                        style={{
                            padding: 10,
                            borderWidth: 1,
                            borderColor: "blue",
                            borderRadius: 10,
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "row",
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: "bold",
                                fontSize: 17,
                                letterSpacing: 0.6,
                                marginRight: 10,
                            }}
                        >
                            Take using Camera
            </Text>
                        <Icon name="camera-outline" size={30} />
                    </TouchableOpacity>

                    <View style={{ padding: 10, marginTop: 10 }}>
                        <Text
                            style={{ fontSize: 15, letterSpacing: 0.5, fontWeight: "bold" }}
                        >
                            OUTPUT
            </Text>
                        {
                            imageSrc.uri === '' ? null : (
                                <View
                                    style={{
                                        height: 150,
                                        width: 150,
                                        borderRadius: 5,
                                        marginTop: 6,
                                    }}
                                >
                                    <Image
                                        style={{
                                            alignSelf: "stretch",
                                            height: "100%",
                                            width: "100%",
                                            borderRadius: 5,
                                        }}
                                        source={imageSrc}
                                    />
                                </View>
                            )
                        }

                        <Text style={{ marginTop: 10, fontWeight: 'bold', fontSize: 20 }}>
                            *Catatan : banyak jumlah saldo yang akan kamu transfer , itu akan menjadi saldo mu untuk mencari orderan di Onqir sebagai kurir!
            </Text>
                    </View>
                    <TouchableOpacity
                        disabled={buktiTf?.data === "" ? true : false}
                        onPress={() => submitForm()}
                        style={{
                            borderRadius: 7,
                            borderWidth: 0.7,
                            borderColor: buktiTf?.data === "" ? "red" : "blue",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 60,
                            marginTop: 10,
                            marginBottom: 20,
                        }}
                    >
                        <Text
                            style={{ fontWeight: "bold", fontSize: 20, letterSpacing: 0.6 }}
                        >
                            Kirim
            </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    ) : (
            <View
                style={{
                    backgroundColor: "white",
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <ActivityIndicator color="blue" size="large" />
            </View>
        );
};

export {
    CourierBalance,
    AddBalanceForm,
    TransactionHistory,
    TransactionHistoryImageView
};