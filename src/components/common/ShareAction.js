import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Icon, Button, CardItem, Left, Thumbnail, Body } from "native-base";
import { primaryColor } from "../../redux/Constant";
import Ripple from "react-native-material-ripple";
import { connect } from "react-redux";
import { renderImage, convertText } from "../../redux/Utility";
import moment from "moment";
import { getSharePost } from "../../redux/api/feed";
import SyncStorage from "sync-storage";
import uiControls from "../../redux/reducer/uiControls";

const { width, height } = Dimensions.get("screen");

const ShareAction = (props) => {

  let lang = props.uiControls.lang
  let userData = SyncStorage.get("userData");
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false)

  const onChangeHandler = (event) => {
    setInputValue(event);
  };

  const handleSharePost = () => {
    let threadId = props.homePage ? props.auth.userData.id : props.map.currentMap;
    let sharedId = props.homePage ? props.map.currentMap : props.currentItem.id;  
    let key = props.homePage && 'homepage'    
    setLoading(true)
    props.dispatch(getSharePost(sharedId, threadId, inputValue, key)).then(res => {
      setLoading(false)
      props.onClose()
    })   
  };

  const renderPostUserDetail = (userData) => {
    return (
      <CardItem>
        <Left>
          <Thumbnail
            source={renderImage(props.auth.userData.profile_image)}
            style={styles.headerImg}
          />
          <Body>
            <Text style={styles.blueColor}>
              {props.auth.userData.first_name ? props.auth.userData.first_name + " " + props.auth.userData.last_name : props.auth.userData.nick_name ||
                "No Name Given"}
            </Text>
          </Body>
        </Left>
      </CardItem>
    );
  };
  return (
    <TouchableOpacity style={styles.mainCon}>
      <View>{renderPostUserDetail()}</View>
      <View style={styles.searchBarCon}>
        <TextInput
          style={styles.searchBar}
          placeholder={convertText('common.say_something', lang)}
          onChangeText={onChangeHandler}
          placeholderTextColor="grey"
          value={inputValue}
          multiline
        />
        <Button 
          style={[styles.postBtn, !inputValue && {backgroundColor: 'gray'}]} 
          onPress={() => handleSharePost()}
          disabled={!inputValue || loading}
        >
          <Text style={styles.postBtnText}>{loading ? convertText('common.sharing', lang) : convertText('common.share_now', lang)}</Text>
        </Button>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  searchBarCon: {
    paddingHorizontal: 20,
  },
  searchBar: {
    width: '100%',
    fontSize: 20,
    marginBottom: 10,
    height: 80,
    color: '#000'
  },
  postBtn: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    width: 150,
    height: 40,
    alignSelf: 'flex-end'
  },
  postBtnText: {
    color: "#ffff",
    fontSize: 15,
  },

  icon: {
    fontSize: 20,
    color: primaryColor,
    marginRight: 10,
  },
  imgCon: {
    width: 50,
    height: 50,
    marginRight: 5,
    borderRadius: 5,
    overflow: "hidden",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    backgroundColor: "#000",
    opacity: 0.4,
    position: "absolute",
    width: 50,
    height: 50,
    zIndex: 99,
  },
  crossIcon: {
    position: "absolute",
    zIndex: 100,
    color: "#fff",
    fontSize: 12,
    right: 5,
    top: 4,
  },
  blueColor: {
    color: primaryColor,
    fontWeight: "bold",
  },
  headerImg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

const mapStateToProps = (state) => ({
  //feed: state.feed,
  map: state.map,
  auth: state.auth,
  uiControls: state.uiControls
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ShareAction);
