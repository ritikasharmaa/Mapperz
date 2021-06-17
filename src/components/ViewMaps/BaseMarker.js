import React, { useRef, useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Platform,
} from "react-native";
import { primaryColor, secondColor } from "../../redux/Constant";
import { Icon } from 'native-base'

const BaseMarker = (props) => {

  const [count, setCount] = useState(0)

  useEffect(() => {
    setTimeout(() => {
      setCount(count+1)
    }, 4000)   
  }, [])

  return (
    <View style={styles.mainCon}>
      <View style={styles.markerOuterCon}>
        <View style={styles.innerCon}>
          <Icon type="FontAwesome5" name={'location-arrow'} style={styles.btnIcon} />
        </View>
      </View>
    </View>
  ) 
}


const styles = StyleSheet.create({
  img: {
    flex: 1,
    resizeMode: 'cover',
    width: 35,
    height: 45
  },
  markerOuterCon: {
    width: 34,
    height: 34,
		borderTopLeftRadius: 30, 
		borderTopRightRadius: 40, 
		borderBottomLeftRadius: 40,
		//transform: [{rotate: (Platform.OS === 'ios') ? '45deg' : (3.14159/4)+'rad'}],
		transform:[{rotate: '45deg'}],
		backgroundColor: secondColor,
		marginTop:Platform.OS === 'ios' ? 0 : 30,
		marginBottom:Platform.OS === 'ios' ? 0 : 30,
		overflow: 'hidden',
  },
  innerCon: {
    width: 22,
		height: 22,
		borderRadius: 30,
		borderColor: '#000',
		position: 'absolute',
		left: 5,
		top: 5,
		backgroundColor: primaryColor,
		overflow: 'hidden',
		zIndex: 1,
		justifyContent: 'center',
		alignItems: 'center'
  },
  btnIcon: {
    fontSize: 13,
    color: '#fff', 
    transform: [{rotate: '-40deg'}]
  },
  mainCon: {
    transform: [{rotate: (Platform.OS === 'android') ? '45deg' :'0deg'}],
    width: 80,
    paddingLeft: 23
  }
})

export default BaseMarker;






















