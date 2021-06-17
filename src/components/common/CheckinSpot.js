import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  TextInput,
  ScrollView,
  Animated,
  Switch,
  Alert,
} from "react-native";
import { Icon, Button, Container, Content, Picker } from "native-base";
import Ripple from "react-native-material-ripple";
import ContentLoader from "./ContentLoader";
import { renderImage, convertText } from "../../redux/Utility";
import NoData from "./NoData";
import { primaryColor, dummyImage } from "../../redux/Constant";
import OwnButton from "./OwnButton";
import { connect } from "react-redux";
import { spotCheckin } from "../../redux/api/map";
import Geolocation from 'react-native-geolocation-service';
import FormatText from "./FormatText";
import { relativeTimeRounding } from "moment";
import Toast from 'react-native-root-toast';
import { postApiPosts } from "../../redux/api/feed";
import _ from "lodash";
import GPSState from 'react-native-gps-state'
import {setToggleState} from '../../redux/actions/map'

const timeArray = [
  { label: "1 Min", value: 1 },
  { label: "10 Min", value: 10 },
  { label: "30 Min", value: 30 },
];

const accessArray = [
  { label: "Friends", value: "friends" },
  { label: "Followers", value: "followers" },
  { label: "Only Me", value: "self" },
];

const { width, height } = Dimensions.get("screen");

