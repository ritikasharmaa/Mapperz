import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Keyboard
} from "react-native";
import { Icon, Container, Content } from "native-base";
import { authorize } from "react-native-app-auth";
import { primaryColor, secondColor } from "../../../redux/Constant";
import Ripple from "react-native-material-ripple";
import { CommonActions } from "@react-navigation/native";
import SyncStorage from "sync-storage";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import { userDetail } from "../../../redux/actions/auth";
import FormatText from "../../../components/common/FormatText";
import { convertText } from "../../../redux/Utility";
import Toast from "react-native-root-toast";
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-community/google-signin";
import {
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
  LoginManager,
} from "react-native-fbsdk";
import { checkLogin } from "../../../redux/api/auth";
import axios from "axios";
import OwnButton from "../../../components/common/OwnButton";

const { width, height } = Dimensions.get("screen");

const Email = (props) => {
  let lang = props.uiControls.lang

  const [userInfo, setUserInfo] = useState({ userDetail: "", loader: false });
  const [pictureURL, setPictureURL] = useState(null);
  const [pictureURLByID, setPictureURLByID] = useState(null);
  const [loading, setLoading] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [emailForFb, setEmailValue] = useState("");
  const [fbData, saveFbData] = useState({});

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ["https://www.googleapis.com/auth/drive.readonly", "email"],
      webClientId:
        "891651713117-td8l2q5j2oj5p1k2ceosff4080ps1e21.apps.googleusercontent.com",
      offlineAccess: true,
    });
  });

  const onChange = (text, key) => {
    console.log(text, 'tesxt')
    props.dispatch(userDetail(text, key));
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  const goToName = () => {
    Keyboard.dismiss()
    setLoading(true);
    if (
      props.auth.user_detail.email === "" ||
      props.auth.user_detail.password === ""
    ) {
      setLoading(false);
      Toast.show(convertText("login.fieldReq", lang));
    } else if (props.auth.user_detail.password.length < 6) {
      setLoading(false);
      Toast.show(convertText("signup.passwordReq", lang));
    } else if(!validateEmail(props.auth.user_detail.email)){
      setLoading(false);
      Toast.show(convertText("signup.emailValid", lang));
    } else{
      props
        .checkLogin({ email: props.auth.user_detail.email })
        .then((res) => {
          if (res.status == 200) {
            setLoading(false);
            Toast.show("Already a user please login to continue");
          } else {
            props.navigation.navigate("Name");
            setLoading(false);
          }
        })
        .catch((err) => {
          props.navigation.navigate("Name");
          setLoading(false);
        });
    }
  };

  /*
   * Google Sign in
   */
  const _signIn = async () => {
    if (Platform.OS == "android") {
      const config = {
        issuer: "https://accounts.google.com",
        clientId:
          "837082262065-t8uioqdt55770kcfl5c8kkhssle9aqkl.apps.googleusercontent.com",
        redirectUrl:
          "com.googleusercontent.apps.837082262065-t8uioqdt55770kcfl5c8kkhssle9aqkl:/oauth2redirect",
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/drive.readonly",
          "openid",
          "https://www.googleapis.com/auth/userinfo.profile",
        ],
      };
      const authState = await authorize(config);

      axios
        .get(
          `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${
            authState.idToken
          }`
        )
        .then((response) => {
          console.log(
            authState,
            response,
            "response response response response"
          );
          let userInfo = {
            ...response.data,
            ...authState,
            id: response.data.sub,
            type: "google",
          };
          setUserInfo({ userDetail: userInfo, loader: true });
          props.navigation.navigate("SocialLoginUser", { data: userInfo });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    } else {
      try {
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        // console.log(userInfo, "userInfo 645789")
        setUserInfo({ userDetail: userInfo, loader: true });
        let dataToSend = {
          ...userInfo,
          type: "google",
          ...userInfo.user,
        };
        props.navigation.navigate("SocialLoginUser", { data: dataToSend });
      } catch (error) {
        console.log(error, "error error");
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          console.log("User Cancelled the Login Flow");
        } else if (error.code === statusCodes.IN_PROGRESS) {
          console.log("Signing In");
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          console.log("Play Services Not Available or Outdated");
        } else {
          console.log("Some Other Error Happened");
        }
      }
    }
    // _isSignedIn();
  };

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUserInfo({ userInfo: "", loader: false });
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
        alert("User has not signed in yet");
        setUserInfo({ loader: false });
      } else {
        alert("Something went wrong. Unable to get user's info");
        setUserInfo({ loader: false });
      }
    }
  };

  /****fb login *****/

  const handleFacebookLogin = () => {
    if (Platform.OS === "android") {
      LoginManager.setLoginBehavior("web_only")
    }
    LoginManager.logInWithPermissions([
      "public_profile",
      "email",
    ]).then(
      function(result) {
        if (result.isCancelled) {
        } else {
          AccessToken.getCurrentAccessToken().then((data) => {
            const accessToken = data.accessToken.toString();
            // props.navigation.navigate('SocialLoginUser')
            getInfoFromToken(accessToken);
          });
          console.log(
            "Login success with permissions: " +
              result.grantedPermissions.toString()
          );
        }
      },
      function(error) {
        console.log("Login fail with error: " + error);
      }
    );
  };

  /*onLoginFinished={(error, result) => {
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
              onLogoutFinished={() => setUserInfo({userInfo: {}})}*/

  const renderButtonText = () => {
    if (loading) {
      return <Text style={styles.continueBtn}>Loading...</Text>;
    } else {
      return (
        <Text style={styles.continueBtn}>
          <FormatText variable="signup.continue" />
        </Text>
      );
    }
  };

  const getInfoFromToken = (token) => {
    const PROFILE_REQUEST_PARAMS = {
      fields: {
        string: "id, name,  first_name, last_name, picture.type(large), email",
      },
    };
    const profileRequest = new GraphRequest(
      "/me",
      { token, parameters: PROFILE_REQUEST_PARAMS },
      (error, result) => {
        if (error) {
          console.log("login info has error: " + error);
        } else {
          if (
            result &&
            result.picture &&
            result.picture.data &&
            result.picture.data.url
          ) {
            setPictureURL(result.picture.data.url);
          } else {
            setPictureURL(`https://graph.facebook.com/${result.id}/picture`);
          }

          setUserInfo({ userInfo: result });
          let dataToSend = {
            ...result,
            type: "facebook",
          };
          if (dataToSend.email) {
            props.navigation.navigate("SocialLoginUser", { data: dataToSend });
          } else {
            setEmailModal(true);
            saveFbData(dataToSend);
          }
        }
      }
    );
    new GraphRequestManager().addRequest(profileRequest).start();
  };

  const emailModalFacebook = () => {
    if (emailModal) {
      return (
        <View style={styles.mainModal}>
          <TouchableOpacity
            style={styles.iconOut}
            onPress={() => setEmailModal(false)}
          >
            <Icon
              type="AntDesign"
              name="closecircle"
              style={{ fontSize: 15 }}
            />
          </TouchableOpacity>
          <TextInput
            onChangeText={(value) => setEmailValue(value)}
            style={styles.textInput}
            placeholder="Please enter email"
          />
          <TouchableOpacity
            onPress={() => saveFbDetailWIthEMail()}
            style={styles.buttonMain}
          >
            <Text style={styles.buttonMainText}><FormatText variable='signup.submit' /></Text>
          </TouchableOpacity>
        </View>
      );
    }
  };

  const saveFbDetailWIthEMail = () => {
    if (emailForFb) {
      fbData.email = emailForFb;
      setEmailModal(false);
      props.navigation.navigate("SocialLoginUser", { data: fbData });
    }
  };

  return (
    <Container style={styles.mainCon}>
      <Content>
      {/* <LinearGradient 
        colors={['#9248e7', '#9949e8', '#bb4fef', '#9949e8', '#9248e7']} 
        style={styles.background}
       > */}
      {emailModalFacebook()}
      <View style={styles.logoCon}>
        <Image source={require('../../../assets/images/registration.png')} style={styles.iconImage} />
      </View>
      <View style={styles.nameCon}>
        <View style={styles.btmCom}>
          <Ripple
            rippleColor="#ccc"
            rippleOpacity={0.2}
            rippleDuration={700}
            style={[styles.formBtn, styles.formBtnGoogle]}
            onPress={_signIn}
          >
            <Icon
              type="FontAwesome"
              name="google"
              style={[styles.btnIcon, styles.btnIconGoogle]}
            />
            <Text style={[styles.btnTextGoogle, styles.btnTextBlack]}>
              <FormatText variable="goToAuth.continue_with_google_btn" />
            </Text>
          </Ripple>
          {/*<Ripple 
              rippleColor="#ccc" 
              rippleOpacity={0.2} 
              rippleDuration={700} 
              style={[styles.formBtn, styles.formBtnFacebook]}
              onPress={handleFacebookLogin}              
            >
              <Icon type="FontAwesome" name='facebook' style={[styles.btnIcon]} />
              <Text style={[styles.btnText, styles.btnTextWhite]}><FormatText variable='goToAuth.continue_with_facebook_btn' /></Text>
            </Ripple>*/}
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={700}
            style={[styles.formBtn, styles.formBtnFacebook]}
            onPress={handleFacebookLogin}
          >
            <Icon type="FontAwesome" name="facebook" style={styles.btnIcon} />
            <Text style={(styles.btnText, { color: "#fff" })}>
              <FormatText variable="goToAuth.continue_with_facebook_btn" />
            </Text>
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
        </View>

          <Text style={styles.or}><FormatText variable='signup.or' /></Text>
          <Text style={styles.or}><FormatText variable='signup.by_email' /></Text>
       

        {/* <Text style={styles.text}><FormatText variable='signup.link_ur_email' /></Text> */}
        {/*<View style={styles.name}>
            <View style={styles.nameBox}>
              <TextInput style={styles.inputBox}
                 placeholder={convertText("signup.email.firstName", lang)}
                 placeholderTextColor= '#dfe1df'
                 onChangeText= {text => onChange(text, 'first_name')}
              />
            </View>
            <View style={styles.nameBox}>
              <TextInput style={styles.inputBox}
               placeholder={convertText("signup.email.lastName", lang)}
               placeholderTextColor= '#dfe1df'
               onChangeText= {text => onChange(text, 'last_name')}
            />
            </View>
          </View>*/}
        <TextInput
          style={styles.inputBox}
          placeholder={convertText("signup.email.email", lang)}
          placeholderTextColor={"grey"}
          onChangeText={(text) => onChange(text, "email")}
          keyboardType="email-address"
          autoCapitalize="none"
          value={props.auth.user_detail.email}
        />
        <TextInput
          style={styles.inputBox}
          placeholder={convertText("signup.email.password", lang)}
          placeholderTextColor={"grey"}
          onChangeText={(text) => onChange(text, "password")}
          secureTextEntry={true}
          value={props.auth.user_detail.password}
        />
      </View>

      {/* <TouchableOpacity
        style={styles.continueBtnCon}
        onPress={() => goToName()}
      > */}
        {/* <Text style={styles.continueBtn}><FormatText variable='signup.continue' /></Text> */}
        {/* {renderButtonText()} */}

        <View style={styles.continueBtnCon}>
          <OwnButton 
            onPress={() => goToName()}
            buttonText={convertText("signup.continue", lang)}
            loading={loading}
          />
        </View>
        <Text
          style={styles.continueLogin}
          onPress={() => props.navigation.navigate("Login")}
        >
          <FormatText variable='signup.already_registered' /><Text style={styles.login}><FormatText variable='goToAuth.login_btn' /></Text>
        </Text>
      {/* </TouchableOpacity> */}
      {/* </LinearGradient> */}
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  nameCon: {
    flex: 1,
    paddingHorizontal: 20,
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
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: "#fff",
  },
  // inputBox: {
  //   padding: 10,
  //   fontSize: 16,
  //   backgroundColor: 'rgba(255,255,255,0.2)',
  //   borderRadius: 10,
  //   color: '#dfe1df',
  //   marginBottom: 15
  // },
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
    marginHorizontal:20
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: "#dfe1df",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: "#dfe1df",
  },
  name: {
    flexDirection: "row",
  },
  nameBox: {
    width: "48%",
    marginRight: "4%",
  },
  formBtn: {
    backgroundColor: "#55afd8",
    height: 50,
    //padding: 10,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    marginBottom: 15,
  },
  btmCom: {
    paddingBottom: 5,
    //paddingRight: 10,
    //paddingLeft: 10,
    // flex: 1,
  },
  btnTextGoogle:{
    color:'#4481ec',
    fontWeight:'600'
  },
  formBtnGoogle: {
    borderWidth:1,
    borderColor:'#4481ec',
    backgroundColor: "#f5f5f5",
  },
  btnIcon: {
    position: "absolute",
    left: 12,
    top: 12,
    color: "#fff",
    fontSize: 33,
  },
  btnIconGoogle: {
    color: "#4481ec",
    top: 10,
  },

  or: {
    // marginVertical: 15,
    fontWeight: "600",
    textAlign: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
  },
  formBtnFacebook: {
    backgroundColor: "#4761a3",
  },
  btnTextWhite: {
    color: "#fff",
  },
  continueLogin: {
    color: secondColor,
    alignItems: "center",
    textAlign: "center",
    marginBottom:30
    // bottom: -12,
  },
  login: {
    textDecorationLine: "underline",
    fontWeight: "bold",
  },
  iconOut: {
    zIndex: 999999999,
    position: "absolute",
    right: 5,
    top: 8,
  },
  textInput: {
    borderRadius: 5,
    height: 35,
    backgroundColor: "#f5f5f5",
    padding: 5,
    width: 200,
    marginBottom: 20,
    textAlign: "center",
    color: '#000'
  },
  buttonMain: {
    backgroundColor: primaryColor,
    width: 150,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    height: 30,
  },
  buttonMainText: {
    color: "#fff",
  },
  mainModal: {
    position: "absolute",
    width: "80%",
    height: 130,
    display: "flex",
    padding: 20,
    alignSelf: "center",
    top: "33%",
    flexDirection: "column",
    backgroundColor: "#fff",
    zIndex: 9999999,
    alignItems: "center",
    justifyContent: "center",
  },
});
const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
    checkLogin: (data) => dispatch(checkLogin(data)),
  };
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Email);

//  return {
//   bussiness: state.bussiness,
//   checkLogin:(data)=>dispatch(checkLogin(data))
// };
