import React from 'react';
import {
  StyleSheet,
  Text
} from 'react-native';

import {
  Button,
} from 'native-base'
import {SkypeIndicator} from 'react-native-indicators';
import { primaryColor } from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';


const OwnButton = (props) =>{

  const renderButtonText = () => {
    if (props.loading) {
      return <SkypeIndicator color='white' />
    } else {
      return <Text style={{color: props.whiteColor ? primaryColor : '#fff'}}>{props.buttonText}</Text>
    }
  }
  return(
    <Ripple 
      style={[styles.formBtn, {backgroundColor: props.whiteColor ? '#f5f5f5' : primaryColor }, (props.loading || props.disabled) && styles.formBtnDisabled]} 
      rippleColor="#eee" 
      rippleOpacity={0.2} 
      rippleDuration={700}
      onPress={props.onPress}
      disabled={props.loading || props.disabled}
    >
      {renderButtonText()}
    </Ripple>
  )
}

const styles = StyleSheet.create({
  formBtn: {
  //  backgroundColor: props.whiteColor ? '#f5f5f5' : primaryColor,
    height: 50,
    marginBottom: 10,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  formBtnDisabled:{
    //backgroundColor: '#bb4fef'
  },
  btmCom: {
    marginTop: 100,
    paddingBottom: 40,
    paddingRight: 10,
    paddingLeft: 10
  },

});

export default OwnButton;