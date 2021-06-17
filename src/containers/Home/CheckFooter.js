import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Footer from "../../components/common/Footer";
import MapSearch from "../MapSearch";
import Messages from "../Messages";
import Notifications from "../Notifications";
import ProfileContainer from "../Profile/ProfileContainer";
import HomeContainer from "./HomeContainer";

const CheckFooter = (props) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleCurrentIndex = (index) => {
    setCurrentIndex(index);
  };

  useEffect(() => {
    const param = props.route && props.route.params;
    if (param && Object.keys(param).length) {
      setCurrentIndex(param.routeId)
    }
  },[props.route.params])

  const renderComponent = () => {
    if (currentIndex === 0) {
        return <HomeContainer props={props} navigation={props.navigation} />
    //   props.navigation.navigate("Home");
    } else if (currentIndex === 1) {
        return <MapSearch props={props} navigation={props.navigation} />
    //   props.navigation.navigate("MapSearch");
    } else if (currentIndex === 2) {
    //   props.navigation.navigate("Messages");
        return <Messages props={props} navigation={props.navigation} />
    } else if (currentIndex === 3) {
        return <Notifications props={props} navigation={props.navigation} />
    //   props.navigation.navigate("Notifications");
    } else if (currentIndex === 4) {
        return <ProfileContainer props={props} navigation={props.navigation} />
    //   props.navigation.navigate("Profile");
    }
  };

  return (
    <View style={{ flex: 1 }}>
        {renderComponent()}
      <Footer
        props={props}
        setCurrentIndex={currentIndex}
        navigation={props.navigation}
        currentIndex={(index) => handleCurrentIndex(index)}
      />
    </View>
  );
};

export default CheckFooter;
