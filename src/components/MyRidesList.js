import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import { Card, Title, Subheading, Divider } from 'react-native-paper'
import Dimens from '../res/Dimens'
import Colors from '../res/Colors'
import moment from 'moment'
import { Actions } from 'react-native-router-flux';

class MyRidesList extends Component {
    state = {
        ...this.props
    }

    render() {
        return (
            <Card style={{ marginBottom: Dimens.padding / 2, padding: 0 }} >
                <Card.Title title={this.state.transporterData.name} subtitle={this.state.vehicleData.truckNumber} />
                <Divider />
                <Card.Content>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: 'column', flex: 0.4 }}>
                            <View style={{ marginTop: 10, marginBottom: 60 }}>
                                <Title>{this.state.rideData.startAddress.address}</Title>
                                {/* <Subheading>{this.state.from.subplace}</Subheading> */}
                            </View>
                            <View>
                                <Title>{this.state.rideData.endAddress.address}</Title>
                                {/* <Subheading>{this.state.to.subplace}</Subheading> */}
                            </View>
                        </View>

                        {/* <View style={{ flexDirection: 'column', flex: 0.4 }}>
                            <View style={{ marginTop: 10, marginBottom: 60 }}>
                                <Title>{this.state.from.date}</Title>
                                <Subheading>{this.state.from.time}</Subheading>
                            </View>
                            <View>
                                <Title>{this.state.to.date}</Title>
                                <Subheading>{this.state.to.time}</Subheading>
                            </View>
                        </View> */}


                        <View style={{ flexDirection: 'column', borderLeftColor: Colors.muteTextColor, borderLeftWidth: 1, flex: 0.6 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, }}>
                                <Text>{`${moment(this.state.rideData.startTime).format('MMMM Do YYYY')} \n${moment(this.state.rideData.startTime).format('hh:mm:ss a')}`}</Text>
                            </View>

                            <Divider />

                            <View style={{ padding: 20 }}>
                                <Text>{`Ride Type : ${this.state.rideData.rideType}`}</Text>
                                <Text>{`Load Weight : ${this.state.weight}`}</Text>
                            </View>

                            <Divider />

                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, }}>
                                <Text>{`${moment(this.state.rideData.endTime).format('MMMM Do YYYY')} \n${moment(this.state.rideData.endTime).format('hh:mm:ss a')}`}</Text>
                            </View>
                        </View>
                    </View>
                </Card.Content>
                {
                    this.props.type == 2 ? (
                        <View>
                            <Divider />
                            <Card.Actions style={{ width: Dimens.windowWidth - Dimens.padding, justifyContent: 'flex-end', marginTop: 0 }}>
                                <TouchableOpacity style={{ paddingRight: Dimens.padding / 2, paddingTop: Dimens.padding / 4, paddingBottom: Dimens.padding / 4 }} onPress={() => Actions.TruckLiveLocation({ initial: this.state.rideData.startAddress.location, destination: this.state.rideData.endAddress.location, truckNumber: this.state.vehicleData.truckNumber })}>
                                    <Text>View Live Location</Text>
                                </TouchableOpacity>
                            </Card.Actions>
                        </View>) : null
                }

            </Card>
        );
    }
}

export default MyRidesList