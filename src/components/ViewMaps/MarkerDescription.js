import React, {useRef, useState, useEffect} from 'react';
import { View, StyleSheet,Text,Image,TouchableOpacity, Dimensions, TextInput } from 'react-native';
import Header from '../common/Header'
import { Icon, Button, Container, Content } from 'native-base'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import NoData from '../common/NoData'
import { renderImage } from '../../redux/Utility';
import moment from 'moment'

const { width, height } = Dimensions.get('screen');

const MarkerDescription = (props) =>{


  const renderData = () => {
    let index = props.item.findIndex(item => item.id === props.markerId)
    let data = props.item[index]
    if(props.markerId){
      return <View style={styles.mainCon}>
              <Text style={styles.heading}>{data.attname_local &&  data.attname_local }</Text>
              <Text style={styles.address}>{data.address}</Text>
              <Text style={styles.description}>{data.description}</Text>
              <Text style={styles.description}>{data.category}</Text>
            </View>
    }
    
  }

	return(
		<View>
        {renderData()}
    </View>
	)
}

const styles = StyleSheet.create({
	mainCon: {
		paddingHorizontal: 15,
		marginTop: 10,
	},
	heading: {
    fontSize: 20,
    marginBottom: 10
  },
  address: {
    fontSize: 18,
    marginBottom: 20
  },
  description: {
    fontSize: 15,
    marginBottom: 5
  }
})

export default MarkerDescription