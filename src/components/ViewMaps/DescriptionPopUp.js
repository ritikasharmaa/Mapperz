import React, { Component } from 'react'
import { StyleSheet, View, Text, PermissionsAndroid, Animated, Image, Platform , Dimensions, TouchableOpacity} from "react-native"
import MapboxGL from "@react-native-mapbox-gl/maps";

const { width, height } = Dimensions.get("screen");

export class DescriptionPopUp extends Component {
	constructor(props) {
    super(props);

    this.state = {
      latitude: null,
      longitude: null,
	  error: null,
	  containerPosition: new Animated.Value(width),
	  containerOpacity: new Animated.Value(0)
  
    };
  }

  componentDidMount() {
	  this.props.map.spotDetail.id
  }
  distance = (lat2, lon2) => {

  	let lat1 = this.state.latitude
  	let lon1 = this.state.longitude
  	if ((lat1 == lat2) && (lon1 == lon2)) {
			return 0;
		}
		else {
			var radlat1 = Math.PI * lat1/180;
			var radlat2 = Math.PI * lat2/180;
			var theta = lon1-lon2;
			var radtheta = Math.PI * theta/180;
			var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
			if (dist > 1) {
				dist = 1;
			}
			dist = Math.acos(dist);
			dist = dist * 180/Math.PI;
			dist = dist * 60 * 1.1515;
			return dist
			//distance = dist;
		}
    /*var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515*/
  //  if (unit=="K") { dist = dist * 1.609344 } 
  //  if (unit=="M") { dist = dist * 0.8684 }
    
	}
	
	selectSpot(item) {
		this.props.setSpotDetail(item)
	}

	render() {
		return ( 
			<>
				<TouchableOpacity onPress={() =>{this.props.toggleBar(0, 'left'); this.selectSpot(this.props.data);}} style={styles.infoCon}>
					<View style={styles.locationImg}>
				{this.props.data.img_url && <Image source={{uri: this.props.data.img_url}} style={styles.img}/>} 
					</View>
				{this.props.data.registered ? 
				<View style={styles.loactionInfo}>
						<Text numberOfLines={1} style={styles.name}>{this.props.data.last_sent_message}</Text>
						<Text numberOfLines={2} style={styles.address}>{this.props.data.last_sent_message_at}</Text>
						<Text style={styles.distance}>{this.distance(this.props.data.latitude, this.props.data.longitude)}</Text>
					</View>
						 :
					 <View style={styles.loactionInfo}>
					<Text numberOfLines={1} style={styles.name}>{this.props.data.attname_local || this.props.data.attname}</Text>
					</View>}	
				</TouchableOpacity>	
				<View style={styles.calloutArrow}></View> 
				</>
		)
	}
}

const styles = StyleSheet.create({
  infoCon: {
		width: 200,
		height:(Platform.OS === 'android'? 100 : 90),
		backgroundColor: '#fff',
    	flexDirection: 'row',
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
		top:(Platform.OS === 'android'? 10 : 0)
  },
  name: {
		fontSize: 15,
		marginBottom: 5,
		fontWeight:"bold",
		marginTop:5
	},
	address: {
		fontSize: 12,
		marginBottom: 5
	},
	distance: {
		fontSize: 11,
  },
  calloutArrow: {
    position: 'absolute',
		width: 12,
		height: 12,
		bottom: -5,
		left: '50%',
		marginLeft: -6,
		backgroundColor: '#fff',
		transform: [
			{rotate: '-45deg'}
		],
	},
})
export default DescriptionPopUp
