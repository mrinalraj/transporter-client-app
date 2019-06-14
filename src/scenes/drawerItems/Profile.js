import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ToastAndroid, KeyboardAvoidingView } from 'react-native'
import Colors from '../../res/Colors'
import Dimens from '../../res/Dimens'
import { Avatar, Title, Subheading, IconButton } from 'react-native-paper'
import NavBar from '../../components/NavBar'
import { TextInput } from 'react-native-gesture-handler'
import CustomStyles from '../../res/CustomStyles'
import FooterButton from '../../components/FooterButton'

class Profile extends Component {
    state = {
        phoneNo: '1234567890'
    }
    render() {

        return (
            <View style={{ flex: 1 }}>
                <NavBar title="Edit Profile" />
                <KeyboardAvoidingView behavior="position">
                    <View style={{
                        height: Dimens.hp('35'),
                        backgroundColor: Colors.primaryColor,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={() => ToastAndroid.show('edit image', ToastAndroid.SHORT)}>
                            <Avatar.Image size={Dimens.hp('20')} source={{ uri: "http://themes.themewaves.com/nuzi/wp-content/uploads/sites/4/2013/05/Team-Member-3.jpg" }} />
                        </TouchableOpacity>
                        <Title style={{ fontSize: 25, color: Colors.White, letterSpacing: 1, marginTop: 20 }}>John Doe</Title>
                        <Subheading style={{ color: Colors.White, marginTop: 8 }}>johndoe@example.com</Subheading>
                    </View>
                    <View style={{ padding: Dimens.padding / 2, paddingBottom: Dimens.footerButtonHeight }}>
                        <TextInput placeholder="Name" style={CustomStyles.inputStyle} value='John Doe' editable={true}></TextInput>
                        <TextInput placeholder="Phone Number" style={CustomStyles.inputStyle} value={this.state.phoneNo} onChange={text => this.setState({ phoneNo: text })}></TextInput>
                        {/* <TextInput placeholder="Password" style={CustomStyles.inputStyle} secureTextEntry></TextInput> */}
                    </View>
                </KeyboardAvoidingView>
                <FooterButton name='Save' icon='check' cta={() => { }} />
            </View >
        );
    }
}

export default Profile