import React from 'react'
import { View, } from 'react-native'
import { Button } from 'react-native-paper'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const FooterButton = props => {
    const { icon, name, cta } = props
    let { disabled } = props || false

    return (
        <View style={{ position: 'absolute', bottom: 0, left: 0, width: Dimens.windowWidth }}>
            <Button dark={false} color={Colors.accentColor} style={{ borderRadius: 0, flex: 1, }} contentStyle={{ height: wp('12') }} mode='contained' icon={icon} onPress={cta} disabled={disabled}>
                {name}
            </Button>
        </View>
    )
}

export default FooterButton