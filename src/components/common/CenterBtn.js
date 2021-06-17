import React, {useRef, memo} from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, Image } from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor, secondColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import ShareAction from "./ShareAction";
import LottieView from 'lottie-react-native';
import { TouchableOpacity } from 'react-native';
import { renderImage } from '../../redux/Utility';
import {CircularProgress} from 'react-native-svg-circular-progress'
import FriendsBtn from './FriendsBtn'

const { width, height } = Dimensions.get('screen');

const CenterBtn = (props) => {

  const slideClose = useRef(new Animated.Value(0)).current
  const modelRef = useRef(null)

  Animated.timing(
    slideClose, 
    {
      toValue: props.isMoving ? -70 : 0,
      duration: 100,
    }
  ).start()

  /*
  * Navigate to Newsfeed screen
  */
  const goToRight = () => {
    props.closeSlider()
    props.toggleBar(0, 'right')
  }
  
  /*
  * Like Current Map
  */
  const like = () => {
    props.addToFavourite()
  }

  /*
  * Render like animation button on likeing of map
  */
  const lottie = () => {
    return <LottieView source={require('../../assets/json/favouriteV2.json')} autoPlay loop={false} style={{width: 50, height: 50}} />
  }

  /*
  * Navigate to User profile
  */
  const goToProfile = () => {
    if(props.mapDetail.owner_id === props.userId){
      //props.navigation.navigate('Profile')
      props.navigation.navigate('Footer', {
        routeId : 4
      }) 
    }
  }
  
  const renderCenterButtons = () => {
    return <>
          {/* <Ripple 
            style={[styles.round, styles.bottomRight, {bottom: 108}]}
            rippleColor="#ccc" 
            rippleOpacity={0.5} 
            rippleDuration={700}
            rippleContainerBorderRadius={30}
            onPress={() => props.centerOnBaseMarker()}
          >
            <Icon type="FontAwesome5" name={'map-marker-alt'} style={styles.usersIcon} />
          </Ripple> */}
          <Ripple 
            style={styles.bottomRightUp}
            rippleColor="#ccc" 
            rippleOpacity={0.5}
            rippleDuration={700}
            rippleContainerBorderRadius={30}
            onPress={() => props.centerOnUserLocation()}
          >        
            <Icon type="FontAwesome5" name={props.isUserCenterLocatied ? 'globe-americas' : 'street-view'} style={styles.usersIcon} />
          </Ripple>
        </>
  }

  const renderSlideBar = () => {
    return <Animated.View style={[styles.round, {right: slideClose}]}>
            <View style={styles.coverageCon}>
              <CircularProgress size={50} progressWidth={18} percentage={props.users_coverage}>
                <View>
                  <Text style={styles.coverageText}>{props.users_coverage}%</Text>
                </View>
              </CircularProgress>
            </View>
            <FriendsBtn 
              checkin_users={props.checkin_users}
              loading={props.loading}
              navigation={props.navigation}
              setCenterCord={props.setCenterCord}
              userId={props.userId}
              lang={props.lang} 
            />          
            <TouchableOpacity style={[styles.center, styles.bottomFav]} onPress={() => like()}>
              { props.mapDetail.isFav ?
              lottie()
              :  
              <Image source={require('../../assets/images/heart_white.png')} style={{height: 50, width: 50}}/>      
              }
              <Text style={styles.text}>{props.mapDetail.favorites_count}</Text> 
            </TouchableOpacity>
            <TouchableOpacity style={[styles.center, styles.comments]} onPress={() => goToRight()}>
              <LottieView source={require('../../assets/json/03 dialog.json')} autoPlay loop={false} style={{width: 55, height: 55}} />
              <Text style={styles.text} >{props.mapDetail.comments_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.center, styles.shares]} onPress={() => modelRef.current.open()}>
              <LottieView source={require('../../assets/json/04 share.json')} autoPlay loop={false} style={{width: 50, height: 50}} />
              {/* <Icon type="FontAwesome5" name={'share'} style={[styles.usersIcon, {color: primaryColor}]} /> */}
              <Text style={styles.text} >{props.mapDetail.shares_count}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.center} onPress={() => goToProfile()}>
              <View style={styles.profileCon}>
                <Image style={styles.userImg} source = {renderImage(props.mapDetail.owner_image, 'user')}/> 
              </View> 
              <Icon type="FontAwesome5" name={'plus'} style={styles.addIcon} />    
            </TouchableOpacity> 
          </Animated.View>
  }
  
  return(
    <>
      {renderSlideBar()}      
      {renderCenterButtons()}      
      <RBSheet
        ref={modelRef}
        height={300}
        openDuration={250}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        dragFromTopOnly={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }
        }}
      >
        <ShareAction homePage onClose={() => modelRef.current.close()}/>
      </RBSheet>
    </>
  )
	
}

const styles = StyleSheet.create({
	round: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 1,
    //backgroundColor: 'rgba(0,0,0,0.2)',
    paddingRight: 10,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomLeftRadius: 20
    
  },
  coverageCon: {
    // top: 80,
  }, 
  bottomRight: {
    right: width/2 - 85,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  bottomRightUp: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    right: 15,
    bottom: 140,
    backgroundColor: 'rgba(255, 255, 255, 0.8)'
  },
  usersIcon: {
    color: 'grey',
    fontSize: 25,
    fontWeight: '600',
  },
  center: {
    alignItems: 'center',
  },
  filled: {
    color: primaryColor,
  },
  profileCon: {
    marginTop: 15,
    borderWidth: 2,
    borderColor: '#fff',
    width: 40,
    height: 40,
    backgroundColor: 'grey',
    overflow: 'hidden',
    borderRadius: 20
  },
  coverageText:{
    fontSize: 12
  },
  text: {
    marginTop: -13,
    fontSize: 12,
  },
  addIcon: {
    position: 'absolute',
    fontSize: 10,
    backgroundColor: primaryColor,
    padding: 3,
    borderRadius: 10,
    overflow: 'hidden',
    color: '#fff',
    zIndex: 99,
    bottom: -5
  },
  userImg: {
    width: '100%',
    height: '100%',
  }
})

export default memo(CenterBtn);