const CheckinSpot = (props) => {
  let lang = props.lang || props.uiControls.lang;

  const stepTransitionIn = useRef(new Animated.Value(0)).current;
  const stepTransitionout = useRef(new Animated.Value(1)).current;

  const [isSecondStep, setIsSecondStep] = useState(false);
  const [checkinForm, setCheckinForm] = useState({
    nearestspot: {},
    google_spot: {},
    time: 10,
    access: "friends",
  });
  const [isEnabled, setIsEnabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [currentCoords, setCurrentCoords] = useState(null);
  const [message, setMessage] = useState(null);

  /*
  * on select of spot save detail in form data
  */
  const selectSpot = (item, key) => {
    setIsSecondStep(true);
    setCurrentCoords(null);
    let formData = {
      nearestspot: {},
      google_spot: {},
      time: 10,
      access: "friends",
    };
    if (key === "google_spot") {
      formData["google_spot"] = item;
    } else {
      formData["nearestspot"] = item;
    }
    setCheckinForm(formData);
  };

  /*
  * save selected time
  */
  const onSelectTime = (item, key) => {
    let formData = { ...checkinForm };
    formData[key] = item;
    setCheckinForm(formData);
  };

  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  /*
  * set searched text on search
  */
  const onSearch = (text, key) => {
    if(key === 'message'){
      setMessage(text)
    } else {
      setSearchText(text);
    }    
    Geolocation.getCurrentPosition((info) => {
      let id = props.currentMap;
      let googleSpot = true;
      props.getNearestSpots(
        id,
        info.coords.latitude,
        info.coords.longitude,
        googleSpot,
        searchText
      );
    });
  };

  /*
  * checkin on current location
  */
  const checkinOnSpot = () => {
    let form = checkinForm;
    form.spot = {};
    setCheckinForm(form);

    Geolocation.getCurrentPosition((info) => {
      setCurrentCoords({
        lat: info.coords.latitude,
        lng: info.coords.longitude,
      });
      setIsSecondStep(true);
    });
  };

  /*
  * After checkin center on spot with increasing zoom level
  */
  const centerOnSpot =( cord, id, distance ) => {
    props.setCenterCord({centerCords : cord, id: id, zoomLevel: 20})
    Toast.show(`this spot is ${distance}m far away`, {position: Toast.positions.CENTER})
      props.onCloseModal();
	}

  /*
  * Render nearest spot list detail
  */
  const spotListDetail = (item, index) => {
    let distance = Math.round(item.distance);
    if (item.can_check_in == true) {
      return (
        <Ripple
          style={styles.userDetail}
          rippleColor="#ccc"
          rippleOpacity={0.2}
          rippleDuration={700}
          onPress={() =>selectSpot(item)}
          key={index}
        >
          <View style={styles.userImgCon}>
            <Image
              style={styles.userImg}
              source={renderImage(item.image)}
            />
          </View>
          <View style={styles.userCon}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name_local}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              {item.address}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              Distance: {distance}m
            </Text>
          </View>
          {item.within_map && <View style={styles.markerCon} >
            <Icon type="FontAwesome5" name={"map-marked-alt"} style={styles.markerIcon} />
          </View>}
        </Ripple>
      );
    } else {
      return (
        <Ripple
          style={[styles.userDetail, styles.dark]}
          rippleColor="#ccc"
          rippleOpacity={0.2}
          rippleDuration={700}
          onPress={() => centerOnSpot([item.longitude, item.latitude], item.id,distance)}
          key={index}
        >
          <View style={styles.userImgCon}>
            <Image
              style={styles.userImg}
              source={renderImage(item.image)}
            />
          </View>
          <View style={styles.userCon}>
            <Text numberOfLines={1} style={styles.name}>
              {item.name_local}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              {item.address}
            </Text>
            <Text numberOfLines={1} style={styles.text}>
              Distance: {distance}m
            </Text>
          </View>
        </Ripple>
      );
    }
  };

  /*
  * Render checkin view
  */
  const spotList = () => {
    if (props.fetchingNearestSpot) {
      return <ContentLoader />;
    } else if (
      props.googleSpotList &&
      props.googleSpotList.length &&
      searchText
    ) {
      let filteredList = props.googleSpotList.filter(
        (item) => item.name_local.indexOf(searchText) != -1
      );
      return filteredList.map((item, index) => {
        return (
          <Ripple
            style={styles.userDetail}
            rippleColor="#ccc"
            rippleOpacity={0.2}
            rippleDuration={700}
            onPress={() => selectSpot(item, "google_spot")}
            key={index}
          >
            <View style={styles.userImgCon}>
              <Image
                style={styles.userImg}
                source={
                  renderImage(
                    //"https://maps.googleapis.com/maps/api/place/photo?maxwidth=450&photoreference=" +
                      item.image 
                     // +"&key=AIzaSyD8zNmW2YZdb_TC6CHpzdaI2y7aAfSUHZQ"
                  )
                }
              />
            </View>
            <View style={styles.userCon}>
              <Text numberOfLines={1} style={styles.name}>
                {item.name_local}
              </Text>
              <Text numberOfLines={1} style={styles.text}>
                {item.address}
              </Text>
            </View>
            {item.within_map && <View style={styles.markerCon} >
            <Icon type="FontAwesome5" name={"map-marked-alt"} style={styles.markerIcon} />
          </View>}
          </Ripple>
        );
      });
    } else {
      return props.nearestSpotList.map((item, index) => {
        return spotListDetail(item, index);
      });
    }
  };

  /*
  * Render checkin view
  */
  const renderSpotList = () => {
    return (
      <Animated.ScrollView
        style={[styles.friendslistCon, { opacity: stepTransitionout }]}
      >
        <Text style={styles.totalNo}>
          <FormatText variable="common.checkin" />
        </Text>
        <View style={styles.searchWrapper}>
          <View style={styles.searchBar}>
            <TextInput
              style={styles.textBox}
              placeholder={convertText("common.search_spot", lang)}
              onChangeText={(text) => onSearch(text)}
              value={searchText}
            />
            <Icon
              type="FontAwesome5"
              name={"search"}
              style={styles.searchIcon}
            />
          </View>
        </View>
        <View style={styles.buttonCon}>
          <TouchableOpacity
            style={styles.checkinBtn}
            onPress={() => checkinOnSpot()}
          >
            <Text style={styles.checkinBtnText}>
              <FormatText variable="common.on_current_loc" />
            </Text>
          </TouchableOpacity>
        </View>
        {spotList()}
      </Animated.ScrollView>
    );
  };


  /*
  * checkin
  */
  const doCheckin = () => {
    let formData = checkinForm;
    formData.mapper_id = props.currentMap /*props.map.mapDetail.id;*/
    let ownerId = props.userId;
    let threadId = props.currentMap;
    let data = {lets_checkin: true, latitude: (currentCoords && currentCoords.lat) || checkinForm.nearestspot.latitude || checkinForm.google_spot.latitude, longitude: (currentCoords && currentCoords.lng) || checkinForm.nearestspot.longitude || checkinForm.google_spot.longitude}
    
    if (isEnabled) {
      Alert.alert(
        setLoading(true),
        convertText("common.do_you", lang),
        [
          {
            text: convertText("common.no", lang),
            onPress: () => {
              setLoading(false);
            },
            style: "cancel",
          },
          {
            text: convertText("common.yes", lang),
            onPress: () => {
              props
                .dispatch(spotCheckin(formData, currentCoords))
                .then((res) => {
                  setLoading(false);
                  props.onCloseModal();
                  props.dispatch(setToggleState(true))
                  message && props.dispatch(postApiPosts(message, [], threadId, ownerId, 'checkin_map', data))
                });
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        setLoading(true),
        convertText("common.do_you", lang),
        [
          {
            text: convertText("common.no", lang),
            onPress: () => {
              setLoading(false);
            },
            style: "cancel",
          },
          {
            text: convertText("common.yes", lang),
            onPress: () => {
              props
                .dispatch(spotCheckin(formData, currentCoords))
                .then((res) => {
                  setLoading(false);
                  props.onCloseModal();
                  props.dispatch(setToggleState(true))
                  message && props.dispatch(postApiPosts(message, [], threadId, ownerId, 'checkin_map', data))
                  /*if(Object.keys(formData.google_spot).length !== 0){
                    return
                  } else if(Object.keys(formData.nearestspot).length !== 0){
                    return
                  } else {
                    props.setCenterCord({centerCords : centerCords, id: props.auth.userData.id, zoomLevel: 20})
                  }*/
                });
            },
          },
        ],
        { cancelable: false }
      );
    }
  };
  // const doCheckin = () => {
  //   setLoading(true)
  //   let formData = checkinForm;
  //   if (isEnabled) {
  //     formData.mapper_id = props.map.currentMap
  //   }
  //   props.dispatch(spotCheckin(formData, currentCoords)).then(res => {
  //     setLoading(false)
  //     props.onCloseModal()
  //   })
  // }

  /*
  * Render view on final step (on which position user wants to checkin)
  */
  const checkedinPosition = () => {
    if (currentCoords) {
      return (
        <View style={styles.selectedLocationBtn}>
          <View style={[styles.checkinBtn, styles.checkinBtnSelected]}>
            <Text
              style={[styles.checkinBtnText, styles.checkinBtnTextSelected]}
            >
              <FormatText variable="common.checked_in_on" />
            </Text>
          </View>
        </View>
      );
    } else if (checkinForm.nearestspot /*&& checkinForm.nearestspot.id*/) {
      return (
        <View>
          <View style={[styles.userDetail, styles.userDetailSelected]}>
            <View style={styles.userImgCon}>
              <Image
                style={styles.userImg}
                source={renderImage(checkinForm.nearestspot.image)}
              />
            </View>
            <View style={styles.userCon}>
              <Text style={styles.name}>
                {checkinForm.nearestspot.name_local}
              </Text>
              <Text style={styles.text}>{checkinForm.nearestspot.address}</Text>
            </View>
          </View>
        </View>
      );
    } else {
      return (
        <View>
          <View style={[styles.userDetail, styles.userDetailSelected]}>
            <View style={styles.userImgCon}>
              <Image
                style={styles.userImg}
                source={renderImage(checkinForm.google_spot.image)}
              />
            </View>
            <View style={styles.userCon}>
              <Text style={styles.name}>
                {checkinForm.google_spot.name_local}
              </Text>
              <Text style={styles.text}>{checkinForm.google_spot.address}</Text>
            </View>
          </View>
        </View>
      );
    }
  };

  /*
  * Render Final step for checkin
  */
  const renderCheckinForm = () => {
    return (
      <View style={[styles.friendslistCon, styles.checkinForm]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => setIsSecondStep(false)}
        >
          <Icon
            type="FontAwesome5"
            name={"chevron-left"}
            style={styles.backBtnIcon}
          />
        </TouchableOpacity>
        <Text style={styles.totalNo}>
          <FormatText variable="common.checkin_to" />
        </Text>
        {checkedinPosition()}
        <View>
          <Text><FormatText variable="msgscomp.message" /></Text>
          <TextInput
            style={styles.checkinMsg}
            placeholder={convertText("common.write_message_checkin", lang)}
            onChangeText={(text) => onSearch(text, 'message')}
            value={message}
            multiline={true}
          />
        </View>
        <View style={styles.btnBox}>
          <Text style={styles.heading}>
            <FormatText variable="common.share_with" />
          </Text>
          <View style={styles.btnsCon}>
            {accessArray.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.btn,
                    checkinForm.access === item.value && styles.btnSelected,
                  ]}
                  onPress={() => onSelectTime(item.value, "access")}
                >
                  <View
                    style={[
                      styles.radioBtn,
                      checkinForm.access === item.value &&
                        styles.radioBtnSelected,
                    ]}
                  >
                    <View style={styles.radioDot} />
                  </View>
                  <Text
                    style={[
                      checkinForm.access === item.value && styles.selectedText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.btnBox}>
          <Text style={styles.heading}>
            <FormatText variable="common.track_for" />
          </Text>
          <View style={styles.btnsCon}>
            {timeArray.map((item, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.btn,
                    checkinForm.time === item.value && styles.btnSelected,
                  ]}
                  onPress={() => onSelectTime(item.value, "time")}
                >
                  <View
                    style={[
                      styles.radioBtn,
                      checkinForm.time === item.value &&
                        styles.radioBtnSelected,
                    ]}
                  >
                    <View style={styles.radioDot} />
                  </View>
                  <Text
                    style={[
                      checkinForm.time === item.value && styles.selectedText,
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/*<View style={styles.btnBox}>
          <Text style={styles.heading}>
            <FormatText variable="common.within_map" />
          </Text>
          <View style={styles.btnsCon}>
            <Switch
              trackColor={{ false: "#767577", true: primaryColor }}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={isEnabled}
            />
          </View>
        </View>*/}
        <View style={styles.sendBtn}>
          <OwnButton
            buttonText={convertText("common.check_in", lang)}
            onPress={() => doCheckin()}
            disabled={!checkinForm.time}
            loading={loading}
          />
        </View>
      </View>
    );
  };

  const renderCheckinUser = () => {
    return <View style={styles.checkinUserCon}>
            <Text style={styles.totalNo}>
              <FormatText variable="messages.checkin_msg" />
            </Text>
            <View style={styles.btnCon}>
              <Text><FormatText variable="msgscomp.message" /></Text>
              <TextInput
                style={[styles.checkinMsg, {height: 80}]}
                placeholder={convertText("common.write_message_checkin", lang)}
                onChangeText={(text) => onSearch(text, 'message')}
                value={message}
                multiline={true}
              />
            </View>
            <View style={styles.btnCon}>
              <OwnButton
                buttonText={convertText("common.check_in", lang)}
                onPress={() => checkinMessage()}
                disabled={message === ''}
                loading={loading}
              />
            </View>
          </View>
  }

  const sendCheckinMessage = (message, data) => {    
    let threadId = props.currentMap
    let ownerId = props.userId;
    props.dispatch(setToggleState(true))
    props.dispatch(postApiPosts(message, [], threadId, ownerId, 'checkin_map', data)).then(res => {
      setLoading(false)
      if (res.status === 'error') {
        Toast.show(res.message)
      } else {
        props.setCenterCord({centerCords: [data.longitude, data.latitude], id: 'user_center'})    
      }
    })
  }


  const checkinMessage = () => {
    setLoading(true)
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){
      if (!props.checked_in) {
        Alert.alert(
          (convertText("message.userCheckin",lang)),
          (convertText("message.userCheckinPost",lang)),
          [
            {
              text: convertText("message.no",lang),
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { 
              text: convertText("message.yes",lang), 
              onPress: () => {
                Geolocation.getCurrentPosition(info => {
                  let data = {lets_checkin: true, latitude: info.coords.latitude, longitude: info.coords.longitude}
                  sendCheckinMessage(message, data) 
                });
                props.onCloseModal()
              }
            }
          ],
          { cancelable: false }
        );
      } else {
        props.onCloseModal()
          Geolocation.getCurrentPosition(info => {
            let data = {lets_checkin: true, latitude: info.coords.latitude, longitude: info.coords.longitude}
            sendCheckinMessage(message, data) 
          });
      }
    } else {
      alert(convertText("map.please_turn_on_your_location", lang))
    }
  }

  const renderScreen = () => {
    if(props.checkinMessage){
      return <>
              {renderCheckinUser()}
            </>
    } else {
      return <>
              {!isSecondStep && renderSpotList()}
              {isSecondStep && renderCheckinForm()}
              {/* <View style={styles.sendBtn}>
                        <OwnButton 
                          buttonText="CHECKIN" 
                          onPress={() => doCheckin()} 
                          disabled={!checkinForm.time}
                          loading={loading}
                        />
                      </View> */}
            </>
    }    
  }

  return (
    <View style={styles.mainCon}>
      {renderScreen()}  
    </View>  
  );
};

const styles = StyleSheet.create({
  mainCon: {
    //paddingHorizontal: 15,
    flex: 1,
  },
  userDetail: {
    paddingVertical: 8,
    flexDirection: "row",
    position: "relative",
    //marginHorizontal: -15,
    paddingHorizontal: 15,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 5,
    backgroundColor: '#ccc'
  },
  userImg: {
    width: "100%",
    height: "100%",
  },
  userCon: {
    marginLeft: 10,
    width: width - 110,
  },
  name: {
    fontSize: 15,
    fontWeight: "500",
  },
  iconCon: {
    justifyContent: "center",
    alignItems: "center",
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
  },
  btnIcon: {
    fontSize: 20,
    color: "grey",
  },
  textBox: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
    paddingLeft: 40,
    color: '#000'
  },
  searchIcon: {
    color: "grey",
    fontSize: 16,
    position: "absolute",
    top: 25,
    left: 15,
  },
  totalNo: {
    fontSize: 20,
    fontWeight: "500",
    alignSelf: "center",
    marginBottom: 10,
  },
  text: {
    color: "grey",
  },
  checkinForm: {
    position: "absolute",
    width: "100%",
    height: "100%",
    paddingHorizontal: 15
  },
  backBtnIcon: {
    fontSize: 20,
  },
  backBtn: {
    position: "absolute",
    left: 5,
    top: 5,
    width: 30,
    alignItems: "center",
  },
  timeCon: {
    fontSize: 15,
    color: primaryColor,
    borderWidth: 1,
    alignItems: "center",
    alignSelf: "center",
    padding: 0,
    borderRadius: 4,
    borderColor: primaryColor,
    opacity: 0.4,
  },
  sendBtn: {
    position: "absolute",
    left: 15,
    bottom: 20,
    width: "100%",
  },
  pickerElement: {
    padding: 0,
  },
  btnsCon: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  btn: {
    borderWidth: 2,
    borderRadius: 20,
    borderColor: primaryColor,
    flexDirection: "row",
    paddingVertical: 5,
    marginRight: 10,
    paddingHorizontal: 8,
  },
  radioBtn: {
    width: 16,
    height: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: primaryColor,
    marginRight: 5,
  },
  heading: {
    marginBottom: 10,
    fontSize: 12,
  },
  btnBox: {
    marginBottom: 10,
  },
  btnSelected: {
    backgroundColor: primaryColor,
  },
  radioBtnSelected: {
    borderColor: "#fff",
  },
  selectedText: {
    color: "#fff",
  },
  radioDot: {
    width: 6,
    height: 6,
    backgroundColor: "#fff",
    borderRadius: 10,
    left: 3,
    top: 3,
  },
  userDetailSelected: {
    marginBottom: 10,
  },
  textBox: {
    backgroundColor: "#f5f5f5",
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 0,
    paddingLeft: 40,
  },
  searchIcon: {
    color: "grey",
    fontSize: 16,
    position: "absolute",
    top: 12,
    left: 15,
  },
  searchWrapper: {
    flexDirection: "row",
    paddingHorizontal: 15
  },
  searchBar: {
    width: "100%",
  },
  buttonCon: {
    width: "100%",
    paddingHorizontal: 15,
    marginTop: 10,
    height: 50,
  },
  checkinBtn: {
    backgroundColor: primaryColor,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  checkinBtnText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 14,
    paddingVertical: 4,
  },
  selectedLocationBtn: {
    marginBottom: 10,
  },
  checkinBtnSelected: {
    //paddingVertical: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: primaryColor,
  },
  checkinBtnTextSelected: {
    color: primaryColor,
  },
  heading: {
    marginBottom: 5,
  },
  picker: {
    borderWidth: 1,
    borderColor: "grey",
    borderRadius: 10,
  },
  pickerElement: {
    height: 40,
  },
  dark: {
    backgroundColor: '#f1f1f1'
  },
  checkinMsg: {
    height: 50,
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 10,
    borderRadius: 5,
    paddingTop: 10,
    marginVertical: 5,
    color: '#000'
  },
  markerCon: {
    //position: 'absolute'
  },
  markerIcon: {
    fontSize: 18,
    color: 'darkgrey'
  },
  checkinUserCon: {
    marginHorizontal: 20
  },
  btnCon: {
    marginTop: 10
  }
});
const mapStateToProps = (state) => ({
  //map: state.map,
  //uiControls: state.uiControls,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckinSpot);
