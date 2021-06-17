import React, { useRef, Component, useState}from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions, Modal
} from 'react-native';
import {
  Button,Icon
} from 'native-base'
import { primaryColor} from '../../redux/Constant';
import Ripple from 'react-native-material-ripple';
import {  convertText } from "../../redux/Utility";

const { width, height } = Dimensions.get('screen');

const PostFeed = (props) =>{
	return(
		<TouchableOpacity style={styles.mainCon} onPress={() => props.navigation.navigate('CreatePost')}>
			{/*<View style={styles.attachmentViewCon}>
				<View style={styles.attachmentView}>
	      	<Icon type="FontAwesome5" name={'image'}  style={styles.icon}/>
	      	<Icon type="FontAwesome5" name={'map-marker-alt'} style={styles.icon}/>
	      </View>
	      <View style={styles.attachmentView}>
	      	<Ripple style={styles.imgCon}>
	      		<View style={styles.overlay}>
	      		</View>
	      		<Icon type="FontAwesome5" name={'times'} style={styles.crossIcon}/>
            <Image source={require('../../assets/images/dummy.jpeg')} style={styles.img}/>  
          </Ripple>
          <Ripple style={styles.imgCon}>
	      		<View style={styles.overlay}>
	      		</View>
	      		<Icon type="FontAwesome5" name={'times'} style={styles.crossIcon}/>
            <Image source={require('../../assets/images/dummy.jpeg')} style={styles.img}/>  
          </Ripple>
	      </View>
      </View>*/}
			<View style={styles.searchBarCon}>
				<TextInput style={styles.searchBar}
	       		placeholder={convertText("sidebarcomp.whatsInMind", props.lang)}
						placeholderTextColor="grey"
						editable={false}
	      />
	      <Ripple style={styles.postBtn}>
	        <Icon type="FontAwesome5" name={'paper-plane'} style={styles.postBtnText}/>
	      </Ripple>
      </View>
      {/*<Text style={styles.stripe}>Spot Posts, Friend Checkins/Popups, User Posts</Text>*/}
		</TouchableOpacity>
	)
}

const styles = StyleSheet.create({
	mainCon: {
		width: '100%',
		//zIndex: 9999,
		//position: 'absolute',
		//top: 10
	},
	searchBarCon: {
		backgroundColor: '#f5f5f5',
		flexDirection: 'row',
		height: 50,
		alignItems: 'center',
		borderTopWidth: 1,
		borderColor: '#ddd',
		paddingHorizontal: 20,
		color: '#000'
	},
	searchBar: {
		width: width - 70,
	},
	postBtn: {
		width: 30,
		justifyContent: 'center',
		alignItems: 'center',
		height: 30,
		borderRadius: 15,
		overflow: 'hidden'
	},
	postBtnText: {
		color: primaryColor,
		fontSize: 18,
	},
	attachmentViewCon:{
		height: 100,
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: '#fff',
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
		borderBottomWidth: 0,
	},
	attachmentView: {		
		flexDirection: 'row',	
		marginBottom: 8,
	},
	icon: {
		fontSize: 20,
		color: primaryColor,
		marginRight: 10,
	},
	imgCon: {
		width:50,
		height: 50,
		marginRight: 5,
		borderRadius: 5,
		overflow: 'hidden',
	},
	img: {
		width: '100%',
		height: '100%',
	},
	overlay: {
		backgroundColor: '#000',
		opacity: 0.4,
		position: 'absolute',
		width: 50,
		height: 50,
		zIndex: 99,
	},
	crossIcon: {
		position: 'absolute',
		zIndex: 100,
		color: '#fff',
		fontSize: 12,
		right: 5,
		top: 4,
	},
	stripe: {
		backgroundColor: primaryColor,
		textAlign: 'center',
		paddingVertical: 8,
		color: '#fff'
	}
})

export default PostFeed;