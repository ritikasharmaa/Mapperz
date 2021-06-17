import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, TextInput } from 'react-native';
import {Icon,Button} from 'native-base'
import Header from '../common/Header'
import { convertText } from '../../redux/Utility'

const SpotSearchBar = (props) =>{

	const onSearch = (text) => {
		props.onSearchSpots(text)
	}

	return(
		<View style={styles.searchBar}>
			<View style={styles.searchBtn}>
				<Icon type="FontAwesome5" name={'bars'} style={styles.barIcon} />
				<TextInput 
  				style={styles.searchInput}
  				placeholder={convertText("sidebarcomp.search", props.lang)}
  				onChangeText={(text) => onSearch(text)}
  			/>
  			<Icon type="FontAwesome5" name={'search'} style={styles.searchIcon}/>
  			<Icon type="FontAwesome5" name={'directions'} style={styles.searchDirections}/>
      </View>
		</View>
	)
}

const styles = StyleSheet.create({
	searchBar:{
		paddingTop: 15,
		paddingBottom: 20,
		paddingLeft: 10,
		paddingRight: 10,
	},
	searchInput:{
		width: 200,
		height: 40,
		fontSize: 14,
		fontWeight: '600',
		color: '#92999F',
		paddingLeft: 20,
		color: '#000'
	},
	searchIcon:{
		color: '#92999F',
		fontSize: 16,
		position: 'absolute',
		right: 40
	},
	searchDirections:{
		fontSize: 18,
		color: '#4574E7',
		right: 10,
		position: 'absolute',
	},
	barIcon:{
		color:'#92999F',
		fontSize: 16,
		left: 10
	},
	searchBtn:{
		backgroundColor: '#fff',
		borderColor: '#E5E5E6',
		borderWidth: 2,
		borderRadius: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
})

export default SpotSearchBar