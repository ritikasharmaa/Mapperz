import React, { useState, useRef, useEffect, memo } from "react";
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Animated,
  TouchableOpacity,
  Dimensions,
  FlatList
} from "react-native";
import GestureRecognizer, {swipeDirections} from "react-native-swipe-gestures";
import { Icon, Button } from "native-base";
import SidebarTitle from "../SidebarComponents/SidebarTitle";
import Filters from "../SidebarComponents/Filters";
import MoreFilters from "../SidebarComponents/MoreFilters";
import SpotSearchBar from "../SidebarComponents/SpotSearchBar";
import SpotList from "../SidebarComponents/SpotList";
import FormatText from "../common/FormatText";
import SpotListDetail from "../SidebarComponents/SpotListDetail";


const { width, height } = Dimensions.get("screen");

const config = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};


const LeftSlideBarComp = (props) =>{
  let lang = props.lang

	const [optionOpened, setOptionOpened] = useState(false)
	const containerHeight = useRef(new Animated.Value(0)).current

	const containerPosition = useRef(new Animated.Value(width)).current
	const containerOpacity = useRef(new Animated.Value(0)).current

  const [timer, setTimer] = useState(true)

	const toggleMoreOptions = () => {		
		Animated.timing(
      containerHeight,
      {
        toValue: (optionOpened ? 0 : 200),
        duration: 200,
      }
    ).start();
    setOptionOpened(!optionOpened)
	}

	useEffect(() => {
		//openDetail()
	}, [props.spotDetail.id])

	const toggleDetail = (open) => {
		Animated.timing(
      containerPosition,
      {
        toValue: open ? (0) : (width),
        duration: 300,
      }
    ).start();

    Animated.timing(
      containerOpacity,
      {
        toValue: open ? (1) : (0),
        duration: 300,
      }
    ).start();

	}

	const selectSpot = (item) => {
		props.setSpotDetail(item)		
  }
  
  useEffect(() => {
    if (props.spotDetail && props.spotDetail.id) {
      setTimeout(() => {
        toggleDetail('open')
      }, 300);  
    }
  }, [props.spotDetail.id])

  useEffect(() => {
		if(props.barSide){
			let timerTimeout = null;
			timerTimeout = setTimeout(() => {
				setTimer(false)
			}, 5000)
		}
		
	}, [props.barSide])
  const TextMsg = () => {
		return <View style={styles.hintTextCon}>
    			   <Text style={styles.hintText}><FormatText variable='profile.swipe_left' /></Text>
    			  </View>

	}

	return(		
		<GestureRecognizer style={styles.barContainer} config={config} onSwipeLeft={() => props.toggleBar('', 'left')}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => props.toggleBar('', 'left', true)}>
          <Text style={styles.homeBtn}><FormatText variable='sidebar.home_map' /></Text>
          <Icon type="FontAwesome5" name={'chevron-right'} style={[styles.icon, styles.backBtnIcon]} />
        </TouchableOpacity>
      </View>
			<ScrollView style={styles.scrollContainer}>
				<SidebarTitle weatherInfo={props.weatherInfo} title={props.map_name_local}  />
				<Filters 
          toggleMoreOptions={toggleMoreOptions} 
          optionOpened={optionOpened} 
          lang={lang} 
          onFilterSpots={props.onFilterSpots}
          filters={props.filters}
        />
				<Animated.View style={[{overflow: 'hidden'}, {height: containerHeight}]}>
					<MoreFilters 
            onFilterSpots={props.onFilterSpots}
            filters={props.filters}
          />
				</Animated.View>
				<SpotSearchBar 
          onSearchSpots={props.onSearchSpots}
          lang={props.lang}/>
				<SpotList 
					spotList={props.spot_details} 
					fetchingDetail={props.fetchingDetail} 
					selectSpot={selectSpot} 
					searchText={props.searchText}
					filters={props.filters}
					addSpotToFav={props.addSpotToFav}
					setCenterCord={props.setCenterCord}
					toggleBar={props.toggleBar}
					setPageCount={props.setPageCount}
		 			page={props.page}
          lang={props.lang}
          getSpotMessage={props.getSpotMessage}
				/>				
    	</ScrollView>
    	<Animated.View style={[styles.detailContainer, {left: containerPosition, opacity: containerOpacity}]}>
    		<SpotListDetail 
          addSpotToFav={props.addSpotToFav} 
          closeBar={toggleDetail} 
          spotDetail={props.spotDetail} 
          lang={props.lang}
        />
    	</Animated.View>
      {timer && TextMsg()}
    	{/*<View style={styles.hintTextCon}>
    		<Text style={styles.hintText}><FormatText variable='profile.swipe_left' /> </Text>
    	</View>*/}
  	</GestureRecognizer>
  	
	)
}

const styles = StyleSheet.create({
  barContainer: {
    width: "100%",
    //paddingTop: 65,
    backgroundColor: "#F8F9FA",
    borderColor: "#EFEFF0",
    borderWidth: 1,
    flex: 1,
    zIndex: 10
  },
  scrollContainer: {
    paddingTop: 15,
    flex: 1,
  },
  hintTextCon: {
    position: "absolute",
    bottom: 60,
    width: "100%",
    left: 0,
    alignItems: "center",
  },
  hintText: {
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 10,
    borderRadius: 20,
    overflow: "hidden",
    paddingRight: 20,
    paddingLeft: 20,
  },
  detailContainer: {
    position: "absolute",
    top: 0,
    width: "100%",
    height: height - 80,
    backgroundColor: "#fff",
    zIndex: 10,
  },
  header: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    justifyContent: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    //borderTopWidth: 0.5,
    borderColor: '#aaa',
    paddingHorizontal: 15,
    zIndex: 99
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: '#aaa'
  },
  homeBtn: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 5
  },
});

const LeftSlideBar = memo(LeftSlideBarComp)

export default LeftSlideBar;
