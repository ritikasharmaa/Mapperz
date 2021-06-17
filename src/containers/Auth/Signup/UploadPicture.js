
import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Content,
  Button,
  Icon
} from 'native-base';
import { primaryColor, secondColor } from '../../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import { CommonActions  } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import LinearGradient from 'react-native-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";
import EditImage from '../../../components/common/EditImage'
import {renderImage} from '../../../redux/Utility';
import {connect} from 'react-redux';
import { signup } from '../../../redux/api/auth'
import microValidator from 'micro-validator'
import validationHelpers from '../../../assets/validationHelpers';
import Toast from 'react-native-root-toast';
import is from 'is_js'
import FormatText from '../../../components/common/FormatText'
import { convertText } from '../../../redux/Utility'
import { getSpecificMapDetail } from '../../../redux/api/map';
import { clearUserDetail } from '../../../redux/actions/auth';
import ContentLoader from '../../../components/common/ContentLoader';

const { width, height } = Dimensions.get('screen');

const UploadPicture = (props) => {
  let lang = 'en'
  const modalRef = useRef(null)

  const [loading, setLoading] = useState(false)

  const profilePicture = () => {
    if(props.auth.user_detail.profile_pic){
      return <Image source={{uri: props.auth.user_detail.profile_pic.uri}} style={{width: '100%', height: '100%'}}/>
    } else {
      return <Icon type="FontAwesome5" name={'camera'} style={styles.icon} />
    }
  }
  const hitSignUp = () => {
    setLoading(true)
    let detail = props.auth.user_detail
    props.dispatch(signup(detail)).then((res) => {
        // props.navigation.navigate('Home', {data:1})  
        // console.log(res, "res");
        // props.navigation.navigate('Footer', {
        //   routeId : 0
        // })
        props.dispatch(getSpecificMapDetail(res.home_mapper_id)).then(res => {
          props.dispatch(clearUserDetail())
          setLoading(false)
          if (res) {
            props.navigation.navigate('Footer', {
              routeId : 0
            })
          }
        })
     
    }).catch(err => {
      setLoading(false)
    })
  }

  const goToHomeBase = () => {
    props.navigation.navigate('HomeBase')
  }

	return(
    <Container style={styles.mainCon} >
      <View style={styles.nameCon}>
        <TouchableOpacity style={styles.imageCon} onPress={() => modalRef.current.open()}>
          {profilePicture()}
        </TouchableOpacity>
        <Text style={styles.text}><FormatText variable='signup.upload_your_photo' /></Text>          
      </View>
      {/* <TouchableOpacity style={styles.continueBtnCon} onPress={() => hitSignUp()}>
        <Text style={styles.continueBtn}>{loading ? 'Loading...' : <FormatText variable='signup.submit' />}</Text>
      </TouchableOpacity> */}
      <TouchableOpacity style={styles.continueBtnCon} onPress={() => goToHomeBase()}>
        <Text style={styles.continueBtn}><FormatText variable='signup.continue' /></Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.skipBtnCon} onPress={() => goToHomeBase('skip')} >
        <Text style={styles.skipBtn}><FormatText variable='signup.skip' /></Text>
      </TouchableOpacity>
      {loading && <ContentLoader />}
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
          }
        }}
      >
        <EditImage removePhoto uploadPic hideModal={() => modalRef.current.close()} />
      </RBSheet>
    </Container>
	)
}
const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  background: {
    width: '100%',
    height: '100%'
  },
  nameCon: {
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center'
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: primaryColor
  },
  imageCon: {
    width: 200,
    height: 200,
    backgroundColor: '#f5f4f4',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 100,
    marginBottom: 20,
    overflow: 'hidden'
  },
  icon: {
    color: '#dfe1df',
    fontSize: 40,
  },
  continueBtnCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor:primaryColor,
    width: 130
  },
  continueBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    color: '#fff'
  },
  skipBtnCon: {
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor:'#fff',
    borderRadius:20, 
    padding:10,
    borderWidth: 1,
    borderColor: primaryColor,
    width: 130
  },
  skipBtn: {
    color: secondColor
  }
})
const mapStateToProps = (state) => ({
  auth: state.auth
});
const mapDispatchToProps = (dispatch) => ({
dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(UploadPicture); 
