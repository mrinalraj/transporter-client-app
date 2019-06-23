import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { Card, Title, Subheading, Divider } from 'react-native-paper'
import Dimens from '../res/Dimens'
import Colors from '../res/Colors'
import moment from 'moment'

class MyRequestsList extends Component {
    state = {
        ...this.props
    }

    render() {
        return (
            <Card style={{ marginBottom: Dimens.padding / 2 }} onPress={this.props.onPress}>
                {/* <Card.Title title='Transporter Name' subtitle='UK 08J 4562' />
                <Divider /> */}
                <Card.Content>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: 'column', flex: 0.4 }}>
                            <View style={{ marginTop: 10, marginBottom: 60 }}>
                                <Title>{this.props.rideData.startAddress.address}</Title>
                                {/* <Subheading>{this.state.from.subplace}</Subheading> */}
                            </View>
                            <View>
                                <Title>{this.props.rideData.endAddress.address}</Title>
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
                                <Text>{`${moment(this.props.rideData.startTime).format('MMMM Do YYYY')} \n${moment(this.props.rideData.startTime).format('hh:mm:ss a')}`}</Text>
                            </View>

                            <Divider />

                            <View style={{ padding: 20 }}>
                                <Text>{`Ride Type : ${this.props.rideData.rideType}`}</Text>

                            </View>

                            <Divider />

                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, }}>
                                <Text>{`${moment(this.props.rideData.endTime).format('MMMM Do YYYY')} \n${moment(this.props.rideData.endTime).format('hh:mm:ss a')}`}</Text>
                            </View>
                        </View>
                    </View>
                </Card.Content>
            </Card>
        );
    }
}

export default MyRequestsList