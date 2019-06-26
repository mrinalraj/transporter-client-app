import React, { Component } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, Alert, KeyboardAvoidingView } from 'react-native'
import Dimens from '../res/Dimens'
import Colors from '../res/Colors'
import CustomStyle from '../res/CustomStyles'
import TopBanner from '../components/TopBanner'
import { Actions } from 'react-native-router-flux'
import { SecureStore } from 'expo'
import { ACCESS_TOKEN, BASE_API } from '../res/Constants';
import LoadingDialog from '../components/LoadingDialog'
import axios from 'axios'
import FooterButton from '../components/FooterButton'
import passwordValidator from 'password-validator'

class Login extends Component {
    state = {
        visible: false
    }

    passwordSchema = new passwordValidator()

    otpSubmitAction = async accessToken => {
        try {
            await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken)
            Actions.replace('HomeDrawer')
        }
        catch (e) {
            alert(JSON.stringify(e))
        }
    }

    async componentDidMount() {
        let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        if (accessToken != null) {
            Actions.replace('HomeDrawer')
        }
    }

    handleClick = () => {

        const { contactNo, password } = this.state

        this.validate()
            .then(() => {
                this.setState({ visible: true })
                axios.post(`${BASE_API}/login`, { contactNo, password })
                    .then(response => {
                        this.afterLogin(response.data)
                    })
                    .catch(error => {
                        Alert.alert("Error occured", JSON.stringify(error))
                    })
            })
            .catch(error => {

            })
    }

    afterLogin = async data => {
        this.setState({ visible: false })
        let { success, payload } = data

        if (!success) {
            let { errorCode, message } = payload.error
            switch (errorCode) {
                case 203: Actions.replace("OtpScreen", { otpType: 'check', contactNo: this.state.contactNo })
                    break;
                case 207:
                case 202:
                case 201:
                default:
                    Alert.alert("Error Occured", message)
            }
        }
        else {
            let { accessToken } = payload.result
            try {
                await SecureStore.deleteItemAsync(ACCESS_TOKEN)
                await SecureStore.setItemAsync(ACCESS_TOKEN, accessToken)
                Actions.replace('CheckLoginState')
            }
            catch (error) {
                Alert.alert("Error Occured", JSON.stringify(error))
                // Actions.refresh()
            }

        }
    }

    validate = () => {
        return new Promise((resolve, reject) => {
            let { contactNo, password, } = this.state
            let errors = {}
            contactNo == undefined ? errors.contactNo = 'Phone Number is Required' : contactNo.trim().length < 10 ? errors.contactNo = 'Phone number should be 10 digits long' : ''
            password == undefined || password.trim() == '' ? errors.password = 'Please enter a password' : ''
            this.passwordSchema.is().min(8).is().max(16)
            // this.passwordSchema.validate(password) ? errors.password = 'Password should be more than 8 and less than 16 chaachters long' : ''
            Object.keys(errors).length > 0 ? this.setState({ errors }, reject(errors)) : resolve()
        })
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <KeyboardAvoidingView behavior='position'>
                    <TopBanner />
                    <ScrollView scrollEnabled={true} contentContainerStyle={{
                        padding: Dimens.padding / 2,
                        paddingBottom: Dimens.footerButtonHeight,
                        flexGrow: 2,
                    }} showsVerticalScrollIndicator={false}>
                        <Text style={CustomStyle.headText}>Welcome back, lets get you signed in.</Text>
                        <TextInput
                            style={CustomStyle.inputStyle}
                            placeholder="Phone Number"
                            returnKeyType="next"
                            onChangeText={val => this.setState({ contactNo: val.trim() })}
                            keyboardType='number-pad'
                            maxLength={10}
                        />
                        <TextInput
                            style={CustomStyle.inputStyle}
                            placeholder="Password"
                            returnKeyType="done"
                            onChangeText={val => this.setState({ password: val.trim() })}
                            secureTextEntry={true}
                        />
                        <Text style={{ color: Colors.warningRed, fontSize: 12 }}>{
                            this.state.errors != undefined ? this.state.errors[Object.keys(this.state.errors)[0]] : ''
                        }</Text>
                        <Text style={{ ...Styles.forgotPassword }} onPress={() => Actions.push('ForgotPassword')}>Forgot Password ?</Text>
                        <Text style={{ padding: Dimens.wp('1.5'), textAlign: "center" }} onPress={() => Actions.SignUp()}>New here, Sign up?</Text>
                    </ScrollView>
                </KeyboardAvoidingView>
                <LoadingDialog visible={this.state.visible} />
                {/* <RoundButton handleClick={this.handleClick} /> */}
                <FooterButton name='Login' icon='check' cta={this.handleClick} disabled={this.state.visible}/>
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
        padding: Dimens.wp('1.5')
    },
})

export default Login