import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TextInput
} from 'react-native';
import {
  Container,
  Button,
  Picker,
  Icon
} from 'native-base';
import Ripple from 'react-native-material-ripple';
import {primaryColor} from '../../redux/Constant'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment' 
import {connect} from 'react-redux';
import { language } from '../../redux/Utility'
import { postApiPosts, updatePost } from "../../redux/api/feed";
import ContentLoader from '../common/ContentLoader'
import FormatText from '../common/FormatText'
import {setToggleState} from '../../redux/actions/map'

const { width, height } = Dimensions.get('screen');

const repitionArray = [
  {'label': 'Hourly', 'value': 'hourly'},
  {'label': 'Daily', 'value': 'daily'},
  {'label': 'Weekly', 'value': 'weekly'},
  {'label': 'Monthly', 'value': 'monthly'}
]

const ScheduleOptions = (props) => {

  const [openDatePicker, setOpenDatePicker] = useState(false)
  const [time, setTime] = useState(null)
  const [currentItem, setCurrentItem] = useState({time: '', repitition: 'hourly', message: '', spot: '', schedule_message: true})
  const [isLoading, setIsLoading] = useState(false)

  const onSelect = (item, key) => {
    let form = {...currentItem};
    let selectedTime = moment(item).format('hh:mm')
    if(key === 'time'){
      form[key] = selectedTime;
      setCurrentItem(form)
      setOpenDatePicker(false)
    } else {
      form[key] = item;
    }
    setCurrentItem(form)
  }

  const saveData = () => {
    setIsLoading(true)
    if(props.currentMessage.id){
      props.dispatch(updatePost(currentItem.message, [], currentItem.spot, props.auth.userData.id, '', currentItem, 'Spot', props.currentMessage.id)).then(res => {
        setIsLoading(false)
        props.closeModal()
      })
    } else {
      props.dispatch(setToggleState(true))
      props.dispatch(postApiPosts(currentItem.message, [], currentItem.spot, props.auth.userData.id, '', currentItem, 'Spot')).then(res => {
        setIsLoading(false)
        props.closeModal()
      })
    }
  }

  useEffect(() => {
    if (props.currentMessage.id) {
      let selectedTime = moment(props.currentMessage.spot_popup.start_at).format('hh:mm')
      setCurrentItem({time: selectedTime, repitition: props.currentMessage.spot_popup.repetition, message: props.currentMessage.message, spot: props.currentMessage.spot_popup.spot_id})
    }
  },[props.currentMessage])

  
  const renderDropdown = () => {
    let { owned_spots, default_locale } = props.auth.userData
    if (props.messages.current_thread_detail.checkinThread) {
      return  <View style={styles.pickerCon}>
                <Text style={styles.heading}><FormatText variable='msgscomp.select_spot' /></Text>
                <View style={styles.picker}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select Prefecture"
                    iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
                    style={styles.pickerElement}
                    onValueChange={(val) => onSelect(val, 'spot')}
                    selectedValue={currentItem.spot}
                    textStyle={{fontSize: 14}}
                  >
                    {owned_spots.length ? 
                      owned_spots.map((item, index) => {
                        return <Picker.Item key={index} label={language(default_locale, item.attname, item.attname_local)} value={item.id} />
                      })
                      :
                      null
                    }
                  </Picker>
                </View>
              </View>
    }
  }

  const renderLoader = () => {
    if(isLoading){
      return <View style={styles.loaderCon}>
                <ContentLoader />
              </View>
    }
  }

	return(
		<Container style= {styles.mainCon}>
      <TouchableOpacity style={styles.dateView} onPress={() => setOpenDatePicker(true)}>
        <Text>{currentItem.time ? currentItem.time : <FormatText variable='msgscomp.select_time' />}</Text>
      </TouchableOpacity>
      <View style={styles.msgCon}>
        <Text style={styles.heading}><FormatText variable='msgscomp.message' /></Text>
        <TextInput
          style={styles.message}
          placeholder="Write Message"
          multiline
          numberOfLines={4}
          value={currentItem.message}
          onChangeText={(text) => onSelect(text, 'message')}
        />
      </View>
      <View style={styles.btnBox}>
        <Text style={styles.heading}><FormatText variable='msgscomp.repitition' /></Text>
        <View style={styles.btnsCon}>
        {repitionArray.map((item, key) => {
          return <TouchableOpacity style={[styles.btn, (currentItem.repitition === item.value) && styles.btnSelected]} onPress={() => onSelect(item.value, 'repitition')}>
                  <View style={[styles.radioBtn, (currentItem.repitition === item.value) && styles.radioBtnSelected]}>
                    <View style={styles.radioDot}></View>
                  </View>
                  <Text style={[styles.text, (currentItem.repitition === item.value) && styles.selectedText]}>{item.label}</Text>
                </TouchableOpacity>
        })}
        </View>
      </View>
      {renderDropdown()}
      <TouchableOpacity style={styles.btnCon} onPress={() => saveData()}>
        <Text style={styles.btnText}><FormatText variable='msgscomp.save' /></Text>
      </TouchableOpacity>
      {renderLoader()}
      <DateTimePickerModal
        isVisible={openDatePicker}
        mode="time"
        onCancel={() => setOpenDatePicker(false)}
        onConfirm={(time) => onSelect(time, 'time')}
        headerTextIOS="Select Time"
      />
		</Container>
	)
}

const styles = StyleSheet.create({
  mainCon:{
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 20
  },
  heading: {
    marginBottom: 5,
  },
  btnBox:{
    marginBottom: 10
  },
  btnsCon: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  btn: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: primaryColor,
    flexDirection: 'row',
    paddingVertical: 3,
    marginRight: 10,
    paddingHorizontal: 5
  },
  radioBtn: {
    width: 16,
    height: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: primaryColor,
    marginRight: 5
  },
  btnSelected: {
    backgroundColor: primaryColor
  },
  radioBtnSelected: {
    borderColor: '#fff'
  },
  radioDot: {
    width: 6,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    left: 3,
    top: 3
  },
  selectedText: {
    color: '#fff',
    fontSize: 12
  },
  dateView: {
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    marginBottom: 10,
    justifyContent: 'center'
  },
  message: {
    height: 60,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    padding: 10, 
    color: '#000' 
  },
  msgCon: {
    marginBottom: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
  },
  pickerElement: {
    height: 40,
  },
  text: {
    fontSize: 12
  },
  btnCon: {
    alignSelf: 'center',
    backgroundColor: primaryColor,
    paddingHorizontal: 25,
    paddingVertical: 8,
    marginTop: 20,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff'
  },
  arrowIcon: {
    fontSize: 18
  },
  loaderCon: {
    position: 'absolute',
    left: -10,
    top: -35,
    width: width + 20,
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  }
})

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleOptions); 
