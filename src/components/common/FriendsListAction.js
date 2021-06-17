import React from 'react';
	import {
	  StyleSheet,
	  View,
	  Text,
	} from 'react-native';
	import {Icon,Button} from 'native-base'
	import {primaryColor} from '../../redux/Constant'
	import FormatText from './FormatText'


	const FriendsListAction = (Props) => {
		return(
			<View style={styles.mainCon}>
				<View style={styles.actionCon}>
					<Icon type="FontAwesome5" name={'envelope'} style={styles.icon}/>
					<Text style={styles.text}><FormatText variable='common.send_msg' /></Text>
				</View>
				<View style={styles.actionCon}>
					<Icon type="FontAwesome5" name={'map-marker-alt'} style={styles.icon}/>
					<Text style={styles.text}><FormatText variable='common.go_to_loc' /></Text>
				</View>
			</View>
		)
	}

	const styles = StyleSheet.create({
		icon: {
			fontSize: 22,
			color: '#495057',
			minWidth: 35,
		},
		actionCon: {
			flexDirection: 'row',
			marginBottom: 20,
		},
		mainCon: {
			paddingHorizontal: 20,
		},
		text: {
			fontSize: 16,
			color: '#495057',
		}
	})

	export default FriendsListAction;