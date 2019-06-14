import React from 'react'
import { View, TextInput } from 'react-native'
import { IconButton, Title, } from 'react-native-paper'
import Colors from '../res/Colors'
import Dimens from '../res/Dimens'
import { Actions } from 'react-native-router-flux'


class NavBar extends React.Component {
    state = {

    }

    topBar = () => {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <IconButton color={Colors.White} size={24} icon='arrow-back' onPress={() => Actions.pop()} />
                <Title style={{ color: Colors.White, textAlign: 'center', justifyContent: 'center', flex: 0.8 }}>{this.props.title}</Title>
                <View style={{ flex: 0.1 }}>
                    {
                        this.props.searchEnabled ? this.searchButton() : null
                    }
                </View>
            </View>
        )
    }

    searchButton = () => {
        return (
            <IconButton icon="search"
                color={Colors.White}
                size={25}
                onPress={() => this.setState({ searchShown: true }, () => this.searchInput.focus())}
            />
        )
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

    render() {
        return (
            <View>
                <View style={{ height: Dimens.statusBarHeight, backgroundColor: Colors.primaryColor }} />
                <View style={{ backgroundColor: Colors.primaryColor, padding: Dimens.padding / 3, }}>
                    {
                        this.state.searchShown ? this.searchBar() : this.topBar()
                    }
                </View>
            </View>
        )
    }
}


export default NavBar