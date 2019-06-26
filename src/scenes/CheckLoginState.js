import React from 'react'
import { View } from 'react-native'
import LoadingDialog from '../components/LoadingDialog';
import { ACCESS_TOKEN, BASE_API, USER_PROFILE, INIT_DATA } from '../res/Constants';
import { SecureStore, Permissions } from 'expo';
import Axios from 'axios';
import { Actions } from 'react-native-router-flux';
import Colors from '../res/Colors';

class CheckLoginState extends React.Component {
    state = {
        loading: true
    }

    async componentDidMount() {
        let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        if (!!accessToken) {
            Axios.get(`${BASE_API}/myProfile`, { params: {}, headers: { accessToken } })
                .then(async ({ data, status }) => {
                    if (!data.success)
                        return alert(data.payload.error.message)
                    await SecureStore.setItemAsync(USER_PROFILE, JSON.stringify(data.payload.result))
                    this._getPermissionsAsync()
                    Actions.reset('HomeDrawer', {})
                })
                .catch(error => {
                    alert(error)
                })
        }
        else
            Actions.reset('Login')
    }

    _getPermissionsAsync = async () => await Permissions.askAsync(Permissions.LOCATION)

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
                <LoadingDialog visible={this.state.loading} />
            </View>
        )
    }
}

export default CheckLoginState