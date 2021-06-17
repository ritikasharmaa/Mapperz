import React, { useState, useRef, useEffect } from "react";
import { View, Platform, Image } from "react-native";
import { NetworkInfo } from "react-native-network-info";
import { CommonActions } from "@react-navigation/native";
import { connect } from 'react-redux';
import SyncStorage from 'sync-storage';
import { primaryColor } from "../../redux/Constant";
//import RNAndroidLocationEnabler from 'react-native-android-location-enabler';


    const FirstRender = (props) => {
    useEffect(() => {
        setTimeout(async() => {
        let credentials = SyncStorage.get('token');

        checkNetwork(credentials);

        // if (Platform.OS === 'android') {
        // checkForLocation(credentials)
        // }else{
        //     checkNetwork(credentials);

        // }
         },1000);
    }, []);

    // const checkForLocation = (credentials) => {
    //     RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
    //     .then(data => {
    //     console.log(data,"data data")
    //     if (data === "already-enabled" || data === "enabled") {
    //         checkNetwork(credentials);
    //     }else{
    //         checkForLocation()
    //     }
    //     }).catch(err => {
    //     checkForLocation()
    //     })
    // }

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
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "Initial",
            },
          ],
        })
      );
    }
  };

  return <View style={{  
            flex: 1,
            backgroundColor: primaryColor,
          }}>
          <Image
            source={require("../../assets/images/newSplash.jpg")}
            style={{width: '100%', height: '100%'}}
          />
          </View>; 
};



// const mapStateToProps = (state) => ({
//     auth: state.auth
//   });
    
//   const mapDispatchToProps = (dispatch) => ({
//       dispatch,
//   });
  
//   export default connect(mapStateToProps, mapDispatchToProps)(FirstRender); 
  export default FirstRender
