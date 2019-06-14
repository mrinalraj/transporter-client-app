import React, { Component } from 'react'
import { View, StyleSheet, Text, TextInput, ToastAndroid, Alert, Actions } from 'react-native'
import TopBanner from '../components/TopBanner'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'
import axios from 'axios'
import { BASE_API, ACCESS_TOKEN, } from '../res/Constants';
import { SecureStore } from 'expo'
import LoadingDialog from '../components/LoadingDialog';

class OtpScreen extends Component {

    state = {
        otp: [],
        visible: false,
        contactNo: this.props.contactNo
    }

    componentDidMount() {
        this.input1.focus()
    }

    shiftFocus = (val, name) => {
        // if (val.length < 1) {
        //     this.setState(prevState => ({
        //         otp: [...prevState.otp.pop()]
        //     }), () => {

        //         switch (name) {
        //             case 'in1':
        //                 break;
        //             case 'in2': this.input1.focus()
        //                 break;
        //             case 'in3': this.input2.focus()
        //                 break;
        //             case 'in4': this.input3.focus()
        //                 break;
        //         }
        //     })
        // }

        this.setState(prevState => ({
            otp: [...prevState.otp, val]
        }), () => {

            switch (name) {
                case 'in1': this.input2.focus();
                    break;
                case 'in2': this.input3.focus();
                    break;
                case 'in3': this.input4.focus()
                    break;
                case 'in4': this.finishOtp()
                    break;
            }
        })


    }

    finishOtp = async () => {
        this.setState({ visible: true })
        this.input4.blur()

        let endpoint = '', data = {}, headers = {}

        if (this.props.otpType === 'verify') {
            let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
            endpoint = '/verifyotp'
            data = {
                otp: this.state.otp.join('')
            }
            headers = {
                accessToken
            }
        } else {
            endpoint = '/verifyForgetPasswordOtp'
            data = {
                otp: this.state.otp.join(''),
                contactNo: this.props.contactNo
            }
        }


        axios.post(`${BASE_API}${endpoint}`, data, {
            headers
        }).then(async ({ data }) => {
            let { success, payload } = data
            if (success) {
                let { result } = payload

                if (this.props.otpType === 'verify') {
                    // Alert.alert(result.message)
                    Actions.HomeDrawer()
                    ToastAndroid.show('logged in 1', ToastAndroid.SHORT)
                }
                else {
                    try {
                        await SecureStore.setItemAsync(ACCESS_TOKEN, result.accessToken)
                        ToastAndroid.show('logged in 2', ToastAndroid.SHORT)
                        Actions.replace('HomeDrawer')
                    }
                    catch (e) {
                        ToastAndroid.show(JSON.stringify(e), ToastAndroid.SHORT)
                    }
                }
                this.setState({ visible: false })
            }
            else {
                let { error } = payload,
                    { errorCode, message } = error
                this.setState({ visible: false })
                Alert.alert('Error Occured', message)
            }
        })
            .catch(err => console.log(err))
    }


    resendOtp = () => {
        this.setState({ visible: true })
        axios.post(`${BASE_API}/sendOtp`, { contactNo: this.state.contactNo })
            .then(({ data }) => {
                if (data.success) {
                    this.setState({ visible: false })
                    ToastAndroid.show(`OTP sent to ${this.state.contactNo}`, ToastAndroid.LONG)
                }
                else {
                    this.setState({ visible: false })
                    ToastAndroid.show(`Error sending OTP please try againr`, ToastAndroid.LONG)
                }
            })
    }


    render() {
        return (
            <View style={{ backgroundColor: Colors.primaryColor, flex: 1 }}>
                <TopBanner />
                <Text style={{ textAlign: "center", color: Colors.White, fontSize: 20, letterSpacing: 0.5, }}>Verification Code</Text>
                <Text style={{ textAlign: "center", fontSize: 15, letterSpacing: 0.2, color: Colors.muteTextColor }}>{`Please type the verification code sent to ${this.props.contactNo}`}</Text>
                <View style={{ flexDirection: "row", justifyContent: "center", marginTop: 20 }}>
                    <TextInput ref={input => this.input1 = input} keyboardType='number-pad' maxLength={1} onChangeText={val => this.shiftFocus(val, 'in1')} style={Styles.otpInput}></TextInput>
                    <TextInput ref={input => this.input2 = input} keyboardType='number-pad' maxLength={1} onChangeText={val => this.shiftFocus(val, 'in2')} style={Styles.otpInput}></TextInput>
                    <TextInput ref={input => this.input3 = input} keyboardType='number-pad' maxLength={1} onChangeText={val => this.shiftFocus(val, 'in3')} style={Styles.otpInput}></TextInput>
                    <TextInput ref={input => this.input4 = input} keyboardType='number-pad' maxLength={1} onChangeText={val => this.shiftFocus(val, 'in4')} style={Styles.otpInput}></TextInput>
                </View>
                <Text style={{ textAlign: "center", fontSize: 15, letterSpacing: 0.2, marginHorizontal: 30, marginTop: 15, marginBottom: 20, color: Colors.muteTextColor }}>The One Time Password is valid for next 10 minutes only</Text>
                <Text style={{ textAlign: "center", fontSize: 15, letterSpacing: 0.2, color: Colors.White }} onPress={this.resendOtp}>Resend OTP</Text>
                <LoadingDialog visible={this.state.visible} />
            </View>
        );
    }
}


const Styles = StyleSheet.create({
    optScreen: {
        flex: 1,
        backgroundColor: Colors.primaryColor
    },
    otpInput: {
        padding: 15,
        margin: 15,
        color: Colors.White,
        textAlign: "center",
        backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
    overlay: {
        position: "absolute",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        top: 0,
        left: 0,
        width: Dimens.windowWidth,
        height: Dimens.height
    }
})

export default OtpScreen;