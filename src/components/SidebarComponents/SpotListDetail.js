import React, {useRef, useEffect} from 'react';
import { View, StyleSheet, Text, Image, TextInput, Dimensions, ImageBackground, ScrollView, TouchableOpacity, Linking } from 'react-native';
import {Icon,Button, Container, Content, Card, CardItem} from 'native-base'
import Ripple from 'react-native-material-ripple';
import ContentLoader from '../common/ContentLoader'
import { primaryColor} from '../../redux/Constant';
import NoData from '../common/NoData'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import moment from 'moment'
import { WebView } from 'react-native-webview';
import FormatText from '../common/FormatText'
import {  convertText } from "../../redux/Utility";
import axios from 'axios'
import Geolocation from 'react-native-geolocation-service';
import { getPreciseDistance } from 'geolib';
import {language} from "../../redux/Utility"


const { width, height } = Dimensions.get('screen');



const SpotListDetail = (props) => {

	let lang = props.lang

	const renderMessage = () => {
		if(props.spotDetail.messages && props.spotDetail.messages.length){
			return <View>
							<Text style={styles.heading}><FormatText variable='sidebarcomp.messages' /></Text>
							{props.spotDetail.messages.map((item, index) => {
								return (index % 2) ? 
				                <View key={index} style={[styles.msgCon, {backgroundColor: 'lightgrey'}]}>
				                  <Text style={[styles.msg, {color: '#fff'}]}>{item.content}</Text>
				                </View>
				                :
				                <View key={index} style={[styles.msgCon]}>
				                  <Text style={styles.msg}>{item.content}</Text>
				                </View>
							})}
							</View>
		} else {
			return <NoData title={convertText("sidebarcomp.noMessages", props.lang)} />
		}
	}

	const renderPhotos = () => {
		if (props.spotDetail.photos && props.spotDetail.photos.length) {
			return <>
				<Text style={styles.eventHeading}><FormatText variable='sidebarcomp.photos' /></Text>
				<ScrollView showsHorizontalScrollIndicator={false} horizontal={true} >
					{props.spotDetail.photos.map((item, index) => {
						return 	<Ripple 
											rippleOpacity={0.5} 
					          	rippleDuration={600} 
					          	rippleColor={'#fff'}
					          	style={styles.eventDetail} 
					          	key={index}
					          >
											<Image style={styles.img} source={{uri: item.photo}}/>
											<Text style={[styles.event, styles.eventName]}>{item.heading}</Text>
											<View style={styles.overlay}></View>
										</Ripple>
		 			})}
				</ScrollView>
			</>
		} else {
			return <NoData title="No Photos" />
		}
	}

	const renderCheckinHistory = () => {
		if (props.spotDetail.checkin_history && props.spotDetail.checkin_history.length) {
			return <>
				<Text style={styles.eventHeading}><FormatText variable='sidebarcomp.checkin_history' /></Text>
					{props.spotDetail.checkin_history.map((item, index) => {
						return 	<View style={styles.checkingCon} key={index}>
											<Text style={[styles.checkingName]}>{item.user_name}</Text>
											<Text style={styles.checkingTime}>{moment(item.date_time).format('DD/MM/YYYY hh:mm')}</Text>
											<Text style={styles.timeSpent}>{item.minutes + ' Minutes'}</Text>
										</View>
					})}
			</>
		} else {
			return <NoData title="No Checkings" />
		}
	}

	const claimThisBussiness = () => {
		//Linking.openURL('https://www.travelz.jp/ja/operators/sign_up')
		Linking.openURL('https://www.mapperz.jp//ja/operators/sign_up')
	}


	const getLink = () => {
		if (props.spotDetail.img_copyright) {
			let splitedLink = props.spotDetail.img_copyright.split('"')
			return splitedLink[1]
		}
	}

	const getLinkText = () => {
		if (props.spotDetail.img_copyright) {
			let splitedtext = props.spotDetail.img_copyright.split('</')
			let text = splitedtext[0].split('>')
			return text[1]	
		}
	}
	return(
		<>
			<TouchableOpacity style={styles.crossBtn} onPress={() => props.closeBar()}>
      	<Icon type="FontAwesome5" name={'arrow-left'} style={[styles.icon, styles.backBtn]} />
      </TouchableOpacity>
			<ParallaxScrollView
	      parallaxHeaderHeight={300}
	      contentBackgroundColor="transparent"
	      renderBackground={() => (
	              <View key="background">
	                {props.spotDetail.img_url && <Image source={{uri: props.spotDetail.img_url}} style={{width: '100%', height: '100%'}}/>}
		            </View>
	            )}
	      renderForeground={() => (
			  props.spotDetail.img_url && props.spotDetail.img_copyright &&
				  <View style={styles.copyrightLink}>
	          <Text style={styles.linkText}
				 onPress={() => Linking.openURL(getLink())}>
					 Copyright: {getLinkText()}
						</Text>
	        </View>
	      )}
	      >
	      <ScrollView>
					<View style={styles.spotDetailCon}>
						<View style={styles.spotCon}>							
							<Text style={styles.spotName}>{language(lang, props.spotDetail.attname, props.spotDetail.attname_local)}{props.spotDetail.attname_local}</Text>
							<Text style={styles.spotType}>{language(lang, props.spotDetail.category, props.spotDetail.categoryJa)}</Text>
						</View>
						<View style={styles.actionList}>
							<View style={styles.actionItems}>
								<View style={styles.actionIcon}>
									<Icon type="FontAwesome5" name={'directions'} style={styles.icon} />
								</View>
								<Text style={styles.iconText}><FormatText variable='sidebarcomp.direction' /></Text>
							</View>
							<TouchableOpacity style={styles.actionItems} onPress={() => props.addSpotToFav({id:props.spotDetail.id, type:'Spot'})}>
								<View style={[styles.actionIcon, !props.spotDetail.isFav && {backgroundColor: 'gray'}]}>
									<Icon type={props.spotDetail.isFav ? "FontAwesome" : "FontAwesome5"} name={'heart'} style={styles.icon} />
								</View>
								<Text style={[styles.iconText, !props.spotDetail.isFav && {color: 'gray'}]}><FormatText variable='sidebarcomp.favourite' /></Text>
							</TouchableOpacity>	
							<TouchableOpacity style={styles.actionItems} onPress={() => claimThisBussiness()}>
								<Icon type="FontAwesome5" name={'shield-alt'} style={styles.iconInfoBuss} />
								<Text style={[styles.iconText, styles.iconTextBuss]}><FormatText variable='sidebarcomp.claim_this' /></Text>
							</TouchableOpacity>
							{/*<View style={styles.actionItems}>
								<View style={styles.actionIcon}>
									<Icon type="FontAwesome5" name={'share-alt'} style={styles.icon} />
								</View>
								<Text style={styles.iconText}>Share</Text>
							</View>*/}
						</View>
						<View style={styles.info}>
							{props.spotDetail.website && 
									<View style={styles.infoCon}>
										<Icon type="FontAwesome5" name={'globe'} style={styles.iconInfo} />
										<Text style={styles.infoText}>{props.spotDetail.website}</Text>
									</View>
							}
							{props.spotDetail.phone &&
								<View style={styles.infoCon}>
									<Icon type="FontAwesome5" name={'phone'} style={styles.iconInfo} />
									<Text style={styles.infoText}>{props.spotDetail.phone}</Text>
								</View>
							}
							{props.spotDetail.open_hours &&
								<View style={styles.infoCon}>
									<Icon type="FontAwesome5" name={'clock'} style={styles.iconInfo} />
									<Text style={styles.infoText}>{props.spotDetail.open_hours}</Text>
								</View>
							}							
						</View>
					</View>
					<View style={{backgroundColor: '#ddd', paddingVertical: 6}}>
						<Card style={styles.eventCon}>
							{renderMessage()}					
						</Card>
						<Card style={styles.eventCon}>
							{renderPhotos()}
						</Card>
						<Card style={[styles.eventCon, styles.marginBottom]}>
							{renderCheckinHistory()}
						</Card>
					</View>
				</ScrollView>
	    </ParallaxScrollView>
    </>
	)
}

