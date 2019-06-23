import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Picker, } from 'react-native'
import Dimens from '../../res/Dimens'
import NavBar from '../../components/NavBar'
import Colors from '../../res/Colors'
import MyRidesList from '../../components/MyRidesList'
import { Actions } from 'react-native-router-flux';
import LoadingDialog from '../../components/LoadingDialog';
import { SecureStore } from 'expo';
import { ACCESS_TOKEN, BASE_API } from '../../res/Constants';
import Axios from 'axios';

class MyRides extends Component {
    state = {
        catagory: 1,
        loading: false,
        list: []
    }

    componentDidMount() {
        this._getData()
    }

    _getData = async (type = this.state.catagory) => {
        this.setState({ loading: true })
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        if (!!accessToken) {
            Axios.post(`${BASE_API}/listMyRides`, { type }, { headers: { accessToken } })
                .then(({ data }) => {
                    this.setState({ loading: false })
                    if (!data.success)
                        return alert(data.payload.error.message)

                    this.setState({ list: data.payload.result.data })
                })
                .catch(error => alert(JSON.stringify(error)))
        }
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
                <NavBar title='My Rides' searchEnabled />
                <View style={{
                    borderRadius: 5,
                    backgroundColor: Colors.White,
                    marginRight: Dimens.padding / 2,
                    marginLeft: Dimens.padding / 2
                }}>
                    <Picker prompt='Select Catagory' style={{ marginTop: -4, marginBottom: -4, marginEnd: -8, }} selectedValue={this.state.catagory} onValueChange={(val, i) => {
                        this.setState({ catagory: val })
                        this._getData(val)
                    }}>
                        <Picker.Item label='Upcoming' value={1} />
                        <Picker.Item label='Ongoing' value={2} />
                        <Picker.Item label='Complete' value={3} />
                    </Picker>
                </View>
                <ScrollView style={Styles.rootView}>
                    {
                        this.state.list.length > 0
                            ? this.state.list.map((e, i) => <MyRidesList {...e} key={i} type={this.state.catagory} onPress={() => Actions.RideDetails({ ...e })} />)
                            : null
                    }
                </ScrollView>
                <LoadingDialog visible={this.state.loading} />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    rootView: {
        padding: Dimens.padding / 2,
        paddingTop: 0,
        marginTop: Dimens.padding / 2,
        flexGrow: 1
    }
})

export default MyRides