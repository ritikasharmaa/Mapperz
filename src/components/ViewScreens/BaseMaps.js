import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Platform,
  TouchableOpacity,
  Dimensions
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

const { width, height } = Dimensions.get("screen");

const BaseMaps = (props) => {
  const modalRef = useRef(null);
  const [mapperId, setMapperId] = useState("");
  const [openView, setOpenView] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  const viewMap = (id) => {
    props.dispatch(getSpecificMapDetail(id));
    props.dispatch(getMapFeed(id));
    props.handleMapSelected() 
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
      let id = props.currentMap;
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

  const status = (item) => {
    if (item.status === "public_false") {
      return <Text style={styles.tipText}><FormatText variable="screencomp.mapPrvt" /></Text>;
    } else {
      return <Text style={styles.tipText}><FormatText variable="screencomp.mapPub" /></Text>;
    }
  };

  const renderList = (props) => {
    if (props.fetchingAllMaps) {
      return <ContentLoader />;
    } else if (
      props.allMaps.base_maps &&
      props.allMaps.base_maps.length
    ) {
      return props.allMaps.base_maps.map((item, index) => {
        return (
          <TouchableOpacity
            rippleColor="#aaa"
            rippleDuration={900}
            style={[
              styles.topSection,
              item.id === props.currentMap && {
                backgroundColor: "#f5f5f5",
              },
            ]}
            key={index}
            onPress={() => viewMap(item.id)}
          >
            <View style={styles.img}>
              <View style={styles.leftCon}>
                <Image
                  source={renderImage(item.img_url, 'map')}
                  style={styles.headerLogo}
                />
              </View>
              <View style={styles.textNeighbor}>
                <Text style={styles.left}>
                  {item.neighborhood_name || "No Neighbor"}
                </Text>
              </View>
            </View>
            <View style={styles.centerCon}>
              <View style={styles.name}>
                <View style={styles.userImageCon}>
                  <Image style={styles.userImage} source={renderImage(item.owner_image, 'user')}/>
                </View>
                <Text numberOfLines={1} style={styles.title}>
                  {item.map_name_local}
                </Text>
              </View>
              <View style={styles.middleView}>
                <Icon
                  type="FontAwesome5"
                  name={"street-view"}
                  style={styles.userCoverageIcon}
                />
                <View style={styles.progressBar}>
                  <View style={[styles.progressBarFill, {width: item.users_coverage}]}></View>
                </View>                
                <Text style={styles.TextCount}>
                  {item.users_coverage}%
                </Text>
              </View>
              
              <View style={styles.footerView}>
                <View style={styles.leftView}>
                  <Icon type="FontAwesome5" name={"eye"} style={styles.Icon} />
                  <Text style={styles.Text}>{item.view_count}</Text>
                </View>
                <View style={[styles.leftView]}>
                  <Icon
                    type="FontAwesome5"
                    name={"map-marker-alt"}
                    style={styles.Icon}
                  />
                  <Text style={styles.Text}>
                    {/*<FormatText variable="screencomp.spot" />*/}{item.spots_count}
                  </Text>
                </View>
                 <View style={styles.leftView}>
                  <Icon
                    type="FontAwesome5"
                    name={"thumbs-up"}
                    style={styles.Icon}
                  />
                  <Text style={styles.TextCount}>
                    {item.likes_count}
                  </Text>
                </View>
                <View style={styles.leftView}>
                  <Icon
                    type="FontAwesome5"
                    name={"comments"}
                    style={styles.Icon}
                  />
                  <Text style={styles.TextCount}>
                    {item.comments_count}
                  </Text>
                </View>
                <View style={styles.leftView}>
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
      props.allMaps.base_maps == null ||
      !props.allMaps.base_maps.length
    ) {
      return <NoData title={convertText("screencomp.NobaseMap", props.lang)} dropDownMaps />;
    }
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
    } else if (currentOffset == 478.6666666666667 || currentOffset > 478.6666666666667 ) {
      _scrollOffset = currentOffset;
      setIsChanged(true);
    }
  };
  const renderIndicator = () => {
    if (props.allMaps.base_maps.length >= 5) {
      return (
        <Ripple
          rippleContainerBorderRadius={30}
          rippleColor="#eee"
          rippleOpacity={0.2}
          rippleDuration={700}
          style={[styles.btn, styles.actionBtns]}
          onPress={() => scrollBtn(scroll)}
        >
          {isChanged ? (
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
      );
    }
  };
  return (
    <View style={{ flex: 1}}>
      {/* {renderIndicator()} */}
      <ScrollView
        style={styles.mainCon}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={(node) => (scroll = node)}
        onScroll={(event) => handleScroll(event)}
      >
        <View style={styles.topOuterView}>{renderList(props)}</View>
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
    height: 100,
  },
  centerCon: {
    width: width - 130,
    marginLeft: 5,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    paddingLeft: 6,
    width: width - 160,
  },
  middleView: {
    flexDirection: "row",
    paddingLeft: 6,
    paddingTop: 10  
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
    margin: 5,
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
    position: 'absolute',
    bottom: 0,
    justifyContent: 'space-between',
    width: '100%'
  },
  leftView: {
    flexDirection: "row",
    marginRight: 10,
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
    //color: "#ADADAD",
    color: primaryColor,
    top: Platform.OS == "ios" ? 1 : 2,
  },
  Text: {
    fontSize: 12,
    fontWeight: "500",
    color: "#ADADAD",
    paddingLeft: 5,
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
    paddingLeft: 5,
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
    height: 100,
    /*position: "absolute",
    left: 8,
    top: 8,
    alignItems: "center",
    justifyContent: "center",*/
  },
  callout: {
    position: "absolute",
    maxWidth: 150,
    //minWidth: 50,
    //width: 150,
    justifyContent: "center",
    alignSelf: "center",
    //height: 100,
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 5,
    marginBottom: 10,
    overflow: "visible",
    top: 71,
    right: 206,
  },
  calloutArrow: {
    position: "absolute",
    width: 12,
    height: 12,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    bottom: -7,
    left: 16,
    backgroundColor: "#fff",
    borderColor: "#aaa",
    transform: [{ rotate: "-45deg" }],
  },
  tipText: {
    borderRadius: 50,
    zIndex: 10,
    fontSize: 10,
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
  textNeighbor: {
    position: 'absolute',
    right: 0,
    top: 5,
    backgroundColor: '#fff'
  },
  userCoverageIcon: {
    fontSize: 20,
    //color: "#ADADAD",
    color: primaryColor
  },
  name: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 2
  },
  userImageCon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#ccc'
  },
  userImage: {
    width: '100%',
    height: '100%'
  },
  progressBar: {
    width: width - 200,
    borderWidth: 0.5,
    borderColor: '#aaa',
    marginHorizontal: 5,
    //borderRadius: 10,
    height: 18
    //backgroundColor: primaryColor
  },
  progressBarFill: {
    marginLeft: 5,
    borderRadius: 10,
    height: 18,
    left: -6,
    top: -1,
    backgroundColor: primaryColor
  }
});

export default BaseMaps;
