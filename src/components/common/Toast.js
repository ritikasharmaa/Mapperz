import React, {useRef, useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, TouchableOpacity } from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import {setCenterCord} from '../../redux/actions/map'
import {connect} from 'react-redux';
import SyncStorage from 'sync-storage';

const { width, height } = Dimensions.get('screen');

const CustomeToast = (props) => {  

  const goToUserLoc = () => {
    let cord = [props.data.lng, props.data.lat]
    let id = props.data.id
    let navigation = SyncStorage.get('navigation');
    props.dispatch(setCenterCord({centerCords : cord, id: id}))
    // navigation.navigate('Home')
    navigation.navigate('Footer', {
      routeId : 0
    })
  }

  const renderToast = () => {
    return <View style={styles.mainCon}>
            <TouchableOpacity onPress={() => goToUserLoc()}>
              {props.name ? <Text style={styles.toast}>{props.name} {props.toastText}</Text> : <Text style={styles.toast}>{props.name}{props.toastText}</Text>}
            </TouchableOpacity>
          </View>
  }
  return(
    <>
      {renderToast()}
    </>
  )
}

const styles = StyleSheet.create({
  mainCon: {
    position: 'absolute',
    zIndex: 999,
    flex: 1,
    width: width,
    height: height,
    alignItems: 'center',
    top: 35
  },
  toast: {
    backgroundColor: 'rgba(0,0,0,0.8)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    color: '#fff',
    fontSize: 16,
    borderRadius: 5,
    overflow: 'hidden'
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapDispatchToProps)(CustomeToast);

