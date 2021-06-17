import React, {useRef, memo} from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import FriendList from '../ViewMaps/FriendList'
import { TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';

const FriendsBtn = (props) => {
  const modalRef= useRef(null)

	return(
    <>
      <TouchableOpacity style={[styles.topRight]} onPress= {()=> modalRef.current.open()}>
        <LottieView source={require('../../assets/json/02 friends.json')} autoPlay loop={false} style={{width: 55, height: 55}} />
        <Text style={styles.text} >Friends</Text>
      </TouchableOpacity>
      <RBSheet
        ref={modalRef}
        height={400}
        openDuration={250}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }
        }}
      >
        <FriendList {...props}  modalRef={modalRef} lang={props.lang}/>
      </RBSheet>
    </>
	)
}

const styles = StyleSheet.create({
  usersIcon: {
    color: primaryColor,
    fontSize: 22,
    fontWeight: '600',
  },
  container: {
    flex: 1,
    zIndex: 99,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc'
  },
  topRight: {
    alignItems: 'center',
  },
  text: {
    position: 'absolute',
    fontSize: 13,
    bottom: 0
  }
})

export default memo(FriendsBtn);  
