import React, { useRef, useEffect } from 'react';
import { View, StyleSheet,Text, Image, ScrollView, Dimensions,TextInput} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon,
} from 'native-base'
import Header from '../../components/common/Header';
import { connect } from 'react-redux';
import Ripple from 'react-native-material-ripple';
import { primaryColor } from '../../redux/Constant';
import FormatText from '../../components/common/FormatText'

const { width, height } = Dimensions.get('screen');

const EditImages = (props) => {
	return(
		<Container>
			<View style={styles.topBar}>
				<View style={styles.leftCon}>
					<Icon type="FontAwesome5" name={'arrow-left'} style={styles.backIcon}/>
					<Text style={styles.edit}><FormatText variable='feed.edit' /></Text>
				</View>
				<View style={styles.rightCon}>
					<Text style={styles.done}><FormatText variable='feed.done' /></Text>
				</View>
			</View>
			<Content>
				<View style={styles.imgCon} >
					<Icon type="FontAwesome5" name={'times'} style={styles.timesIcon}/>
      		<Image source = {require('../../assets/images/dummy1.jpeg')} style={styles.img} />
      		<TextInput style={styles.textInput}
          		placeholder="Add a caption..."
          		placeholderTextColor= "grey"
          	/>
      	</View>
      	<View style={styles.imgCon} >
					<Icon type="FontAwesome5" name={'times'} style={styles.timesIcon}/>
      		<Image source = {require('../../assets/images/dummy1.jpeg')} style={styles.img} />
      		<TextInput style={styles.textInput}
          		placeholder="Add a caption..."
          		placeholderTextColor= "grey"
          	/>
      	</View>
      	<Ripple style={styles.addCon} rippleContainerBorderRadius={20} 
        rippleColor="#aaa" 
        rippleOpacity={0.2} 
        rippleDuration={700} >
      		<Text style={styles.addText}>+ <FormatText variable='feed.add_photo' /></Text>
      	</Ripple>
			</Content>
		</Container>
	)
}

const styles=StyleSheet.create({
	topBar: {
		flexDirection: 'row',
		height: 50,
		alignItems: 'center',
		paddingHorizontal: 15,
		width: '100%'
	},
	backIcon: {
		fontSize: 20,
	},
	leftCon: {
		flexDirection: 'row',
		width: width-80,
	},
	edit: {
		fontSize: 17,
		fontWeight: '600',
		marginLeft: 15,
	},
	doneCon: {
		width: 80,
		justifyContent: 'flex-end'
	},
	done: {
		fontSize: 15,
		textTransform: 'uppercase',
	},
	imgCon: {
		marginBottom: 10,
	},
	img: {
		width: '100%',
	},
	textInput: {
		padding:10,
		color: '#000'
	},
	timesIcon: {
		position: 'absolute',
		zIndex: 9,
		color: '#fff',
		right: 15,
		top: 10,
		fontSize: 20,
	},
	addCon: {
		borderWidth: 1,
		borderColor: primaryColor,
		marginHorizontal: 20,
		justifyContent: 'center',
		alignItems: 'center',
		marginTop: 10,
		borderRadius: 20,
	},
	addText: {
		fontSize: 16,
		paddingVertical: 10,
		color: primaryColor,
	}
})

export default EditImages;