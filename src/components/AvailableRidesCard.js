import React, { Component } from 'react'
import { View, Text, Image } from 'react-native'
import { Card, Title, Subheading, Divider } from 'react-native-paper'
import Dimens from '../res/Dimens'
import Colors from '../res/Colors'


class AvailableRidesCard extends Component {
    state = {
        ...this.props
    }

    render() {
        return (
            <Card style={{ marginBottom: Dimens.padding / 2 }} onPress={this.props.onPress}>
                <Card.Title title='Transporter Name' subtitle='UK 08J 4562' />
                <Divider />
                <Card.Content style={{ paddingBottom: Dimens.hp('3') }}>
                    <View style={{ flexDirection: "row" }}>
                        <View style={{ flexDirection: 'column', flex: 0.4 }}>
                            <View style={{ marginTop: 10, marginBottom: 60 }}>
                                <Title>{this.state.from.place}</Title>
                                <Subheading>{this.state.from.subplace}</Subheading>
                            </View>
                            <View>
                                <Title>{this.state.to.place}</Title>
                                <Subheading>{this.state.to.subplace}</Subheading>
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
                                <Text>{`${this.state.from.date} / ${this.state.from.time}`}</Text>
                            </View>

                            <Divider />

                            <View style={{ padding: 20 }}>
                                <Text>{`Truck Type : ${this.state.truck}`}</Text>
                                <Text>{`Ride Type : ${this.state.ride}`}</Text>
                            </View>

                            <Divider />

                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 20, }}>
                                <Text>{`${this.state.to.date} / ${this.state.to.time}`}</Text>
                            </View>
                        </View>
                    </View>
                    <Divider />
                </Card.Content>
            </Card>
        );
    }
}

export default AvailableRidesCard