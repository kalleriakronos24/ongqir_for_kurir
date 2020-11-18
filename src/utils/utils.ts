import { Linking, Alert } from 'react-native';
import VersionCheck from 'react-native-version-check';


const CheckVersion = async () => {

    await VersionCheck.getCountry()
        .then(country => console.log('Country :: ', country));        // KR
    console.log('package name', VersionCheck.getPackageName());        // com.reactnative.app
    console.log('build number :', VersionCheck.getCurrentBuildNumber()); // 10
    console.log('current version : ', VersionCheck.getCurrentVersion());     // 0.1.1

    await VersionCheck.getLatestVersion()
        .then(latestVersion => {
            console.log(latestVersion);    // 0.1.2
        });

    // VersionCheck.getLatestVersion({
    //     provider: 'appStore'  // for iOS
    // })
    //     .then(latestVersion => {
    //         console.log(latestVersion);    // 0.1.2
    //     });

    await VersionCheck.getLatestVersion({
        provider: 'playStore'  // for Android
    })
        .then(latestVersion => {
            console.log('Get latest version of this app in playstore : ', latestVersion);    // 0.1.2
        });

    // VersionCheck.getLatestVersion()    // Automatically choose profer provider using `Platform.select` by device platform.
    //     .then(latestVersion => {
    //         console.log('Auto Select Provider Version : ', latestVersion);    // 0.1.2
    //     });

    await VersionCheck.needUpdate()
        .then(async res => {
            // console.log('if this returns true then it navigate them to Our Playstore App Link', );    // true
            if (res.isNeeded) {

                Alert.alert(
                    'Update Aplikasi',
                    'Unduh Versi Terbaru Aplikasi untuk menikmati Fitur Fitur Menarik Lainnya. ',
                    [
                        {
                            text: 'UPDATE',
                            onPress: async () => {
                                await Linking.openURL(res.storeUrl);
                            }
                        },
                        {
                            text: 'CANCEL',
                            onPress: () => {
                                // do nothing when user cancel the required to update button
                            },
                            style: 'cancel'
                        },
                    ],
                );  // open store if update is needed.
            }
        });
};


export {
    CheckVersion
}