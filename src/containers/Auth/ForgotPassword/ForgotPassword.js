import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image
} from 'react-native';

import {
  Button,
  Container,
  Content
} from 'native-base'

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import textResource from '../../../assets/textResource'
import microValidator from 'micro-validator'
import validationHelpers from '../../../assets/validationHelpers';
import Toast from 'react-native-root-toast';
import is from 'is_js'
import OwnButton from '../../../components/common/OwnButton'
import FormatText from '../../../components/common/FormatText'
import { primaryColor, secondColor } from '../../../redux/Constant'


class ForgotPassword extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      forgotData: {
        email: ''
      },
      loading: false,
      errors: {}
    }
  }

  onChange = (key, event) => {
    let {forgotData} = this.state;
    forgotData[key] = event.nativeEvent.text;
    this.setState({forgotData})
  }

  onSubmit = () => {
    let { forgotData } = this.state 
    const errors = microValidator.validate(validationHelpers.forgotValidationSchema, forgotData)
    if (!is.empty(errors)) {
      this.setState({ errors })
      Toast.show("Above Field is required")
      return
    }
    this.setState({loading: true})
    this.props.forgotPassword(this.state.forgotData).then((res)=>{
      this.setState({loading: false})
      if (res) {
        Toast.show('Password Sent')
        this.setState({forgotData:{email: ''}})
        this.props.navigation.navigate('Login')  
      } else {
        Toast.show('Invalid Email Id')
      }
    })
  }

  goToLogin = () => {
    this.props.navigation.navigate('Login') 
  }

  render() {
    let { errors } = this.state;
    return(
      <Container style={styles.mainContainer}>
        <Content>
          <View style={styles.logoCon}>
            <Image source={require('../../../assets/images/mapperz_logo-h.png')} style={styles.logoImage} />
          </View>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionDescription}><FormatText variable='forgot_password.enter_email'/> </Text>
            </View>
            <View style={styles.formBox}>
              <TextInput 
                placeholder={textResource["forgot_password.email_placeholder.en"]}
                style={[styles.inputBox]}
                onChange={this.onChange.bind(this, 'email')}
                placeholderTextColor={errors.exist_email && errors.exist_email[0] && "red"}
                value={this.state.forgotData.email}
                autoCapitalize = 'none'
              />
            </View>
            <View style={styles.btnCon}>
              <OwnButton 
                onPress={this.onSubmit}
                buttonText={textResource["forgot_password.send_password_through_mail_btn.en"]}
                loading={this.state.loading}
              />
            </View>
            <View style={styles.forgot}>
              <TouchableOpacity onPress={this.goToLogin}>
                <Text style={styles.highlight}><FormatText variable='forgot_password.back_to_login'/></Text>
              </TouchableOpacity>
            </View>
          </View>
        </Content>
      </Container>
    )
  }
}

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    flex: 1
  },
  mainContainer: {
    backgroundColor: Colors.lighter,
  },
  sectionContainer: {
    marginTop: 12,
    paddingHorizontal: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.dark,
    textAlign: 'center'
  },
  highlight: {
    color: secondColor,
    fontWeight: '700'
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
  formBox: {
    marginTop: 30,
    paddingHorizontal: 10,
  },
  inputBox: {
    height: 50,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: '#000',
    borderBottomWidth: 1,
    borderColor: primaryColor
  },
  btnCon: {
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20
  },
  formBtn: {
    backgroundColor: '#55afd8',
    height: 50,
    marginBottom: 10,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center'
  },
  btmCom: {
    marginTop: 100,
    paddingBottom: 40,
    paddingRight: 10,
    paddingLeft: 10
  },
  btnText: {
    color: '#fff'
  },
  formBtnGoogle:{
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  btnTextBlack: {
    color: '#000'
  },
  formBtnFacebook: {
    backgroundColor: '#4861a3'
  },
  forgot: {
    textAlign: 'center',
    alignItems: 'center'
  },
  logoImage:{
    width: 150,
    height: 50,
    resizeMode: 'contain'
  },
  logoCon: {
    alignItems: 'center',
    marginVertical: 40
  }
});

export default ForgotPassword;