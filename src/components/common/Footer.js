import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View} from 'react-native';
import { Button, Icon, Footer, FooterTab } from 'native-base'
import { connect } from 'react-redux';
import { setActiveTabIndex } from '../../redux/actions/uiControls';
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import TabBar from "../fluidbottomnavigation-rn";
import { convertText } from '../../redux/Utility'
import HomeContainer from '../../containers/Home/HomeContainer';
import { sliderClose } from '../../redux/actions/map'
import * as RNLocalize from "react-native-localize";


const FooterMain = (props, { route, navigation }) => {

  // let { activeTabIndex } = props;
  // let screen = props.loggedIn ? 'Profile' : 'GoToAuth';

  // const onClickBtn = (index, screen) => {
  //   props.setActiveTabIndex(index)
  //   props.navigation.navigate(screen)
  // }
  let lang = props.uiControls.lang

  /*
  * set current index of footer
  */
  const manageIndex = (index) => {
    props.currentIndex(index)
    props.sliderClose()
  }

  return (
    <View style={styles.container}>
      <View style={styles.whiteLayer} />
      <TabBar
        selectedIndex={props.setCurrentIndex}
        onPress={tabIndex => {
          manageIndex(tabIndex)
        }}
        values={[
          { title: convertText('footer.home', lang), icon: require("../../assets/images/map2.png") },
          { title: convertText('footer.search', lang), icon: require("../../assets/images/magnifying-glass.png") },
          { title: convertText('footer.message', lang), icon: require("../../assets/images/chat.png") },
          { title: convertText('footer.notification', lang), icon: require("../../assets/images/world.png"), badge: props.notifications.count },
          { title: convertText('footer.profile', lang), icon: require("../../assets/images/user.png") }
        ]}
        tintColor={primaryColor}
      />
    </View>
  )
}

const mapStateToProps = (state) => {
  return {
    //loggedIn: state.auth.loggedIn,
    //activeTabIndex: state.uiControls.activeTabIndex,
    notifications: state.notifications,
    uiControls: state.uiControls
    //map: state.map
  };
};
  
const mapDispatchtoProps = {
  sliderClose,
  setActiveTabIndex,
};  
  
export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(FooterMain);

const styles = StyleSheet.create({
  containerMain: {
      flex: 1,
  },
  imageMain: {
      height: '100%',
      width: '100%'
  },
  imageOutPeople:{
      height: 24,
      width: 26,
      marginBottom: 3
  },
  imageOut: {
      height: 25,
      width: 18,
      marginBottom: 3
  },
  imageOutFirst:{
      marginBottom: 3
  },
  footerText:{
      color: '#BEBFC4',
      fontSize: 14
  },
  footerIcon:{
      color: '#BEBFC4',
      fontSize: 22,
      marginBottom: 4
  },
  locationIcon:{
      color: '#BEBFC4',
      fontSize: 40,
      bottom: 5,
      right: 15
  },
  locationText:{
      color: '#BEBFC4',
      fontSize: 18,
      fontWeight: "500",
      right: 15
  },
  activeFooterText: {
      color: primaryColor,
      fontSize: 14
  },
  activeFooterIcon: {
      color: primaryColor,
      fontSize: 22,
      marginBottom: 4
  },
  activeLocationIcon:{
      color: primaryColor,
      fontSize: 40,
      bottom: 5,
      right: 15
  },
  activeLocationText:{
      color: primaryColor,
      fontSize: 18,
      fontWeight: "500",
      right: 15
  },
  mapBtnStyle:{
      backgroundColor:"#f5f5f5",
      borderTopRightRadius: 110,
      height: 140,
      marginBottom: 20,
  },
  footerStyle:{
      backgroundColor: '#fff',
      borderTopWidth: 0,
      height: 60,
      zIndex: 9
  },
  btnCon: {
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      flex: 1
  },
  labelCon: {
    position: 'absolute',
    top: 8,
    right: 108,
    backgroundColor: 'red',
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99
  },
  label: {
    color: '#fff',
    fontSize: 12
  },
  container: {
    position: 'absolute',
    justifyContent: "space-between",
    alignItems: "flex-end",
    bottom: Platform.OS === 'android' ? 0 : 0,
    zIndex: 99999
  },
  whiteLayer: {
    position: 'absolute',
    width: '100%',
    backgroundColor: '#fff',
    height: 20,
    zIndex: 9,
    bottom: -20
  }
});

