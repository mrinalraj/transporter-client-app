import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Alert, Keyboard, TextInput, } from 'react-native'
import Dimens from '../../res/Dimens'
import { SecureStore } from 'expo'
import { ACCESS_TOKEN } from '../../res/Constants'
import { Actions, } from 'react-native-router-flux'
import Colors from '../../res/Colors'
import { IconButton, Modal } from 'react-native-paper'
import FooterButton from '../../components/FooterButton';
import FilterModal from '../../components/FilterModal';
import AvailableRidesCard from '../../components/AvailableRidesCard';


class Home extends Component {
    state = {
        searchShown: false,
        filterShown: false
    }



    async componentDidMount() {
        this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                searchBar: false
            })
        })

        let accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        if (accessToken == null) {
            Actions.replace('Login')
        }

    }

    componentWillUnmount() {
        this.keyboardHideListener.remove()
    }


    searchBar = () => {
        return (
            <View style={{ alignItems: 'center', marginLeft: Dimens.padding / 6, marginRight: Dimens.padding / 6, borderRadius: 5, backgroundColor: Colors.White, justifyContent: 'space-between', flexDirection: 'row' }}>
                <IconButton icon='arrow-back'
                    color={Colors.muteTextColor}
                    size={25}
                    onPress={() => this.setState({ searchShown: false })}
                />

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 0.9 }}>
                    <TextInput ref={i => this.searchInput = i} placeholder="Search" style={{ flex: 1 }}></TextInput>
                </View>

                <IconButton icon="search"
                    color={Colors.muteTextColor}
                    size={25}
                    onPress={() => this.setState({ searchShown: true }, () => this.searchInput.focus())}
                />
            </View>
        )
    }

    topBar = () => {
        return (
            <View style={{ alignItems: 'center', justifyContent: 'space-evenly', flexDirection: 'row' }}>
                <IconButton icon='menu'
                    color={Colors.White}
                    size={25}
                    onPress={() => Actions.drawerOpen()}
                />

                <View style={{ backgroundColor: Colors.primaryColor, alignItems: 'center', justifyContent: 'center', flex: 0.8, paddingStart: 40, flexDirection: 'row' }}>
                    <Image source={require('../../../assets/icon.png')} style={{ height: 30, width: 45, marginRight: 10 }} />
                    <Text style={{ color: Colors.White, letterSpacing: 1, }}>{'Transporter'.toUpperCase()}</Text>
                </View>

                <IconButton icon='filter-list' color={Colors.White} size={25} onPress={() => this.setState({ filterShown: true })} style={{ flex: 0.1 }} />

                <IconButton icon="search"
                    color={Colors.White}
                    size={25}
                    style={{ flex: 0.1 }}
                    onPress={() => this.setState({ searchShown: true }, () => this.searchInput.focus())}
                />
            </View>
        )
    }

    data = {
        from: {
            place: 'Roorkee',
            subplace: 'Adarsh Nagar',
            date: '13th May, 2019',
            time: '08:00 AM'
        },
        to: {
            place: 'Dehradun',
            subplace: 'Dehradun',
            date: '16th May, 2019',
            time: '09:00 PM'
        },
        ride: 'Full Load',
        truck: 'Vegetable'
    }


    cardPressed = () => {
        Alert.alert('', 'Are you sure you want to request for this ride ?', [
            {
                text: 'Yes',
                onPress: () => Actions.MyRequests()
            },
            {
                text: "No",
                onPress: () => { }
            }
        ],
            { cancelable: true }
        )
    }

    render() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
                <View style={{ backgroundColor: Colors.primaryColor, height: Dimens.statusBarHeight }} />
                <View style={{ backgroundColor: Colors.primaryColor, padding: Dimens.padding / 3, }}>

                    {
                        this.state.searchShown ? this.searchBar() : this.topBar()
                    }

                </View>

                <ScrollView style={Styles.rootView}>
                    {/* {this.list.map((e, i) => <TruckListing key={i} {...e} onPress={() => this.cardPressed(e)} />)} */}
                    <AvailableRidesCard {...this.data} onPress={() => this.cardPressed()} />
                </ScrollView>
                <FilterModal visible={this.state.filterShown} hideFilter={() => { this.setState({ filterShown: false }) }} onComplete={() => { }} />
                <FooterButton icon='add' name='Create Ride Request' cta={() => Actions.CreateRideRequest()} />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    rootView: {
        padding: Dimens.padding / 2,
        paddingTop: 0,
        flexGrow: 1
    }
})

export default Home