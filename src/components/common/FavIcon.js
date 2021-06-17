import React, {useRef, useState, useEffect, memo} from 'react';
import { View, StyleSheet, Dimensions, Modal, Text, Animated, TouchableOpacity, Alert } from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import CheckinSpot from './CheckinSpot'
import Geolocation from 'react-native-geolocation-service';
import SuggestSpot from './SuggestSpot'
import GPSState from 'react-native-gps-state'
import { convertText } from '../../redux/Utility'
import LottieView from 'lottie-react-native';
import {postApiPosts} from '../../redux/api/feed'
import { connect } from "react-redux";
import {setToggleState, hideButtons} from '../../redux/actions/map'

const { width, height } = Dimensions.get('screen');

const shoutList = [
  'What a good day!',
  'Lets meetup!',
  "Who's up for coffee?",
  'On my way!'
]

const FavIcon = (props) => {
  let isUnderProcess = false;
  const btnAnimate = useRef(new Animated.Value(width/2 - 25)).current
  const btnAnimateRight = useRef(new Animated.Value(width/2 - 25)).current
  const btnOpacity = useRef(new Animated.Value(0)).current
  const btnAnimateTop = useRef(new Animated.Value(40)).current
  const btnRotate = useRef(new Animated.Value(0)).current
  const modalRef = useRef(null)
  const suggestRef = useRef(null)
  const animateWithSlider = useRef(new Animated.Value(140)).current
  const lottieRef = useRef(null)
  const closeRef = useRef(null)
  const [modalVisible, setModalVisible] = useState(false);

  let lang = props.lang

  useEffect(() => {
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){
      Geolocation.getCurrentPosition((info) => {
        let id = props.currentMap;
        let googleSpot = true;
        props.getNearestSpots(
          id,
          info.coords.latitude,
          info.coords.longitude,
          googleSpot
        );
      });
    }
  },[])


  useEffect(() => {
    {manageShout()}
    // if (!props.isOpen) {
    //   toggleBtns('skipChange')
    // }
  },[props.clickCount])

  
  /*
  * Animations on click of center Button and open other action buttons
  */
  const toggleBtns = (isSkipChange) => {  
    Animated.timing(
      btnAnimate,
      {
        toValue: (props.isOpen || isSkipChange) ? width/2 - 25 : width/2 - 80,
        duration: 300,
      }
    ).start();

    Animated.timing(
      btnAnimateRight,
      {
        toValue: (props.isOpen || isSkipChange) ? width/2 - 25 : width/2 + 40,
        duration: 300,
      }
    ).start();

    Animated.timing(
      btnAnimateTop,
      {
        toValue: (props.isOpen || isSkipChange) ? /*(props.map.isSliderOpen ? 320 : 140 )*/140 : /*(props.map.isSliderOpen ? 380 : 200 )*/ 200,
        duration: 300,
      }
    ).start();

    Animated.timing(
      btnOpacity,
      {
        toValue: (props.isOpen || isSkipChange) ? 0 : 1,
        duration: 500,
      }
    ).start();

    Animated.timing(
      btnRotate,
      {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }
    ).start()

    if (!isSkipChange) {
      props.favIconIsOpen()
    }
  }

  Animated.timing(
    animateWithSlider,
    {
      toValue: props.isSliderOpen ? 320 : 140,
      duration: 300,
    }
  ).start()

  /*
  * Rotate plus icon on click of it
  */
  const spin = btnRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg']
  })

  /*
  * On click of checkin Button open checkin Modal
  */
  const checkin = () => { 
    modalRef.current.open()    
  }

  /*
  * On click plus action button navigate to planner screen
  */
  const goToPlanner = () => {
    props.navigation.navigate('Planner')
    props.hideOverlay()
  }

  /*
  * Open suggestion modal
  */
  const suggestSpot = () => {
    suggestRef.current.open()
    props.favIconIsOpen()
  }

  /*
  * Navigate user to Review screen of Map planner
  */
  const editMap = () => {
    let item = props.map.mapDetail;
      let data = {
      centerData: {
        id : item.id,
        image_url: item.image_url,
        label: item.neighborhood_name + ' ' + item.prefecture_name,
        latitude: item.latitude,
        longitude: item.longitude,
        name_local: item.spot_details.attname_local,
        pref_cd: item.prefecture_id,
        tours_count: item.spots_count,
        value:item.neighborhood_name + ' ' + item.prefecture_name,
      },
      finalFormData : {
        tour_name : item.map_name,
        description: item.description,
        date: '',
        status: item.status,
        group: ''
      },
      methodType: {
        caption: '',
        commingSoon: Boolean,
        image: '',
        method: '',
        subCaption:''
      }
    }
    props.editPlannerDetail(data);
    props.hideOverlay()
    props.navigation.navigate('Planner', {step: 3})
  }

  const lottie = () => {    
    if(props.isOpen){      
      return <LottieView ref={closeRef} source={require('../../assets/json/closed shout buttons.json')} onAnimationFinish={onAnimationFinish} loop={false} style={{width: 200, height: 200}}/>
    } else {
      return <LottieView ref={lottieRef} source={require('../../assets/json/open shouts cropped size.json')} onAnimationFinish={onAnimationFinish} loop={false} style={{width: 200, height: 200}}/>
    }
  }

  const lottieOpen = () => {
    return <LottieView ref={lottieRef} source={require('../../assets/json/open shouts cropped size.json')} onAnimationFinish={onAnimationFinish} loop={false} style={{width: 170, height: 170}}/>
  }

  const lottieClose = () => {
    return <LottieView ref={closeRef} source={require('../../assets/json/closed shout buttons.json')} onAnimationFinish={onAnimationFinish} loop={false} style={{width: 170, height: 170}}/>
  }

  const onAnimationFinish = () => { 
    
    isUnderProcess = false;
    props.favIconIsOpen() 

  }

  const manageShout = () => {  
    if(props.isOpen){     
      closeRef.current.play()          
      //props.dispatch(hideButtons()) 
    }     
  }

  const openShout = () => {  
    if(isUnderProcess){
      return
    }
    isUnderProcess = true;
    if(!props.isOpen){      
      lottieRef.current.play() 
      //props.dispatch(hideButtons())
    }  
  }

  const sendCheckinMessage = (msg) => {
    Geolocation.getCurrentPosition(info => {
      props.dispatch(setToggleState(true))
      let data = {lets_checkin: true, latitude: info.coords.latitude, longitude: info.coords.longitude}
      let threadId = props.currentMap
      let ownerId = props.userId;
      props.dispatch(setToggleState(true))
      props.dispatch(postApiPosts(msg, [], threadId, ownerId, 'checkin_map', data)).then(res => {
        if (res.status === 'error') {
          Toast.show(res.message)
        } else {
          props.setCenterCord({centerCords: [data.longitude, data.latitude], id: 'user_center'})    
        }
      })
    });
  }

  const onePushShout = (key) => {
    setModalVisible(false)
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){
      if (!props.checked_in) {
        Alert.alert(
          (convertText("message.userCheckin",lang)),
          (convertText("message.userCheckinPost",lang)),
          [
            {
              text: convertText("message.no",lang),
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { 
              text: convertText("message.yes",lang), 
              onPress: () => {
                sendCheckinMessage(key) 
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        sendCheckinMessage(key) 
      }
    } else {
      alert(convertText("map.please_turn_on_your_location", lang))
    }
  }

  const shoutBtns = () => {
    if(props.isOpen){
      return <>
              <TouchableOpacity onPress={() => onePushShout('I checked in here')} style={[styles.btn, styles.checkinBtn]}></TouchableOpacity>
              <TouchableOpacity onPress={() => suggestSpot()} style={[styles.btn, styles.suggestBtn]}></TouchableOpacity>
              <TouchableOpacity onPress={() => onePushShout('What a good day!')} style={[styles.btn, styles.rightbtn, styles.pushShoutBtn]}></TouchableOpacity>
              <TouchableOpacity onPress={() => setModalVisible(true)}style={[styles.btn, styles.rightbtn, styles.selectShoutBtn]}></TouchableOpacity>
              <TouchableOpacity onPress={() => checkin()} style={[styles.btn, styles.rightbtn, styles.customShoutBtn]}></TouchableOpacity>
            </>
    }
  }

  const renderShoutList = () => {
    return shoutList.map((item, index) => {
      return <TouchableOpacity key={index}
                style={styles.button}
                onPress={(e) => onePushShout(item)}
              >
                <Text style={styles.textStyle}>{item}</Text>            
              </TouchableOpacity>
    })
  }
  
  return(
  <>
    {/* <Ripple rippleDuration={700} rippleContainerBorderRadius={30} style={[styles.btn, styles.actionBtn, {bottom: 140}]} onPress={() => toggleBtns()}>      
      <Animated.View style={[props.isOpen && {transform: [{rotate: spin}] }]}>
        <Icon type="FontAwesome5" name={'plus'} style={[styles.actionButtonIcon]}/>
      </Animated.View>
    </Ripple> */}
    {/* <LottieView ref={lottieRef} source={require('../../assets/json/open shouts cropped size.json')} loop={false} style={{position: 'absolute', zIndex: 1, backgroundColor: 'black', width: 100, height: 100}}/> */}
    <View pointerEvents="none" style={[styles.shoutCon]}> 
      {lottie()}  
    </View>
    {/* <View pointerEvents="none" style={[styles.shoutCon, {opacity: props.open ? 0 : 1}]}> 
      {lottieOpen()}  
    </View>
    <View pointerEvents="none" style={[styles.shoutCon, {opacity: props.open ? 1 : 0} ]}> 
      {lottieClose()} 
    </View> */}
    <TouchableOpacity onPress={() => openShout()} style={[styles.btn, styles.shoutBtn]}></TouchableOpacity>
    {shoutBtns()}
    <View style={styles.centeredView}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>What to shout?</Text>
            {renderShoutList()}            
          </View>
        </View>
      </Modal>
    </View>
    <Animated.View style={[styles.topBtn, {left: btnAnimate, opacity: btnOpacity}, {bottom: /*props.map.isSliderOpen ? 350 :*/ 170}]}>
      {/* {(props.map.mapDetail.owner_id !== props.auth.userData.id) ?
      <Ripple rippleDuration={700} rippleContainerBorderRadius={30} style={[styles.searchBtn]} onPress={() => closeOverlay()}>
        <Icon type="FontAwesome5" name={'lightbulb'} style={styles.actionButtonIcon} />
      </Ripple>
      :
      <Ripple rippleDuration={700} rippleContainerBorderRadius={30} style={[styles.searchBtn]} onPress={() => editMap()}>
        <Icon type="FontAwesome5" name={'pen'} style={styles.actionButtonIcon} />
      </Ripple>
      } */}
    </Animated.View>
    {/* <Animated.View  style={[styles.topBtn, {bottom: btnAnimateTop, opacity: btnOpacity, left: width/2 - 20}]} >
      <Ripple rippleDuration={700} rippleContainerBorderRadius={30} style={[styles.searchBtn, styles.plusBtn]} onPress={() => goToPlanner()}>
        <Icon type="FontAwesome5" name={'plus'} style={styles.actionButtonIcon} />
      </Ripple>
    </Animated.View>  
    <Animated.View  style={[styles.topBtn, {left: btnAnimateRight, opacity: btnOpacity}, {bottom: 170}]}>
      <Ripple 
        rippleDuration={700} 
        rippleContainerBorderRadius={30} 
        style={[styles.searchBtn, styles.shareBtn]}
        onPress={() => checkin()}
      >
        <Icon type="FontAwesome5" name={'map-marker'} style={styles.actionButtonIcon} />
      </Ripple>
    </Animated.View> */}

    <RBSheet
      ref={modalRef}
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
      <CheckinSpot 
        {...props} 
        checkinMessage 
        onCloseModal={() => modalRef.current.close()}
      />
    </RBSheet>
    <RBSheet
      ref={suggestRef}
      height={600}
      openDuration={250}
      closeOnDragDown={true}
      keyboardAvoidingViewEnabled={true}
      customStyles={{
        container: {
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        },
      }}
    >
      <SuggestSpot mapperId={props.currentMap} closeModal={suggestRef} {...props}/>
    </RBSheet>
  </>
  )
}

const styles = StyleSheet.create({
  btn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: 'absolute',
    left: width/2 - 20,
    zIndex: 111
  },
  actionButtonIcon: {
    fontSize: 13,
    color: '#fff'
  },
  actionBtn: {
    backgroundColor: 'rgba(231,76,60,1)',
    //bottom: 0,
    zIndex: 111
  },
  searchBtn: {
    backgroundColor: '#9b59b6',
    position: 'relative',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  plusBtn: {
    backgroundColor: '#1abc9c',
  },
  shareBtn: {
    backgroundColor: '#3498db',    
  },
  topBtn: {
    position: 'absolute',
    zIndex: 100
  },
  shoutCon: {
    position: 'absolute', 
    zIndex: 1, 
    height: 150, 
    width: 170, 
    bottom: 130, 
    left: width/2 - 147,
    //backgroundColor: 'red'
  },
  btn: {
    position: 'absolute', 
    height: 45, 
    width: 50, 
    //backgroundColor: 'black',    
    zIndex: 11
  },
  shoutBtn: {
    left: width/2 - 20, 
    bottom: 140,
  },
  checkinBtn: {
    left: width/2 - 85,
    bottom: 120,
  },
  suggestBtn: {
    left: width/2 - 60,
    bottom: 185,
    width: 45
  },
  rightbtn: {
    width: 35,
    height: 35
  },
  pushShoutBtn: {
    right: width/2 - 45,
    bottom: 195,    
  },
  selectShoutBtn: {
    right: width/2 - 75,
    bottom: 155,
  },
  customShoutBtn: {
    right: width/2 - 65,
    bottom: 115,
    width: 30,
    height: 30
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0, 0.2)',
    zIndex: 11
    // position: 'absolute',
    // zIndex: 99,
    // bottom: 0,
    // left: 0
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    width: 200,
    padding: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  textStyle: {
    // fontWeight: "bold",
    textAlign: "center",
    
  },
  modalText: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center"
  },
  button: { 
    width: '100%',
    paddingVertical: 7,
    borderBottomWidth: 0.2,
    borderColor: 'grey',
  }

})

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(memo(FavIcon));

