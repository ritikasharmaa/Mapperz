import React, { useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Platform,
  Dimensions
} from "react-native";
import { Icon } from 'native-base';
import { connect } from "react-redux";
import LottieView from 'lottie-react-native';


const color = {
  'Restaurants' : 'rgba(241, 130, 120, 0.5)',
  'Others' : 'rgba(60,180,75, 0.5)',
  'Sweets': 'rgba(240,50,230,0.5)',
  'Fast Food': 'rgba(230, 26, 75, 0.5)',
  'Izakaya': 'rgba(67, 99, 217, 0.5)',
  'Bar': 'rgba(169, 169, 169, 0.5)',
  'Cafe': 'rgba(255, 225, 26, 0.5)',
  'Daily Goods': 'rgba(1, 0, 117, 0.5)',
  'Food Items': 'rgba(145, 30, 180, 0.5)',
  'Body Building': 'rgba(69, 153, 144, 0.5)',
  'Liquer Shop': 'rgba(191, 239, 69, 0.5)'
}

const { height, width } = Dimensions.get('window');

const PopupMessage  = (props) => {
  const [localNew, setLocalNew] = useState(false)
  const [lines, setLines] = useState(1)
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setLocalNew(false)
    setLines(1)
    {fadeIn()}
    setTimeout(() => {
      {fadeOut()}
    }, 285000)
  }, [props.data.message.length])

  const fadeIn = () => {
    return Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 5000
    }).start();
  };



  const fadeOut = () => {
    return <LottieView source={require('../../assets/json/speech buble close.json')} autoPlay loop={false}  style={{height: 150, width: 220}}/>
  };

  const getPopupStyle = () => {
    if(lines > 2){
      return {width: 165, height: 115, marginBottom: (Platform.OS === 'android' ? 160 : 110) }
    } else {
      return {marginBottom: (Platform.OS === 'android' ? 150 : 85) }
    }
  }
  /*const getTextStyle = (totalCount) => {
    if(totalCount <= 55 && totalCount >= 30){
      return {fontSize: 14, paddingTop: (Platform.OS === 'android' ? 0 : 2)}
    } else if(totalCount > 55){
      return {fontSize: 14, paddingHorizontal: 40, paddingTop: 4}
    }
  }*/

  const getTextStyle = () => {
    if(lines > 2){
      return { paddingTop: (Platform.OS === 'android' ? 0 : 7)}
    } else {
      return 
    }
  }

  const getConStyle = () => {
    if(lines > 2){
      return {width: 155, height: 105, marginBottom: (Platform.OS === 'android' ? 10 : 25) }
    } else {
      return 
    }
  }

  const getPopupConStyle = (totalCount) => {
    if(lines > 2){
      return {width: 200, marginBottom: 40}
    }
  }

  const getArrowStyle = () => {
    if(lines > 2){
      return {bottom: (Platform.OS === 'android' ? 160 : 100) }
    } else {
      return 
    }
  }

  const imageClick = () => {
    setLocalNew(true)
  }

  const getTextConStyle = () => {
    if(lines > 2){
      return {height: 105}
    } else {
      return 
    }
  }

  const onLayout = (event) => {
    const { height } = event.nativeEvent.layout;
    let noOfLines = Math.floor(height / styles.tipText.lineHeight)
    if(noOfLines > 2){
      setLines(noOfLines)
    }
  }

  const popup = () => {
    return <LottieView source={require('../../assets/json/speeck buble open.json')} autoPlay loop={false}  style={{height: 150, width: 220}}/>
  }

  const renderPopup = () => {
    if (props.data.message) {
      return (
        <>
        <View style={[styles.textCon, {width: 220, height: 150, justifyContent: 'center', alignItems: 'center', left: -30, bottom: -10}]}>
          {popup()}
          <Animated.View pointerEvents="none" style={[styles.textCon, getTextConStyle(props.data.message.length)]}>
            <Text numberOfLines={1} style={[styles.name]} >{props.data.name && props.data.name.substring(0,7)|| props.data.spot_name && props.data.spot_name.substring(0, 5) }</Text>
            <Text numberOfLines={4} onLayout={event => onLayout(event)} style={[styles.tipText,getTextStyle(props.data.message.length)]} >{props.data.message}</Text>
          </Animated.View>
        </View>        
        {/* {props.closePopup && <TouchableOpacity style={[styles.iconCon]} onPress={() => props.closePopup()}>
          <Icon type="FontAwesome5" name={'times'} style={styles.icon} />
        </TouchableOpacity>}
        <TouchableOpacity onPress={() => imageClick()}  style={[styles.mainCon, getPopupConStyle(props.data.message.length)]}>
          <Animated.View 
            style={
              [styles.profileContainer, {opacity: fadeAnim},
              props.category && {backgroundColor: (color[props.category.category] ? color[props.category.category] : 'red')},
              getPopupStyle(props.data.message.length)]}>
          </Animated.View>
          <Animated.View  
            style={
              [styles.whiteCon, {opacity: fadeAnim},
              (props.isNewest) ? {backgroundColor: 'rgba(255,255,255, 0.9)'} : {backgroundColor: 'rgba(255,255,255, 0.7)'},
              localNew && {backgroundColor: '#fff'},
              getConStyle(props.data.message.length)]}>
          </Animated.View>
          <Animated.View pointerEvents="none" style={[styles.textCon, {opacity: fadeAnim}, getTextConStyle(props.data.message.length)]}>
            <Text numberOfLines={1} style={[styles.name]} >{props.data.name && props.data.name.substring(0,7)|| props.data.spot_name && props.data.spot_name.substring(0, 5) }</Text>
            <Text numberOfLines={4} onLayout={event => onLayout(event)} style={[styles.tipText,getTextStyle(props.data.message.length)]} >{props.data.message}</Text>
          </Animated.View>
          <Animated.View 
            style={
              [styles.calloutArrow, {opacity: fadeAnim},
              // (props.isNewest && localNew) ? {backgroundColor: '#fff'} : {backgroundColor: 'lightgrey'}, getArrowStyle(props.data.message.length),
              props.category && {backgroundColor: (color[props.category.category] ? color[props.category.category] : 'red')},
              getArrowStyle(props.data.message.length)
            ]}>             
          </Animated.View>
        </TouchableOpacity>        */}
        </>
      )       
    } else {
      return <View></View>
    }
  }
    return (
     <>  
     {renderPopup()}
     </>
   )
}
const styles = StyleSheet.create({
  calloutArrow: {
    position: 'absolute',
    width: 40,
    height: 28,
    bottom: (Platform.OS === 'android' ? 150 : 75),
    left: '45%',
    marginLeft: 0,
    borderColor: '#aaa',
    transform: [
      {rotate: '-45deg'},
      {skewX: '-20deg'}
    ],
    zIndex: -10,
    backgroundColor: 'rgba(211,211,211,0.8)'
  },
  tipText: {
    fontSize: 15,
    paddingHorizontal: 35,
    flexDirection: 'row',
    flexWrap: 'wrap',
    lineHeight: 17,
    textAlign: 'center'
  },
  profileContainer: {
    //position: 'absolute',
    width: 130,
    height: 80,
    //marginBottom:(Platform.OS === 'android' ? 150 : 0),
    borderRadius: 20,
    //transform: [{scaleX: 2}],
    backgroundColor: 'rgba(211,211,211,0.8)'
  },
  whiteCon: {
    position: 'absolute',
    width: 120,
    height: 70,
    zIndex: 2,
    //backgroundColor: '#fff',
    bottom: (Platform.OS === 'android' ? 155 : 90),
    borderRadius: 20,
    //transform: [{scaleX: 2}]
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  name:{
    fontSize:13,
    color:'#aaa',
    marginTop:3,
    paddingTop: 3,
    position: 'absolute',
    top: 0,
  },
  mainCon: {
    marginBottom: 70,
    alignItems: 'center',
    width: 160,
    marginLeft: 40,
  },
  textCon: {
    position: 'absolute',
    zIndex: 99,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    paddingLeft: 5
    //backgroundColor: 'red'
  },
  iconCon: {
    position: 'absolute',   
    right: 30,
    top: 10,
    zIndex: 99,
  },
  icon: {
    fontSize: 12,
    color: '#aaa'
  }
});
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    socket: state.socket,
  };
};
export default connect(
  mapStateToProps,
  null
)(PopupMessage);






















