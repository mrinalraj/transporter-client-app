import React, { Component } from 'react'
import { View, StyleSheet, ScrollView, Text, TextInput, KeyboardAvoidingView, ToastAndroid } from 'react-native'
import TopBanner from '../components/TopBanner'
import CustomStyle from '../res/CustomStyles'
import Dimens from '../res/Dimens'
import FooterButton from '../components/FooterButton';

class ChangePassword extends Component {

    state = {
        type: this.props.changeType
    }


    renderCurrent = () => {
        if (this.state.type == 'current')
            return (<TextInput
                style={CustomStyle.inputStyle}
                placeholder="Current Password"
                returnKeyType="next"
                secureTextEntry={true}
            />)
    }

    render() {

        // TODO

        return (
            <View style={{ flex: 1 }}>
                <TopBanner />
                <ScrollView scrollEnabled={true} contentContainerStyle={{
                    padding: Dimens.padding / 2,
                    flexGrow: 2,
                }} showsVerticalScrollIndicator={false}>
                    <KeyboardAvoidingView behavior="position">
                        <Text style={CustomStyle.headText}>{`Enter the new password`}</Text>
                        {
                            this.renderCurrent()
                        }
                        <TextInput
                            style={CustomStyle.inputStyle}
                            placeholder="New Password"
                            returnKeyType="next"
                            secureTextEntry={true}
                        />
                        <TextInput
                            style={CustomStyle.inputStyle}
                            placeholder="Re-enter Password"
                            returnKeyType="done"
                            secureTextEntry={true}
                        />
                    </KeyboardAvoidingView>
                </ScrollView>
                <FooterButton name="Change Password" icon="check" cta={() => { }} />
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


export default ChangePassword