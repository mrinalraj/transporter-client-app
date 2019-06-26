import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Picker, } from 'react-native'
import Colors from '../../res/Colors'
import NavBar from '../../components/NavBar'
import Dimens from '../../res/Dimens'
import MyRequestsList from '../../components/MyRequestsList'
import LoadingDialog from '../../components/LoadingDialog';
import { SecureStore } from 'expo';
import { ACCESS_TOKEN, BASE_API } from '../../res/Constants';
import Axios from 'axios';

class MyRequests extends Component {
    state = {
        loading: false,
        list: []
    }

    _getData = async _ => {
        this.setState({ loading: true })
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        if (!!accessToken) {
            Axios.post(`${BASE_API}/listMyRequests`, '', { headers: { accessToken } })
                .then(({ data }) => {
                    this.setState({ loading: false })
                    if (!data.success)
                        return alert(dara.payload.error.message)
                    const list = data.payload.result.data.map(e => e.rideData)
                    this.setState({ list })
                })
                .catch(err => alert(err))
        }
    }

    componentDidMount() {
        this._getData()
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
                <NavBar title='My Request' searchEnabled />
                {/* <View style={{ margin: Dimens.padding / 2, marginTop: 0, marginBottom: 0, borderRadius: 5, backgroundColor: Colors.White, paddingTop: Dimens.padding / 12, paddingBottom: Dimens.padding / 12 }}>
                    <Picker prompt='Select Catagory' style={{ marginTop: -4, marginBottom: -4, marginEnd: -8, }} selectedValue={this.state.catagory} onValueChange={(val, i) => this.setState({ catagory: val })}>
                        <Picker.Item label='Pending' value='Pending' />
                        <Picker.Item label='Accepted' value='Accepted' />
                        <Picker.Item label='Ongoing' value='Ongoing' />
                        <Picker.Item label='Complete' value='Completed' />
                    </Picker>
                </View> */}
                <ScrollView style={Styles.rootView}>
                    {
                        this.state.list.map((d, i) => {
                            return <MyRequestsList {...d} key={i} />
                        })
                        // .sort((a, b) => a. - b)

                        // .filter()

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

export default MyRequests