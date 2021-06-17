import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Picker,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  Button,
  Icon,
  Container,
  Content
} from 'native-base'
import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';
import textResource from '../../../assets/textResource'
import OwnButton from '../../../components/common/OwnButton'
import {mainUrl} from '../../../redux/Constant'
import Toast from 'react-native-root-toast';
import microValidator from 'micro-validator'
import is from 'is_js'
import validationHelpers from '../../../assets/validationHelpers';
import { primaryColor } from '../../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import FormatText from '../../../components/common/FormatText'
import UserAgent from 'react-native-user-agent';
import { convertText } from '../../../redux/Utility'

class Signup extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      loading: false,
      signupData: {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
      },
      isOpen: false,
      errors:{},
    }
  }

  componentDidMount(){
    this.props.getCountries()
  }

  onSignup = () => {
    let info = UserAgent.getUserAgent();
    let lang = this.props.uiControls.lang
    let { signupData } = this.state 
    const errors = microValidator.validate(validationHelpers.signupValidationSchema, signupData)
    if (!is.empty(errors)) {
      this.setState({ errors })
      Toast.show(convertText("signup.aboveField", lang))
      return
    } else if (this.state.signupData.password.length < 6) {
      Toast.show(convertText("signup.passwordReq", lang))
      return
    }
    this.setState({loading: true})
    let apiData = this.state.signupData;
    apiData.mobile_user_agent = info;
    this.props.signup(apiData).then((res)=>{
      this.setState({loading: false})
      if (res.id) {
        Toast.show(convertText("signup.signup", lang))
        // this.props.navigation.navigate('Home')  
        this.props.navigation.navigate('Footer', {
          routeId : 0
        })
      } else {
        let errorMsg = '';
        Object.keys(res).forEach((key) => errorMsg += res[key][0])
        Toast.show(errorMsg)
      }
    })
  }

  togglePicker(){
    this.setState({isOpen: !this.state.isOpen})
  }

  renderCountryName(){
    let {signupData} = this.state;
    let {bussiness} = this.props;
    let filterCountry = bussiness.allCountries.length && bussiness.allCountries.filter(item=>item.code == signupData.address)
    return filterCountry.length ? filterCountry[0].name : textResource["signup.address.en"]
  }

  onChange = (key, event) => {
    let {signupData} = this.state;
    signupData[key] = event.nativeEvent.text;
    this.setState({signupData})
  }

  renderCountries(){
    let {bussiness} = this.props;
    if (bussiness.allCountries.length) {
      return bussiness.allCountries.map((item, index)=>{
        return <Picker.Item label={item.name} value={item.code} key={index} />
      })
    }
  }

  bindFlag(){
    let {signupData} = this.state;
    let {bussiness} = this.props;
    let filterCountry = bussiness.allCountries.length && bussiness.allCountries.filter(item=>item.code == signupData.address)
    
    if (filterCountry.length) {
      let flagUrl = mainUrl+'uploads/country_flag/'+filterCountry[0].country_flag;
      return {uri: flagUrl};
    }    
  }

  selectedCountry(item){
    let {signupData} = this.state;
    signupData.address = item;
    this.setState({signupData})
    this.togglePicker()
  }

  render() {
    let { errors } = this.state;
    return(
      <Container style={styles.mainContainer}>
        <View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionDescription}><FormatText variable='goToAuth.continuing' /><Text style={styles.highlight}><FormatText variable='goToAuth.terms_of_service'/></Text> <FormatText variable='goToAuth.acknowledge'/> <Text style={styles.highlight}><FormatText variable='goToAuth.privacy_policy'/></Text>
            </Text>
          </View>
          <Text style={styles.heading}><FormatText variable='signup.signup_with_email' /></Text>
          <View style={styles.formBox}>
            <View style={styles.halfEleCon}>
              <TextInput 
                placeholder={errors.first_name && errors.first_name[0] ? errors.first_name[0] : "First Name"}
                style={[styles.inputBox, styles.inputBoxHalf]}
                onChange={this.onChange.bind(this, 'first_name')}
                placeholderTextColor={errors.first_name && errors.first_name[0] && "red"}
              />
              <TextInput 
                placeholder={errors.last_name && errors.last_name[0] ? errors.last_name[0] : "Last Name"}
                style={[styles.inputBox, styles.inputBoxHalf]}
                onChange={this.onChange.bind(this, 'last_name')}
                placeholderTextColor={errors.last_name && errors.last_name[0] && "red"}
              />
            </View>
            <TextInput 
              placeholder={errors.email && errors.email[0] ? errors.email[0] : textResource["signup.email_address.en"]}
              style={styles.inputBox}
              onChange={this.onChange.bind(this, 'email')}
              placeholderTextColor={errors.email && errors.email[0] && "red"}
              autoCapitalize = 'none'
              keyboardType="email-address"
            />
            <TextInput 
              placeholder={errors.password && errors.password[0] ? errors.password[0] : textResource["signup.password.en"]}
              style={[styles.inputBox, styles.inputBoxLast]}
              onChange={this.onChange.bind(this, 'password')}
              secureTextEntry={true}
              placeholderTextColor={errors.password && errors.password[0] && "red"}
            />
            {/*<View style={styles.categoryBox}>
              <TouchableOpacity style={styles.categoryCon} onPress={this.togglePicker.bind(this)}>
                <Text style={styles.categoryText}>{this.renderCountryName()}</Text>
                <Icon type="FontAwesome5" name='chevron-down' style={styles.btnIconNext} />
                <View style={styles.flagCon}>
                  <Image source={this.bindFlag()} style={styles.flagStyle} />
                </View>
              </TouchableOpacity>
              {this.state.isOpen && 
                <Picker
                  selectedValue={this.state.signupData.address}
                  style={styles.pickerStyle}
                  onValueChange={(itemValue, itemIndex) => this.selectedCountry(itemValue)}
                >
                  {this.renderCountries()}
                </Picker>
              }
            </View>*/}
          </View>
          <View style={styles.btnCon}>
            <OwnButton 
              onPress={this.onSignup}
              buttonText= {<FormatText variable='signup.sigunp_with_email'/>}
              loading={this.state.loading}
            />
          </View>
          <View style={styles.btmCom}>
            <Ripple 
              rippleColor="#ccc" 
              rippleOpacity={0.2} 
              rippleDuration={700} 
              style={[styles.formBtn, styles.formBtnGoogle]}
            >
              <Icon type="FontAwesome" name='google' style={[styles.btnIcon, styles.btnIconGoogle]} />
              <Text style={[styles.btnText, styles.btnTextBlack]}><FormatText variable='signup.continue_with_google'/></Text>
            </Ripple>
            <Ripple 
              rippleOpacity={0.2} 
              rippleDuration={700} 
              style={[styles.formBtn, styles.formBtnFacebook]}
            >
              <Icon type="FontAwesome" name='facebook' style={styles.btnIcon} />
              <Text style={styles.btnText}><FormatText variable='signup.continue_with_facebook'/></Text>
            </Ripple>
            <Text style={styles.sectionDescription}><FormatText variable='signup.dnt_wry'/></Text>
          </View>
        </View>
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
    color: primaryColor,
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
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginTop: 5,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10
  },
  inputBox: {
    height: 50,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    color: '#000'
  },
  inputBoxLast: {
    borderBottomWidth: 0
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
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  btmCom: {
    marginTop: 40,
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
  heading: {
    fontSize: 15,
    marginTop: 25,
    paddingLeft: 10,
    color: '#c1c1c1'
  },
  halfEleCon: {
    flexDirection: 'row'
  },
  inputBoxHalf: {
    width: '50%'
  },
  btnIcon: {
    position: 'absolute',
    left: 10,
    top: 12,
    color: '#fff'
  },
  btnIconGoogle: {
    color: '#f5bb45',
    top: 10
  },
  categoryBox: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 5,
    borderBottomWidth: 0,
  },
  categoryCon: {
    padding: 15,
    borderColor: '#ccc',
    flexDirection: 'row',
    paddingLeft: 0,
    paddingRight: 0
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500'
  },
  btnIconNext: {
    right: 0,
    left: 'auto',
    position: 'absolute',
    fontSize: 18,
    color: '#636363',
    top: 15
  },
  pickerStyle:{
    height: 220,
    width: '100%'
  },
  flagCon:{
    width: 30,
    height: 20,
    position:'absolute',
    right: 40,
    top: 15
  },
  flagStyle:{
    width: '100%',
    height: '100%'
  }
});

export default Signup