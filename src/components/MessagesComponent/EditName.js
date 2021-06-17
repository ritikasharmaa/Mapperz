import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput, 
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Button,
} from 'native-base';
import Ripple from 'react-native-material-ripple';
import {primaryColor} from '../../redux/Constant'
import FormatText from '../common/FormatText'
import { convertText } from '../../redux/Utility'
const { width, height } = Dimensions.get('screen');

const EditName = (props) => {
  
  let lang = props.uiControls.lang
	return( 
		<Container style= {styles.mainCon}>
			<Text style={styles.heading}><FormatText variable='msgscomp.enter_new_sub' /></Text>
      <View style={styles.textInput}>
        <TextInput style={styles.text}
          placeholder={convertText('msgscomp.subject', lang)}
          placeholderTextColor= 'grey'
          onChangeText={text => props.onChange(text)}
          editable={true}
          defaultValue={props.defaultValue}
        />
        <TouchableOpacity style={styles.enterCon} onPress = {() => props.changeName('name')}>
          <Text style={styles.enter}><FormatText variable='msgscomp.enter' /></Text>
        </TouchableOpacity>
      </View>
      {/*<View style={styles.buttonCon}>
        <Ripple style={styles.button} onPress = {() => props.exitThread('exit_group')}>
          <Text style={styles.blueBtn}>Sure</Text>
        </Ripple>
        <Ripple style={[styles.button, styles.whiteBtn]} onPress ={() => props.closeModal()}>
          <Text style={styles.whiteBtnText}>CANCEL</Text>
        </Ripple>
      </View>*/}
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
    marginBottom: 10,
  },
  textInput: {
    flexDirection: 'row'
  },
  text:{
    padding: 6,
    borderBottomWidth: 1,
    borderColor: 'grey',
    width: width - 100,
    marginRight: 10,
    color: '#000'
  },
  enter: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    color: '#fff',
  },
  enterCon: {
    overflow: 'hidden',
    borderRadius: 20,
    backgroundColor: primaryColor,
  }
})
export default EditName;
