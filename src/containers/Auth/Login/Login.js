import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  Dimensions,
  Keyboard
} from 'react-native';
import {
  Container,
  Content,
  Icon,
  Button
} from 'native-base'
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import textResource from '../../../assets/textResource'
import Toast from 'react-native-root-toast';
import microValidator from 'micro-validator'
import is from 'is_js'
import { primaryColor, secondColor } from '../../../redux/Constant'
import OwnButton from '../../../components/common/OwnButton'
import validationHelpers from '../../../assets/validationHelpers';
import Ripple from 'react-native-material-ripple';
import FormatText from '../../../components/common/FormatText'
import UserAgent from 'react-native-user-agent';
import LinearGradient from 'react-native-linear-gradient';
import { convertText } from '../../../redux/Utility';
import SyncStorage from "sync-storage";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager
} from 'react-native-fbsdk';
import { authorize } from 'react-native-app-auth';
import Axios from 'axios';
import { CommonActions } from "@react-navigation/native";
import { notifications, NotificationMessage, Android } from 'react-native-firebase-push-notifications'

var { height ,width } = Dimensions.get('window')
class Login extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      loginData: {
        email: '',
        password: ''
      },
      loading: false,
      errors: {},
      userInfo: null,
      gettingLoginStatus: true,
    }  
  }

  componentDidMount(){
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly', "email"], 
      webClientId: '891651713117-td8l2q5j2oj5p1k2ceosff4080ps1e21.apps.googleusercontent.com',
      offlineAccess: true,
    });
  }  

  callApi = () => {
    let userData = SyncStorage.get('userData');
    let id = userData.home_mapper_id
    return new Promise(async (resolve) => {
      await this.props.getSpecificMapDetail(id);
      await this.props.getAllMaps();
      //await this.props.getFriendsRequestList();
      //await this.props.getMapFeed(id);
      await this.props.getCheckins();
      resolve("success done!");
    });
  };


   getInfoFromToken = (token) => {
    // const PROFILE_REQUEST_PARAMS = {
    //   fields: {
    //     string: 'id, name,  first_name, last_name, picture.type(large)',
    //   },
    // };
    // const profileRequest = new GraphRequest(
    //   '/me',
    //   {token, parameters: PROFILE_REQUEST_PARAMS},
    //   (error, result) => {
    //     if (error) {
    //       console.log('login info has error: ' + error);
    //     } else {
         
    //       let datatoSend ={
    //         ...result,
    //         type:'facebook',
    //         social_login: true
    //       }
    //       this.props.navigation.navigate('SocialLoginUser', {data: datatoSend}) 
    //       console.log('result:', result);
    //     }
    //   },
    // );
    // new GraphRequestManager().addRequest(profileRequest).start();
  };

 handleFacebookLogin = () => {
  this.setState({loading: true})  
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    LoginManager.logInWithPermissions(['public_profile', 'email']).then((result) => {
        if (result.isCancelled) {
          this.setState({loading: false})
        } else {
          let datatoSend = {}

          AccessToken.getCurrentAccessToken().then(data => {
            const accessToken = data.accessToken.toString();
            // props.navigation.navigate('SocialLoginUser') 
            // this.getInfoFromToken(accessToken);

            const PROFILE_REQUEST_PARAMS = {
              fields: {
                string: 'id, name,  first_name, last_name, picture.type(large), email',
              },
            };
            const profileRequest = new GraphRequest(
              '/me',
              {accessToken, parameters: PROFILE_REQUEST_PARAMS},
              (error, result) => {
                if (error) {
                  console.log('login info has error: ' + error);
                } else {                 
                  datatoSend ={
                    uid : data.userID,
                    ...result,
                    type:'facebook',
                    social_login: true,
                  }
                  this.handleFBLogin(datatoSend)
                  // this.props.navigation.navigate('SocialLoginUser', {data: datatoSend}) 
                  // console.log('result:', result);
                }
              },
            );
            new GraphRequestManager().addRequest(profileRequest).start();

          });
          //console.log('Login success with permissions: ' + result.grantedPermissions.toString())
        }

      }
    ).catch((error) => {
      this.setState({loading: false})
    })
  }

  handleFBLogin = (datatoSend) => {
    

    this.props.login(datatoSend).then(async(res)=>{      
      if (res.token) {
        let renderApis = await this.callApi();
        this.setState({loading: false})
        // this.props.navigation.navigate('Home')  
        this.props.navigation.navigate('Footer', {
          routeId : 0
        })
      } else {
        Toast.show(res.errors)
        this.setState({loading: false})
      }
    })
  }


	onLogin = () => {
    Keyboard.dismiss()
    let info = UserAgent.getUserAgent();
    let lang = this.props.uiControls.lang
    let { loginData } = this.state 
    const errors = microValidator.validate(validationHelpers.loginValidationSchema, loginData)
    if (!is.empty(errors)) {
      this.setState({ errors })
      Toast.show(convertText("login.fieldReq", lang))
      return
    }
    this.setState({loading: true})
    let apiData = this.state.loginData;
    apiData.mobile_user_agent = info;
    apiData.social_login = false
    this.props.login(apiData).then(async(res)=>{      
      if (res.token) {
        let renderApis = await this.callApi();
        this.setState({loading: false})
        // this.props.navigation.navigate('Home')
        this.props.navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [
                  {
                    name: "Footer",
                  },
                ],
              })
            );
        // this.props.navigation.navigate('Footer', {
        //   routeId : 0
        // })  
      } else {
        Toast.show(res.errors)
        this.setState({loading: false})
      }
    })
	}

  onChange = (key, event) => {
    let {loginData} = this.state;
    loginData[key] = event.nativeEvent.text;
    this.setState({loginData})
  }

  _signIn = async () => {
    if (Platform.OS == 'android') {
  this.setState({loading: true})

      const config = {
        issuer: 'https://accounts.google.com',
        clientId: '837082262065-t8uioqdt55770kcfl5c8kkhssle9aqkl.apps.googleusercontent.com',
        redirectUrl: 'com.googleusercontent.apps.837082262065-t8uioqdt55770kcfl5c8kkhssle9aqkl:/oauth2redirect',
        scopes: ["https://www.googleapis.com/auth/userinfo.email","https://www.googleapis.com/auth/drive.readonly","openid", "https://www.googleapis.com/auth/userinfo.profile"]
      };
      const authState = await authorize(config);
      Axios.get(`https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${authState.idToken}`).then(response => {
      

      let userInfo = {
          ...response.data,
          ...authState,
          uid :response.data.sub,
          type:'google',
          social_login: true,
          email:response.data.email
        }
        this.props.login(userInfo).then(async(res)=>{      
          if (res.token) {
            let renderApis = await this.callApi();
            this.setState({loading: false})
            // this.props.navigation.navigate('Home')  
            this.props.navigation.navigate('Footer', {
              routeId : 0
            })
          } else {
            Toast.show(res.errors)
            this.setState({loading: false})
          }
        })

        // setUserInfo({userDetail: userInfo, loader: true})
        // this.props.navigation.navigate('SocialLoginUser', {data: userInfo}) 
      })
      .catch(error => {
        // handle error
      })
    } else {
      try {
        this.setState({loading: true})
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // setUserInfo({userDetail: userInfo, loader: true})
        let dataToSend = {
          ...userInfo,
          uid : userInfo.user.id,
          type: 'google',
          social_login: true,
          email:userInfo.user.email
        }
        this.props.login(dataToSend).then(async(res)=>{      
          if (res.token) {
            let renderApis = await this.callApi();
            this.setState({loading: false})
            // this.props.navigation.navigate('Home')  
            this.props.navigation.navigate('Footer', {
              routeId : 0
            })
          } else {
            Toast.show(res.errors)
            this.setState({loading: false})
          }
        })

        // this.props.navigation.navigate('SocialLoginUser', {data: dataToSend}) 
      } catch (error) {
  this.setState({loading: false})
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        } else if (error.code === statusCodes.IN_PROGRESS) {
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        } else {
        }
      }
    }
   // _isSignedIn();
  };

  renderButtonText(){
    if (this.state.loading) {
      return <Text style={styles.btnText}>Loading...</Text>
    } else {
      return <Text style={styles.btnText}><FormatText variable='login.login_with_email' /></Text>
    }
  }
  /*
  * Facebook - get response
  */
  /*get_Response_Info = (error, result) => {
    console.log("here")
    if (error) {
      //Alert for the Error
      Alert.alert('Error fetching data: ' + error.toString());
    } else {
      //response alert
      alert(JSON.stringify(result));
      this.setState({ user_name: 'Welcome' + ' ' + result.name });
      this.setState({ token: 'User Token: ' + ' ' + result.id });
      this.setState({ profile_pic: result.picture.data.url });
    }
    console.log(this.state.user_name, "user_name")
    console.log(this.state.token, "token")
    console.log(this.state.profile_pic, "profile_pic")
  };*/
  /*onLogout = () => {
    //Clear the state after logout
    this.setState({ user_name: null, token: null, profile_pic: null });
  };*/
  render() {
    let { errors } = this.state;
    return(
      <Container style={styles.mainContainer}>
        <Content>
        {/*<LinearGradient 
          colors={['#9248e7', '#9949e8', '#bb4fef', '#9949e8', '#9248e7']} 
          style={styles.background}
         >*/}
          <View style={styles.logoCon}>
            <Image source={require('../../../assets/images/login.png')} style={styles.iconImage} />
          </View>
          <View>
            {/*<View style={styles.sectionContainer}>
              <Text style={styles.sectionDescription}>
                <FormatText variable='goToAuth.continuing' />
                <Text style={styles.highlight}>
                  <FormatText variable='goToAuth.terms_of_service' />
                </Text> 
                <FormatText variable='goToAuth.acknowledge'/>
                <Text style={styles.highlight}>
                  <FormatText variable='goToAuth.privacy_policy' />
                </Text>
              </Text>
            </View>*/}
           
            <View style={styles.btmCom}>
              <Ripple 
                rippleColor="#ccc" 
                rippleOpacity={0.2} 
                rippleDuration={700} 
                style={[styles.formBtn, styles.formBtnGoogle]}
                onPress={() => this._signIn()}              
              >
                <Icon type="FontAwesome" name='google' style={[styles.btnIcon, styles.btnIconGoogle]} />
                <Text style={[styles.btnText, styles.btnTextBlack]}><FormatText variable='goToAuth.continue_with_google_btn' /></Text>
              </Ripple>
              {/*<GoogleSigninButton
                style={{ width: '100%', height: 48 }}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={this._signIn}
                //disabled={this.state.isSigninInProgress} 
              />*/}
              <Ripple 
                rippleOpacity={0.2} 
                rippleDuration={700} 
                style={[styles.formBtn, styles.formBtnFacebook]}
                onPress={() => this.handleFacebookLogin()}
              >
                <Icon type="FontAwesome" name='facebook' style={styles.btnIcon} />
                <Text style={styles.btnText}><FormatText variable='goToAuth.continue_with_facebook_btn' /></Text>
              </Ripple>
              {/*<LoginButton
                style={[styles.formBtn, styles.formBtnFacebook]}
                readPermissions={['public_profile']}
                onLoginFinished={(error, result) => {
                  if (error) {
                    alert(error);
                    alert('login has error: ' + result.error);
                  } else if (result.isCancelled) {
                    alert('login is cancelled.');
                  } else {
                    AccessToken.getCurrentAccessToken().then(data => {
                      alert(data.accessToken.toString());
                      const processRequest = new GraphRequest(
                        '/me?fields=name,picture.type(large)',
                        null,
                        this.get_Response_Info
                      );
                      // Start the graph request.
                      new GraphRequestManager().addRequest(processRequest).start();
                    });
                  }
                }}
                onLogoutFinished={this.onLogout}
              />*/}
            </View>
            <View>
              <Text style={{ textAlign: 'center'}}>
                Or
              </Text>
              <Text style={{ textAlign: 'center'}}>
                By Email
              </Text>
            </View>

            <View style={styles.formBox}>
              <TextInput 
                placeholder={errors.email && errors.email[0] ? errors.email[0] : textResource["forgot_password.email_placeholder.en"]}
                style={styles.inputBox}
                onChange={this.onChange.bind(this, 'email')}
                placeholderTextColor={errors.email ? errors.email && errors.email[0] && secondColor : 'grey' }
                keyboardType="email-address"
                autoCapitalize = 'none'
              />
              <TextInput 
                placeholder={errors.password && errors.password[0] ? errors.password[0] : textResource["login.password.en"]}
                style={[styles.inputBox, styles.inputBoxLast]}
                onChange={this.onChange.bind(this, 'password')}
                secureTextEntry={true}
                placeholderTextColor={errors.email ? errors.email && errors.email[0] && secondColor : 'grey' }
              />
            </View>
            <View style={styles.btnCon}>
              <OwnButton 
                onPress={this.onLogin}
                buttonText={textResource["login.login_with_email.en"]}
                loading={this.state.loading}
              />
            </View>
            <View style={styles.forgot}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('ForgotPassword')}>
                <Text style={styles.highlight}><FormatText variable='login.forgot_password' /></Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionDescription}><FormatText variable='login.dont_have-account' /><Text style={styles.highlight} onPress={() => this.props.navigation.navigate('Email')}><FormatText variable='login.signup' /></Text></Text>

          </View>
        {/*</LinearGradient>*/}
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
  background: {
    width: '100%',
    height: '100%'
  },
  mainContainer: {
   // backgroundColor: primaryColor,
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
    marginBottom:30,
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: 'grey',
    textAlign: 'center',
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
    //borderTopWidth: 1,
   // borderBottomWidth: 1,
    marginTop: 0,
   // borderColor: primaryColor,
    paddingLeft: 10,
    paddingRight: 10
  },
  inputBox: {
    height: 50,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: 'grey',
    borderBottomWidth: 1,
    borderColor: 'grey',
    color: '#000'
  },
  inputBoxLast: {
    //borderBottomWidth: 0
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
  formBtnDisabled:{
    backgroundColor: '#98d2ec'
  },
  btmCom: {
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10
  },
  btnText: {
    color: '#fff'
  },
  formBtnGoogle:{
    borderWidth:1,
    borderColor:'#4481ec',
    backgroundColor: "#f5f5f5",
  },
  btnTextBlack: {
    color: 'rgba(64, 128, 236, 1)'
  },
  formBtnFacebook: {
    backgroundColor: '#4761a3'
  },
  forgot: {
    textAlign: 'center',
    alignItems: 'center'
  },
  btnIcon: {
    position: 'absolute',
    left: 10,
    color: '#fff'
  },
  btnIconGoogle: {
    color:'#4481ec',
  },
  logoImage:{
    width: 150,
    height: 50,
    resizeMode: 'contain'
  },
  logoCon: {
    width:width,
    height: width - 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  iconImage: {
    width: '100%',
    height: '100%',
  }
});
export default Login;