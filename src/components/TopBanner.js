import React, { Component } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import Dimens from '../res/Dimens'
import Colors from '../res/Colors'

export default TopBanner = () => {
    return (
        <View style={Styles.topBanner}>
            <Image style={{ height: 80, width: 120 }} source={require('../../assets/icon.png')}></Image>
        </View>
    );
}

const Styles = StyleSheet.create({
    topBanner: {
        alignItems: 'center',
        justifyContent: 'center',
        height: Dimens.bannerHeight + Dimens.statusBarHeight,
        backgroundColor: Colors.primaryColor,
        width: Dimens.windowWidth
    },
})