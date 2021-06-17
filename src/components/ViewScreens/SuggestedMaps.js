import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import ContentLoader from "../common/ContentLoader";
import NoData from "../common/NoData";
import { primaryColor } from "../../redux/Constant";
import { renderImage } from "../../redux/Utility";
import Ripple from "react-native-material-ripple";
import { Icon, Button } from "native-base";
import moment from "moment";
import { getSpecificMapDetail } from "../../redux/api/map";
import { getMapFeed } from "../../redux/api/feed";
import RBSheet from "react-native-raw-bottom-sheet";
import SuggestSpot from "../common/SuggestSpot";
import Geolocation from 'react-native-geolocation-service';
import FormatText from "../common/FormatText";
import { convertText } from '../../redux/Utility'
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import SuggestedAroundMaps from './SuggestedAroundMaps'
import SuggestedFarMaps from './SuggestedFarMaps'
const { width, height } = Dimensions.get("screen");

const SuggestedMaps = (props) => {
  const modalRef = useRef(null);
  const [mapperId, setMapperId] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  let lang = props.uiControls.lang;

  const Tab = createMaterialTopTabNavigator();

 
  const renderTabs = (props) => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontWeight: "700",},
          style: { backgroundColor: '#f5f5f5' }
          
        }}
      >
        <Tab.Screen
          name={convertText("screencomp.mapAroundUser", lang)}
          children={() => (<SuggestedAroundMaps {...props} />)}
        />
        <Tab.Screen
          name={convertText("screencomp.mapFarUser", lang)}
          children={() => (<SuggestedFarMaps {...props} />)}
        />
      </Tab.Navigator>
    );
  };
 
 
  const scrollBtn = (scroll) => {
    if (!isChanged) {
     return scroll.scrollTo({ x: width * 2, y: width * 2, animate: true });
    } else {
     return scroll.scrollTo({ x: 0, y: 0, animate: true });
    }
  };
  const handleScroll = (event) => {
    const currentOffset = event.nativeEvent.contentOffset.y;
    let shouldShow;
	let _scrollOffset = 0;

    if (currentOffset > _scrollOffset || currentOffset === 0) {
      shouldShow = false;
    } else {
      shouldShow = true;
    }
    if (shouldShow !== isChanged && (!shouldShow || currentOffset > 250)) {
      _scrollOffset = currentOffset;
      setIsChanged(false);
	}
	else  if (currentOffset > 509.3333435058594  ){
		_scrollOffset = currentOffset;
		setIsChanged(true);
	}
  };
  const renderIndicator = () => {
	  if(props.map.allMaps.suggested_maps.length >= 5){
		return <Ripple
		rippleContainerBorderRadius={30}
		rippleColor="#eee"
		rippleOpacity={0.2}
		rippleDuration={700}
		style={[styles.btn, styles.actionBtns]}
		onPress={() => scrollBtn(scroll)}
	  >
		{isChanged? (
		  <Icon
			type="FontAwesome5"
			name={"arrow-up"}
			style={[styles.actionButtonIcon]}
		  />
		) : (
		  <Icon
			type="FontAwesome5"
			name={"arrow-down"}
			style={[styles.actionButtonIcon]}
		  />
		)}
	  </Ripple>
	 }
  }
  return (
    <View style={{maxHeight: (Platform.OS==='ios' ? height - 280 :   null ), backgroundColor: 'red'}}>
     {/* {renderIndicator()} */}
      <ScrollView
        style={styles.mainCon}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={[styles.topOuterView]}>
          {renderTabs(props)}
        </View>

        <RBSheet
          ref={modalRef}
          height={600}
          openDuration={250}
          closeOnDragDown={true}
          keyboardAvoidingViewEnabled={true}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
            },
          }}
        >
          <SuggestSpot mapperId={mapperId} closeModal={modalRef} />
        </RBSheet>
      </ScrollView>
      <View />
    </View>
  );
};
const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: "#fff",
  },
  topHeader: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 15,
    marginBottom: 15,
    flexDirection: "row",
  },
  headerIcon: {
    fontSize: 15,
    color: "#ABABAC",
  },
  headerText: {
    paddingLeft: 8,
    fontWeight: "600",
  },
  topSection: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderColor: "#f1f1f1",
  },
  leftCon: {
    paddingLeft: 0,
  },
  headerLogo: {
    width: 110,
    height: 120,
  },
  centerCon: {
    width: "100%",
    paddingLeft: 110,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    paddingLeft: 6,
  },
  middleView: {
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingLeft: 6,
  },
  left: {
    color: "#fff",
    backgroundColor: primaryColor,
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 2,
    paddingBottom: 3,
    borderRadius: 3,
    overflow: "hidden",
    fontSize: 12,
    marginTop: 3,
  },
  right: {
    color: "#fff",
    backgroundColor: "#000000",
    paddingLeft: 10,
    paddingRight: 10,
    marginLeft: 10,
    paddingTop: 2,
    paddingBottom: 2,
    borderRadius: 5,
    overflow: "hidden",
  },
  leftView: {
    backgroundColor: "#fff",
  },
  footerView: {
    flexDirection: "row",
    flexWrap: "nowrap",
    paddingLeft: 8,
    marginTop: 13,
  },
  leftView: {
    flexDirection: "row",
  },
  centerView: {
    position: "absolute",
    left: 63,
  },
  rightView: {
    flexDirection: "row",
    right: 10,
    position: "absolute",
  },
  Icon: {
    fontSize: 12,
    color: "#ADADAD",
    top: Platform.OS == "ios" ? 1 : 2,
  },
  Text: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ADADAD",
    paddingLeft: 2,
  },
  actionItems: {
    alignItems: "center",
    justifyContent: "center",
    width: 65,
    marginRight: 20,
  },
  TextCount: {
    fontSize: 12,
    fontWeight: "500",
    paddingLeft: 2,
    paddingBottom: 3,
    color: "#aaa",
  },
  btnCon: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    top: 25,
  },
  actionBtn: {
    borderColor: "#E5E5E6",
    borderWidth: 1,
    backgroundColor: "#f5f5f5",
    width: 35,
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  bookmarkBtn: {
    marginRight: 10,
  },
  mapIcon: {
    color: "#000000",
    fontSize: 14,
  },
  img: {
    width: 110,
    height: 120,
    position: "absolute",
    left: 8,
    top: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  btn: {
    shadowColor: "lightgrey",
    shadowRadius: 10,
    shadowOpacity: 1,
    width: 50,
    height: 50,
    borderRadius: 30,
    position: "absolute",
    bottom: 50,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  actionBtns: {
    backgroundColor: primaryColor,
    //bottom: 0,
    zIndex: 11,
  },
  actionButtonIcon: {
    color: "#fff",
    fontSize: 20,
  },
});

export default SuggestedMaps;