const styles = StyleSheet.create({
	imgCon: {
		width: '100%',
		height: 300,
		position: 'absolute',
		top: 0,
	},
	img: {
		width: '100%',
		height: '100%',
	},
	backBtn: {
		padding: 10,
		
		backgroundColor: 'rgba(0, 0, 0, .6)',
		borderRadius: 20,
		overflow: 'hidden',
		margin: 10,
	},
	crossBtn: {
		position: 'absolute',
		top: 40,
		zIndex: 20
	},
	spotDetailCon: {
		paddingHorizontal: 15,
		backgroundColor: '#fff',
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	spotCon: {
		paddingVertical: 10,
	},
	spotName: {
		fontSize: 16,
	},
	spotType: {
		fontSize: 15,
		paddingVertical: 5,
	},
	actionList: {
		flexDirection: 'row',
		marginTop: 10,
	},
	actionIcon: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 20,
		backgroundColor: primaryColor,
	},
	icon: {
		fontSize: 18,
		color: '#fff',
	},
	iconText: {
		color: primaryColor,
		marginTop: 5,
		fontSize: 13
	},
	actionItems: {
		alignItems: 'center',
		justifyContent: 'center',
		width: 65,
		marginRight: 20
	},
	infoCon: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 10,
	},
	info: {
		marginVertical: 20,
	},
	iconInfo: {
		color: primaryColor,
		fontSize: 16,
		marginRight: 10,
	},
	infoText: {
		fontSize: 16,
	},
	eventCon: {
		marginVertical: 10,
		paddingVertical: 15,
		paddingLeft: 10,
	},
	eventHeading: {
		fontSize: 18,
		marginBottom: 15,
	},
	eventDetail: {
		width: 140,
		height: 90,
		borderRadius: 10,
		overflow: 'hidden',
		marginRight: 10,
	},
	event: {
		position: 'absolute',
		color: '#fff',
		fontWeight: '400',
		left: 8,
		zIndex: 99,
	},
	eventName: {
		top: 6,
	},
	eventTiming: {
		bottom: 10
	},
	overlay: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		width: '100%',
		height: '100%',
		position: 'absolute',
	},
	checkingCon: {
		borderBottomWidth: 1,
		borderColor: '#f1f1f1',
		paddingVertical: 10,
		width: '100%',
	},
	checkingName: {
		marginBottom: 5
	},
	checkingTime: {
		color: '#aaa'
	},
	timeSpent: {
		backgroundColor: primaryColor,
		color: '#fff',
		position: 'absolute',
		right: 10,
		top: 16,
		paddingVertical: 2,
		paddingHorizontal: 5,
		borderRadius: 4,
		overflow: 'hidden'
	},
	copyrightLink: { 
		height: 20, 
		flex: 1, 
		alignItems: 'flex-end', 
		justifyContent: 'flex-end',
	},
	linkText: {
		color: '#fff',
		backgroundColor: 'rgba(0,0,0,0.5)',
		width: '100%',
		textAlign: 'right',
		paddingVertical: 5,
		paddingRight: 10
	},
	msgCon: {
    backgroundColor: '#f1f1f1',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
  },
  msg: {
    padding: 10,
    color: '#565658'
  },
  heading: {
  	fontSize: 15
  },
  iconInfoBuss: {
	color: primaryColor,
	width: 40,
	height: 40,
	justifyContent: 'center',
	alignItems: 'center',
	borderRadius: 20,
	top:20
},
iconTextBuss:{
	marginTop:20
}
})

export default SpotListDetail
