import React, {useState} from "react";
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
import FormatText from "../common/FormatText";
import { convertText } from '../../redux/Utility'
import { clockRunning } from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

const FavoritedMaps = (props) => {
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

  const renderList = (props) => {

    if (props.fetchingAllMaps) {
      return <ContentLoader />;
    } else if (
      props.allMaps.favorite_maps &&
      props.allMaps.favorite_maps.length
    ) {
      return props.allMaps.favorite_maps.map((item, index) => {
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
                  source={ renderImage(item.img_url, 'map') }
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
                <View>
                  <Text numberOfLines={1} style={styles.title}>
                    {item.map_name_local}
                  </Text>
                </View> 
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
             {/* <View style={styles.btnCon}>
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
              </View>*/}
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
      props.allMaps.favorite_maps == null ||
      !props.allMaps.favorite_maps.length
    ) {
      return <NoData title={convertText("screencomp.NoFavtMap", props.lang)} dropDownMaps />;
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
    if (props.allMaps.favorite_maps.length >= 5) {
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
    <View style={{flex: 1}}>
      {/*renderIndicator()*/}
      <ScrollView
        style={styles.mainCon}
        pagingEnabled={true}
        showsHorizontalScrollIndicator={false}
        ref={(node) => (scroll = node)}
        onScroll={(event) => handleScroll(event)}
      >
        <View style={styles.topOuterView}>{renderList(props)}</View>
      </ScrollView>
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
    top: 1,
    marginRight: 2
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
    margin: 2,
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

export default FavoritedMaps;
