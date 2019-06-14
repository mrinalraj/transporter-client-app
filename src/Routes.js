import React from 'react'
import { Router, Scene, Drawer, Actions, } from 'react-native-router-flux'
import { ToastAndroid, BackHandler, BackAndroid } from 'react-native'
import { SecureStore, } from 'expo'
import { ACCESS_TOKEN } from './res/Constants'

import Login from './scenes/Login'
import SignUp from './scenes/SignUp'
import OtpScreen from './scenes/OtpScreen'
import ForgotPassword from './scenes/ForgotPassword'
import ChangePassword from './scenes/ChangePassword'
import DrawerMenu from './components/DrawerMenu'
import Home from './scenes/drawerItems/Home'
import Dimens from './res/Dimens'
import Profile from './scenes/drawerItems/Profile'
import CreateRideRequest from './scenes/CreateRideRequest'
import MyRequests from './scenes/drawerItems/MyRequests'
import MyRides from './scenes/drawerItems/MyRides'
import RideDetails from './components/RideDetails';

let backPressedOnce = false

class Routes extends React.Component {
    state = {
        isLogged: true
    }

    componentDidMount() {
        // this.loginState()
        this.setState({ loggedInState: true })
    }

    componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
    }

    loginState = async () => {
        try {
            const loggedInState = await SecureStore.getItemAsync(ACCESS_TOKEN)
            this.setState({
                loggedInState: loggedInState !== null
            })
        }
        catch (error) {
            ToastAndroid.show(this.state.loggedInState)
        }
    }

    onBackPress = () => {
        const currentScene = Actions.currentScene.substr(1)
        if (currentScene != 'Login' || currentScene != 'HomeDrawer') {
            return;
        }

        switch (currentScene) {
            case 'Login': BackAndroid.exitApp()
                break;
            case 'HomeDrawer':
                if (backPressedOnce) {
                    BackAndroid.exitApp()
                }
                else {
                    backButtonPressedOnceToExit = true;
                    ToastAndroid.show("Press Back Button again to exit", ToastAndroid.SHORT);
                    setTimeout(() => { backButtonPressedOnceToExit = false }, 2000);
                    return true;
                }
                break;
        }
    }

    render() {
        return (
            <Router backAndroidHandler={this.onBackPress}>
                <Scene key="root">
                    <Drawer key='HomeDrawer'
                        hideNavBar
                        initial={this.props.isLogged}
                        contentComponent={DrawerMenu}
                        drawerWidth={Dimens.windowWidth * 0.6}
                        hideDrawerButton={true}
                        drawerPosition="left">

                        <Scene key='Home' component={Home} hideNavBar />
                        <Scene key='Profile' component={Profile} hideNavBar />
                        <Scene key='MyRequests' component={MyRequests} hideNavBar />
                        <Scene key='MyRides' component={MyRides} hideNavBar />

                    </Drawer>
                    <Scene key="Login" component={Login} initial={!this.props.isLogged} hideNavBar />
                    <Scene key="SignUp" component={SignUp} hideNavBar />
                    <Scene key="OtpScreen" component={OtpScreen} hideNavBar />
                    <Scene key="ForgotPassword" component={ForgotPassword} hideNavBar />
                    <Scene key="ChangePassword" component={ChangePassword} hideNavBar />
                    <Scene key="CreateRideRequest" component={CreateRideRequest} hideNavBar />
                    <Scene key="RideDetails" component={RideDetails} hideNavBar />
                </Scene>
            </Router>
        )
    }
}

export default Routes