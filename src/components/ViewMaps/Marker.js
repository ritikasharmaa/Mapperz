import React from 'react';
import PropTypes from 'prop-types';
import { Animated, View, StyleSheet } from 'react-native';
import {primaryColor} from '../../redux/Constant'
import MapboxGL from "@react-native-mapbox-gl/maps";

const Marker = (props) => {
  
  return (
    <Animated.View style={[styles.markerWrap]}>
      <Animated.View style={[styles.ring]} />
      <View style={styles.marker} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
})

export default Marker;