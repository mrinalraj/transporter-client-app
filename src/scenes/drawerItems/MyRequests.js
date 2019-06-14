import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Picker, } from 'react-native'
import Colors from '../../res/Colors'
import NavBar from '../../components/NavBar'
import Dimens from '../../res/Dimens'
import MyRequestsList from '../../components/MyRequestsList'

class MyRequests extends Component {
    state = {

    }

    data = {
        from: {
            place: 'Roorkee',
            subplace: 'Adarsh Nagar',
            date: '13th May, 2019',
            time: '08:00 AM'
        },
        to: {
            place: 'Dehradun',
            subplace: 'Dehradun',
            date: '16th May, 2019',
            time: '09:00 PM'
        },
        ride: 'Full Load',
        truck: 'Vegetable'
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
                <NavBar title='My Request' searchEnabled />
                <View style={{ margin: Dimens.padding / 2, marginTop: 0, marginBottom: 0, borderRadius: 5, backgroundColor: Colors.White, paddingTop: Dimens.padding / 12, paddingBottom: Dimens.padding / 12 }}>
                    <Picker prompt='Select Catagory' style={{ marginTop: -4, marginBottom: -4, marginEnd: -8, }} selectedValue={this.state.catagory} onValueChange={(val, i) => this.setState({ catagory: val })}>
                        <Picker.Item label='Pending' value='Pending' />
                        <Picker.Item label='Accepted' value='Accepted' />
                        <Picker.Item label='Ongoing' value='Ongoing' />
                        <Picker.Item label='Complete' value='Completed' />
                    </Picker>
                </View>
                <ScrollView style={Styles.rootView}>
                    {/* {this.list.map((e, i) => <TruckListing key={i} {...e} onPress={() => this.cardPressed(e)} />)} */}
                    <MyRequestsList {...this.data} />
                </ScrollView>
            </View>
        );
    }
}


const Styles = StyleSheet.create({
    rootView: {
        padding: Dimens.padding / 2,
        flexGrow: 1
    }
})

export default MyRequests