import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';
import { Icon, Button } from 'native-base'
import { primaryColor } from '../../redux/Constant'

const moreFilters = [
	{
		title: 'Banks',
		value: 'bank',
		icon: 'university'
	},
	{
		title: 'Gas Station',
		value: 'gas_station',
		icon: 'gas-pump'
	},
	{
		title: 'Parking Lot',
		value: 'parking',
		icon: 'parking'
	},
	{
		title: 'Grocery',
		value: 'grocery',
		icon: 'shopping-cart'
	},
	{
		title: 'Post Office',
		value: 'post_office',
		icon: 'envelope'
	},
	{
		title: 'Hospital',
		value: 'hospital',
		icon: 'plus-square'
	}
]

const MoreFilters = (props) =>{

	const filterToggle = (value) => {
		props.onFilterSpots(value)
	}

	const isActive = (value) => {
		if ((props.filters).indexOf(value) !== -1) {
			return true
		}
	}

	return(
		<View>
			<View style={styles.optionSection}>
				{moreFilters.map((item, index) => {
					return 	<View style={styles.leftCon} key={index}>
										<TouchableOpacity style={[styles.button, isActive(item.value) && {backgroundColor: primaryColor}]} onPress={() => filterToggle(item.value)}>
											<Icon type="FontAwesome5" name={item.icon} style={styles.icon} />
					        		<Text style={styles.infoText}>{item.title}</Text>
					      		</TouchableOpacity>
					        </View>	
				})}
    	</View>
		</View>
	)
}

const styles = StyleSheet.create({	
	optionSection: {
		flexDirection: 'row',
		paddingTop: 20,
		flexWrap: 'wrap',
		alignItems: 'flex-start',
	},
	button: {
		width: 45,
		height: 45,
		borderRadius: 50,
		backgroundColor: '#71828D',
		alignItems: 'center',
		marginBottom: 20,
		justifyContent: 'center'
	},
	icon: {
		fontSize: 16,
		color: '#fff',
		top: 10
	},
	leftCon: {
		flexDirection: 'row',
		paddingLeft:20,
		width: '50%'
	},
	infoText: {
		color: '#71828D',
		fontSize: 16,
		fontWeight: '500',
		left: 75,
		width: 90,
		bottom: 10,
	}
})

export default MoreFilters