import React, { useRef, useState, useEffect } from 'react';
import {  StyleSheet, 
          Dimensions, 
          ScrollView, 
          Image, 
          ImageBackground, 
          Platform, 
          View, 
          TouchableOpacity, 
          Modal, 
          Button,
          RefreshControl 
        } from 'react-native';
import { createStackNavigator, CommonActions  } from '@react-navigation/native';
import { StackActions, NavigationActions } from 'react-navigation';
import { Block, Text, theme, Input } from 'galio-framework';
import { Icon } from 'native-base'
import Header from '../../components/common/Header';
//import Footer from '../../components/common/Footer';
import {connect} from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import InvitaionForm from '../../components/common/InvitaionForm'
import ChangePasswordForm from '../../components/common/ChangePasswordForm'
import Ripple from 'react-native-material-ripple';
import {renderImage, CustomFont} from '../../redux/Utility';
import FormatText from '../../components/common/FormatText'
import ImageViewer from 'react-native-image-zoom-viewer';
import { primaryColor} from '../../redux/Constant'
import SelectLanguage from '../../components/common/SelectLanguage'
import EditImage from '../../components/common/EditImage'
import ContentLoader from '../../components/common/ContentLoader'
import { getProfile, getFriendsRequestList } from '../../redux/api/auth'
import { setActiveTabIndex } from '../../redux/actions/uiControls';

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

