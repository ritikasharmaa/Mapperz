import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Platform, Dimensions, Image, Animated } from "react-native";
import { Container, Button } from "native-base";
import { primaryColor } from "../../redux/Constant";
import { CommonActions } from "@react-navigation/native";
import UserAgent from 'react-native-user-agent';
import SyncStorage from "sync-storage";
import {
  getSpecificMapDetail,
  getAllMaps,
  getCheckins,
} from "../../redux/api/map";
import { getMapFeed } from "../../redux/api/feed";
import { login, changeLanguage } from '../../redux/api/auth';
import { connect } from "react-redux";
import { getProfile, getFriendsRequestList, isUpdated, logout } from "../../redux/api/auth";
import { authSuccess, setToken } from "../../redux/actions/auth";
import { setLanguage } from "../../redux/actions/uiControls";
import Geolocation from "@react-native-community/geolocation";
import { NetworkInfo } from "react-native-network-info";
import LottieView from 'lottie-react-native';
import Toast from "react-native-root-toast";
import { setMapDetail } from "../../redux/actions/map"
import * as RNLocalize from "react-native-localize";
import GPSState from 'react-native-gps-state'

const { width, height } = Dimensions.get("screen");

const Initial = (props) => {
  const [data, setData] = useState(0);
  const [loadEnd, setLoadEnd] = useState(false);
  const [isDataUpdated, setIsDataUpdated] = useState()
  const [oldUser,setOldUser] = useState('')
  const [loading,setLoading] = useState(true)
  let listener 
  let clearData

  const layerWidth = useRef(new Animated.Value(0)).current

  const watchUserLocation = (socket) => {
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized && props.map.toggleValue){
      listener = Geolocation.watchPosition(
        (info) => {
          //let {socket} = this.props.socket
          if (socket) {
            const msg = {
              command: "message",
              identifier: JSON.stringify({
                channel: "MapperChannel",
              }),
              data: JSON.stringify({
                lat: info.coords.latitude,
                lng: info.coords.longitude,
                captured_at: info.timestamp,
              }),
            };
            socket.send(JSON.stringify(msg));
          }
        },
        {},
        { enableHighAccuracy: true, distanceFilter: 50 }
      );
    }   
  };

  const logoutAction = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "GoToAuth",
          },
        ],
      })  
    )  
    props.dispatch(logout()) 
  }

  const callApi = async (isDataUpdated) => {
    let mapData = SyncStorage.get('mapData')
    // clearData = setTimeout(() => {
    //   logoutAction()
    // }, 20000)
    if(isDataUpdated){
      let userData = SyncStorage.get('userData');
      let id = userData && userData.home_mapper_id
      return new Promise(async (resolve) => {
        await props.getSpecificMapDetail(id)/*.catch(error => {
          logoutAction()
        })*/
        {changeWidth(0.3333333333333333)}
        await props.getAllMaps()/*.catch(error => {
          logoutAction()
        })*/
        {changeWidth(0.6666666666666666)}
        await props.getCheckins()/*.catch(error => {
          logoutAction()
        })*/
        {changeWidth(1)}
        resolve("success done!");
      });
    } else {
      props.setMapDetail(mapData)
    }   
  };

  const changeWidth = (val) =>  {
    /*if(val === 0.16666666666666666){
      setData(30)
    } else */if(val === 0.3333333333333333){
      setData(60)
    } /*else if(val === 0.5){
      setData(90)
    }*/ else if(val === 0.6666666666666666){
      setData(150)
    } 
    // else if(val === 1){
    //   clearTimeout(clearData)
    // }    
  }

  Animated.timing(
    layerWidth,
    {
      toValue: data,
      duration: 1000,
    }
  ).start();
  
  // const checkForLocation = () => {
  //   RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
  //   .then(data => {
  //     console.log(data,"data data")
  //     if (data === "already-enabled" || data === "enabled") {
  //       // good :-)


  //     }else{
  //       checkForLocation()
  //     }
  //   }).catch(err => {
  //     checkForLocation()
  //   })
  // }


  useEffect(() => {
    setTimeout(async() => {
    let credentials = SyncStorage.get('token');
    let finalcre = SyncStorage.get('credentials');    
    let user = await getUser()
    //console.log(user, "useEffecr")
    setOldUser(user)
    setLoading(false)
    checkNetwork(credentials);    
    // if (Platform.OS === 'android') {
    // checkForLocation(credentials)
    // }else{
    //     checkNetwork(credentials);
    // }
     },1000);
     return () => {listener} 
     
}, []);

