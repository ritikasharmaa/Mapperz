import React, { useRef, useState, useEffect, memo } from "react";
import PropTypes from "prop-types";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { primaryColor } from "../../redux/Constant";
import ProgressCircle from "react-native-progress-circle";
import { renderImage } from "../../redux/Utility";
import { connect } from "react-redux";
import LocationPulseLoader from './PulseLoader'
import Svg from 'react-native-svg'

//import MapboxGL from "@react-native-mapbox-gl/maps";
var timeLeft, totalTime, interval;

class UsermarkerCon extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      progress: 100,
      fadeAnim: new Animated.Value(0),
      showMessage: false
    };
  }
  Progress() {
    timeLeft = this.props.data.time_left;
    totalTime = this.props.data.total_time;
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(() => {
      timeLeft = timeLeft - 1;
      const percentageLeft = (timeLeft / totalTime) * 100;
      this.setState({ progress: parseInt(percentageLeft) });
      if (percentageLeft <= 1) {
        clearInterval(interval);
      }
    }, 1000);
  }
  componentDidMount() {
    this.Progress();
  }
  componentDidUpdate(prevProps) {
    if (prevProps.socket.checkin_users !== this.props.socket.checkin_users) {
      this.Progress();
    }
    /*if (this.props.data.message) {
      this.setState({showMessage: true})
      setTimeout(() => {
        this.setTimeout({showMessage: false})
      }, 10000);
    }*/
  }

  fadeIn = () => {
    Animated.timing(this.state.fadeAnim, {
      toValue: 1,
    }).start(() => {
      Animated.timing(this.state.fadeAnim, {
        toValue: 0,
        delay: 2000,
      }).start();
    });
  };

  render() {
    return (
      <>
        <TouchableOpacity style={styles.mainCon} onPress={this.fadeIn}>
          {/*this.props.data.message &&  
            <View style={styles.callout}>
              <Text style={styles.tipText}>{this.props.data.message}</Text>
              <View style={styles.calloutArrow}></View>     
            </View>*/
          }
          <ProgressCircle
            percent={this.state.progress}
            radius={20}
            borderWidth={4}
            color="#3399FF"
            shadowColor="#eee"
            bgColor="#fff"
          >
            <Svg width={40} height={30}>
            <Image
              source={renderImage(this.props.data.profile_image, "user")}
              style={styles.image}
            />
            </Svg>
          </ProgressCircle>
          <View style={{position: 'absolute', width: 32, left: 39, top: 39,  zIndex: 99}}>
            <LocationPulseLoader 
              size={32} 
              avatar={renderImage(this.props.data.profile_image, "user", "pathOnly")}  
              borderColor={'#17497d'}
              backgroundColor={primaryColor}
              pulseMaxSize={100}
              interval={3000}
            />
          </View>
        </TouchableOpacity>
      </>
    );
  }
}

const styles = StyleSheet.create({
  mainCon: {
    width: 110,
    height: 110,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'visible',
    position:'absolute',
  },
  image: {
    width: 36,
    height: 36,
  },
  fadingContainer: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    borderRadius: 20,
    backgroundColor: primaryColor,
    marginBottom: 15,
    width: 100,
  },
  fadingText: {
    fontSize: 14,
    margin: 10,
    color: "#fff",
  },
  TriangleShapeCSS: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 10,
    borderStyle: "solid",
    backgroundColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: primaryColor,
    marginLeft: 15,
    position: "absolute",
    bottom: -10,
  },
  svgCon: {
    position: 'absolute'
  },
  calloutCon: {
    position: 'absolute',
    bottom: 75,
    left: 25,
    zIndex: 10
  },
  callout: {
    position: 'absolute',
    maxWidth: 150,
    //minWidth: 50,
    //width: 150,
    justifyContent: 'center',
    alignSelf: 'flex-start',
    //height: 100,
    backgroundColor: '#fff',
    bottom: 75,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#aaa',
    left: 30,
    padding: 5,
    marginBottom: 10,
    overflow: 'visible',
  },
  calloutArrow: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    bottom: -7,
    left: 16,
    backgroundColor: '#fff',
    borderColor: '#aaa',
    transform: [
      {rotate: '-45deg'}
    ]
  },
  tipText: {
    borderRadius: 50,
    zIndex: 10,
    fontSize: 10
  }
});

const mapStateToProps = (state) => {
  return {
    socket: state.socket,
  };
};

const Usermarker = memo(UsermarkerCon)

export default connect(
  mapStateToProps,
  null
)(Usermarker);

// const Usermarker = memo(UsermarkerCon)

// export default Usermarker
