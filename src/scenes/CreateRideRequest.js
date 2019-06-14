import React, { Component } from 'react'
import { Text, View, KeyboardAvoidingView, ScrollView, TextInput, StyleSheet, Picker } from 'react-native'
import { Subheading, } from 'react-native-paper'
import NavBar from '../components/NavBar'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'
import FooterButton from '../components/FooterButton'
import DatePicker from '../components/DatePicker';

class CreateRideRequest extends Component {
    state = {

    }

    renderList = () => {
        let vals = ['Full Load', 'Share']
        return vals.map((t, i) => <Picker.Item key={i} value={t} label={t} />)
    }

    renderTruckList = () => {
        let vals = ['Vegitable', 'Refrigration', 'Others']
        return vals.map((t, i) => <Picker.Item key={i} value={t} label={t} />)
    }

    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1, }}>
                <NavBar title='Create Ride Request' />
                <ScrollView contentContainerStyle={{ flexGrow: 2, padding: Dimens.padding / 2, paddingTop: Dimens.padding / 4 }}>
                    <KeyboardAvoidingView behavior='position'>
                        <Subheading style={{ color: Colors.White }}>Create a ride with the following details</Subheading>
                        <View style={{ marginTop: Dimens.hp('5'), }}>
                            <Text style={Styles.labelText}>Load Type</Text>

                            <View style={{ backgroundColor: Colors.White, paddingRight: 10, paddingLeft: 10, borderRadius: 4, }}>
                                <Picker style={{ margin: -4, marginStart: -8, marginEnd: -8 }}>
                                    {this.renderList()}
                                </Picker>
                            </View>

                            <Text style={{ marginTop: 20, ...Styles.labelText }}>Truck Type</Text>
                            <View style={{ backgroundColor: Colors.White, paddingRight: 10, paddingLeft: 10, borderRadius: 4 }}>
                                <Picker style={{ margin: -4, marginStart: -8, marginEnd: -8 }}>
                                    {this.renderTruckList()}
                                </Picker>
                            </View>

                            <Input label="Pickup Location" />
                            <Input label="Drop Location" />
                            <DatePicker label="Pickup Date" inputStyle={Styles.inputStyle} mode='datetime' onConfirm={datetime => this.setState({ pickup: datetime })} />
                            <DatePicker label="Drop Date" inputStyle={Styles.inputStyle} mode='datetime' onConfirm={datetime => this.setState({ drop: datetime })} />
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
                <FooterButton name="Create Request" icon="add" cta={() => { }} />
            </View>
        );
    }
}

const Input = ({ label, value, onChangeText }) => {
    return (
        <View>
            <Text style={{ marginTop: 20, ...Styles.labelText }}>{label}</Text>
            <TextInput placeholder={label} value={value} style={Styles.inputStyle}></TextInput>
        </View >
    )
}

const Styles = StyleSheet.create({
    labelText: {
        fontSize: 12,
        color: Colors.White
    },
    inputStyle: {
        backgroundColor: Colors.White,
        paddingTop: 7,
        paddingBottom: 7,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 4,
    },
})

export default CreateRideRequest