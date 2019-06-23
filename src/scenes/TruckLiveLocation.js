import React from 'react'
import { Image } from 'react-native'
import { MapView, SecureStore, Icon } from 'expo';
import Axios from 'axios';
import * as Polylines from '@mapbox/polyline'
import LoadingDialog from '../components/LoadingDialog';
import Dimens from '../res/Dimens';
import { ACCESS_TOKEN } from '../res/Constants';
import { Actions } from 'react-native-router-flux';

class TruckLiveLocation extends React.Component {

    state = {
        ready: false,
    }

    _getAccessToken = async () => {
        const accessToken = await SecureStore.getItemAsync(ACCESS_TOKEN)
        this.setState({ accessToken })
    }

    getCurrentTruckLocation = () => {
        const { accessToken } = this.state
        Axios.post(`http://3.17.255.202:8009/transporter/api/v1/admin/liveLocation`, { Vehicle_No: this.props.truckNumber }, { headers: { accessToken } })
            .then(({ data }) => {
                if (!data.success) {
                    console.log(data)
                    alert('Vehicle not found')
                    return Actions.pop()
                }
                const actData = data.payload.result,
                    { Latitude, Longitude } = actData
                this.setState({ latitude: Latitude, longitude: Longitude }, () => this.generatePolyline(Latitude, Longitude))
            })
    }

    generatePolyline = (latitude, longitude) => {
        Axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${latitude},${longitude}&destination=${this.props.destination.join(',')}&mode=driving&key=AIzaSyCnUW7MghZAMZkHMJjOInheluUbzNJZcoU`)
            .then(({ data }) => {
                const array = Polylines.decode(data.routes[0].overview_polyline.points),
                    coordinates = array.map(point => ({ latitude: point[0], longitude: point[1] }))
                this.setState({
                    coordinates, ready: true
                })
            })
    }

    componentDidMount() {
        this._getAccessToken()
        this.update = setInterval(() => this.getCurrentTruckLocation(), 5000)
    }

    componentWillUnmount() {
        clearInterval(this.update)
    }

    DEFAULT_DELTA = { latitudeDelta: 0.28, longitudeDelta: (0.28 * (Dimens.windowWidth / Dimens.windowHeight)) }

    render() {
        if (!this.state.ready) {
            return (
                <LoadingDialog visible={true} />
            )
        }
        return (
            <MapView
                style={{ flex: 1 }}
                initialRegion={{
                    latitude: parseFloat(this.state.latitude),
                    longitude: parseFloat(this.state.longitude),
                    ...this.DEFAULT_DELTA
                }}
            >
                <MapView.Marker coordinate={{ latitude: this.props.destination[0], longitude: this.props.destination[1] }} />
                <MapView.Marker coordinate={{ latitude: parseFloat(this.state.latitude), longitude: parseFloat(this.state.longitude) }}>
                    <Image style={{ height: Dimens.wp(3) * 2.7, width: Dimens.wp(3) }} source={require('../../assets/mapTruck.png')} />
                </MapView.Marker>
                <MapView.Polyline
                    coordinates={this.state.coordinates}
                    strokeWidth={4}
                    strokeColor="rgb(0,0,0)" />
            </MapView>
        )
    }
}

export default TruckLiveLocation