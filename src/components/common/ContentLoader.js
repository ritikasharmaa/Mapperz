import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import {primaryColor} from '../../redux/Constant'
import {BarIndicator} from 'react-native-indicators';

const ContentLoader = (props) => {
  return(
  	<View style={styles.con}>
    	<BarIndicator count={4} color={props.color || primaryColor} size={props.size || 30} />
    </View>
  )
}

const styles = StyleSheet.create({
  con: {
    padding: 40,
    flex: 1,
  }
})

export default ContentLoader