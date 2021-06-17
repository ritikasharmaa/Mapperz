import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Animated, View, StyleSheet } from 'react-native';
import {primaryColor} from '../../redux/Constant'
import MapboxGL from "@react-native-mapbox-gl/maps";

class AnimatedMarker extends React.Component { 
  constructor(props) {
    super(props);

    this.state = {
      ring: new Animated.Value(24),
    };

    this._loopAnim = null;
  }

  componentDidMount() {
    const expandOutAnim = Animated.parallel([
      Animated.timing(this.state.ring, {
        toValue: 34,
        duration: 800,
      }),
    ]);

    const shrinkInAnim = Animated.parallel([
      Animated.timing(this.state.ring, {
        toValue: 24,
        duration: 500,
      })
    ]);

    this._loopAnim = Animated.loop(
      Animated.sequence([expandOutAnim, shrinkInAnim]),
    );

    this._loopAnim.start(() => {
      //this.setState({ pulseOpacity: 1 });
    });
  }

  render() {
    return (
      <Animated.View style={[styles.markerWrap]}>
        <Animated.View style={[styles.ring, {width: this.state.ring, height: this.state.ring, borderRadius: this.state.ring}]} />
        <View style={styles.marker} />
      </Animated.View>
    );
  }
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

export default AnimatedMarker;