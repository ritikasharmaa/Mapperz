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
import { Block, Text, theme, Input } from 'galio-framework';
import { Icon } from 'native-base'
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import {connect} from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import InvitaionForm from '../../components/common/InvitaionForm'
import ChangePasswordForm from '../../components/common/ChangePasswordForm'
import Ripple from 'react-native-material-ripple';
import {renderImage} from '../../redux/Utility';
import FormatText from '../../components/common/FormatText'
import ImageViewer from 'react-native-image-zoom-viewer';
import { primaryColor} from '../../redux/Constant'
import SelectLanguage from '../../components/common/SelectLanguage'
import EditImage from '../../components/common/EditImage'
import ContentLoader from '../../components/common/ContentLoader'
import { getProfile, getFriendsRequestList, deleteFriend, sendFriendRequest, cancelFriendRequest, acceptFriendRequest } from '../../redux/api/auth'

const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

const FriendProfile = (props) => {
  
  const goTobackScreen = () => {
    //props.navigation.navigate('Profile')
    props.navigation.goBack()
  }

  const removeFriend = (id) => {
    props.dispatch(deleteFriend(id)).then(res => {
      props.dispatch(getProfile())
    })
  }

  const sendRequest = (id) => {
    props.dispatch(sendFriendRequest(id)).then(res => {
      props.dispatch(getFriendsRequestList())
    })
  }

  const cancelSentRequest = (id) => {
    props.dispatch(cancelFriendRequest(id, 'outgoing_requests')).then(res => {
      props.dispatch(getFriendsRequestList())
    })
  }

  const acceptRequest = (id, type) => {
    props.dispatch(acceptFriendRequest(id, type)).then(res => {
      props.dispatch(getProfile())
      props.dispatch(getFriendsRequestList())
    })
  }


  const friendsStatus = (item) => {
    if(item.friend_status){
      if(item.friend_status === 'friend'){
        return <TouchableOpacity style={styles.menuCon} onPress={() => removeFriend(item.id)}>
                <Icon name="user-times" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
                <Text style={styles.redText}><FormatText variable='profile.unfriend'/></Text>
              </TouchableOpacity>
      } else if(item.friend_status === "request_sent") {
        return <View>
                <TouchableOpacity style={styles.menuCon}>
                  <Icon name="check" type="FontAwesome5" style={[styles.menuIcon, {color: 'green'}]} />
                  <Text><FormatText variable='profile.req_sent'/></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuCon} onPress={() => cancelSentRequest(item.id)}>
                  <Icon name="times" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
                  <Text style={styles.redText}><FormatText variable='profile.cancel_sent'/></Text>
                </TouchableOpacity>
              </View>
      } else if(item.friend_status === "request_received") {
        return <View style={styles.btnCon}>
                <TouchableOpacity style={[styles.btn, styles.blueBtn]} onPress={() => acceptRequest(item.id, true)}>
                  {/*<Icon name="user" type="FontAwesome5" style={[styles.menuIcon]} />*/}
                  <Text style={styles.blueBtnTex}><FormatText variable='profile.confirm'/></Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.btn} onPress={() => acceptRequest(item.id, false)}>
                  {/*<Icon name="user" type="FontAwesome5" style={[styles.menuIcon]} />*/}
                  <Text><FormatText variable='profile.reject'/></Text>
                </TouchableOpacity>
              </View>
      } else {
        return <TouchableOpacity style={styles.menuCon} onPress={() => sendRequest(item.id)}>
                <Icon name="user" type="FontAwesome5" style={[styles.menuIcon, {color: primaryColor}]} />
                <Text style={{color: primaryColor}}><FormatText variable='profile.send_req'/></Text>
              </TouchableOpacity>
      }
    } else {
      return
    }
  }

  return (
    <Block flex style={styles.profile}>
      <View style={styles.backBtnCon}>
        <Icon name="chevron-left" type="FontAwesome5" style={styles.backBtn} onPress={() => goTobackScreen()}/>
      </View>
      <Block flex>
        <TouchableOpacity disabled={!props.auth.friendData.profile_image}>
          <ImageBackground
            source={renderImage(props.auth.friendData.profile_image, 'user')}
            style={styles.profileContainer}
            imageStyle={styles.profileImage}>
          <View style={styles.imageoverlay} pointerEvents="none">
            {props.auth.loading && <ContentLoader size={40} color={'#fff'} />}
          </View>
          <Block flex style={styles.profileDetails}>
            <Block style={styles.profileTexts}>
              <Text color="white" size={28} style={{ paddingBottom: 8 }}>{props.auth.friendData.first_name ? props.auth.friendData.first_name + ' ' +props.auth.friendData.last_name : props.auth.friendData.nick_name}</Text>
            </Block>
          </Block>
          </ImageBackground>
        </TouchableOpacity>
      </Block>
      <Block flex style={styles.options}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          
        >
          <Block row space="between" style={{ padding: theme.SIZES.BASE, }}>
            <Ripple style={styles.userDetail} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} >
              <Block middle>
                <Text bold size={15} style={{marginBottom: 8}}>{props.auth.friendData.friends_count ? props.auth.friendData.friends_count : 0}</Text>
                <Text muted size={15}><FormatText variable='profile.friends'/></Text>
              </Block>
            </Ripple>
            <Ripple style={styles.userDetail} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} >
              <Block middle>
                <Text bold size={15} style={{marginBottom: 8}}>{props.auth.friendData.current_user_relation ? props.auth.friendData.current_user_relation.common_friends_count : 0}</Text>
                <Text muted size={15}>{/*<FormatText variable='profile.send_requests'/>*/}Mutual Friends</Text>
              </Block>
            </Ripple>
          </Block>
          <View>
            {props.auth.friendData.birthday ? 
              <View style={styles.menuCon}>
                <Icon name="birthday-cake" type="FontAwesome5" style={[styles.menuIcon, {color: 'grey'}]} />
                <Text>{props.auth.friendData.birthday}</Text>
              </View>
              :
              null
            } 
            {props.auth.friendData.email ? 
              <View style={styles.menuCon}>
                <Icon name="envelope" type="FontAwesome5" style={[styles.menuIcon, {color: 'grey'}]} />
                <Text>{props.auth.friendData.email}</Text>
              </View>
              : 
              null
            }
            
            {friendsStatus(props.auth.friendData)}
          </View>
        </ScrollView>
      </Block>
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
    zIndex: 2
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
    borderColor: '#ddd',
    flexDirection: 'row'
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 25,
    color: '#999'
  },
  redText: {
    color: 'red'
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
  backBtnCon: {
    position:'absolute', 
    zIndex: 10, 
    width: '100%'
  },
  backBtn: {
    color: '#fff',
    fontSize: 22,
    margin: 15
  },
  btnCon: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 40
  },
  blueBtn: {
    backgroundColor: primaryColor,
    borderColor: primaryColor
  },
  btn: {
    borderWidth: 1,
    marginRight: 5,
    width: 100,
    flexDirection: 'row',
    paddingVertical: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3
  },
  blueBtnTex: {
    color: '#fff'
  }
});


const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendProfile); 