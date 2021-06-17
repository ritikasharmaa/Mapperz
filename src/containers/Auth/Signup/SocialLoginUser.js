import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { Container,Content, Icon } from "native-base";
import { primaryColor } from "../../../redux/Constant";
import Ripple from "react-native-material-ripple";
import { CommonActions } from "@react-navigation/native";
import SyncStorage from "sync-storage";
import LinearGradient from "react-native-linear-gradient";
import { userDetail } from "../../../redux/actions/auth";
import { connect } from "react-redux";
import FormatText from "../../../components/common/FormatText";
import { convertText, renderImage } from "../../../redux/Utility";
import Toast from "react-native-root-toast";
import EditImage from "../../../components/common/EditImage";
import RBSheet from "react-native-raw-bottom-sheet";

const { width, height } = Dimensions.get("screen");

const SocialLoginUser = (props) => {
  useEffect(() => {
    let data = props.route.params.data;
    if (data && data.photo) {
      let photo = {
        uri: data.photo,
        type: "multipart/form-data",
        name: "image.png",
      };
      props.dispatch(userDetail(photo, "profile_pic"));
    }
    if (data && data.type == 'facebook') {
      let photo = {
        uri: `https://graph.facebook.com/${data.id}/picture?type=large`,
        type: "multipart/form-data",
        name: "image.png",
      };
      props.dispatch(userDetail(photo, "profile_pic"));
    } else{
      let photo = {
        uri: data.picture,
        type: "multipart/form-data",
        name: "image.png",
      };
      props.dispatch(userDetail(photo, "profile_pic"));
    }

    props.dispatch(userDetail(data.name, 'user_name'));
    props.dispatch(userDetail(data.email, 'email'));
    props.dispatch(userDetail(data.type, 'type'));
      props.dispatch(userDetail(data.id, 'uid'));
    props.dispatch(userDetail(data.first_name, 'first_name'));
    props.dispatch(userDetail(data.last_name, 'last_name'));

  }, []);

  let lang = "en";
  let data = props.route.params.data;
  const modalRef = useRef(null);

  const profilePicture = () => {
    if (data && data.photo) {
      return (
          <Image
            source={renderImage(data.photo) }
            style={{ width: "100%", height: "100%" }}
          />
      );
    }
    if (data && data.type == 'facebook') {
      return (
          <Image
            source={{ uri: `https://graph.facebook.com/${data.id}/picture?type=large` }}
            style={{ width: "100%", height: "100%" }}
          />
      );
    } if (data && data.type == 'google') {
      return (
        <Image
          source={{ uri: data.picture }}
          style={{ width: "100%", height: "100%" }}
        />
    );
    } else {
      return <Icon type="FontAwesome5" name={"camera"} style={styles.icon} />;
    }
  };
  const onChange = (text, key) => {
    props.dispatch(userDetail(text, key));
  };
  const goToNext = () => {
    if (data.name === "") {
      Toast.show(convertText("login.fieldReq", lang));
    } else {
      // props.dispatch(userDetail(data.name, 'user_name'));
      //  props.dispatch(userDetail(data.email, 'email'));
      props.navigation.navigate("HomeBase", { data: "data" });
      return;
    }
  };
  return (
    <Container style={styles.mainCon}>
      <Content>

      {/* <LinearGradient
        colors={["#9248e7", "#9949e8", "#bb4fef", "#9949e8", "#9248e7"]}
        style={styles.background}
      > */}
        <View style={styles.nameCon}>
          <Text style={styles.text}>Please Verify Your Details</Text>
          <View style={[{ alignItems: "center" }]}>
            <TouchableOpacity
              style={styles.imageCon}
              onPress={() => modalRef.current.open()}
            >
              {profilePicture()}
            </TouchableOpacity>
          </View>

          <Text style={styles.textMain}>Name</Text>
          <TextInput
            style={styles.inputBox}
            placeholder={convertText("signup.name.name", lang)}
            placeholderTextColor= 'black'
            value={props.auth.user_detail && props.auth.user_detail.user_name}
            onChangeText={(text) => onChange(text, "user_name")}
          /> 
          <Text style={[styles.textMain]}>Email</Text>
          <TextInput
            style={styles.inputBox}
            placeholder={convertText("signup.email_address", lang)}
            placeholderTextColor= 'black'
            value={props.auth.user_detail && props.auth.user_detail.email}
            onChangeText={(text) => onChange(text, "email")}
          />
        </View>
        <TouchableOpacity
          style={styles.continueBtnCon}
          onPress={() => goToNext()}
        >
          <Text style={styles.continueBtn}>
            <FormatText variable="signup.continue" />
          </Text>
        </TouchableOpacity>
      {/* </LinearGradient> */}
      <RBSheet
        ref={modalRef}
        height={180}
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
        <EditImage
          removePhoto
          uploadPic
          hideModal={() => modalRef.current.close()}
        />
      </RBSheet>
      </Content>
    </Container>
  );
};
const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
  },
  nameCon: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  textMain: {
    fontSize: 20,
    color:'black'
  },
  inputBox: {
    height: 50,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
    color: "grey",
    borderBottomWidth: 1,
    borderColor: "grey",
  },
  continueBtnCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
    marginTop:30,
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: primaryColor
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: "#fff",
  },
  imageCon: {
    width: 200,
    height: 200,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginBottom: 20,
    overflow: "hidden",
    borderWidth:0.5,
    borderColor:'grey'
  },
  icon: {
    color: "#dfe1df",
    fontSize: 40,
  },
});
const mapStateToProps = (state) => ({
  auth: state.auth,
});
const mapDispatchToProps = (dispatch) => ({
  dispatch,
});
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SocialLoginUser);
