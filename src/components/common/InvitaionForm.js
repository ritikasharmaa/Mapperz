import React, {useState} from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Icon, Button} from 'native-base'
import { primaryColor } from '../../redux/Constant'
import OwnButton from './OwnButton'
import FormatText from './FormatText'
import { sendInitation } from '../../redux/api/auth'
import { connect } from 'react-redux';
import Toast from 'react-native-root-toast';
import { convertText } from '../../redux/Utility'


const InvitaionForm = (props) => {
  let lang = props.uiControls.lang
	const [inviteForm, setInviteForm] = useState({nick_name: '', email: '', message: ''})
	const [loading, setLoading] = useState(false)
	
	const onChange = (key, val) => {
		let form = {...inviteForm}
		form[key] = val;
		setInviteForm(form)
	}

	const sendInvite = () => {
		setLoading(true)
		props.dispatch(sendInitation(inviteForm)).then(res => {
			if (res.id) {
				Toast.show(convertText('common.invite_sent', lang))	
			}
			setInviteForm({nick_name: '', email: '', message: ''})
			
			setLoading(false)
			props.hideModal()
		})
	}

	const isDisbaled = () => {
		if (!inviteForm.nick_name || !inviteForm.email) {
			return true
		}
		return false
	}

  return(
    <View style={styles.InviteCon}>
    	<Text style={styles.heading}><FormatText variable='profile.invite_your_friends'/></Text>
    	<TextInput
        style={styles.textBox}
        placeholder={convertText('common.nick_name', lang)}
        onChangeText={(text) => onChange('nick_name', text)}
        value={inviteForm.nick_name}
      />
      <TextInput
        style={styles.textBox}
        placeholder={convertText('common.enter_email', lang)}
        onChangeText={(text) => onChange('email', text)}
        value={inviteForm.email}
        keyboardType="email-address"
        autoCapitalize = 'none'
      />
      <TextInput
        style={[styles.textBox, {height: 100}]}
        placeholder={convertText('common.enter_message', lang)}
        onChangeText={(text) => onChange('message', text)}
        value={inviteForm.message}
        multiline
      />
      <View style={styles.sendBtn}>
        <OwnButton
        	buttonText={<FormatText variable='profile.send_invitation'/>} 
        	onPress={() => sendInvite()}
      		disabled={isDisbaled()}
      		loading={loading}
        />
      </View>
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
  	marginBottom: 10
  },
  textBox: {
    borderBottomWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingHorizontal: 10,
    marginBottom: 20,
    color: '#000'
  },
  // sendBtn: {
  // 	backgroundColor: primaryColor,
  // 	alignItems: 'center',
  // 	justifyContent: 'center'
  // },
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

export default connect(mapStateToProps, mapDispatchToProps)(InvitaionForm);
