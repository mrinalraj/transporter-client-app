import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper'
import Routes from './src/Routes'
import Colors from './src/res/Colors'

export default class App extends React.Component {

  render() {
    return (
      <PaperProvider theme={paperCustomTheme}>
        <Routes />
      </PaperProvider>
    );
  }

}

const paperCustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primaryColor,
    accent: Colors.accentColor
  }
}