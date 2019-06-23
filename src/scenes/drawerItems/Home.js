import React, { Component } from 'react'
import { View, Text, Image, StyleSheet, ScrollView, Button, Keyboard, TextInput, KeyboardAvoidingView, TouchableOpacity } from 'react-native'
import Dimens from '../../res/Dimens'
import { SecureStore } from 'expo'
import { ACCESS_TOKEN, BASE_API, INIT_DATA } from '../../res/Constants'
import { Actions, } from 'react-native-router-flux'
import Colors from '../../res/Colors'
import { IconButton, Modal, ActivityIndicator, Card, } from 'react-native-paper'
import FooterButton from '../../components/FooterButton'
import FilterModal from '../../components/FilterModal'
import AvailableRidesCard from '../../components/AvailableRidesCard'
import Axios from 'axios'
import LoadingDialog from '../../components/LoadingDialog';


class VolumeAndWeightInput extends Component {

    state = {
        setState: this.props.setState,
    }

    render() {
        return (
            <Modal
                dismissable={false}
                visible={this.props.confirmOptionShown}>
                <KeyboardAvoidingView behavior='position'>
                    <Card style={{ margin: Dimens.padding }}>
                        <Card.Title title='Enter values to request ride' />
                        <Card.Content>
                            <Text style={Styles.labelText}>Volume</Text>
                            <TextInput placeholder={`Volume in metre³`} style={Styles.inputStyle} onChangeText={t => this.setState({ volume: t })}></TextInput>
                            <Text style={Styles.labelText}>Weight</Text>
                            <TextInput placeholder={`Weight in kilogram`} style={Styles.inputStyle} onChangeText={t => this.setState({ weight: t })}></TextInput>
                        </Card.Content>

                        <View style={{ paddingRight: Dimens.padding / 4, paddingLeft: Dimens.padding / 4 }}>
                            {
                                !!this.state.error ? <Text style={{
                                    fontSize: 12,
                                    color: Colors.warningRed,
                                    marginTop: Dimens.hp(4),
                                }}>All fields are mandatory</Text> : null
                            }

                            <Text style={{ marginTop: Dimens.hp(2) }}>Do you want to reqest the ride?</Text>
                        </View>


                        <Card.Actions style={{ marginTop: 10 }}>
                            <TouchableOpacity onPress={() => {
                                if (!!this.state.volume && !!this.state.weight) {
                                    this.setState({ error: false })
                                    this.props.cancelModal()
                                    this.props._createRideRequest(this.state.volume, this.state.weight)
                                }
                                else this.setState({ error: true })
                            }}
                                style={{ padding: Dimens.padding / 4, marginRight: 15 }}>
                                <Text style={{ color: Colors.primaryColor }}>Yes</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this.props.cancelModal} style={{ padding: Dimens.padding / 6, }}>
                                <Text style={{ color: Colors.primaryColor }}>No</Text>
                            </TouchableOpacity>
                        </Card.Actions>
                    </Card>
                </KeyboardAvoidingView>
            </Modal >
        )
    }
}


class Home extends Component {

    state = {
        searchShown: false,
        filterShown: false,
        list: [],
        loading: false,
        loadingModal: false,
        confirmOptionShown: false
    }

    _getData = async (page = 1) => {
        this.setState({ loading: true })
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        if (!!accessToken) {
            Axios.post(`${BASE_API}/listRides`, {
                limit: 20,
                page,
            }, { headers: { accessToken } })
                .then(({ data }) => {
                    this.setState({ loading: false })

                    if (!data.success)
                        return alert(data.payload.error.message)

                    this.setState({ list: data.payload.result.data })
                    // console.log(data.payload.result.data)

                })
                .catch(error => alert(error))
        }
    }

    _createRideRequest = async (volume, weight) => {

        if (!!volume && !!weight) {
            this.setState({ loadingModal: true })
            const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
            if (!!accessToken) {
                Axios.post(`${BASE_API}/createRideRequest`, {
                    rideId: this.state.currentCard._id,
                    transporterId: this.state.currentCard.transporterData._id,
                    volume: Number.parseInt(volume),
                    weight: Number.parseInt(weight)
                },
                    { headers: { accessToken } })
                    .then(({ data }) => {
                        this.setState({ loadingModal: false })
                    
                        if (!data.success)
                            return alert(data.payload.error.message)

                        Actions.MyRides()
                    })
                    .catch(error => alert(JSON.stringify(error)))
            }

        }

    }

    async componentDidMount() {
        this._getData()
        this.keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
            this.setState({
                searchBar: false
            })
        })
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


    cardPressed = e => {

        this.setState({
            currentCard: e,
            confirmOptionShown: true
        })
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
                    {
                        this.state.list.map((e, i) => <AvailableRidesCard {...e} key={i} onPress={() => this.cardPressed(e)} />)
                    }
                    {
                        this.state.loading ? <ActivityIndicator animating={true} size="small" color={Colors.accentColor} ></ActivityIndicator> : null
                    }

                </ScrollView>
                <FilterModal visible={this.state.filterShown} hideFilter={() => { this.setState({ filterShown: false }) }} onComplete={() => { }} />
                <FooterButton icon='add' name='Create Ride Request' cta={() => Actions.CreateRideRequest()} />
                <VolumeAndWeightInput setState={this.setState} confirmOptionShown={this.state.confirmOptionShown} _createRideRequest={this._createRideRequest} cancelModal={() => this.setState({ confirmOptionShown: false })} />
                <LoadingDialog visible={this.state.loadingModal} />
            </View>
        );
    }
}

const Styles = StyleSheet.create({
    rootView: {
        padding: Dimens.padding / 2,
        paddingTop: 0,
        flexGrow: 1
    },
    labelText: {
        fontSize: 12,
        color: Colors.muteTextColor,
        marginTop: Dimens.hp(2)
    },
    pickerStyle: {
        marginStart: -8, marginTop: -4, marginBottom: -4, marginEnd: -8
    },
    inputStyle: {
        paddingBottom: 3,
        fontSize: 15,
        borderBottomColor: Colors.blackColor,
        borderBottomWidth: 1.5,
        letterSpacing: 0.5,
    }
})

export default Home