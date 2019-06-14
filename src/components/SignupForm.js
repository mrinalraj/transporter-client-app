import React from 'react'
import { View, Text, Picker, TextInput, StyleSheet, ToastAndroid, Alert, } from 'react-native'
import Colors from '../res/Colors'
import CountryCode from '../res/CountryCode'
import CustomStyles from '../res/CustomStyles'


class SignupForm extends React.Component {
    state = {
        countryCode: '',
        passwordMatch: true,
        changeText: this.props.changeText
    };

    componentDidMount() {
        fetch('http://ip-api.com/json/')
            .then(res => res.json())
            .then(data => {
                let cc = data.countryCode
                CountryCode.forEach(e => {
                    if (e.iso2 === cc) {
                        return this.setState({ countryCode: e.code })
                    }
                })
            })
            .catch(err => {
                Alert.alert(err)
            })
    }

    renderList = () => {
        return CountryCode.map(country => <Picker.Item key={country.iso2} label={`${country.name} (+${country.code})`} value={country.code} />)
    }

    otpSubmitAction = () => {

    }


    render() {
        return (

            <View>
                <Text style={CustomStyles.headText}>New here? Lets get you onboard.</Text>
                <Picker
                    style={Styles.picker}
                    selectedValue={this.state.countryCode}
                    onValueChange={(itemValue, itemIndex) => {
                        this.setState({ countryCode: itemValue })
                        this.state.changeText({ countryCode: itemValue })
                    }}>
                    {this.renderList()}
                </Picker>
                <TextInput
                    onChangeText={text => this.state.changeText({ contactNo: text })}
                    placeholder="Phone Number"
                    keyboardType='number-pad'
                    returnKeyType="next"
                    maxLength={10}
                    onSubmitEditing={() => { this.emailInput.focus() }}
                    blurOnSubmit={false}
                    style={CustomStyles.inputStyle}
                />
                <TextInput
                    onChangeText={text => this.state.changeText({ email: text })}
                    placeholder="Email"
                    keyboardType="email-address"
                    style={CustomStyles.inputStyle}
                    ref={input => this.emailInput = input}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.nameInput.focus() }}
                    blurOnSubmit={false} />
                <TextInput
                    onChangeText={text => this.state.changeText({ name: text })}
                    placeholder="Full name"
                    style={CustomStyles.inputStyle}
                    ref={input => this.nameInput = input}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.passwordInput.focus() }}
                    blurOnSubmit={false} />
                <TextInput
                    onChangeText={text => { this.setState({ password: text }); this.state.changeText({ password: text }) }}
                    placeholder="Password"
                    secureTextEntry={true}
                    style={CustomStyles.inputStyle}
                    ref={input => this.passwordInput = input}
                    returnKeyType="next"
                    onSubmitEditing={() => { this.passwordConfirmInput.focus() }}
                    blurOnSubmit={false} />
                <TextInput
                    onChangeText={text => {
                        this.setState({ passwordMatch: this.state.password === text })
                        this.state.changeText({ passwordMatch: this.state.password === text })
                    }}
                    placeholder="Confirm password"
                    secureTextEntry={true}
                    style={CustomStyles.inputStyle}
                    ref={input => this.passwordConfirmInput = input}
                    returnKeyType="done"
                    // onSubmitEditing={() => { this.handleSignup }}
                    blurOnSubmit={false} />


                <Text
                    style={{ color: Colors.warningRed, fontSize: 12 }}>
                    {!this.state.passwordMatch ? 'Password do not match.' : ''}
                </Text>
                <Text style={{ marginTop: 40, textAlign: 'center', color: Colors.textColor }}>{`We will send a one time password\ncarrier rates may apply.`}</Text>

            </View>
        );
    }
}


const Styles = StyleSheet.create({

    picker: {
        margin: -8,
        marginTop: 10,
        borderColor: Colors.blackColor,
        borderBottomWidth: 1
    },

})

export default SignupForm