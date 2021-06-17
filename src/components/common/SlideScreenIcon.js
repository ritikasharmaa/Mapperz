import React from 'react';
import { View, StyleSheet } from 'react-native';
import {Icon,Button} from 'native-base'

const SlideScreenIcon = ({toggleBar}) => {
	return(
		<>
			<Button onPress={() => toggleBar(0, 'left')} style={styles.leftSlideButton}>
        <Icon type="FontAwesome5" name={'chevron-right'} style={styles.slideIcon} />
    	</Button>
			<Button onPress={() => toggleBar(0, 'right')} style={styles.rightSlideButton}>
        <Icon type="FontAwesome5" name={'chevron-left'} style={styles.slideIcon} />
    	</Button>
		</>
	)
}


const styles = StyleSheet.create({
	leftSlideButton: {
		height: 60,
		width:40,
		backgroundColor: '#fff',
		top: 250,
		position: 'absolute',
		borderRadius: 0,
		zIndex: 10
	},
	rightSlideButton:{
		height: 60,
		width:40,
		backgroundColor: '#fff',
    right: 0,
  	top: 250 ,
  	position: 'absolute',
		borderRadius: 0,
		zIndex: 10
	},
	slideIcon:{
		fontSize:16,
		color:'#000000',
	}
})

export default SlideScreenIcon