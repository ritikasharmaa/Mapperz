import React, { useState, useRef, useEffect } from "react";
import { View, Platform, Image, StyleSheet, Text, Dimensions} from "react-native";
import { connect } from 'react-redux';
import SyncStorage from 'sync-storage';
import { primaryColor } from "../../redux/Constant";
import AppIntroSlider from 'react-native-app-intro-slider';
import { Icon } from 'native-base'
import { convertText } from '../../redux/Utility'

const { width, height } = Dimensions.get('screen');


const Intro = (props) => {
  let lang = props.uiControls.lang

  const slides = [
    {
      key: 1,
      title: convertText("intro.map_planner", lang),
      text: convertText("intro.you_can_use", lang),
      image: require('../../assets/images/addspots.png'),
    },
    {
      key: 2,
      title: convertText("intro.share_your_maps", lang),
      text: convertText("intro.sub_share_your_map", lang),
      image: require('../../assets/images/maplisting.png'),
    },
    {
      key: 3,
      title: convertText("intro.follow_map", lang),
      text: convertText("intro.sub_follow_map", lang),
      image: require('../../assets/images/followmap.png'),
    },
    {
      key: 4,
      title: convertText("intro.increse_your", lang),
      text: convertText("intro.checkin_to_spots", lang),
      image: require('../../assets/images/send_messages_ja.png'),
    },
    {
      key: 5,
      title: convertText("intro.sign_up", lang),
      text: convertText("intro.join_the_ma", lang),
      image: require('../../assets/images/sign_up.png'),
    }
  ];

  useEffect(() => {
    let token = SyncStorage.get('token')
    if(token){
      props.navigation.navigate('Initial')
    }
  }, [])

  renderItem = ({ item }) => {
    return (
      <View style={styles.slide}>
        <View style={styles.imageCon}>
          <Image source={item.image} style={styles.image}/>
        </View>       
        <View style={styles.textCon} >
          <Text style={styles.title}>{item.title}</Text>        
          <Text style={[styles.title, styles.text]}>{item.text}</Text>
        </View>        
      </View>
    );
  }

  renderNextButton = () => {
    return (
      <View style={styles.buttonCircle}>
        <Icon type="FontAwesome5" name={'arrow-right'} style={styles.btnIcon} size={14}/>
      </View>
    );
  };

  renderDoneButton = () => {
    SyncStorage.set('ifSignedUp', true)
    return (
      <View style={styles.buttonCircle}>
        <Icon type="FontAwesome5" name={'check'} style={styles.btnIcon} size={14}/>
      </View>
    );
  };

  renderSkipButton = () => {
    return   <View style={styles.buttonCircle}>
    <Icon type="FontAwesome5" name={'forward'} style={styles.btnIcon} size={14}/>
  </View>
  }
    
  return (    
    <AppIntroSlider
      renderItem={renderItem}
      data={slides}
      showSkipButton={true}
      renderSkipButton={renderSkipButton}
      renderDoneButton={renderDoneButton}
      renderNextButton={renderNextButton}
      activeDotStyle={{backgroundColor: primaryColor, width: 20}}
      onDone={() => props.navigation.navigate('Email')}
    />
  )    
};

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    backgroundColor: '#fff',
    overflow: 'hidden'
  },
  skip: {
    color: 'grey',
    fontSize: 16,
    position: 'absolute',
    bottom: -33
  },
  buttonCircle: {
    backgroundColor: primaryColor,
    borderRadius: 10
  },
  btnIcon: {
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 18,
  },
  done: {
    color: primaryColor,
    fontSize: 16,
    position: 'absolute',
    bottom: -33,
    right:0
  },
  textCon: {
    height: '50%',
    alignItems: 'center',
    marginTop: 50
  },
  title: {
    color: primaryColor,
    fontSize: 24,
    fontWeight: '900',
    marginVertical: 10,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  text: {
    color: 'grey',
    fontSize: 17,
    fontWeight: '400',
    lineHeight: 28
  },
  imageCon: {
    width: (width + 200),
    height: '50%',
    backgroundColor: '#fef2d3',
    borderRadius: 20,
    borderBottomLeftRadius: 1000,
    borderBottomRightRadius: 1000,
    overflow: 'hidden',
    marginLeft: -100,
    alignItems: 'center'
  },
  image: {
    width: width,
    height: '100%',
    resizeMode: 'contain'
  }

});

const mapStateToProps = (state) => ({
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Intro);
