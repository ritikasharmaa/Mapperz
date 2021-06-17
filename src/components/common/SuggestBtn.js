import React, {useRef} from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import FriendList from '../ViewMaps/FriendList'
import SuggestSpot from './SuggestSpot'
import Geolocation from 'react-native-geolocation-service';


const SuggestBtn = (props) => {
  const modalRef= useRef(null)

  const getspotlist = () => {
    modalRef.current.open()
    {checkin()}
  }

  const checkin = () => { 
    Geolocation.getCurrentPosition(info => {
        let id = props.map.currentMap
        modalRef.current.open()
        props.getNearestSpots(id, info.coords.latitude, info.coords.longitude)
      }
    );
  }

	return(
    <>
      <Ripple 
        style={[styles.round, styles.topRight]}
        rippleColor="#ccc" 
        rippleOpacity={0.6}
        rippleDuration={700}
        rippleContainerBorderRadius={30}
        onPress= {()=> getspotlist()}
      >
        <Icon type="FontAwesome5" name={'comments'} style={styles.usersIcon} />
      </Ripple>
      <RBSheet
        ref={modalRef}
        height={500}
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
        <SuggestSpot onCloseModal={() => modalRef.current.close()} loading={props.map.fetchingNearestSpot} nearestSpotList={props.map.nearestSpotList}/>
      </RBSheet>
    </>
	)
}

const styles = StyleSheet.create({
	round: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    right: 10,
    bottom: 240,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    opacity: 0.8,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 10
  },
  usersIcon: {
    color: 'grey',
    fontSize: 16,
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
  topRightTest: {
    bottom: 250,
    backgroundColor: 'gray'
  }
})

export default SuggestBtn;