const Profile = (props) => {
  const [logingOut, setLogingOut] = useState(false)
  const [formType, setFormType] = useState('')
  const modalRef = useRef(null)
  const [imageViewer, setImageViewer] = useState(false)
  const [allImages, setAllImages] = useState([])
  const [refreshing, setRefreshing] = useState(false)

  //let Text = CustomFont

  const viewImages = (image) => { 
    let images = [
      {
        url: '',
        props: {
            //Or you can set source directory.
            source: image
        }
      }
    ]
    setAllImages(images)
    setImageViewer(true)
  }

  const logout = () => {
    setLogingOut(true)
    props.logout().then(res => {
      setLogingOut(false)
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: "GoToAuth",
            },
          ],
        })
      );
    }).catch(err => {
      setLogingOut(false)
    })
  }

  useEffect(() => {
    const listener = props.navigation.addListener('focus', () => {
       props.dispatch(setActiveTabIndex(5))
     });
    return () => {listener}
   }, [props.navigation]);
   
  const renderForm = () => {
    if ( formType === 'change_lang' ) {
      return <SelectLanguage hideModal={() => modalRef.current.close()} />
    } else if ( formType === 'change_pass' ) {
      return <ChangePasswordForm hideModal={() => modalRef.current.close()} />
    } else {
      return <InvitaionForm hideModal={() => modalRef.current.close()} />
    }
  }

  const renderHeight = () => {
    if ( formType === 'change_lang' ) {
      return 150
    } else if ( formType === 'change_pass' ) {
      return 300
    } else {
      return 400
    }
  }

  const onRefresh = () => {
    setRefreshing(true)
    props.dispatch(getFriendsRequestList())
    props.dispatch(getProfile()).then(res => {
      setRefreshing(false)
    })
  }

  return (
    <Block flex style={styles.profile}>
      <View style={{position:'absolute', zIndex: 10, width: '100%'}}>
        <Header centerHeading transParent navigation={props.navigation} nextScreen="Footer" threeDotMenu />
      </View>
      <Block flex>
        <TouchableOpacity disabled={!props.auth.userData.profile_image}>
          <ImageBackground
            source={renderImage(props.auth.userData.profile_image, 'user')}
            style={styles.profileContainer}
            imageStyle={styles.profileImage}>
          <View style={styles.imageoverlay} pointerEvents="none">
            {props.auth.loading && <ContentLoader size={40} color={'#fff'} />}
          </View>
          <Block flex style={styles.profileDetails}>
            <Block style={styles.profileTexts}>
             {props.auth.userData.nick_name ? <Text color="white" size={28} style={{ paddingBottom: 4 }}>{props.auth.userData.nick_name}</Text> : <Text color="white" size={28} style={{ paddingBottom: 8 }}>{props.auth.userData.first_name + ' ' +props.auth.userData.last_name}</Text>} 
              <Block row space="between">
                {/* <Block row>
                  <Block style={styles.pro}>
                    <Icon name="birthday-cake" type="FontAwesome5" style={[styles.menuIcon, {color: '#fff'}]} />
                    </Block>
                    <Text color="white" size={16} muted style={styles.seller}>{props.auth.userData.birthday}</Text>
                  </Block> */}
                  <Block>
                    <Text color={'white'} size={16} style={{ paddingBottom: 20 }}>{props.auth.userData.email}</Text>
                  </Block>
                </Block>
              </Block>
            </Block>
          </ImageBackground>
        </TouchableOpacity>
      </Block>
      <Block flex style={styles.options}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
            <Ripple style={styles.userDetail} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('Friends')}>
              <Block middle>
                <Text bold size={15} style={{marginBottom: 8}}>{props.auth.userData.friends ? props.auth.userData.friends.length : 0}</Text>
                <Text muted size={15}><FormatText variable='profile.friends'/></Text>
              </Block>
            </Ripple>
            <Ripple style={styles.userDetail} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('SentRequests')}>
              <Block middle>
                <Text bold size={15} style={{marginBottom: 8}}>{props.auth.requestData.outgoing_requests ? props.auth.requestData.outgoing_requests.length : 0}</Text>
                <Text muted size={15}><FormatText variable='profile.send_requests'/></Text>
              </Block>
            </Ripple>
            <Ripple style={styles.userDetail} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('Invites')}>
              <Block middle>
                <Text bold size={15} style={{marginBottom: 8}}>{props.auth.requestData.incoming_requests ? props.auth.requestData.incoming_requests.length : 0}</Text>
                <Text muted size={15}><FormatText variable='profile.invites'/></Text>
              </Block>
            </Ripple>
          </Block>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('EditProfile')}>
            <Block row style={styles.menuCon}>
              <Icon name="user-edit" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15}><FormatText variable='profile.edit_profile'/></Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => {setFormType('change_pass'); modalRef.current.open();}}>
            <Block row style={styles.menuCon}>
              <Icon name="lock" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15}><FormatText variable='profile.change_pass'/></Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => {setFormType('change_lang'); modalRef.current.open();}}>
            <Block row style={styles.menuCon}>
              <Icon name="language" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15}  style={styles.menuHead} size={15}><FormatText variable='profile.change_lang'/></Text>
              <Text style={styles.lang}>{props.uiControls.lang}</Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('FacebookFriends')}>
            <Block row style={styles.menuCon}>
              <Icon name="facebook" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15}><FormatText variable='profile.facebook_friends'/></Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('FindFriends')}>
            <Block row style={styles.menuCon}>
              <Icon name="users" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15}><FormatText variable='profile.find_friends'/></Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => props.navigation.navigate('UserContacts')}>
            <Block row style={styles.menuCon}>
              <Icon name="sms" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15}><FormatText variable='profile.invite_friends'/></Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => {setFormType('invite_friends'); modalRef.current.open();}}>
            <Block row style={styles.menuCon}>
              <Icon name="share-alt" type="FontAwesome5" style={styles.menuIcon} />
              <Text size={15} ><FormatText variable='profile.invite_friends'/></Text>
            </Block>
          </Ripple>
          {/*<Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700}>
                      <Block row style={styles.menuCon}>
                        <Icon name="cash-register" type="FontAwesome5" style={styles.menuIcon} />
                        <Text size={15}><FormatText variable='profile.register_info'/></Text>
                      </Block>
                    </Ripple>
                    <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700}>
                      <Block row style={styles.menuCon}>
                        <Icon name="cog" type="FontAwesome5" style={styles.menuIcon} />
                        <Text size={15}><FormatText variable='profile.settings'/></Text>
                      </Block>
                    </Ripple>*/}
          
          <Ripple style={logingOut && {opacity: 0.5}} disabled={logingOut} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => logout()}>
            <Block row style={styles.menuCon}>
              <Icon name="sign-out-alt" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
              <Text size={15} style={styles.redText}>{logingOut ? <FormatText variable='profile.logingout'/> : <FormatText variable='profile.logout'/>}</Text>
            </Block>
          </Ripple>
        </ScrollView>
      </Block>
      {/*<View style={styles.footerCon}>
        <Footer navigation={props.navigation} />
      </View>*/}

      <RBSheet
        ref={modalRef}
        height={ renderHeight() }
        openDuration={250}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }
        }}
      >
        {renderForm()}
      </RBSheet>
      
      <Modal 
        visible={imageViewer} 
      >
        <View style={styles.crossBtn}>
          <Text  style={styles.closeBtn} onPress = { () => setImageViewer(false)}>
            X
          </Text>
        </View>
        <ImageViewer 
          imageUrls={allImages}
          onSwipeDown= {() => setImageViewer(false)}
          enableSwipeDown={true}
          swipeDownThreshold={10}
          onRequestClose={() => setImageViewer(false) }
        />

      </Modal>
    </Block>
  );
}
const styles = StyleSheet.create({
  profile: {
    flex: 1
  },
  profileImage: {
    width: '100%',
    height: 'auto',
  },
  profileContainer: {
    width: width,
    height: height / 2,
  },
  profileDetails: {
    justifyContent: 'flex-end',
    position: 'relative',
  },
  profileTexts: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE * 2 + 40,
    zIndex: 2,
  },
  pro: {
    paddingHorizontal: 6,
    marginRight: 5,
    borderRadius: 4,
    height: 19,
    width: 25
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
    paddingBottom: 60
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: 'center',
    width: thumbMeasure,
    height: thumbMeasure
  },
  gradient: {
    zIndex: 1,
    left: 0,
    right: 0,
    bottom: 0,
    height: '30%',
    position: 'absolute',
  },
  menuCon: {
    paddingVertical: 16, 
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderColor: '#ddd'
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 25,
    color: '#999'
  },
  redText: {
    color: 'red',
  },
  imageoverlay: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    height: '100%', 
    width: '100%', 
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuHead: {
    width: width - 150,
  },
  lang:{
    fontSize: 14,
    color: primaryColor,
    width: 50,
    textAlign: 'right',
    fontWeight: '700'
  },
  crossBtn: {
    position: 'absolute',
    top: 100,
    right: 0,
    color:'#fff',
    width: 50,
    height: 50,
    zIndex: 10
  },
  closeBtn:{
    color:'#fff',
    width: 50,
    height: 50,
    fontSize:20
  },
  footerCon: {
    position:'absolute', 
    zIndex: 10, 
    width: '100%', 
    bottom: 0
  }
});


const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Profile); 