//console.log(oldUser, "old user status")

const checkNetwork = async (credentials) => {
  let abc = null
  abc = await NetworkInfo.getIPV4Address();
  if (abc == null || abc == "0.0.0.0") {
    if (credentials) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "Footer",
            },
          ],
        })
      );
    } else {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "GoToAuth",
            },
          ],
        })
      );
    }
  } else {
    handleRouteNext()
  //   props.navigation.dispatch(
  //     CommonActions.reset({
  //       index: 0,
  //       routes: [
  //         {
  //           name: "Initial",
  //         },
  //       ],
  //     })
  //   );
  // }
}
}

  // useEffect(() => {
    const handleRouteNext  = () => {
        let info = UserAgent.getUserAgent();
        let credentials = SyncStorage.get('credentials');
        let token = SyncStorage.get('token');
        let userData = SyncStorage.get('userData');
        let provider = SyncStorage.get('provider');
        // if (Platform.OS === 'android') {
        //   checkForLocation()
        // }


      if(SyncStorage.get('mapData')){
        props.isUpdated().then(async res => { 
            await callApi(res.has_changes)
        })
      }

      setTimeout(async() => {
        if (provider && provider !== null && provider == 'google' || provider == 'facebook' ) {
          let userInfo = {
            uid :userData.uid,
            type: provider,
            social_login: true,
            ...userData,
          }
          props.login(userInfo).then(async(res)=>{    
            if (res.token) {
              let renderApis = await callApi();
              setLoading(false)
              // this.props.navigation.navigate('Home')  
              // props.navigation.navigate('Footer', {
              //   routeId : 0
              // })              
              setTimeout(() => {
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "Footer",
                      },
                    ],
                  })
                );
              }, 5500);
            } else {
              Toast.show(res.errors)
              setLoading(false)
            }
          })
        } else{
            if(credentials && credentials.password) {
                props.login(credentials).then(async (res)=>{
                  if (res.token) {         
                    watchUserLocation(window.socket) 
                    //let renderApis = await callApi();        
                    setTimeout(() => {
                      props.navigation.dispatch(
                        CommonActions.reset({
                          index: 0,
                          routes: [
                            {
                              name: "Footer",
                            },
                          ],
                        })
                      );
                    }, 5500);
                  }
                })
            }
            else {  
              let user = await getUser()
              if(user){
                props.navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [
                      {
                        name: "GoToAuth",
                      },
                    ],
                  })
                );
              }                         
              // setTimeout(() => {
              //   let oldUser = SyncStorage.get('ifSignedUp')
              //   console.log(oldUser, "oldUser")
              //   if(oldUser){
              //     props.navigation.dispatch(
              //       CommonActions.reset({
              //         index: 0,
              //         routes: [
              //           {
              //             name: "GoToAuth",
              //           },
              //         ],
              //       })
              //     );
              //   } else {
              //     props.navigation.dispatch(
              //       CommonActions.reset({
              //         index: 0,
              //         routes: [
              //           {2
              //             name: "Intro",
              //           },
              //         ],
              //       })
              //     );                  
              //   }                
              // }, 5500);
            }
          }
        }, 1000);
        // let renderApis = await callApi(); 
        // props.navigation.navigate('Home')
    }
  // , []);

  const load = () => {
    let token = SyncStorage.get("token");
    if (!token) {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "GoToAuth",
            },
          ],
        })
      );
      //props.navigation.navigate('GoToAuth')
    }
  };

  const getUser = async () => {
    let user = await SyncStorage.get('oldUser')
    //console.log(user, "user")
    return user
  }

  //console.log(getUser(), "getUser")

  const onAnimationFinish = () => {
    props.navigation.navigate('GoToAuth')
  }

  const loadingScreen = () => {
    if(RNLocalize.getLocales()[0].languageCode === 'ja'){
      return <Image
        source={require("../../assets/images/newsplash_ja.png")}
        style={styles.logo}
      />
    } else {
      return <Image
        source={require("../../assets/images/newSplashFinal.png")}
        style={styles.logo}
      />
    }
  }

  const renderView = () => {    
      // let oldUser = await SyncStorage.get('ifSignedUp')
      // console.log(oldUser, "old user status")
      // let oldUser = getUser()
      // console.log(oldUser, "old user status")
      if(oldUser && !loading){
        return <View style={styles.logoCon}>
                <View style={styles.baseLayer}></View>
                <View style={styles.whiteLayerCon}>
                  <Animated.View style={[styles.whiteLayer, {width:layerWidth}]}></Animated.View>
                </View>
                {loadingScreen()}
              </View>
      } else {
        // return <LottieView source={require('../../assets/json/ENG_no_shadow.json')} autoPlay loop={false} onAnimationFinish={onAnimationFinish} />
        if(RNLocalize.getLocales()[0].languageCode === 'ja'){
          //props.dispatch(changeLanguage('ja'))
          if(Platform.OS === 'android'){
            return <LottieView source={require('../../assets/json/JP_no_shadow.json')} autoPlay loop={false} onAnimationFinish={onAnimationFinish} />
          } else {
            return <LottieView source={require('../../assets/json/intro edits no masks.json')} autoPlay loop={false} onAnimationFinish={onAnimationFinish} />
          }
        } else {
          //props.dispatch(changeLanguage('en'))
          if(Platform.OS === 'android'){
            return <LottieView source={require('../../assets/json/ENG_no_shadow.json')} autoPlay loop={false} onAnimationFinish={onAnimationFinish} />
          } else {
            return <LottieView source={require('../../assets/json/intro edits no masks ENG.json')} autoPlay loop={false} onAnimationFinish={onAnimationFinish} />
          }
        }        
      }
  }
  return (
    <Container style={styles.mainCon}>
      {!loading && renderView()}
      {/*<View style={styles.logoCon}>
        <View style={styles.baseLayer}></View>
        <View style={styles.whiteLayerCon}>
          <Animated.View style={[styles.whiteLayer, {width:layerWidth}]}></Animated.View>
        </View>
        <Image
          source={require("../../assets/images/newSplashFinal.png")}
          style={styles.logo}
        />
      </View>*/}
    </Container>
  );
};

