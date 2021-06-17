import React from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity } from 'react-native';
import {Icon,Button} from 'native-base'
import Header from '../common/Header'
const SidebarTitle = (props) =>{

	const convertKelvinToCelsius = (weatherData) => {
    let kelvin = weatherData.main && weatherData.main.temp
    if (!kelvin) {return ''}
    if (kelvin < (0)) {
      return '';
    } else {
      return parseInt(kelvin-273.15) + '℃';
    }
  }

  const renderWeatherImage = (weatherData) => {
  	let path = "http://openweathermap.org/img/w/" + (weatherData.weather && weatherData.weather[0].icon) + ".png"
  	return <Image source={{uri: path}} style={styles.wheatherIcon} />
  }

	return(
		<View style={styles.detailTop}>
			<View style={styles.topSection}>
				<View style={styles.leftSec}>
					<Text style={styles.topLeftText}>{props.title}</Text>
					<Text style={styles.bottomLeftText}>{props.subTitle}</Text>
				</View>
				<View style={styles.detailRightCon}>
					<Text style={styles.leftText}>{convertKelvinToCelsius(props.weatherInfo)}</Text>
					{renderWeatherImage(props.weatherInfo)}
				</View>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	detailTop:{
		
	},
	leftSec: {
		paddingRight: 100,
		width: '100%'
	},
	topSection:{
		paddingLeft: 15,
		width: '100%',
	},
	topLeftText: {
		fontSize: 15,
		fontWeight: '500',
  	color: '#000000',
  	textAlign: 'left'
	},
	detailRightCon:{
  	flexDirection: 'row',
  	position: 'absolute',
  	right: 10,
  	top: 8
	},
	leftText:{
		fontSize: 16,
		paddingRight: 10
	},
	rightImg:{
		fontSize: 20
	},
	bottomLeftText:{
		fontSize: 15,
		fontWeight: '600',
		color: '#999',
		marginTop: 3
	},
	wheatherIcon: {
		width: 40,
		height: 40,
		top: -10
	}
})

export default SidebarTitle