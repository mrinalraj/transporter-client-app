import React, { Component } from 'react'
import { View, Text, ScrollView, StyleSheet } from 'react-native'
import Colors from '../res/Colors';
import Dimens from '../res/Dimens';
import { Title, FAB, Subheading, } from 'react-native-paper';
import { Actions } from 'react-native-router-flux';

class RideDetails extends Component {
    state = {

    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
                <View style={{ height: Dimens.statusBarHeight }} />
                <ScrollView style={Styles.rootView}>
                    <Title style={{ color: Colors.White, fontSize: 30 }}>UK 08J 7895</Title>
                    <Subheading>Transporter Name</Subheading>
                    <View style={{ flexDirection: 'row', flex: 1 }}>
                        <Text>Delhi</Text>
                        <Text style={{ textAlign: 'right' }}>Roorkee</Text>
                    </View>
                    <Text>13th May, 2019</Text>
                    <Text>08:00 AM</Text>
                    <Text>Full load</Text>
                </ScrollView>
                <FAB style={{ position: 'absolute', margin: Dimens.padding / 2, bottom: 0, right: 0 }}
                    icon='map'
                    onPress={() => Actions.TruckLiveLocation()} />
            </View>
        )
    }
}
const Styles = StyleSheet.create({
    rootView: {
        padding: Dimens.padding / 2,
        flexGrow: 1
    }
})

export default RideDetails