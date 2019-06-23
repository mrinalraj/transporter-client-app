import React, { Component } from 'react'
import { Text, View, KeyboardAvoidingView, ScrollView, TextInput, StyleSheet, Picker, TouchableOpacity } from 'react-native'
import { Subheading, } from 'react-native-paper'
import NavBar from '../components/NavBar'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'
import FooterButton from '../components/FooterButton'
import DatePicker from '../components/DatePicker';
import { Actions } from 'react-native-router-flux';
import Axios from 'axios';
import { BASE_API, ACCESS_TOKEN } from '../res/Constants';
import { SecureStore } from 'expo';
import LoadingDialog from '../components/LoadingDialog';

class CreateRideRequest extends Component {
    state = {
        truckType: 'Open',
        truckSubType: '6 TYRE(19-24 FT)',
        startAddress: {
            location: []
        },
        endAddress: {
            location: []
        },
        loading: false
    }

    truckList = ["Open", "Container", "Trailer",]
    truckSubTypeOpen = ['6 TYRE(19-24 FT)', '10 TYRE', '12 TYRE', '14 TYRE', '18 TYRE', '22 TYRE', 'TEMPO 407', 'LCV(14-17 FT)']
    truckSubTypeContainer = ['32 FT MXL', '32 FT SXL', '19-22 FT SXL', 'LCV(14-17 FT)', '24 FT MXL', '24 FT SXL', '32 FT MXL HQ', '32 FT SXL HQ', '32 FT TXL', '32 FT TXL HQ']
    truckSubTypeTrailer = ['High Bed', 'Low Bed', 'Semi Bed']

    renderSubType = () => {
        switch (this.state.truckType) {
            case 'Open':
                return this.truckSubTypeOpen.map((e, i) => <Picker.Item label={e} key={i} value={e} />)
            case 'Container':
                return this.truckSubTypeContainer.map((e, i) => <Picker.Item label={e} key={i} value={e} />)
            case 'Trailer':
                return this.truckSubTypeTrailer.map((e, i) => <Picker.Item label={e} key={i} value={e} />)
            default:
                return <Picker.Item label='Select Truck type first' value='' />
        }
    }

    renderList = () => {
        return this.truckList.map((t, i) => <Picker.Item key={i} value={t} label={t} />)
    }

    _onLocationSelect = (which, lat, long, address) => {
        this.setState({
            [which]: {
                location: [lat, long],
                address
            }
        })
        Actions.pop()
    }

    _validate = () => {
        return new Promise((resolve, reject) => {
            const { startAddress, endAddress, truckType, truckSubType, startTime, endTime } = this.state;
            (!!startTime && !!endTime && !!truckType && !!truckSubType && startAddress.location.length > 0 && endAddress.location.length > 0) ? resolve() : reject()
        })
    }

    _createRideRequest = () => {
        this._validate()
            .then(async () => {
                this.setState({ loading: true })
                const { startTime, endTime, startAddress, endAddress, truckType, truckSubType } = this.state
                    , accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
                Axios.post(`${BASE_API}/createUserRide`, { startTime, endTime, startAddress, endAddress, truckType, truckSubType }, { headers: { accessToken } })
                    .then(({ data }) => {
                        this.setState({ loading: false })
                        if (!data.success)
                            return alert(data.payload.error.message)
                        
                        Actions.MyRequests()
                    })
                    .catch(err => alert(err))
            })
            .catch(() => {
                alert('All fields are mandatory!')
            })
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1, }}>
                <NavBar title='Create Ride Request' />
                <ScrollView contentContainerStyle={{ flexGrow: 2, padding: Dimens.padding / 2, paddingTop: Dimens.padding / 4 }}>
                    <KeyboardAvoidingView behavior='position'>
                        <Subheading style={{ color: Colors.White }}>Create a ride with the following details</Subheading>
                        <View style={{ marginTop: Dimens.hp(3), }}>

                            <Text style={Styles.labelText}>Load Type</Text>
                            <View style={{ backgroundColor: Colors.White, paddingRight: 10, paddingLeft: 10, borderRadius: 4, marginBottom: Dimens.hp(2) }}>
                                <Picker style={{ margin: -4, marginStart: -8, marginEnd: -8 }}
                                    selectedValue={this.state.truckType}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ truckType: itemValue })}>
                                    {this.renderList()}
                                </Picker>
                            </View>

                            <Text style={Styles.labelText}>Truck Type</Text>
                            <View style={{ backgroundColor: Colors.White, paddingRight: 10, paddingLeft: 10, borderRadius: 4, marginBottom: Dimens.hp(2) }}>
                                <Picker style={{ margin: -4, marginStart: -8, marginEnd: -8 }}
                                    selectedValue={this.state.truckSubType}
                                    onValueChange={(itemValue, itemIndex) => this.setState({ truckSubType: itemValue })}>
                                    {this.renderSubType()}
                                </Picker>
                            </View>

                            <Text style={Styles.labelText}>Pickup Location</Text>
                            <TouchableOpacity
                                onPress={() => Actions.MapPickerCustom({ onLocationSelect: this._onLocationSelect, which: 'startAddress' })}>
                                <TextInput editable={false} placeholder="Pickup Location"
                                    style={Styles.inputStyle} value={this.state.startAddress.address} ></TextInput>
                            </TouchableOpacity>

                            <Text style={Styles.labelText}>Drop Location</Text>
                            <TouchableOpacity
                                onPress={() => Actions.MapPickerCustom({ onLocationSelect: this._onLocationSelect, which: 'endAddress' })}>
                                <TextInput editable={false} placeholder="Drop Location"
                                    style={Styles.inputStyle} value={this.state.endAddress.address}></TextInput>
                            </TouchableOpacity>


                            <DatePicker label="Pickup Date" inputStyle={Styles.inputStyle} labelText={Styles.labelText} mode='datetime' onConfirm={(datetime, timestamp) => this.setState({ pickup: datetime, startTime: timestamp })} />
                            <DatePicker label="Drop Date" inputStyle={Styles.inputStyle} labelText={Styles.labelText} mode='datetime' onConfirm={(datetime, timestamp) => this.setState({ drop: datetime, endTime: timestamp })} />
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <FooterButton name="Create Request" icon="add" cta={this._createRideRequest} />
                <LoadingDialog visible={this.state.loading} />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    labelText: {
        fontSize: 12,
        color: Colors.White,
    },
    inputStyle: {
        backgroundColor: Colors.White,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4,
        marginBottom: Dimens.hp(2)
    },
})

export default CreateRideRequest