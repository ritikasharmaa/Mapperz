import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard
} from 'react-native';
import {
  Container,
  Content
} from 'native-base';
import { primaryColor } from '../../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import { CommonActions  } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import LinearGradient from 'react-native-linear-gradient';
import { userDetail } from '../../../redux/actions/auth'
import {connect} from 'react-redux';
import FormatText from '../../../components/common/FormatText'
import { convertText } from '../../../redux/Utility'
import Toast from 'react-native-root-toast';

const { width, height } = Dimensions.get('screen');

const Name = (props) => {

  let lang = props.uiControls.lang
  const onChange = (text, key) => {
    props.dispatch(userDetail(text, key))
  } 
  const goToNext = () => {
    Keyboard.dismiss()
    if(props.auth.user_detail.user_name === ''){
      Toast.show(convertText("login.fieldReq", lang))
      return
    } else {
        props.navigation.navigate('Areas')
        return
    }   
  }
	return(
    <Container style={styles.mainCon}>
      <Content>
        <View style={styles.logoCon}>
          <Image source={require('../../../assets/images/sign_up8.png')} style={styles.iconImage} />
        </View>

      {/* <LinearGradient 
        colors={['#9248e7', '#9949e8', '#bb4fef', '#9949e8', '#9248e7']} 
        style={styles.background}
       > */}
  			<View style={styles.nameCon}>
          <Text style={styles.text}><FormatText variable='signup.what_can_we' /></Text>
          <TextInput style={styles.inputBox}
             placeholder={convertText("signup.name.name", lang)}
             placeholderTextColor= '#ccc'
             onChangeText={text => onChange(text, 'user_name')}
             value={props.auth.user_detail.user_name}
          />
        </View>
        <TouchableOpacity style={styles.continueBtnCon} onPress={() => goToNext()}>
          <Text style={styles.continueBtn}><FormatText variable='signup.continue' /></Text>
        </TouchableOpacity>
      {/* </LinearGradient> */}
      </Content>
    </Container>
	)
}
const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  logoCon: {
    width:width,
    height: width - 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  background: {
    width: '100%',
    height: '100%'
  },
  nameCon: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  text: {
    fontSize: 18,
    marginBottom: 20,
    // color: '#fff'
  },
  inputBox: {
    height: 50,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: "grey",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  continueBtnCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  continueBtn: {
    width: 130,
    borderWidth: 1,
    borderColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: primaryColor,
    textAlign: 'center'
  }
})
const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
const mapDispatchToProps = (dispatch) => ({
dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Name); 