import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  PanResponder
} from 'react-native';
import LeftSlideBar from '../../components/SlideBars/LeftSlideBar';
import RightSlideBar from '../../components/SlideBars/RightSlideBar';
import Maps from '../../components/ViewMaps/Maps';
import {Container} from 'native-base'
import FavIcon from '../../components/common/FavIcon'
import SyncStorage from 'sync-storage';
import Slider from '../../components/common/Slider'

const { width, height } = Dimensions.get('screen');

const Home = (props) =>  {
  let lang = props.uiControls.lang
  let allMap = SyncStorage.get('allMap')
  const [topBarOpen, setTopBarOpen] = useState(false);
  const [containerHeight, setContainerHeight] = useState(null)
  const [barSide, setBarSide] = useState(0)
  const leftSlideBar = useRef(new Animated.Value(-(width))).current
  const rightSlideBar = useRef(new Animated.Value(-(width))).current
  const [getswipe, setGetSwipe] = useState('')


  const toggleBar = (endPoint, barSide, swipe) => {
    setGetSwipe(endPoint)
    if(swipe) {
      setBarSide(0)
    }else{
      setBarSide(barSide+1)
    }
    Animated.timing(
      barSide == 'right' ? rightSlideBar : leftSlideBar,
      { 
        toValue: (endPoint === 0 ? endPoint : -(width)),
        duration: 200,
      }
    ).start();
  }

  useEffect(() => {    
   const listener = props.navigation.addListener('focus', () => {
      props.setActiveTabIndex(1)     
    });
    return () => {listener}
  }, [props.navigation]);


  useEffect(() => {  
    if(props.map.isOpen === true){
      props.favIconIsOpen()
    }  
    SyncStorage.set('oldUser', true)
    SyncStorage.set('ifSignedUp', true)
    let mapData = SyncStorage.get('mapData');
    props.getFriendsRequestList()
    if (mapData && mapData.id) {
      props.getMapFeed(mapData.id)
    }
    props.getProfile()
    SyncStorage.set('navigation', props.navigation);
      let allMap = SyncStorage.get('allMap')
      props.setMaps(allMap)
  },[])


  const closeOverlay = () => {
    props.hideOverlay()
  }

  
  const closeFavIcon = () => {
    console.log(props.map.isOpen, "kjsdhjjhs")
    if(props.map.isOpen === true){
      console.log('if')
      props.favIconIsOpen()
    }
  }

  // const _panResponder = React.useRef(
  //   PanResponder.create({
  //     onStartShouldSetPanResponder: () => {
  //       return true       
  //     },
  //     onMoveShouldSetPanResponder: () => true,
  //     onStartShouldSetPanResponderCapture: () => {
  //       // console.log('byeeeee')
  //       // if(props.map.isOpen === true){
  //       //   console.log('if')
  //       //   props.favIconIsOpen()
  //       // }
  //       return false
  //     },
  //     onPanResponderRelease: () => {
  //       console.log(props.map.isOpen, '...isOpen')
  //       if(props.map.isOpen === true){
  //         console.log('if')          
  //         props.favIconIsOpen()
  //       }
  //     },
  //     onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
  //       return gestureState.dx != 0 && gestureState.dy != 0;
  //     },
  //     onPanResponderTerminationRequest: () => true,
  //     onShouldBlockNativeResponder: () => false,
  //   }));

  const panResponder = React.useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => {
      return true
    },
    onMoveShouldSetPanResponder: () => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => {
      props.setClickCount()
      return false
    },
    onMoveShouldSetPanResponderCapture: () => false,
    onPanResponderTerminationRequest: () => true,
    onShouldBlockNativeResponder: () => false,
  }), [props.map.isOpen]);

  return (
    <>
    <Container style={styles.mainContainer} >
      <View scrollEnabled={false} style={styles.mainView} {...panResponder.panHandlers}>
        {(getswipe !== 0) && <FavIcon 
          //{...props} 
          clickCount={props.map.count}
          lang={props.uiControls.lang}
          currentMap={props.map.currentMap}
          getNearestSpots={props.getNearestSpots}
          isSliderOpen={props.map.isSliderOpen}
          favIconIsOpen={props.favIconIsOpen}
          isOpen={props.map.isOpen}
          userId={props.auth.userData.id}
          setCenterCord={props.setCenterCord}
          checked_in={props.auth.userData.checked_in}
          fetchingNearestSpot={props.map.fetchingNearestSpot}
          googleSpotList={props.map.googleSpotList}
          spot_details={props.map.mapDetail.spot_details}
        />}                
        {/* {props.map.isOpen && <TouchableWithoutFeedback onPress={() => closeOverlay()}>
          <View style={styles.overlay}></View>
        </TouchableWithoutFeedback>} */}
        <Maps 
          //{...props}  
          clickCount={props.map.count}        
          fncModalVisible={props.modalVisibale}
          mapDetail={props.map.mapDetail}
          centerCords={props.map.centerCords}
          modalVisible={props.uiControls.modalVisible }
          route={props.props.route}
          setMapDetail={props.setMapDetail}
          setCenterCord={props.setCenterCord }
          saveMapMarkerId={props.saveMapMarkerId}
          setSpotDetail={props.setSpotDetail}
          searchText={props.map.searchText}
          filters={props.map.filters}
          socket={props.socket}
          getSpecificMapDetail={props.getSpecificMapDetail}
          navigation={props.navigation}
          fetchingDetail={props.map.fetchingDetail}
          addSpotToFav={props.addSpotToFav}
          authLoading={props.auth.loading}
          map_marker_id={props.map.map_marker_id}
          removeToFav={props.removeToFav}
          favIconIsOpen={props.favIconIsOpen}
          getNearestSpots={props.getNearestSpots}
          currentMap={props.map.currentMap}
          fetchingAllMaps={props.map.fetchingAllMaps}
          allMaps={props.map.allMaps}
          DeleteMap={props.DeleteMap}
          getSuggestedSpot={props.getSuggestedSpot}
          updatingSuggestion={props.updatingSuggestion}
          suggestedSpot={props.map.suggestedSpot}
          updateHomemap={props.updateHomemap}
          getAllMaps={props.getAllMaps}
          fetchingNearestSpot={props.map.fetchingNearestSpot} 
          nearestSpotList={props.map.nearestSpotList} 
          googleSpotList={props.map.googleSpotList}
          userId={props.auth.userData.id}
          closeSlider={props.sliderClose}
          isSliderOpen={props.map.isSliderOpen}
          isShoutOpen={props.map.isOpen}
          toggleBar={toggleBar}  
          lang={lang}
          toggleValue={props.map.toggleValue}
          />          
        {/* { allMap && <TopSlideBar {...props}  /> } */}
      </View>       

      {barSide === 'left1' && <Animated.View  style={[styles.leftSlideAnimation, {left: leftSlideBar}]}>
        <LeftSlideBar 
          toggleBar={toggleBar} 
          barSide={barSide}
          lang={lang}
          spotDetail={props.map.spotDetail}
          setSpotDetail={props.setSpotDetail}
          weatherInfo={props.map.weatherInfo}
          map_name_local={props.map.mapDetail.map_name_local}
          onFilterSpots={props.onFilterSpots}
          filters={props.map.filters}
          onSearchSpots={props.onSearchSpots}
          spot_details={props.map.mapDetail.spot_details} 
					fetchingDetail={props.map.fetchingDetail} 
					searchText={props.map.searchText}
					addSpotToFav={props.addSpotToFav}
					setCenterCord={props.setCenterCord}
					setPageCount={props.setPageCount}
		 			page={props.map.page}
          getSpotMessage={props.getSpotMessage}
        />
      </Animated.View>}
      {barSide === 'right1' && <Animated.View  style={[styles.slideAnimation, {right: rightSlideBar} ]}>
        <RightSlideBar
          toggleBar={toggleBar} 
          barSide={barSide}
          lang={lang}
          currentMap={props.map.currentMap}
          searchPost={props.searchPost}
          navigation={props.navigation}
        />
      </Animated.View>}
    </Container>
    {/* {(getswipe !== 0) && <Slider 
        //toggleBar={toggleBar} 
        lang={lang}
        spot_details={props.map.mapDetail.spot_details}  
        setCenterCord={props.setCenterCord}
        setSpotDetail={props.setSpotDetail}
        getSpotMessage={props.getSpotMessage}
        //sliderClose={props.sliderClose}
        //sliderOpen={props.sliderOpen}
        //hideOverlay={props.hideOverlay}
      />} */}
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#ddd',
    flex: 1
  },
  mainView: {
    //height: height,
    flex: 1,
    //marginBottom: 50
  },
  slideAnimation: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    zIndex:1,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  leftSlideAnimation: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 1,
    overflow: 'hidden',
    flex: 1,
    backgroundColor: '#fff',
  },
  /*container: {
    flex: 1,
    zIndex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center'
  },
  dragHandler: {
    alignSelf: 'stretch',
    height: 64,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ccc'
  },*/
  btn: {
    position: 'absolute',
    top: 100,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    flex: 1,
    position: 'absolute',
    top: (Platform.OS === 'android' ? 0 : 50),
    bottom: -60,
    left: 0,
    right: 0,
    zIndex: 99
  }
});

export default Home;  



