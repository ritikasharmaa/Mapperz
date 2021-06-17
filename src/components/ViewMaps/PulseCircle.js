import React, {memo} from 'react';
import PropTypes from 'prop-types';
import { Animated } from 'react-native';
import {primaryColor} from '../../redux/Constant'
import MapboxGL from "@react-native-mapbox-gl/maps";

class PulseCircleLayerComp extends React.Component {
  

  constructor(props) {
    super(props);

    this.state = {
      innerRadius: new Animated.Value(10),
      pulseOpacity: new Animated.Value(1),
      pulseRadius: new Animated.Value(8),
    };

    this._loopAnim = null;
  }

  componentDidMount() {
    const expandOutAnim = Animated.parallel([
      Animated.timing(this.state.pulseRadius, {
        toValue: 8,
        duration: 800,
      }),
      Animated.timing(this.state.innerRadius, {
        toValue: 40,
        duration: 1600,
      }),
      Animated.timing(this.state.pulseOpacity, {
        toValue: 0,
        duration: 1600,
      })
    ]);

    const shrinkInAnim = Animated.parallel([
      Animated.timing(this.state.pulseRadius, {
        toValue: 5,
        duration: 500,
      }),
      Animated.timing(this.state.innerRadius, {
        toValue: 8,
        duration: 0,
      })
    ]);

    this._loopAnim = Animated.loop(
      Animated.sequence([expandOutAnim, shrinkInAnim]),
    );

    this._loopAnim.start(() => {
      this.setState({ pulseOpacity: 1 });
    });
  }

  componentWillUnmount() {
    this._loopAnim.stop();
  }

  render() {
    return (
      <MapboxGL.UserLocation renderMode="normal" visible={true} showsUserHeadingIndicator={true}>
        <MapboxGL.Animated.CircleLayer
          id="pointCircles123"
          style={[{
                    circleColor: primaryColor,
                  }, {circleRadius: this.state.innerRadius, circleOpacity: this.state.pulseOpacity}]}
        />
        <MapboxGL.Animated.CircleLayer
          id="pointCircles"
          style={[{
                    circleStrokeColor: "#fff",
                    circleStrokeWidth: 4,
                    circleColor: primaryColor,
                  }, {circleRadius: this.state.pulseRadius}]}
        />
        {/* <MapboxGL.SymbolLayer
          id={`ownPosition-symbol`}
          style={{
        //    iconImage: userDirectionMarker,
            iconSize: 0.1,
         //   iconRotate: this.state.pulseOpacity,
            iconRotationAlignment: 'map',
            iconAllowOverlap: true,
            backgroundColor: 'red',
          }}
        /> */}
        {/*<MapboxGL.Light anchor="map" intensity={1} Description={[2.0, 200, 32]} color={'red'} />*/}
      </MapboxGL.UserLocation>
    );
  }
}

const PulseCircleLayer = memo(PulseCircleLayerComp)

export default PulseCircleLayer;