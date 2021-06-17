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
import { convertText } from "../../redux/Utility";
const { width, height } = Dimensions.get("screen");

const SuggestedFarMaps = (props) => {
    const modalRef = useRef(null);
    const [mapperId, setMapperId] = useState("");

  const viewMap = (id) => {
    props.dispatch(getSpecificMapDetail(id));
    props.dispatch(getMapFeed(id));
    //   props.panel.transitionTo(1000)
  };
  const addRemoveFav = (item) => {
    if (item.isFav !== true) {
      return props.addSpotToFav({ id: item.id, type: "Mapper" });
    } else {
      return props.removeToFav({ id: item.id, type: "Mapper" });
    }
  };
  const suggestionBtn = (item) => {
    setMapperId(item.id);
    Geolocation.getCurrentPosition((info) => {
      let id = props.map.currentMap;
      modalRef.current.open();
      let googleSpot = true;
      props.getNearestSpots(
        id,
        info.coords.latitude,
        info.coords.longitude,
        googleSpot
      );
    });
  };

  const buttons = (item) => {
    if (props.map.allMaps.suggested_maps.length) {
      return (
        <View style={styles.btnCon}>
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={600}
            style={[
              styles.actionBtn,
              styles.bookmarkBtn,
              item && item.isFav ? { backgroundColor: primaryColor } : {},
            ]}
            onPress={() => addRemoveFav(item)}
          >
            <Icon
              type={item.isFav ? "FontAwesome" : "FontAwesome5"}
              name={"heart"}
              style={[
                styles.mapIcon,
                item && item.isFav ? { color: "#fff" } : {},
              ]}
            />
          </Ripple>
          <Ripple
            rippleOpacity={0.2}
            rippleDuration={600}
            style={[styles.actionBtn, styles.bookmarkBtn]}
            onPress={() => suggestionBtn(item)}
          >
            <Icon
              type={"FontAwesome5"}
              name={"lightbulb"}
              style={[styles.mapIcon]}
            />
          </Ripple>
        </View>
      );
    }
  };

  const renderList = (props) => {
    if (props.map.fetchingAllMaps) {
      return <ContentLoader />;
    } else if (
      props.map.allMaps.suggested_maps.around_user !== true &&
      props.map.allMaps.suggested_maps.length
    ) {
      return props.map.allMaps.suggested_maps.map((item, index) => {
        return (
          <TouchableOpacity
            rippleColor="#aaa"
            rippleDuration={900}
            style={[
              styles.topSection,
              item.id === props.map.currentMap && {
                backgroundColor: "#f5f5f5",
              },
            ]}
            key={index}
            onPress={() => viewMap(item.id)}
          >
            <View style={styles.img}>
              <View style={styles.leftCon}>
                <Image
                  source={renderImage(item.img_url, 'map') }
                  style={styles.headerLogo}
                />
              </View>
            </View>
            <View style={styles.centerCon}>
              <Text numberOfLines={2} style={styles.title}>
                {item.map_name_local}
              </Text>
              <View style={styles.middleView}>
                <Icon
                  type="FontAwesome5"
                  name={"thumbs-up"}
                  style={styles.Icon}
                />
                <Text style={styles.TextCount}>
                  <FormatText variable="screencomp.likes" /> :{" "}
                  {item.likes_count}
                </Text>
              </View>
              <View style={styles.middleView}>
                <Icon
                  type="FontAwesome5"
                  name={"comments"}
                  style={styles.Icon}
                />
                <Text style={styles.TextCount}>
                  <FormatText variable="sidebarcomp.comments" /> :{" "}
                  {item.comments_count}
                </Text>
              </View>
              <View style={styles.middleView}>
                <Icon
                  type="FontAwesome5"
                  name={"street-view"}
                  style={styles.Icon}
                />
                <Text style={styles.TextCount}>
                  <FormatText variable="screencomp.user_coverage" /> :{" "}
                  {item.users_coverage}
                </Text>
              </View>
              {buttons(item)}
              <View style={styles.middleView}>
                <Text style={styles.left}>{item.neighborhood_name}</Text>
              </View>
              <View style={styles.footerView}>
                <View style={styles.leftView}>
                  <Icon type="FontAwesome5" name={"eye"} style={styles.Icon} />
                  <Text style={styles.Text}>{item.view_count}</Text>
                </View>
                <View style={[styles.leftView, styles.centerView]}>
                  <Text style={styles.Text}>
                    <FormatText variable="screencomp.spot" />:{item.spots_count}
                  </Text>
                </View>
                <View style={styles.rightView}>
                  <Icon
                    type="FontAwesome5"
                    name={"clock"}
                    style={styles.Icon}
                  />
                  <Text style={styles.Text}>
                    {moment(item.created_at).format("YYYY/MM/DD")}
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      });
    } else if (
      props.map.allMaps.suggested_maps == null ||
      !props.map.allMaps.suggested_maps.length ||  props.map.allMaps.suggested_maps.around_user === true
    ) {
      return (
        <NoData
          title={convertText("screencomp.NoSuggestedMap", props.lang)}
          dropDownMaps
        />
      );
    }
  };
  return (
    <ScrollView
    style={styles.mainCon}
    pagingEnabled={true}
    showsHorizontalScrollIndicator={false}
    >
        {renderList(props)}
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
  );
};
const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: "#fff",
  },
  topOuterView: {
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

export default SuggestedFarMaps;
