import React from 'react'
import { ActivityIndicator, Modal, } from 'react-native-paper'
import Colors from '../res/Colors'

const LoadingDialog = ({ visible }) => {
    return (
        <Modal style={{ zIndex: 1000 }} dismissable={false} visible={visible} >
            <ActivityIndicator animating={true} size="large" color={Colors.accentColor} ></ActivityIndicator>
        </Modal>
    )
}

export default LoadingDialog