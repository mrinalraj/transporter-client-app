import { StyleSheet } from 'react-native'
import Colors from './Colors'
import Dimens from './Dimens';

export default CustomStyles = StyleSheet.create({
    headText: { fontSize: 20, letterSpacing: 0.5, color: '#626262' },
    subHeadText: { fontSize: 15, letterSpacing: 0.2, color: '#c4c4c4' },
    inputStyle: {
        marginTop: Dimens.hp('4'),
        paddingBottom: 3,
        fontSize: 15,
        borderBottomColor: Colors.blackColor,
        borderBottomWidth: 1.5,
        letterSpacing: 0.5,
    },
})