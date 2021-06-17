import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions
} from 'react-native';
import {
  Container,
  Button,
} from 'native-base';
import Ripple from 'react-native-material-ripple';
import {primaryColor} from '../../redux/Constant'
import FormatText from '../common/FormatText'


const Exit = (props) => {

	return(
		<Container style= {styles.mainCon}>
			<Text style={styles.heading}><FormatText variable='common.are_you_sure' /></Text>
      <View style={styles.buttonCon}>
        <Ripple style={styles.button} onPress = {() => props.exitThread('exit_group')}>
          <Text style={styles.blueBtn}><FormatText variable='common.sure' /></Text>
        </Ripple>
        <Ripple style={[styles.button, styles.whiteBtn]} onPress ={() => props.closeModal()}>
          <Text style={styles.whiteBtnText}><FormatText variable='common.cancel' /></Text>
        </Ripple>
      </View>
		</Container>
	)
}

const styles = StyleSheet.create({
  mainCon:{
    width: '100%',
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginHorizontal: 5,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: primaryColor
  },
  buttonCon: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  blueBtn: {
    color: '#fff',
    fontSize: 12,
  },
  whiteBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'grey',
    fontSize: 12,
  },
  whiteBtnText: {
    fontSize: 12,
  }
})
export default Exit;