import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  Image,
  TouchableOpacity,
  Keyboard,
} from "react-native";
import { Icon, Container, Content } from "native-base";
import { primaryColor } from "../../../redux/Constant";
import Ripple from "react-native-material-ripple";
import { CommonActions } from "@react-navigation/native";
import SyncStorage from "sync-storage";
import LinearGradient from "react-native-linear-gradient";
import { connect } from "react-redux";
import Maps from "../../../components/ViewMaps/Maps";
import HomeBaseMap from "./HomeBaseMap";
import FormatText from "../../../components/common/FormatText";
import { signup } from "../../../redux/api/auth";
import microValidator from "micro-validator";
import validationHelpers from "../../../assets/validationHelpers";
import { setCenterCord } from "../../../redux/actions/map";
import Geolocation from 'react-native-geolocation-service';
import Toast from "react-native-root-toast";
import { convertText } from "../../../redux/Utility";

const { width, height } = Dimensions.get("screen");

const HomeBase = (props) => {
 
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [loading, setLoading] = useState(false);

  
  return (
    <Container>
      <Content>
        <View style={styles.logoCon}>
          <Image source={require('../../../assets/images/sign_up7.png')} style={styles.iconImage} />
        </View>
        <View style={{ height : height}}>
          <View style={styles.textCon}>
            <Text style={[styles.text, styles.bottomText]}>
              <FormatText variable="signup.drag_marker" />
            </Text>
          </View>
          <View style={{ height: '59%'}}>
            <HomeBaseMap
              {...props}
              setLat={setLat}
              setLng={setLng}
              lat={lat}
              lng={lng}
            />
          </View>
        </View>
      {/* </LinearGradient> */}
      </Content>           
    </Container>
  );
};

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  logoCon: {
    width:width,
    height: 250,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  addressCon: {
    alignItems: "center",
  },
  text: {
    fontSize: 20,
    marginBottom: 15,
    paddingHorizontal: 20,
    textAlign: "center",
  },
  bottomText: {
    fontSize: 14,
    paddingVertical: 5,
    marginBottom: 0,
  },
  textCon: {
    // backgroundColor: "#9248e7",
    width: "100%",
    alignItems: "center",
  },
  continueBtnCon: {
    position: "absolute",
    bottom: 50,
    left: width / 2 - 60,
  },
  continueBtn: {
    backgroundColor: "#9248e7",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: "#fff",
    overflow: "hidden",
  },
  iconOuterCon: {
    position: "absolute",
    bottom: height / 4,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "rgba(187, 79, 239,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#bb4fef",
    fontSize: 16,
  },
  latlng: {
    fontSize: 14,
    color: "#fff",
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  map: state.map,
  socket: state.socket,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeBase);
