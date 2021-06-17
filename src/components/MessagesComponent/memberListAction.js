import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  Container,
  Button,
  Icon
} from 'native-base';
import Ripple from 'react-native-material-ripple';
import {primaryColor} from '../../redux/Constant'
import FormatText from '../common/FormatText'


const MemberListAction = (props) => {
  let isAdmin = props.currentAdmins.indexOf(props.selectedMember.id)
	return(
		<Container style= {styles.mainCon}>
      <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} style={[styles.actionList, styles.border]} onPress = {() => props.changeRoleBtn(isAdmin == -1 ? 'admin' : 'member')}>
        <View style={styles.imgCon}>
          <Image source={require('../../assets/images/Users-admin.png')} style={styles.img}></Image>
        </View>
        {/*<Icon name="user-shield" type="FontAwesome5" style={styles.icon} />*/}
        <Text style={styles.action}>{isAdmin == -1 ? <FormatText variable='msgscomp.make_group_admin' /> : <FormatText variable='msgscomp.dimiss_as' />}</Text>
      </Ripple>
			<Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} style={styles.actionList} onPress = {() => props.removeBtn()}>
        <View style={styles.imgCon2}>
          {/* <Image source={require('../../assets/images/remove.jpg')} style={styles.img}></Image> */}
        </View>
        {/*<Icon name="times" type="FontAwesome5" style={styles.icon} />*/}
        <Text style={styles.action}><FormatText variable='msgscomp.remove' /></Text>
      </Ripple>
		</Container>
	)
}

const styles = StyleSheet.create({
  mainCon:{
    width: '100%',
    paddingHorizontal: 15,
    paddingBottom: 10,
  },
  actionList: {
    paddingVertical: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  border: {
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  action: {
    fontWeight: '600',
  },
  icon: {
    width: 30,
    fontSize: 20,
    marginRight: 10,
    color: 'red'
  },
  imgCon: {
    width: 38,
    height: 38,
    marginRight: 10,
  },
  imgCon2: {
    width: 32,
    height: 32,
    marginHorizontal: 8,
  },
  img: {
    width: '100%',
    height: '100%',
  }
})
export default MemberListAction;