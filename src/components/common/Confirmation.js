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
import ContentLoader from './ContentLoader'
import {primaryColor} from '../../redux/Constant'
import FormatText from './FormatText'

const { width, height } = Dimensions.get('screen');
const Confirmation = (props) => {

	return(
		<View style= {styles.mainCon}>
      <View style={styles.innerContainer}>
  			<Text style={styles.heading}><FormatText variable='common.are_you_sure' /></Text>
        <View style={styles.buttonCon}>
          <Ripple style={styles.button} onPress={() => props.deleteMessage ? props.deleteMessage() : props.onConfirm()}>
            <Text style={styles.blueBtn}><FormatText variable='common.sure' /></Text>
          </Ripple>
          <Ripple style={[styles.button, styles.whiteBtn]} onPress={() => props.closeModal ? props.closeModal() : props.onCancel()}>
            <Text style={styles.whiteBtnText}><FormatText variable='common.cancel' /></Text>
          </Ripple>
        </View>
      </View>
      {props.loading && <View style={styles.loaderCon}>
                          <ContentLoader />
                        </View>
      }
		</View>
	)
}

const styles = StyleSheet.create({
  mainCon:{
    width: '100%',
    padding: 10,
    alignItems: 'center',
    flex: 1,
  },
  innerContainer: {
    //height: 200,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10
  },
  heading: {
    fontSize: 16,
    fontWeight: '500',
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
  },
  loaderCon: {
    position: 'absolute',
    width: width,
    height: 150,
    left: 0,
    top: -25,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center'
  }
})
export default Confirmation;