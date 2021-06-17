import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Icon
} from 'native-base';
import { primaryColor } from '../../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import { CommonActions  } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {userDetail} from '../../../redux/actions/auth'
import FormatText from '../../../components/common/FormatText'
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
const { width, height } = Dimensions.get('screen');


const SocialLogin = (props) => {

  const [userInfo, setUserInfo] = useState({userDetail: '', loader: false})


  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'], 
      webClientId: '891651713117-5eeo2a55tpigthob1idnjjandcbl0ckd.apps.googleusercontent.com', 
    });
  })

  /*
  * Google Sign in
  */
  const _signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserInfo({userDetail: userInfo, loader: true})
      props.navigation.navigate('HomeBase') 
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User Cancelled the Login Flow');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Signing In');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services Not Available or Outdated');
      } else {
        console.log(error,'Some Other Error Happened');
      }
    }
   // _isSignedIn();
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo({userInfo: '', loader: false})
    } catch (error) {
      console.error(error);
    }
  };

  /*
  * Google - to check if user is already signed in
  */

  /*const _isSignedIn = async () => {
    const isSignedIn = await GoogleSignin.isSignedIn();
    if (isSignedIn) {
      alert('User is already signed in');
      _getCurrentUserInfo();
    } else {
      console.log('Please Login');
    }
    setUserInfo({ loader: false });
  };*/

  /*
  * Google - get current user info if user is already signed in
  */

  const _getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      setUserInfo({ userInfo: userInfo });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_REQUIRED) {
        alert('User has not signed in yet');
        setUserInfo({loader: false})
      } else {
        alert("Something went wrong. Unable to get user's info");
        setUserInfo({loader: false})
      }
    }
  };
/****fb login *****/
const getInfoFromToken = token => {
  const PROFILE_REQUEST_PARAMS = {
    fields: {
      string: 'id, name,  first_name, last_name',
    },
  };
  const profileRequest = new GraphRequest(
    '/me',
    {token, parameters: PROFILE_REQUEST_PARAMS},
    (error, result) => {
      if (error) {
        console.log('login info has error: ' + error);
      } else {
        setUserInfo({userInfo: result});
        props.navigation.navigate('HomeBase' ) 
      }
    },
  );
  new GraphRequestManager().addRequest(profileRequest).start();
};
const handleFacebookLogin = () => {
  LoginManager.logInWithPermissions(['public_profile', 'email']).then(
     (result)=> {
      if (result.isCancelled) {
      } else {
        AccessToken.getCurrentAccessToken().then(data => {
          const accessToken = data.accessToken.toString();
          props.navigation.navigate('HomeBase') 
          getInfoFromToken(accessToken);
        });
        console.log('Login success with permissions: ' + result.grantedPermissions.toString())
      }
    }).catch(error =>{
    console.log('Login fail with error: ' + error)
  })
}

	return(
    <Container style={styles.mainCon}>
      <LinearGradient 
        colors={['#9248e7', '#9949e8', '#bb4fef', '#9949e8', '#9248e7']} 
        style={styles.background}
       >
  			<View style={styles.btmCom}>
          <Ripple 
            rippleColor="#ccc" 
            rippleOpacity={0.2} 
            rippleDuration={700} 
            style={[styles.formBtn, styles.formBtnGoogle]}
            onPress={_signIn}              
          >
            <Icon type="FontAwesome" name='google' style={[styles.btnIcon, styles.btnIconGoogle]} />
            <Text style={[styles.btnText, styles.btnTextBlack]}><FormatText variable='goToAuth.continue_with_google_btn' /></Text>
          </Ripple>
          <Text style={styles.or}>OR</Text>

          <Ripple 
                rippleOpacity={0.2} 
                rippleDuration={700} 
                style={[styles.formBtn, styles.formBtnFacebook]}
                onPress={handleFacebookLogin}
              >
                <Icon type="FontAwesome" name='facebook' style={styles.btnIcon} />
                <Text style={styles.btnText, {color: '#fff'}}><FormatText variable='goToAuth.continue_with_facebook_btn' /></Text>
              </Ripple>
          {/* <LoginButton
            style={[styles.formBtn]}
            onLoginFinished={(error, result) => {
              if (error) {
                console.log('login has error: ' + result.error);
              } else if (result.isCancelled) {
                console.log('login is cancelled.');
              } else {
                AccessToken.getCurrentAccessToken().then(data => {
                  console.log(data, "data")
                  const accessToken = data.accessToken.toString();
                  props.navigation.navigate('HomeBase') 
                  getInfoFromToken(accessToken);
                });
              }
            }}
          onLogoutFinished={() => setUserInfo({userInfo: {}})}
        /> */}
          {/* <Ripple 
            rippleOpacity={0.2} 
            rippleDuration={700} 
            style={[styles.formBtn, styles.formBtnGoogle]}
          >
            <Icon type="FontAwesome" name='facebook' style={[styles.btnIcon, styles.btnIconGoogle]} />
            <Text style={styles.btnText}><FormatText variable='goToAuth.continue_with_facebook_btn' /></Text>
          </Ripple> */}
        </View>
        <TouchableOpacity style={styles.continueBtnCon} onPress={() => props.navigation.navigate('Email')}>
          <Text style={styles.continueBtn}><FormatText variable='signup.continue' /> Manually</Text>
        </TouchableOpacity>
       
      </LinearGradient>
    </Container>
	)
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%'
  },
  formBtn: {
    backgroundColor: '#55afd8',
    height: 60,
    //padding: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  btmCom: {
    marginTop: 60,
    paddingBottom: 40,
    paddingRight: 10,
    paddingLeft: 10,
    flex: 1
  },
 
  btnIcon: {
    position: 'absolute',
    left: 15,
    top: 12,
    color: '#fff'
  },
  btnIconGoogle: {
    color: 'rgba(64, 128, 236, 1)',
    top: 10
  },
  or: {
    color: "#fff",
    marginVertical: 15,
    fontWeight: '600',
    textAlign: 'center'
  },
  continueBtnCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: '#dfe1df',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: '#dfe1df'
  },
  continueLogin:{
    color:"#fff",
    alignItems: 'center',
    textAlign: 'center',
    bottom:40
  }, 
  login:{
    textDecorationLine: 'underline',
    fontWeight:'bold'
  },
  formBtnFacebook: {
    backgroundColor: 'rgba(72, 97, 163, 1)'
  },
  formBtnGoogle:{
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: 'rgba(64, 128, 236, 1)'
  },
  btnTextBlack: {
    color: 'rgba(64, 128, 236, 1)'
  },
})

const mapStateToProps = (state) => ({
  auth: state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SocialLogin); 
