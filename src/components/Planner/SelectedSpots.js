import React from 'react';
import { View, StyleSheet,Text,Image,TouchableOpacity,ScrollView, Dimensions } from 'react-native';
import {Icon,Button, Container, Content} from 'native-base'
import Header from '../common/Header'
import Ripple from 'react-native-material-ripple';
import NoData from '../common/NoData'
import { renderImage } from '../../redux/Utility';

const { width, height } = Dimensions.get('screen');

const SelectedSpots = (props) =>{


	return(
		<ScrollView showsVerticalScrollIndicator={true} style={styles.mainCon}>
			<TouchableOpacity activeOpacity={1}>
				{!props.spots.length ?
					<View style={styles.noData}>
						<NoData />
					</View>
					:
					(props.spots.map((item, index) => {
						return 	<View key={index} rippleDuration={700} rippleColor="#999" style={styles.spot}>
											<View style={styles.imgCon}>
												<Image style={styles.img} source = {renderImage(item.image || item.img_url, 'spot')} />
											</View>
											<View style={styles.detailCon}>
												<Text style={styles.heading}>{item.attname || item.name}</Text>
												{item.genre && <Text style={styles.subText}>{item.genre}</Text>}
											</View>
											<Icon type="FontAwesome5" name={'times'} style={styles.crossIcon} onPress={() => props.removeSpot(item)} />
										</View>
					}))
				}
				
			</TouchableOpacity>
		</ScrollView>
	)
}

const styles = StyleSheet.create({
	mainCon: {
		flex: 1,
		width: '100%',
	},
	spot: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderColor: '#ddd',
		paddingVertical: 10,
		paddingHorizontal: 15,
	},
	imgCon: {
		width: 50,
		height: 50,
		borderRadius: 10,
		overflow: 'hidden',
		backgroundColor: '#f5f5f5',
		borderWidth: 1,
		borderColor: '#ccc'
	},
	img: {
		width: '100%',
		height: '100%',
	},
	detailCon: {
		paddingLeft: 10,
		width: width - 100,
	},
	heading: {
		fontSize: 16,
		fontWeight: '600',
		marginBottom: 3,
	},
	crossIcon: {
		fontSize: 18,
		position: 'absolute',
		right: 15,
		top: 20,
		zIndex: 10,
		width: 30,
		height: 30,
		alignItems: 'center',
		justifyContent: 'center',
		textAlign: 'center',
		padding: 6
	},
	noData: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	noDataText: {
		fontSize: 20
	}
})

export default SelectedSpots;