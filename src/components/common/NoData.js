import React from 'react';
import { View, StyleSheet, Dimensions, Text, Image } from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import ActionButton from 'react-native-action-button';
import FormatText from './FormatText'


const { width, height } = Dimensions.get('screen');

const NoData = (props) => {
  const friendLink = () => {
    if(props.findFriends){
      return <View style={styles.sendBtn}>
              <OwnButton
                buttonText={<FormatText variable='profile.send_invitation'/>} 
                onPress={() => props.navigation.navigate('FindFriends')}
              />
            </View>
    }
  }

  return(
    <View style={[styles.data, props.dropDownMaps && styles.dataMargin]}>
      <View style={styles.imgCon}>
        <Image style={styles.img} source = {require('../../assets/images/nodata.png')}/>
      </View>
      <Text style={styles.heading}>{props.title ? props.title : <FormatText variable='planner.its_empty' />}</Text>
      {!props.noSubTitile && <Text style={styles.subText}><FormatText variable='planner.oops_seems' /></Text>}
      {friendLink()}
    </View>
  )
}

const styles = StyleSheet.create({
  data: { 
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataMargin:{
    marginTop:10

  },
  imgCon: {
    width: 100,
    height: 70,
    marginTop: 10,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  heading: {
    color: 'grey',
    fontSize: 20,
    marginVertical: 15,
  },
  subText: {
    color: 'grey',
    width: 230,
    textAlign: 'center',
  },
  sendBtn: {
    marginTop: 20,
    width: 200,
    alignSelf: 'center'
  }
})

export default NoData