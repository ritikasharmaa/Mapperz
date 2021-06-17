import React, { useState } from 'react';
import { View,StyleSheet, Text, TextInput } from 'react-native';
import { Icon, Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import OwnButton from '../common/OwnButton'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Ripple from 'react-native-material-ripple';
import moment from 'moment'
import FormatText from '../common/FormatText'
import { convertText } from '../../redux/Utility'


const EditSpotDetail = (props) => {
	console.log(props, 'new props')
	const [openDatePicker, setOpenDatePicker] = useState(false)

	const selectTime = (time) => {
		//console.log(moment(time).format('hh:mm'), 'time')
		let selectedTime = moment(time).format('hh:mm')
		props.onChangeValues('visit_time', selectedTime)
		setOpenDatePicker(false)
	}

  console.log(props.currentSpot, "currentSpot")
  return(
    <View style={styles.InviteCon}>
    	<Text style={styles.heading}><FormatText variable='plannercomp.edit_detail' /></Text>
    	<Ripple style={styles.dateView} onPress={() => setOpenDatePicker(true)}>
    		<Text>{props.currentSpot.visit_time ? props.currentSpot.visit_time : <FormatText variable='msgscomp.select_time' />}</Text>
    	</Ripple>
    	{/*<TextInput
        style={styles.textBox}
        placeholder="Edit Time"
        value={props.currentSpot.visit_time}
        onChangeText={(val) => props.onChangeValues('visit_time', val)}
      />*/}
      <TextInput
        style={[styles.textBox, {height: 100}]}
        placeholder={convertText('planner.enterDesc', props.lang)}
        multiline
        value={props.currentSpot.description}
        onChangeText={(val) => props.onChangeValues('description', val)}
      />
      <View style={styles.sendBtn}>
      	<OwnButton buttonText="Save" onPress={() => props.saveSpot()} />
      </View>

      <DateTimePickerModal
        isVisible={openDatePicker}
        mode="time"
        onCancel={() => setOpenDatePicker(false)}
        onConfirm={(time) => selectTime(time)}
        headerTextIOS={convertText("planner.selectTime", props.lang)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
	InviteCon: {
		paddingHorizontal: 10
	},
  heading: {
  	fontSize: 20,
  	textAlign: 'center',
  	marginBottom: 40
  },
  textBox: {
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    color: '#000'
  },
  sendBtn: {
  	marginTop: 20
  },
  dateView: {
  	borderBottomWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 10,
    justifyContent: 'center'
  }
})

export default EditSpotDetail
