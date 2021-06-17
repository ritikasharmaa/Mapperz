import React, {useState} from 'react';
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
  Platform
} from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import FormatText from './FormatText'
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import { uploadProfilePic } from '../../redux/api/auth'
import { editGroup, removeImage, sendMessages } from '../../redux/api/messages'
import { userDetail } from '../../redux/actions/auth'
import ImgToBase64 from 'react-native-image-base64';

const EditImage = (props) => {

  const [imageArr, setImageArr] = useState([]);

  const removePicture = () => {
    let userObject = props.auth.userData
    let objectId = props.auth.userData.id
    let type = "User"
    if (props.groupImage) {
      type = "Conversation";
      objectId = props.messages.current_thread_detail.id;
    }
    props.dispatch(removeImage(type, objectId, userObject))
    props.hideModal()
  }

  /*
  * Open Camera of device to click picture
  */
  const launchCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 300,
      cropping: true,
      //multiple: props.multi
    }).then(image => {
      props.hideModal()
      let photo = {
          uri: image.path,
          type: "multipart/form-data",
          name: "image.png",
      };
      let threadId = props.messages.current_thread_detail.id
      let threadObject = props.messages.current_thread_detail
      if (props.groupImage){
        let photo = {
          uri: image.path,
          type: "multipart/form-data",
          name: "image.png",
        };
        props.dispatch(editGroup(photo, threadId))
      } /*
      * API call for Send Media
      */
      else if(props.onSend){
        let sendingMessage = {
          body: '',
          owner_id: props.auth.userData.id,
          owner_type: 'User',
          images: image
        }
        props.dispatch(sendMessages(sendingMessage, threadId, threadObject, props.auth.userData.id)).then(res => {
        //  props.renderMedia(res)
        })
      } 
      /*
      * Action call to upload Profile Picture
      */
      else if(props.uploadPic){
        let photo = {
          uri: image.path,
          type: "multipart/form-data",
          name: "image.png",
        };
        props.dispatch(userDetail(photo, 'profile_pic'))
      }
      /*
      * API call for change Profile Picture
      */
      else {
        let photo = {
          uri: image.path,
          type: "multipart/form-data",
          name: "image.png",
        };
        props.dispatch(uploadProfilePic(photo))
      } 
    }); 
  }

  /*
  * Open device image library for select pictures
  */
  const launchImageLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 300,
      //cropping: true,
      compressImageQuality: 0.2,
      multiple: true
    }).then(image => {
      props.hideModal()
      let threadId = props.messages.current_thread_detail.id
      let threadObject = props.messages.current_thread_detail
      if (props.groupImage){

        let photo = {
          uri: image.path,
          type: "multipart/form-data",
          name: "image.png",
        };
        props.dispatch(editGroup(photo, threadId))
      } 
      /*
      * API call for Send Media
      */
      else if(props.onSend){
        let sendingMessage = {
          body: '',
          owner_id: props.auth.userData.id,
          owner_type: 'User',
          images: image
        }
        props.dispatch(sendMessages(sendingMessage, threadId, threadObject, props.auth.userData.id)).then(res => {
        //  props.renderMedia(res)
        })
      } 
      /*
      * Action call to upload Profile Picture
      */
      else if(props.uploadPic){
        let photo = {
          uri: image[0].path,
          type: "multipart/form-data",
          name: "image.png",
        };
        props.dispatch(userDetail(photo, 'profile_pic'))
      }
      /*
      * API call for change Profile Picture
      */
      else {
        let photo = {
          uri: image[0].path,
          type: "multipart/form-data",
          name: "image.png",
        };
        props.dispatch(uploadProfilePic(photo))
      }
      /*ImgToBase64.getBase64String(image.path)
      .then(base64String => {
        props.dispatch(uploadProfilePic(base64String))
      })*/
    });
  }

  /*
  * Render remove button to remove image
  */
  const removeBtn = () => {
    if(!props.removePhoto){
      return <View style={styles.itemCon}>
              <Ripple style={styles.imgCon} onPress={() => removePicture()}>
                <Image style={styles.img} source={require('../../assets/images/trash.png')} />
              </Ripple>
              <Text style={styles.label}>Remove Photo</Text>
            </View>
    }
  }

	return(
		<View style={styles.mainCon}>
      <Text style={styles.heading}>Profile Photo</Text>
      <View style={styles.subCon}>
        {removeBtn()}
        <View style={styles.itemCon}>
          <Ripple style={styles.imgCon} onPress={() =>launchCamera()}>
            <Image style={styles.img} source={require('../../assets/images/camera.png')} />
          </Ripple>
          <Text style={styles.label}><FormatText variable='signup.camera' /></Text>
        </View>
        <View style={styles.itemCon}>
          <Ripple style={styles.imgCon} onPress={() =>launchImageLibrary()}>
            <Image style={styles.img} source={require('../../assets/images/gallary.png')} />
          </Ripple>
          <Text style={styles.label}><FormatText variable='signup.gallery' /></Text>
        </View>
      </View>
		</View>
	)
}

const styles = StyleSheet.create({
	mainCon: {
		marginHorizontal: 15,   
	},
  heading: {
    fontWeight: '600',
    marginBottom : 20,
  },
  subCon: {
    flexDirection: 'row',
  },
  itemCon: {
    width: 60,
    height: 60,
    marginRight: 15,
  },
  img: {
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 13,
    textAlign: 'center',
    color: 'grey',
    marginTop: 5,
  },
  imgCon: {
    borderRadius: 30,
    overflow: 'hidden',
  }
})

const mapStateToProps = (state) => ({
  uiControls: state.uiControls,
  messages: state.messages,
  auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
  dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(EditImage);
