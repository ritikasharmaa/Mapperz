import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import FormatText from './FormatText'


const PostAction = (props) => {
	return(
		<View style={styles.mainCon}>
			<TouchableOpacity style={[styles.actionCon, {opacity: 0.2}]} disabled>
				<Icon type="FontAwesome5" name={'share-square'} style={styles.icon}/>
				<Text style={styles.text}><FormatText variable='common.share_post' /></Text>
			</TouchableOpacity>
			<TouchableOpacity  style={[styles.actionCon, {opacity: 0.2}]} disabled>
				<Icon type="FontAwesome5" name={'eye-slash'} style={styles.icon}/>
				<Text style={styles.text}><FormatText variable='common.hide_post' /></Text>
			</TouchableOpacity>
			<TouchableOpacity style={[styles.actionCon, {opacity: 0.2}]} disabled>
				<Icon type="FontAwesome5" name={'share-alt'} style={styles.icon}/>
				<Text style={styles.text}><FormatText variable='common.share_on_fb' /></Text>
			</TouchableOpacity>
			
			{props.currentItem.post_owner && 
				<View>
					<TouchableOpacity style={[styles.actionCon]} onPress={() => props.onDelete()}>
						<Icon type="FontAwesome5" name={'trash'} style={styles.icon}/>
						<Text style={styles.text}><FormatText variable='common.delete_post' /></Text>
					</TouchableOpacity>
				</View>
			}
		</View>
	)
}

const styles = StyleSheet.create({
	icon: {
		fontSize: 20,
		color: '#495057',
		minWidth: 35,
	},
	actionCon: {
		flexDirection: 'row',
		marginBottom: 30,
	},
	mainCon: {
		paddingHorizontal: 20,
	},
	text: {
		fontSize: 16,
		color: '#495057',
	}
})

export default PostAction;