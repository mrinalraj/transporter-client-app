import { Dimensions, Platform, StatusBar } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const Dimens = {
    windowWidth: wp('100'),
    // windowWidth: (Dimensions.get('window').width),
    // windowHeight: (Dimensions.get('window').height),
    windowHeight: hp('100'),
    statusBarHeight: Platform.OS === 'ios' ? 20 : StatusBar.currentHeight,
    bannerHeight: (Platform.OS === 'ios' ? 20 : StatusBar.currentHeight) + hp('25'),
    padding: wp('10'),
    footerButtonHeight: wp('12') + 5,
    wp: percent => wp(percent),
    hp: percent => hp(percent)
}

export default Dimens