const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    backgroundColor: primaryColor
  },
  logoCon: {
    width: width,
    height: height,
  },
  logo: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    zIndex: 3,
    //resizeMode: 'contain',
  },
  progressBar: {
    position: "absolute",
  },
  baseLayer: {
    position: 'absolute',
    flex: 1,
    width: width,
    height: height,
    backgroundColor: primaryColor,
    zIndex: 1,
  },
  whiteLayer: {
    height: 100,
    backgroundColor: "#fff",
  },
  whiteLayerCon: {
    position: 'absolute',
    width: 150,
    height: 100,
    zIndex: 2,
    top: height/2,
    left: width/2 - 70
  }
});

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    map: state.map,
    socket: state.socket,
    planner: state.planner,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
      getProfile: (data) => dispatch(getProfile(data)),
      getSpecificMapDetail: (data) => dispatch(getSpecificMapDetail(data)),
      getFriendsRequestList: () => dispatch(getFriendsRequestList()),
      getAllMaps: () => dispatch(getAllMaps()),
      getMapFeed: (value) => dispatch(getMapFeed(value)),
      getCheckins: () => dispatch(getCheckins()),
      setToken: (token) => dispatch(setToken(token)),
      authSuccess: (data) => dispatch(authSuccess(data)),
      setLanguage: (data) => dispatch(setLanguage(data)),
      login:(data)=>dispatch(login(data)),
      isUpdated:() => dispatch(isUpdated()),
      setMapDetail:(data) => dispatch(setMapDetail(data))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Initial);
