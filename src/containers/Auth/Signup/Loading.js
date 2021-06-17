import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, Text, Dimensions, Image, Animated } from "react-native";
import { Container, Button } from "native-base";
import { primaryColor, secondColor } from "../../../redux/Constant";
import {
  getSpecificMapDetail,
  getAllMaps,
  getCheckins
} from "../../../redux/api/map";
import { connect } from "react-redux";



const { width, height } = Dimensions.get("screen");

const Loading = (props) => {
  const [data, setData] = useState(0);
  const [loadEnd, setLoadEnd] = useState(false);

  const layerWidth = useRef(new Animated.Value(0)).current

  const callApi = async () => {
    let id = props.route.params.homeMapId
    new Promise(async (resolve) => { 
      await props.getAllMaps();             
      {changeWidth(0.3333333333333333)}
      await props.getCheckins();
      {changeWidth(0.6666666666666666)}      
      props.getSpecificMapDetail(id).then(res => {
        {changeWidth(1)}
        props.navigation.navigate('Footer', {
          routeId : 0,
          user: "new"
        })
      })       
      resolve("success done!");     
    }); 
  };

  const changeWidth = (val) =>  {
    if(val === 0.3333333333333333){
      setData(50)
    } else if(val === 0.6666666666666666){
      setData(100)
    } else if(val === 1){
      setData(150)      
    }
          
  }

  Animated.timing(
    layerWidth,
    {
      toValue: data,
      duration: 1000,
    }
  ).start();


  useEffect(() => {

    callApi()

  }, []);


  const renderView = () => {    
    return <View style={styles.logoCon}>
            <View style={styles.baseLayer}></View>
            <View style={styles.whiteLayerCon}>
              <Animated.View style={[styles.whiteLayer, {width:layerWidth}]}></Animated.View>
            </View>
            <Image 
              source={require("../../../assets/images/newSplashFinal.png")}
              style={styles.logo}
            />
            <View style={styles.captionCon}>
              <Text style={styles.caption}>Creating Base Map, Checkin Map and Favourite Maps....</Text>
            </View>
          </View>
  }

  return (
    <Container style={styles.mainCon}>
      {renderView()}
    </Container>
  );
};

const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    backgroundColor: primaryColor
  },
  logoCon: {
    width: width,
    height: height,
  },
  logo: {
    position: 'absolute',
    width: "100%",
    height: "100%",
    zIndex: 3,
    //resizeMode: 'contain',
  },
  progressBar: {
    position: "absolute",
  },
  baseLayer: {
    position: 'absolute',
    flex: 1,
    width: width,
    height: height,
    backgroundColor: primaryColor,
    zIndex: 1,
  },
  whiteLayer: {
    height: 100,
    backgroundColor: "#fff",
  },
  whiteLayerCon: {
    position: 'absolute',
    width: 150,
    height: 100,
    zIndex: 2,
    top: height/2,
    left: width/2 - 70
  },
  captionCon: {
    position: 'absolute', 
    zIndex: 99, 
    bottom: 150,
    width: '100%',
    alignItems: 'center'
  },
  caption: {
    color: secondColor
  }
});

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    map: state.map,
    socket: state.socket,
    planner: state.planner,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    dispatch,
      getSpecificMapDetail: (data) => dispatch(getSpecificMapDetail(data)),
      getAllMaps: () => dispatch(getAllMaps()),
      getCheckins: () => dispatch(getCheckins()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Loading);
