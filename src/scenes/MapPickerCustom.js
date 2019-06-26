import React from 'react'
import MapPicker from '../components/MapPicker'

import { View } from 'react-native'
import { Permissions, Location, Accu } from 'expo'
import LoadingDialog from '../components/LoadingDialog'
// import { Accuracy } from 'expo-location'
import Axios from 'axios';
import { BASE_API } from '../res/Constants';

class MapPickerCustom extends React.Component {
    state = {

    }

    componentDidMount() {
        this._getLocationAsync()
    }

    _getLocationAsync = async () => {
        this.setState({ loading: true })
        const { status } = await Permissions.askAsync(Permissions.LOCATION)

        if (status !== 'granted') {
            alert('we need permission')
        }

        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest })
        this.setState({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            loading: false
        })
    }

    _onLocationSelect = (which, latitude, longitude) => {
        this.setState({ loading: true })
        Axios.post(`${BASE_API}/placeAPI?lat=${latitude}&lng=${longitude}`, { lat: latitude, lng: longitude })
            .then(({ data }) => {
                if (!data.success)
                    return alert('error finding address')
                const addressComp = data.payload.result.results[0]
                    // , place = addressComp.address_components.filter(e => e.types.includes('administrative_area_level_2'))[0]
                    // , subPlace = addressComp.address_components.filter(e => e.types.includes('locality'))[0]
                    // , address = `${place} / ${subPlace}`
                    , address = addressComp["formatted_address"].split(', ')
                    , city = address.slice(-3, -2)
                    , locality = address.slice(-5, -4)
                this.setState({ loading: false })
                this.props.onLocationSelect(which, latitude, longitude, `${city}/${locality}`)
            })
            .catch(err => alert(err))
    }

    _renderMap = () => {
        if (this.state.latitude) {
            return (
                <MapPicker min initialCoordinate={{
                    latitude: this.state.latitude,
                    longitude: this.state.longitude
                }}
                    onLocationSelect={({ latitude, longitude }) => this._onLocationSelect(this.props.which, latitude, longitude)} />
            )
        }
        return;
    }


    render() {

        return (
            <View style={{ flex: 1 }}>
                {
                    this._renderMap()
                }
                <LoadingDialog visible={this.state.loading} />
            </View>
        )
    }

}

export default MapPickerCustom