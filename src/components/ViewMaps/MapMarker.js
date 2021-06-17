import React, { useRef, memo } from 'react';
import { Animated, View, StyleSheet, Text, Platform, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base'

const mapImages = {
	'Restaurants' : '#f18278',
	'Others' : '#3cb44b',
	'Sweets': '#f032e6',
	'Fast Food': '#e61a4b',
	'Izakaya': '#4363d9',
	'Bar': '#a9a9a9',
	'Cafe': '#ffe11a',
	'Daily Goods': '#010075',
	'Food Items': '#911eb4',
	'Body Building': '#459990',
	'Liquer Shop': '#bfef45'
}

const genreIcons = {
	'Restaurants' : 'utensils',
	'Others' : 'star-of-life',
	'Sweets': 'cookie-bite',
	'Fast Food': 'hamburger',
	'Izakaya': 'glass-martini-alt',
	'Bar': 'glass-cheers',
	'Cafe': 'coffee',
	'Daily Goods': 'shopping-bag',
	'Food Items': 'utensils',
	'Body Building': 'dumbbell',
	'Liquer Shop': 'glass-whiskey'
}

const MapMarker = (props) => {

	const openSlider = (id) => {

		if(!props.baseMarker){
			props.togglePopover(id)
		}
	}

  const showNames = () => {
	  if(props.location &&  props.location.properties && props.location.properties.zoomLevel < 15){
		  <View style={styles.spotNameOut}>
				<Text numberOfLines={1} style={styles.spotName}>{props.data.attname_local}</Text> 
			</View>		  
	  } else{
		  return <View style={styles.spotNameOut}>
            <Text numberOfLines={1} style={styles.spotName}>{props.data.attname_local}</Text>
          </View>
	  }
  }

  return (
    <View style={[styles.markerCon]}>
	    <Animated.View
	    	style={
	    			[
	    				styles.markerConOutter, 
	    				//props.location && props.location.properties.zoomLevel >=19 && {height: 40, width: 40},
	    				props.data && {backgroundColor: (mapImages[props.data.category] ? mapImages[props.data.category] : 'red')}, 
	    				//props.baseMarker && {backgroundColor: '#f03800', height: 35, width: 35},
	    				props.active && {height: 35, width: 35}
	    			]
	    		}
	    	>
	    	<TouchableOpacity onLongPress={() => alert('open')}  onPress={() => openSlider(props.data.id)} >
	    		<View style={
		    			[
		    				styles.innerCon, 
		    				(props.active) && {width: 22, height: 22},
		    				//props.location && props.location.properties.zoomLevel >=19 && {height: 25, width: 25},
		    			]
		    		}
	    		>
	    		{props.data &&	<Icon type="FontAwesome5" name={genreIcons[props.data.category] ? genreIcons[props.data.category] : "atom"} style={[styles.icon, {color: mapImages[props.data.category]}]} />}
	    		</View>
	    		{/* {props.baseMarker && <View style={styles.markerLine}></View>} */}
	    	</TouchableOpacity>
	    </Animated.View>
		  {showNames()}
    </View>
  );
}

const styles = StyleSheet.create({
	markerConOutter: {
		width: 30, 
		height: 30, 
		borderColor: '#000', 
		borderTopLeftRadius: 30, 
		borderTopRightRadius: 40, 
		borderBottomLeftRadius: 40,
		transform: [{rotate: (Platform.OS === 'ios') ? '45deg' : (3.14159/4)+'rad'}],
		transform:[{rotate: '45deg'}],
		backgroundColor: '#f9bd00',
		marginTop:Platform.OS === 'ios' ? 0 : 30,
		marginBottom:Platform.OS === 'ios' ? 0 : 30,
		overflow: 'hidden',
	},
	innerCon: {
		width: 20,
		height: 20,
		borderRadius: 30,
		borderColor: '#000',
		position: 'absolute',
		left: 4,
		top: 4,
		backgroundColor: '#fff',
		overflow: 'hidden',
		zIndex: 1,
		justifyContent: 'center',
		alignItems: 'center'
	},
	markerImage: {
		width: 30,
		height: 40
	},
	markerCon: {
	 transform: [{rotate: (Platform.OS === 'android') ? '45deg' :'0deg'}],
	 width: 80,
	 paddingLeft: 23
	},
	imgCon: {
		width: 19,
		height: 19,
		borderRadius: 20,
		backgroundColor: '#fff',
		position: 'absolute',
		left: 5,
		top: 5,
		zIndex: 10000,
		overflow: 'hidden',
	},
	mapMarkerImage: {
		width: '100%',
		height: '100%',
		
	},
/*	baseMarkerText: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		height: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 20,
		textAlign: 'center',
		zIndex: 1000
	},*/
		calloutArrow: {
		position: 'absolute',
		width: 12,
		height: 12,
		bottom: -6,
		left: 60,
		backgroundColor: '#fff',
		transform: [
			{rotate: '-45deg'}
		],
	},
	tipText: {
		borderRadius: 50,
		zIndex: 10,
		fontSize: 10
	},
	infoCon: {
		width: 200,
		height: 80,
		backgroundColor: '#fff',
		flexDirection: 'row',
		position: 'absolute',
		bottom: 50,
		left: -50,
	},
	locationImg: {
		width: 60,
		height: '100%',
		zIndex: 9,
	},
	img: {
		width: '100%',
		height: '100%'
	},
	loactionInfo: {
		width: 140,
		padding: 5,
		zIndex: 9,
	},
	name: {
		fontSize: 12,
		marginBottom: 5
	},
	address: {
		fontSize: 12,
		marginBottom: 5
	},
	distance: {
		fontSize: 11,
	},
	markerLine: {
		width: 100,
		height: 6,
		backgroundColor: '#00a66c',
		position: 'absolute',
		top: 15
	},
	icon: {
		fontSize: 10,
		transform: [{rotate: '-45deg'}]
	},
	spotNameOut:{
		backgroundColor: '#fff',
		width: 80,
		padding: 2,
		display:'flex',
		alignItems:'center',
		justifyContent:'center',
		overflow: 'hidden',
		marginTop: (Platform.OS === 'android') ? -20 : 7,
		marginLeft: -23 ,
		borderRadius: 5,
	},
	spotName: {
		fontSize: 12,
		color:'black',
	},  
})

export default memo(MapMarker);