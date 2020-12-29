import React from 'react';
import { View, Text, ActivityIndicator, StatusBar } from 'react-native';

const LoadingSpinner = () => {
    const isDarkMode = false;
    return (
        <ActivityIndicator
            style={{
                justifyContent: 'center',
                alignItems: 'center'
            }}
            size='large'
            color={isDarkMode ? '#2296F3' : 'blue'}
        />
    );
};

export const SplashScreen = () => {
    const barHeight = StatusBar.currentHeight;
    const isDarkMode = false;
    return (
        <React.Fragment>
            <StatusBar
                backgroundColor={isDarkMode ? 'rgba(22,18,18,0.72)' : 'rgba(0,0,0,0.251)'}
                barStyle='light-content'
                animated
                translucent
            />
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'black',
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingTop: barHeight
                }}
            >
                <LoadingSpinner />
            </View>
        </React.Fragment>
    );
};