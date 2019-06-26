import React, { Component } from 'react'
import { Text, View, TouchableOpacity, KeyboardAvoidingView, Image } from 'react-native'
import Colors from '../../res/Colors'
import Dimens from '../../res/Dimens'
import { Avatar, Title, Subheading, IconButton, ActivityIndicator, List } from 'react-native-paper'
import NavBar from '../../components/NavBar'
import { TextInput } from 'react-native-gesture-handler'
import CustomStyles from '../../res/CustomStyles'
import FooterButton from '../../components/FooterButton'
import { SecureStore, ImagePicker, Permissions } from 'expo';
import { USER_PROFILE, ACCESS_TOKEN, BASE_API } from '../../res/Constants'
import { BottomSheet } from 'react-native-btr'
import { RNS3 } from 'react-native-aws3'
import LoadingDialog from '../../components/LoadingDialog';
import Axios from 'axios';

class Profile extends Component {
    state = {
        bottomSheetVisible: false,
        imageUploading: false,
        loading: false
    }

    _getProfileFromStorage = async _ => {
        SecureStore.getItemAsync(USER_PROFILE)
            .then(result => {
                this.setState({ ...JSON.parse(result) }, () =>
                    this.setState({ tempImageUrl: this.state.imageUrl }, () => {
                        if (!!this.state.tempImageUrl && this.state.tempImageUrl !== '') {
                            this.setState({ imageUploading: true })
                            Image.prefetch(this.state.tempImageUrl)
                                .then(_ => this.setState({ imageUploading: false }))
                                .catch(err => console.log(err))
                        }
                    }
                    )
                )
            })
    }

    componentDidMount() {
        this._getProfileFromStorage()
        this.getPermissionAsync()
    }

    getPermissionAsync = async () => {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
        }
    }

    _toggleBottomNavigationView = () => {
        this.setState({ bottomSheetVisible: !this.state.bottomSheetVisible });
    }

    _makeid = (length = 12) => {
        var result = '';
        var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    _pickImage = async from => {

        this._toggleBottomNavigationView()
        this.setState({ imageUploading: true })
        var result = null

        if (from == 'gallery') {
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                base64: true
            })
        }
        else {
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                base64: true
            })
        }

        if (!result.cancelled) {

            const file = {
                uri: result.uri,
                name: this._makeid(),
                type: 'image/jpeg'
            }

            const options = {
                keyPrefix: `avatar-`,
                bucket: 'trans-app',
                region: 'us-east-2',
                accessKey: 'AKIAQC4EZDNK4VRJ7RVB',
                secretKey: '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',
                successActionStatus: 201
            }

            RNS3.put(file, options).then(response => {
                this.setState({ imageUploading: false })
                if (response.status !== 201) {
                    return alert('Failed to upload. Please try again.')
                }
                this.setState({ imageUrl: response.body.postResponse.location, changed: true, tempImageUrl: `data:image/png;base64,${result.base64}` })

            }).catch(err => this.setState({ imageUploading: false }))
        }
        else {
            this.setState({ imageUploading: false })
        }
    }

    editProfile = async () => {
        this.setState({ loading: true })
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN),
            { imageUrl, name } = this.state
        if (!!accessToken) {
            Axios.post(`${BASE_API}/editProfile`, { imageUrl, name }, { headers: { accessToken } })
                .then(async ({ data }) => {
                    this.setState({ loading: false })
                    if (!data.success)
                        return alert(data.payload.error.message)
                    alert(data.payload.result.message || `Profile has been updated`)
                    await SecureStore.setItemAsync(USER_PROFILE, JSON.stringify(data.payload.result.user))
                })
                .catch(err => alert(err))
        }
        else
            return alert('Login status cannot be verified!')
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
                        <TouchableOpacity onPress={() => {
                            this._toggleBottomNavigationView()
                        }}>
                            {
                                !!this.state.imageUploading
                                    ? <ActivityIndicator animating={true} size="small" color={Colors.accentColor} ></ActivityIndicator>
                                    : < Avatar.Image size={Dimens.hp('20')} source={{ uri: this.state.imageUrl !== '' ? this.state.tempImageUrl : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdqpgF3_oUtUDlrs3UiCsnVtkLtIQ_7xnuGpTpV-y9QsM-GV8J" }} />
                            }
                        </TouchableOpacity>
                        <Title style={{ fontSize: 25, color: Colors.White, letterSpacing: 1, marginTop: 20 }}>{this.state.name}</Title>
                        <Subheading style={{ color: Colors.White, marginTop: 8 }}>{this.state.email}</Subheading>
                    </View>
                    <View style={{ padding: Dimens.padding / 2, paddingBottom: Dimens.footerButtonHeight }}>
                        <TextInput placeholder="Name" style={CustomStyles.inputStyle} value={this.state.name} editable={true} onChangeText={text => this.setState({ name: text, changed: true })}></TextInput>
                        <TextInput placeholder="Phone Number" style={CustomStyles.inputStyle} value={this.state.contactNo} editable={false}></TextInput>
                        {/* <TextInput placeholder="Password" style={CustomStyles.inputStyle} secureTextEntry></TextInput> */}
                    </View>
                </KeyboardAvoidingView>
                <BottomSheet visible={this.state.bottomSheetVisible}
                    onBackButtonPress={this._toggleBottomNavigationView}
                    onBackdropPress={this._toggleBottomNavigationView} >
                    <View style={{ backgroundColor: Colors.White, padding: 20 }}>
                        <List.Item title='Select from gallery' onPress={() => this._pickImage('gallery')} />
                        <List.Item title='Open Camera' onPress={() => this._pickImage('camera')} />
                    </View>
                </BottomSheet>
                <LoadingDialog visible={this.state.loading} />
                <FooterButton name='Save' icon='check' cta={this.editProfile} disabled={!(!!this.state.changed)} />
            </View >
        );
    }
}

export default Profile