import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Icon,
  DatePicker,
  Input,
  Item
} from 'native-base'
import {connect} from 'react-redux';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Header from '../../components/common/Header'
//import Footer from '../../components/common/Footer'
import OwnButton from '../../components/common/OwnButton'
import moment from 'moment'
import { saveProfile } from '../../redux/api/auth'
import FormatText from '../../components/common/FormatText'
import { convertText } from '../../redux/Utility'
import DateTimePickerModal from "react-native-modal-datetime-picker";


const { width, height } = Dimensions.get('screen');

const EditProfile = (props) => {
  let lang = props.uiControls.lang

  const [ profileData, setProfileData ] = useState({})
  const [loading, setloading] = useState(false)
  const [openDatePicker, setOpenDatePicker] = useState(false)

  const [temp, setTemp] = useState(0)

  useEffect(() => {
    setProfileData(props.auth.userData)
  }, [])

  const onChange = (key, value) => {
    if(key === 'birthday'){
      value = moment(value).format('yyyy-MM-DD')
    }
    let data = {...profileData};
    data[key] = value;
    setProfileData(data)
  }

  const saveData = () => {
    setloading(true)
    props.dispatch(saveProfile(profileData)).then(res => {
      setloading(false);
      props.navigation.navigate('Footer', {
        routeId : 4
      })
    })
  }

  const birthDate = (isText) => {    
    let date = new Date()
    let year = date.getFullYear()
    let month = date.getMonth();
    let day = date.getDate();
    let oldDate = new Date(year - 20, month, day)
    
    if(isText) {      
      if(profileData.birthday){
        return profileData.birthday
      } else {
        return moment(oldDate).format('DD-MM-YYYY')
      }      
    } else {
      if(profileData.birthday){
        return (new Date(profileData.birthday))
      } else {
        return oldDate
      }      
    }
  }  
  
  return(
    <Container style={styles.mainContainer}>
      <Header backEnd blackBackBtn nextScreen="Footer" heading={<FormatText variable='profile.edit_basic_detail'/>} navigation={props.navigation}/>
      <Content>
        <View style={styles.body}>
          <Item style={styles.ItemBox}>
            <Input
              style={styles.inputBox}
              placeholder={convertText("profile.firstName", lang)}
              value={profileData.first_name != 'undefined'  ? profileData.first_name : ''}
              onChangeText={(text) => onChange('first_name', text)}
            />
          </Item>
          <Item style={styles.ItemBox}>
            <Input
              style={styles.inputBox}
              placeholder={convertText("profile.lastName", lang)}
              value={profileData.last_name != 'undefined' ? profileData.last_name : ''}
              onChangeText={(text) => onChange('last_name', text)}
            />
          </Item>
          <View style={[styles.textBox, {paddingHorizontal: 0}]}>
            <TouchableOpacity style={styles.dateView} onPress={() => setOpenDatePicker(true)}>
              <Text>{birthDate('text')}</Text>
            </TouchableOpacity>
            {/* <DatePicker
              placeHolderText={profileData.birthday ? profileData.birthday : convertText("profile.birthday", lang)}
              defaultDate={birthDate()}
              format="DD-MM-YYYY"
              onDateChange={(date) => onChange('birthday', date)}
              maximumDate={new Date()}
              //value={profileData.birthday}
            /> */}
            <DateTimePickerModal
              isVisible={openDatePicker}
              mode="date"
              onCancel={() => setOpenDatePicker(false)}
              onConfirm={(date) => onChange('birthday', date)}
              headerTextIOS="Select Time"
              date={birthDate()}
            />
          </View>
          <Item style={styles.ItemBox}>
            <Input
              style={styles.inputBox}
              placeholder={convertText("profile.showName", lang)}
              value={profileData.nick_name}
              onChangeText={(text) => onChange('nick_name', text)}
            />
          </Item>
          <Item style={styles.ItemBox}>
            <Input
              style={styles.inputBox}
              placeholder={convertText("profile.email", lang)}
              value={profileData.email}
              onChangeText={(text) => onChange('email', text)}
            />
          </Item>
          {/* <Item style={styles.ItemBox}>
            <Input
              style={styles.inputBox}
              keyboardType='numeric'
              placeholder={convertText("profile.phone", lang)}
              value={profileData.phone}
              onChangeText={(text) => onChange('phone', text)}
            />
          </Item> */}
          <View style={styles.btnCon}>
            <OwnButton 
              buttonText={convertText("profile.updateUser", lang)}
              onPress={() => saveData()} 
              loading={loading}
            />
          </View>
        </View>
      </Content>
      {/*<Footer navigation={props.navigation} />*/}
    </Container>
  )
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    paddingHorizontal: 10,
    paddingBottom: 50,
    paddingTop: 20
  },
  heading: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20
  },
  mainContainer: {
    backgroundColor: '#fff',
  },
  textBox: {
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  inputBox: {
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    marginBottom: 2
  },
  btnCon: {
    marginTop: 10
  },
  ItemBox: {
    marginBottom: 10,
  },
  dateView: {
    marginLeft: 8,
    marginTop: 5
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(EditProfile);  