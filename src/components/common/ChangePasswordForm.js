import React, { useState } from 'react';
import { View,StyleSheet, Text, TextInput } from 'react-native';
import { Icon, Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import OwnButton from './OwnButton'
import Toast from 'react-native-root-toast';
import { connect } from 'react-redux';
import { changePassword } from '../../redux/api/auth'
import FormatText from './FormatText'
import { convertText } from '../../redux/Utility'

const ChangePasswordForm = (props) => {

  let lang = props.uiControls.lang

	const [passwordForm, setPasswordForm] = useState({password: '', password_confirmation: ''})
	const [loading, setLoading] = useState(false)
	const [errorMsg, setErrorMsg] = useState('')

	/*
  * set value on change of text 
  */
	const onChange = (key, val) => {
		let form = {...passwordForm}
		form[key] = val;
		setPasswordForm(form)
		setErrorMsg('')
	}

  /*
  * update password
  */
	const savePassword = () => {
		if (passwordForm.password.length < 6) {
			// Toast.show(convertText('common.pass_must_have', lang))
			setErrorMsg(convertText('common.pass_must_have', lang))
			return
		} else if (passwordForm.password !== passwordForm.password_confirmation) {
			// Toast.show(convertText('common.confirm_pass_not', lang))
			setErrorMsg(convertText('common.confirm_pass_not', lang))
			return
		}
		setLoading(true)
		setErrorMsg('')
		props.dispatch(changePassword(passwordForm)).then(res => {
			setPasswordForm({password: '', password_confirmation: ''})
			Toast.show(convertText('common.pass_updated', lang))
			setLoading(false)
			props.hideModal()
		})
	}

  /*
  * Disable Change password button until both text fields are filled
  */
	const isDisbaled = () => {
		if (!passwordForm.password || !passwordForm.password_confirmation) {
			return true
		}
		return false
	}

  return(
    <View style={styles.InviteCon}>
    	<Text style={styles.heading}><FormatText variable='profile.change_pass' /></Text>
    	<TextInput
        style={styles.textBox}
        placeholder={convertText('common.enter_new', lang)}
        placeholderTextColor={"#ccc"}
        onChangeText={(text) => onChange('password', text)}
        value={passwordForm.password}
        secureTextEntry={true}
      />
      <TextInput
        style={styles.textBox}
        placeholderTextColor={"#ccc"}
        placeholder={convertText('profile.confirm',lang)}
        onChangeText={(text) => onChange('password_confirmation', text)}
        value={passwordForm.password_confirmation}
        secureTextEntry={true}
      />
		{
			errorMsg && errorMsg.length ? <Text style={styles.errMsg}>{errorMsg}</Text> : null
		}
		  <View style={styles.sendBtn}>
        <OwnButton 
          buttonText={convertText('profile.change_pass',lang)}
          onPress={() => savePassword()}
          disabled={isDisbaled()}
          loading={loading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
	errMsg:{
		color:'red',
		fontSize:10,
		marginLeft:20
	},
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
  	marginTop: 20,
    width: 200,
    alignSelf: 'center'
  }
})

const mapStateToProps = (state) => ({
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ChangePasswordForm);
