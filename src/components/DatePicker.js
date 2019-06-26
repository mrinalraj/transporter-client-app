import React, { Component } from 'react'
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native'
import DateTimePicker from 'react-native-modal-datetime-picker'
import moment from 'moment'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'

class DatePicker extends Component {
    state = {
        isVisible: false,

    }

    onConfirm = data => {
        let datetime = ''
        if (this.props.mode == 'time')
            datetime = moment(data).format('hh:mm')
        if (this.props.mode == 'date')
            datetime = moment(data).format('Do MMMM YYYY')
        if (this.props.mode == 'datetime')
            datetime = moment(data).format('Do MMMM YYYY / hh:mm A')

        this.setState({
            datetime: datetime, isVisible: false
        }, this.props.onConfirm(this.state.datetime, moment(data).unix()))

        console.log(moment(data).unix())
        console.log(data)
    }

    Styles = StyleSheet.create({
        labelText: {
            ...this.props.labelText
        },
        inputStyle: {
            ...this.props.inputStyle
        }
    })

    render() {
        return (
            <View>
                <View style={{ marginTop: Dimens.hp('0.5') }}>
                    <Text style={this.Styles.labelText}>{this.props.label}</Text>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({
                                isVisible: true
                            })
                        }}>
                        <TextInput style={this.Styles.inputStyle} placeholder={this.props.label} editable={false} value={this.state.datetime} />
                    </TouchableOpacity>
                </View>
                <DateTimePicker
                    is24Hour={false}
                    isVisible={this.state.isVisible}
                    onConfirm={this.onConfirm}
                    onCancel={() => this.setState({ isVisible: false })}
                    mode={this.props.mode} />
            </View>
        );
    }
}


export default DatePicker