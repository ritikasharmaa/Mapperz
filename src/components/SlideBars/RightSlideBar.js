import React, {useEffect, useState, useRef, memo} from 'react';
import { View, StyleSheet,Text, Image, ScrollView, Dimensions, TouchableOpacity,TextInput} from 'react-native';
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Feed from '../SidebarComponents/Feed';
import PostFeed from '../SidebarComponents/PostFeed';
import FormatText from '../common/FormatText'
import Toast from 'react-native-root-toast';
import { primaryColor} from '../../redux/Constant';
import {
  Button,Icon
} from 'native-base'

const config = {
	velocityThreshold: 0.3,
	directionalOffsetThreshold: 80
};
const { width, height } = Dimensions.get('screen');

const RightSlideBar = (props) => {

const [timer, setTimer] = useState(true)
const [searchBar, setSearchBar] = useState(false)
const [searchText, setSearchText] = useState('')
	
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
			   <Text style={styles.hintText}><FormatText variable='profile.swipe_right' /></Text>
			  </View>
	}	

	const openSearchBar = () => {
		setSearchBar(true)
	}

	const onChange = (text) => {
		setSearchText(text)
		let threadId = props.currentMap
		props.searchPost(text, threadId, "Mapper")
	}

	const goToHome = () => {
		props.toggleBar('', 'right', true)
		setSearchBar(false)
	}

	return(
		<GestureRecognizer style={styles.barContainer} config={config} onSwipeRight={() => props.toggleBar('', 'right')}>
			<View style={styles.header}>
				<TouchableOpacity style={styles.backBtn} onPress={() => goToHome()}>
					<Icon type="FontAwesome5" name={'chevron-left'} style={[styles.icon, styles.backBtnIcon]} />
					<Text style={styles.homeBtn}><FormatText variable='sidebar.home_map' /></Text>
				</TouchableOpacity>
				<View style={styles.backBtn}>
					{searchBar && <View>
						<View style={styles.searchBar} >
							<TextInput style={styles.text}
		            placeholder="Search"
		            placeholderTextColor= 'grey'
		            onChangeText={text => onChange(text)}
		            value={searchText}
		            editable={true}
		          />
	          </View>
	          <TouchableOpacity style={styles.cross} onPress={() => setSearchText('')}>
	          	<Icon type="FontAwesome5" name={'times'} style={[styles.crossIcon]} />
	          </TouchableOpacity>
          </View>}
          <TouchableOpacity style={[styles.rightBtn]} onPress={() => openSearchBar()}>
						<Icon type="FontAwesome5" name={'search'} style={[styles.icon, styles.searchbtn ]} />
					</TouchableOpacity>
				</View>
			</View>
			<Feed navigation={props.navigation} lang={props.lang}/>
			{timer && TextMsg()}    	
		</GestureRecognizer>
	)
}

const styles = StyleSheet.create({
	barContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
	},
	header: {
		width: '100%',
		height: 50,
		backgroundColor: '#fff',
		justifyContent: 'space-between',
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 0.5,
		borderColor: 'grey',
		paddingHorizontal: 15,
		paddingTop: 2,
		zIndex: 1000
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
		marginLeft: 5
	},
	searchBar: {
		width: 250,
		borderRadius: 20,
		overflow: 'hidden'
	},
	rightBtn: {
		marginLeft: 10,
	},
	text: {
		backgroundColor: '#f5f5f5',
		paddingHorizontal: 15,
		paddingVertical: (Platform.OS === 'android' ? 5 : 10),
		paddingRight: 30,
		color: '#000'
	},
	hintTextCon: {
		position: 'absolute',
		bottom: 90,
		width: '100%',
		left: 0,
		alignItems: 'center',
	},
	hintText: {
		color: '#fff',
		backgroundColor: 'rgba(0,0,0,0.5)',
		padding: 10,
		borderRadius: 20,
		overflow: 'hidden',
		paddingRight: 20,
		paddingLeft: 20
	},
	cross: {
		position: 'absolute',
		right: 10,
		top: 12
	},
	crossIcon: {
		fontSize: 12,
		color: '#aaa'
	}
	
})

export default memo(RightSlideBar)