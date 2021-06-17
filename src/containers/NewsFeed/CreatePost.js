import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  Dimensions,
  TextInput,
  Modal,
} from "react-native";
import { Button, Container, Content, Icon } from "native-base";
import Header from "../../components/common/Header";
import { connect } from "react-redux";
import Ripple from "react-native-material-ripple";
import { primaryColor } from "../../redux/Constant";
import ImagePicker from "react-native-image-crop-picker";
import { postApiPosts } from "../../redux/api/feed";
import ContentLoader from "../../components/common/ContentLoader"
import{ renderImage, convertText } from '../../redux/Utility'
import FormatText from '../../components/common/FormatText'
import {setToggleState} from '../../redux/actions/map'


const { width, height } = Dimensions.get("screen");

const CreatePost = (props) => {
  let lang = props.uiControls.lang

  const [inputValue, setInputValue] = useState("");
  const [imageArr, setImageArr] = useState([]);
	const [loading, setLoading] = useState(false)

  const onChangeHandler = (event) => {
    setInputValue(event);
  };
  
  const launchImageLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      compressImageQuality: 0.2,
      multiple: true,
    }).then((images) => {
      setImageArr(images);
    })
  };

  const handleSavePost = () => {
    let threadId = props.map.mapDetail.id;
    let ownerId = props.auth.userData.id
    if (inputValue) {
      setLoading(true)
      props.dispatch(setToggleState(true))
      props.dispatch(postApiPosts(inputValue, imageArr, threadId, ownerId)).then(res => {
        setLoading(false)
        setImageArr([])
        setInputValue('')
        // props.navigation.navigate('Home')
        props.navigation.navigate('Footer', {
          routeId : 0
        })
      })		
    }
  };

  const renderImages = () => {
     if (imageArr.length) {
      return imageArr.map(
        (item, index) =>
          index < 4 && (
            <View style={[styles.selectedImgCon, imageArr.length === 1 && {width: '100%'}]} key={index}>
              <Image source={{ uri: item.path }} style={styles.selectedImg} />
              {index === 3 && imageArr.length > 4 && 
                <View style={styles.overlay}>
                  <Text style={styles.overlayText}> +{imageArr.length - 4}</Text>
                </View>
              }
            </View>
          )
      );
     }
	};

	const renderLoader = () => {
		if(loading){
  		return  <View style={styles.loaderCon}>
          			<ContentLoader />
          		</View>
		}
	}

  const renderUserDetail = () => {
    return  <View
              style={styles.userDetail}
              rippleColor="#ccc"
              rippleOpacity={0.2}
              rippleDuration={700}
            >
              <View style={styles.userImgCon}>
                <Image
                  style={styles.userImg}
                  source={renderImage(props.auth.userData.profile_image, 'user')}
                />
              </View>
              {props.auth.userData.nick_name ? 
              <View style={styles.userCon}>
                <Text style={styles.name}>{props.auth.userData.nick_name}</Text>
              </View>
              :
              <View style={styles.userCon}>
                <Text style={styles.name}>{props.auth.userData.first_name + ' ' + props.auth.userData.last_name}</Text>
              </View>
              }
            </View>
  }
  return (
    <Container> 
      <Header
        navigation={props.navigation}
        backEnd
        blackBackBtn
				nextScreen="Footer"
				rightBtn="paper-plane"
				onRightBtnClick={handleSavePost}
      />
      <Content>
        <View style={styles.mainCon}>
          {renderUserDetail()}
          <View>
            <TextInput
              style={styles.textInput}
              multiline={true}
              numberOfLines={6}
              placeholder={convertText("sidebarcomp.whatsInYourMind", lang)}
              placeholderTextColor="grey"
              onChangeText={onChangeHandler}
              value={inputValue}
            />
          </View>
        </View>
        <View style={styles.selectedCon}>{renderImages()}</View>
      </Content>
			{renderLoader()}
      <View style={styles.bottomCon}>
        <Ripple
          style={styles.field}
          rippleOpacity={0.2}
          rippleDuration={700}
          onPress={() => launchImageLibrary()}
        >
          <View style={styles.imgCon}>
            <Image
              source={require("../../assets/images/photo.png")}
              style={styles.img}
            />
          </View>
          <Text style={styles.fieldText}><FormatText variable='feed.photo' /></Text>
        </Ripple>
        {/*<Ripple style={styles.field} rippleOpacity={0.2} rippleDuration={700}>
          <View style={styles.imgCon}>
            <Image
              source={require("../../assets/images/location(1).png")}
              style={styles.img}
            />
          </View>
          <Text style={styles.fieldText}>Check in</Text>
        </Ripple>*/}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  mainCon: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  userDetail: {
    flexDirection: "row",
  },
  userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  userImg: {
    width: "100%",
    height: "100%",
  },
  userCon: {
    marginLeft: 10,
    justifyContent: "center",
  },
  name: {
    fontSize: 15,
    fontWeight: "bold",
  },
  textInput: {
    fontSize: 20,
    marginVertical: 10,
    color: '#000'
  },
  bottomCon: {
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  field: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  imgCon: {
    width: 22,
    height: 22,
    color: "grey",
  },
  img: {
    width: "100%",
    height: "100%",
  },
  fieldText: {
    paddingLeft: 15,
    fontSize: 16,
  },
  selectedCon: {
    flexDirection: "row",
    marginBottom: 3,
    flexWrap: "wrap",
    marginHorizontal: -2,
  },
  selectedImgCon: {
    width: "50%",
    height: 200,
    borderWidth: 2,
    borderColor: "#fff",
  },
  selectedImg: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    zIndex: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    fontSize: 22,
    fontWeight: "600",
    color: "#fff",
  },
  postBtn: {
    width: 30,
    position: "relative",
    height: 30,
    borderRadius: 15,
    overflow: "hidden",
    left: 190,
    top: 11,
  },
  postBtnText: {
    color: primaryColor,
    fontSize: 18,
  },
  loaderCon: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 10
  }
});
const mapStateToProps = (state) => ({
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
)(CreatePost);
