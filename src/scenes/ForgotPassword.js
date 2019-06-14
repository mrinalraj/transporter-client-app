import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, TextInput, ToastAndroid } from 'react-native'
import LoadingDialog from '../components/LoadingDialog'
import TopBanner from '../components/TopBanner'
import CustomStyle from '../res/CustomStyles'
import Dimens from '../res/Dimens'
import { Actions } from 'react-native-router-flux';
import Axios from 'axios';
import { BASE_API, ACCESS_TOKEN } from '../res/Constants'
import { SecureStore } from 'expo'
import FooterButton from '../components/FooterButton';

class ForgotPassword extends Component {
    state = {
        visible: false
    }

    otpSubmitAction = async accessToken => {
        await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken)
        Actions.replace('ChangePassword')
    }

    handleClick = () => {
        // Actions.replace('ChangePassword')
        this.setState({ visible: true })
        Axios.post(`${BASE_API}/sendOtp`, {
            contactNo: this.state.contactNo
        }).then(response => {
            this.setState({ visible: false })
            if (response.data.success) {
                ToastAndroid.show(response.data.payload.result.message, ToastAndroid.SHORT)
                Actions.replace('OtpScreen', { submitAction: this.otpSubmitAction, otpType: 'forgot', contactNo: this.state.contactNo })
            }
            else {
                // ToastAndroid.show()
            }
        })
            .catch(err => {
                console.log(err)
            })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <TopBanner />
                <ScrollView scrollEnabled={true} contentContainerStyle={{
                    padding: Dimens.padding / 2,
                    paddingBottom: Dimens.footerButtonHeight,
                    flexGrow: 2,
                }} showsVerticalScrollIndicator={false}>
                    <Text style={CustomStyle.headText}>{`Forgot password?\nNo worries, we will help you.`}</Text>
                    <TextInput
                        onChangeText={text => this.setState({
                            contactNo: text.trim()
                        })}
                        style={CustomStyle.inputStyle}
                        placeholder="Phone Number"
                        returnKeyType="done"
                        keyboardType='number-pad'
                        maxLength={10}
                    />
                    <Text style={{ ...Styles.forgotPassword }}>{`We will send a One time password\nCarrier rates may apply.`}</Text>
                </ScrollView>
                <LoadingDialog visible={this.state.visible} />
                {/* <RoundButton handleClick={this.handleClick} /> */}
                <FooterButton name="Forgot Password" icon="arrow-forward" cta={this.handleClick} />
            </View >
        );
    }
}


const Styles = StyleSheet.create({
    forgotPassword: {
        textAlign: "center",
        color: CustomStyle.headText.color,
        // textDecorationLine: 'underline',
        marginTop: 20,
        marginBottom: 10,
        padding: 10
    },
})

export default ForgotPassword;