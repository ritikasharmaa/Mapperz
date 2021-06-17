import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import {Icon,Button} from 'native-base'
import Header from '../common/Header'
import Ripple from 'react-native-material-ripple';
import { primaryColor } from '../../redux/Constant'
import FormatText from '../common/FormatText'
import { convertText } from '../../redux/Utility'


const Filter = (props) =>{
	const filters = [
		{
			title: convertText("sidebarcomp.eat", props.lang),
			value: 'Restaurants',
			icon: 'utensils',
			color: '#BE5854'
		},
		{
			title: convertText("sidebarcomp.hotel", props.lang),
			value: 'hotel',
			icon: 'bed',
			color: '#C55591'
		},
		{
			title: convertText("sidebarcomp.bar", props.lang),
			value: 'Bar',
			icon: 'glass-cheers',
			color: '#DEA461'
		},
		{
			title: convertText("sidebarcomp.cafe", props.lang),
			value: 'Cafe',
			icon: 'coffee',
			color: '#7C5B3D'
		}
	]
	const filterToggle = (value) => {
		props.onFilterSpots(value)
	}

	const isActive = (value) => {
		if ((props.filters).indexOf(value) !== -1) {
			return true
		}
	}

	return(
		<View style={styles.detailTop}>
			<View style={styles.viewInfo}>
				{filters.map((item, index) => {
					return 	<TouchableOpacity style={styles.innerElement} key={index} onPress={() => filterToggle(item.value)}>
										<View style={[styles.ButtonCon,{backgroundColor: item.color}, isActive(item.value) && {backgroundColor: primaryColor}]}>
											<Icon type="FontAwesome5" name={item.icon} style={styles.btnIcon} />
					      		</View>
					      		<Text style={styles.infoText}>{item.title}</Text>
					      	</TouchableOpacity>
				})}

    		<TouchableOpacity style={styles.innerElement} onPress={() => props.toggleMoreOptions()}>
      		<View style={[styles.ButtonCon, {backgroundColor: '#71828D'}]}>
          		<Icon type="FontAwesome5" name={props.optionOpened ? 'chevron-up' : 'ellipsis-h'} style={styles.btnIcon} />
      		</View>
      		<Text style={styles.infoText}><FormatText variable='sidebarcomp.more' /></Text>
      	</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	detailTop: {
		borderBottomWidth:1,
    	borderBottomColor: '#E5E5E6',
	},
	viewInfo: {
		width: '100%',
	  	flexDirection: 'row',
	  	flexWrap: 'nowrap',
	  	paddingTop: 25,
	  	paddingBottom: 20,
	},
	infoText: {
		fontSize: 14
	},
	ButtonCon: {
		width: 45,
		height: 45,
		borderRadius: 50,
		backgroundColor: '#C55591',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10
	},
	btnIcon: {
		color: '#fff',
		fontSize: 16
	},
	innerElement: {
		flex: 1,
		alignItems: 'center'
	}
})

export default Filter