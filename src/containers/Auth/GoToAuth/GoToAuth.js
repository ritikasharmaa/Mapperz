
import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TouchableOpacity,
  Linking 
} from 'react-native';
import {
  Container,
} from 'native-base'
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Ripple from 'react-native-material-ripple';
import FormatText from '../../../components/common/FormatText'
import SyncStorage from "sync-storage";
import { notifications, NotificationMessage, Android } from 'react-native-firebase-push-notifications'

class GoToAuth extends React.Component {

  signup = () => {
    let oldUser = SyncStorage.get('ifSignedUp')
    if(oldUser){
      this.props.navigation.navigate('Email')
    } else {
      this.props.navigation.navigate('Intro')
    }    
  }

  componentDidMount(){
    this.getToken()
  } 

  getToken = async () => {
    //get the messeging token
    const token = await notifications.getToken()
    SyncStorage.set('deviceToken', token)
    //you can also call messages.getToken() (does the same thing)
    return token
  }

  render() {
    let lang = this.props.uiControls.lang
    return(
      <Container style={styles.mainContainer}>
          <View style={{height: '100%'}}>
            <View style={styles.topSecCon}>
              {/*<Text style={[styles.sectionDescription, styles.sectionDescriptionTop]}><FormatText variable='goToAuth.signup_for_free'/></Text>*/}
              {/*<Image source={require('../../../assets/images/travelzjp__black_logo.png')} style={styles.successImg} />*/}
              {lang === 'ja' ?
                <Image source={require('../../../assets/images/splash_ja.png')} style={styles.backgroundImage}/>
                :
                <Image source={require('../../../assets/images/newSplash.jpg')} style={styles.backgroundImage}/>
              }
              {/*<View style={styles.mapperzCon}>
                <Image source={require('../../../assets/images/mapperz.png')} style={styles.backgroundImage}/>
              </View>*/}
            </View>
            <View style={styles.btmCom}>
              {/*<Ripple 
                rippleColor="#ccc" 
                rippleOpacity={0.2} 
                rippleDuration={700}  
                style={[styles.formBtn, styles.formBtnGoogle]}
              >
                <Icon type="FontAwesome" name='google' style={[styles.btnIcon, styles.btnIconGoogle]} />
                <Text style={[styles.btnText, styles.btnTextBlack]}><FormatText variable='goToAuth.continue_with_google_btn'/></Text>
              </Ripple>
              <Ripple 
                rippleOpacity={0.2} 
                rippleDuration={700} 
                style={[styles.formBtn, styles.formBtnFacebook]}
              >
                <Icon type="FontAwesome" name='facebook' style={styles.btnIcon} />
                <Text style={styles.btnText}><FormatText variable='goToAuth.continue_with_facebook_btn'/></Text>
              </Ripple>*/}
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionDescription}><FormatText variable='goToAuth.continuing'/><Text style={styles.highlight} onPress={() => Linking.openURL('https://www.travelz.jp/ja/terms')}><FormatText variable='goToAuth.terms_of_service'/></Text> <FormatText variable='goToAuth.acknowledge'/><Text style={styles.highlight} onPress={() => Linking.openURL('https://www.travelz.jp/ja/terms')} ><FormatText variable='goToAuth.privacy_policy'/></Text><FormatText variable='goToAuth.privacy_policy_follow_up'/>
                  </Text>
              </View>
              <View style={styles.btmBtnCon}>
                <Ripple 
                  rippleOpacity={0.2} 
                  rippleDuration={700} 
                  style={[styles.formBtn, styles.formBtnSign]} 
                  onPress={() => this.signup()}
                >
                  <Text style={styles.btnText}><FormatText variable='goToAuth.sign_up_btn'/></Text>
                </Ripple>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={styles.login}><FormatText variable='goToAuth.login_btn'/></Text>
                </TouchableOpacity>
                {/*<Ripple 
                  rippleOpacity={0.2} 
                  rippleDuration={700} 
                  style={[styles.formBtn, styles.formBtnBtm]} 
                  onPress={() => this.props.navigation.navigate('Login')}
                >
                  <Text style={[styles.btnText]}><FormatText variable='goToAuth.login_btn'/></Text>
                </Ripple>*/}
              </View>            
            </View>
          </View>
      </Container>
    )
  }
}
const styles = StyleSheet.create({
  topSecCon: {
    justifyContent: 'center',
    alignItems: 'center',
    //marginBottom:15
  },
  /*sectionDescriptionTop: {
    marginBottom: 40
  },*/
  engine: {
    position: 'absolute',
    right: 0,
  },
  mainContainer: {
    backgroundColor: '#fff',
    flex: 1
  },
  sectionContainer: {
    paddingHorizontal: 14,
    justifyContent: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: '400',
    color: '#fff',
    textAlign: 'center'
  },
  highlight: {
    color: '#f5a640',
    fontWeight: '900',
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
    borderColor: '#ccc'
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
    height: 50,
    marginBottom: 10,
    padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#f5a640',
    overflow: 'hidden'
  },
  btmCom: {
    position: 'absolute',
    paddingBottom: 40,
    paddingRight: 10,
    paddingLeft: 10,
    bottom: -30,
    width: '100%'
  },
  btnText: {
    color: '#f5a640'    
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
  btmBtnCon: {
    alignItems: 'center',
    marginBottom: 40
  },
  formBtnBtm: {
    width: '49%',
    backgroundColor: '#abab9f',
    marginRight: '1%'
  },
  formBtnSign: {
    width: '49%',
    marginLeft: '1%',
  //  backgroundColor: '#4da728'
  },
  successImg: {
    position: 'absolute',
    width: 150,
    height: 59,
    zIndex: 10,
    resizeMode: 'contain',
    bottom: 120
  },
  login: {
    color: '#fff',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  mapperzCon: {
    width: 100,
    height: 40,
  }
});
export default GoToAuth; 