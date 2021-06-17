import React,{useState, useRef, useEffect, memo} from 'react';
import { View, StyleSheet,Animated,Dimensions, TouchableOpacity, Text } from 'react-native';
import TopbarHandle from '../SidebarComponents/TopbarHandle'
import TopView from '../ViewScreens/TopView'
import SlideDownPanel from "../react-native-slide-down-panel";
import {Icon,Button} from 'native-base'
import {connect} from 'react-redux';
import { getSpecificMapDetail, getMapFeed } from '../../redux/api/map'
import LottieView from 'lottie-react-native';
import  animationView from 'lottie-react-native';
import { convertText } from '../../redux/Utility'
import GPSState from 'react-native-gps-state'
import Geolocation from 'react-native-geolocation-service';
import RBSheet from "react-native-raw-bottom-sheet";
import CheckinSpot from '../common/CheckinSpot'
import ContentLoader from '../common/ContentLoader';
import { primaryColor } from '../../redux/Constant';



const { width, height } = Dimensions.get('screen');

var MAXIMUM_HEIGHT = height - 320;
var HANDLER_HEIGHT = 80;
var OFFSET_TOP = 50;


const TopSlider = (props) => {
 
  const [mapClicked, handleMapClicked] = useState(false);
  const [isOpen, setIsOpen] = useState(false)
  const dataAnimate = useRef(new Animated.Value(0)).current;
  const modalRef = useRef(null)
  const upRef = useRef(null)
  const downRef = useRef(null)
  const [modalOpen, setModalOpen] = useState(false)


  useEffect(() => {
    {handleMapSelected()}
  },[props.clickCount])


  Animated.timing(
    dataAnimate, 
    {
      toValue: isOpen ? 400 : 0,
      duration: 500
    }
  ).start();

  const handleMapSelected =  () => {
    if(isOpen){
      setIsOpen(false)
    }  
  }
  
  const data = () => {
    return <View style={{height: '80%'}}>
      <TopView 
        {...props} 
        handleMapSelected={() => handleMapSelected()} 
      />
    </View>
  }

  const openNewMap = () => {
    props.navigation.navigate('Planner')
  }


  const doCheckIn = () => {   
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){
      Geolocation.getCurrentPosition(info => {
          let id = props.currentMap
          modalRef.current.open()
          props.getNearestSpots(id, info.coords.latitude, info.coords.longitude)
        },
        (error) => {
          // See error code charts below.
          console.log(error.code, error.message);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    } else {
      alert(convertText('map.please_turn_on_your_location', props.lang))
    }
  }

  const open = () => {
    if(!isOpen){
      setIsOpen(true)
    }   
  }
	return(  
    <>
      <View style={styles.dropDownCon}>
        <Animated.View style={styles.dropDown, {height: dataAnimate}}>
          {data()}
          <View style={styles.options}>
            <TouchableOpacity onPress={() => openNewMap()} style={[styles.plannerBtn, styles.btn]}>
              <Text style={styles.btnText}>New Map</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => doCheckIn()} style={[styles.checkinBtn, styles.btn]}>
              <Text style={styles.btnText}>Check in</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>      
        <TouchableOpacity disabled={isOpen ? true : false} style={styles.handler} onPress={() => open()}>
          {props.fetchingDetail ? 
          <View style={{marginTop: 65}}><ContentLoader /></View> :
          <Text numberOfLines={2} style={{marginTop: 65, paddingHorizontal: 25, textAlign: 'center'}}>{props.map_name_local}</Text>
          }         
        </TouchableOpacity>
      </View>                            
      <RBSheet
        ref={modalRef}
        height={450}
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
        onCloseModal={() => modalRef.current.close()} 
      />
    </RBSheet>
    </> 
		// <SlideDownPanel
    //   offsetTop={OFFSET_TOP}
    //   initialHeight={0}
    //   containerMaximumHeight={MAXIMUM_HEIGHT}
    //   mapClicked={mapClicked} 
    //   handlerHeight={HANDLER_HEIGHT}
    //   handlerDefaultView={<TopbarHandle mapTitle={props.map.mapDetail && props.map.mapDetail.map_name_local} />}
    //   handlerBackgroundColor={'rgba(52, 52, 52, 0)'}
	  // 	containerBackgroundColor={'rgba(52, 52, 52, 0)'} 
    // >
    //   <TopView {...props} handleMapSelected={() => handleMapSelected()} />
    // </SlideDownPanel>    
	)
} 

const styles = StyleSheet.create({  
  dropDownCon: {
    position: 'absolute', 
    zIndex: 9,
    width: '100%',
    top: 50
  },
  options: {   
    backgroundColor: '#fff',
    height: '20%', 
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,  
    flexDirection: 'row'  
  },
  btn: {
    backgroundColor: primaryColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  plannerBtn: {     
    width: width/2 - 2,
    marginRight: 2,
    borderBottomLeftRadius: 100,   
  },
  checkinBtn: {
    backgroundColor: primaryColor, 
    width: width/2,
    borderBottomRightRadius: 100,
  },
  dropDown: {    
    backgroundColor: '#fff',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: 2,
    overflow: 'hidden'
  },
  handler: {
    backgroundColor: '#fff',
    height: 150,
    width: 200,
    bottom: 80,
    left: width/2 - 100,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    zIndex: -1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnText: {
    color: '#fff',
    fontSize: 20
  },
  dataCon: {
    width: '100%', 
    position: 'absolute', 
    zIndex: 3, 
    top: 50,
    //backgroundColor: 'black'
  },
  layerCon: {
    position: 'absolute',
    top: 50, 
    width: width, 
    height: 540,
  },
  newMap: {    
    left: 50,    
  },
  checkIn: {
    right: 50,
    left: 'auto'
  },
  upperBtn: {
    width: 150,
    height: 90,
    bottom: 105,
  }
})
const mapStateToProps = (state) => ({
	//map: state.map,
  });
	
  const mapDispatchToProps = (dispatch) => ({
	  dispatch
  });

  const TopSlideBar = memo(TopSlider)
export default connect(mapStateToProps, mapDispatchToProps)(TopSlideBar)