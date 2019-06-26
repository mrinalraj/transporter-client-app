import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, TextInput, KeyboardAvoidingView } from 'react-native'
import TopBanner from '../components/TopBanner'
import CustomStyle from '../res/CustomStyles'
import Dimens from '../res/Dimens'
import FooterButton from '../components/FooterButton';
import LoadingDialog from '../components/LoadingDialog';
import { SecureStore } from 'expo';
import { ACCESS_TOKEN, BASE_API } from '../res/Constants';
import Axios from 'axios';
import { Actions } from 'react-native-router-flux';
import Colors from '../res/Colors';
import passwordValidator from 'password-validator'

class ChangeForgotPassword extends Component {

    state = {
        type: this.props.changeType,
        loading: false
    }

    passwordSchema = new passwordValidator()

    
    _validate = () => {
        return new Promise((resolve, reject) => {
            const { newPassword, repeatNewPassword, } = this.state
            let errors = {}
            newPassword == undefined || newPassword.toString().trim() == '' ? errors.password = 'Please set a password' : ''
            this.passwordSchema
                .is().min(7)
                .is().max(100)
                .is().not().oneOf(['Passw0rd', 'Password123'])
            this.passwordSchema.validate(newPassword.toString().trim()) ? '' : errors.password = 'Password should be atlest 8 and less than 16 chaachters long'
            newPassword.toString().trim() !== repeatNewPassword.toString().trim() ? errors.password = 'Passwords do not match' : ''
            Object.keys(errors).length > 0 ? this.setState({ errors }, reject(errors)) : resolve()
        })
    }

    _changePassword = async () => {
        this._validate()
            .then(async _ => {
                this.setState({ loading: true })
                const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN),
                    { oldPassword, newPassword } = this.state
                Axios.post(`${BASE_API}/changePassword`, { oldPassword, newPassword }, { headers: { accessToken } })
                    .then(({ data }) => {
                        console.log(data)
                        this.setState({ loading: false })

                        if (!data.success)
                            return alert(data.payload.error.message)
                        alert(data.payload.result.message)
                        Actions.pop()
                    })
                    .catch(err => alert(err))
            })
            .catch(err => alert(err))
    }

    render() {

        return (
            <View style={{ flex: 1 }}>
                <TopBanner />
                <KeyboardAvoidingView behavior="position">
                    <ScrollView scrollEnabled={true} contentContainerStyle={{
                        padding: Dimens.padding / 2,
                        flexGrow: 2,
                    }} showsVerticalScrollIndicator={false}>
                        <Text style={CustomStyle.headText}>{`Enter the new password`}</Text>
                        <TextInput
                            style={CustomStyle.inputStyle}
                            placeholder="New Password"
                            onChangeText={t => this.setState({ newPassword: t })}
                            returnKeyType="next"
                            secureTextEntry={true}
                        />
                        <TextInput
                            style={CustomStyle.inputStyle}
                            placeholder="Re-enter Password"
                            returnKeyType="done"
                            onChangeText={t => this.setState({ repeatNewPassword: t })}
                            secureTextEntry={true}
                        />
                        <Text style={Styles.labelText}>{
                            this.state.errors != undefined ? this.state.errors[Object.keys(this.state.errors)[0]] : ''
                        }</Text>
                    </ScrollView>
                </KeyboardAvoidingView>
                <FooterButton name="Change Password" icon="check" cta={this._changePassword} disabled={this.state.loading}/>
                <LoadingDialog visible={!!this.state.loading} />
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
    }, labelText: {
        fontSize: 12,
        color: Colors.warningRed,
        marginTop: Dimens.hp(2)
    },
})


export default ChangeForgotPassword