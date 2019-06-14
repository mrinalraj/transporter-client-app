import React, { Component } from 'react'
import { Modal, Card, Button } from 'react-native-paper'
import { Text, View, StyleSheet, Picker, TextInput, KeyboardAvoidingView, Alert } from 'react-native'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'
import DatePicker from './DatePicker';

class FilterModal extends Component {
    state = {
        ride: 'share',
    }

    renderTruck = () => {
        if (this.state.ride && this.state.ride == 'full_load') {
            // this.setState({ truck: 'veg' })
            return (
                <View>
                    <Text style={Styles.labelText}>Truck Type</Text>
                    <Picker style={Styles.pickerStyle} mode='dropdown' onValueChange={(val, i) => this.setState({ truck: val })} selectedValue={this.state.truck}>
                        <Picker.Item label='Vegetable' value='veg' />
                        <Picker.Item label='Refrigaration' value='refrigaration' />
                        <Picker.Item label='Other' value='other' />
                    </Picker>
                </View>
            )
        }

    }

    render() {
        return (
            <Modal
                ref={r => this.modal = r}
                dismissable={false}
                visible={this.props.visible}>
                <KeyboardAvoidingView behavior='position'>
                    <Card style={{ margin: Dimens.padding }}>
                        <Card.Title title='Apply Filter' />
                        <Card.Content>

                            <Text style={Styles.labelText}>Ride Type</Text>
                            <Picker style={Styles.pickerStyle} prompt='Select Ride Type' selectedValue={this.state.ride} onValueChange={(val, index) => this.setState({ ride: val })}>
                                <Picker.Item label='Share' value='share' />
                                <Picker.Item label='Full Load' value='full_load' />
                            </Picker>

                            {
                                this.renderTruck()
                            }

                            <DatePicker inputStyle={Styles.inputStyle} label='Pickup Date' mode='date' onConfirm={datetime => this.setState({ pickupDate: datetime })} />
                            <DatePicker inputStyle={Styles.inputStyle} label='Pickup Time' mode='time' onConfirm={datetime => this.setState({ pickupTime: datetime })} />
                            <DatePicker inputStyle={Styles.inputStyle} label='Drop Date' mode='date' onConfirm={datetime => this.setState({ dropDate: datetime })} />
                            <DatePicker inputStyle={Styles.inputStyle} label='Drop Time' mode='time' onConfirm={datetime => this.setState({ dropTime: datetime })} />

                        </Card.Content>
                        <Card.Actions style={{ paddingTop: Dimens.hp('1'), paddingBottom: Dimens.hp('1') }}>
                            <Button onPress={() => Alert.alert('data', JSON.stringify(this.state))}>Apply</Button>
                            <Button onPress={this.props.hideFilter}>Cancel</Button>
                        </Card.Actions>
                    </Card>
                </KeyboardAvoidingView>
            </Modal >
        )
    }
}

const Input = ({ label, placeholder }) => {
    return (
        <View style={{ marginTop: Dimens.hp('0.5') }}>
            <Text style={Styles.labelText}>{label}</Text>
            <TextInput style={Styles.inputStyle} placeholder={placeholder} />
        </View>
    )
}

const Styles = StyleSheet.create({
    labelText: {
        fontSize: 12,
        color: Colors.muteTextColor,
        marginTop: Dimens.hp(2)
    },
    pickerStyle: {
        marginStart: -8, marginTop: -4, marginBottom: -4, marginEnd: -8
    },
    inputStyle: {
        paddingBottom: 3,
        fontSize: 15,
        borderBottomColor: Colors.blackColor,
        borderBottomWidth: 1.5,
        letterSpacing: 0.5,
    }
})

export default FilterModal