import React, { useRef, useState } from 'react';
import { StyleSheet, Dimensions, ScrollView, Image, ImageBackground, Platform, View, TouchableOpacity } from 'react-native';
import { Block, Text, theme, Input } from 'galio-framework';
import { Icon } from 'native-base'
import Header from '../../components/common/Header';
//import Footer from '../../components/common/Footer';
import {connect} from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import Ripple from 'react-native-material-ripple';
import Exit from '../../components/MessagesComponent/Exit'
import EditName from '../../components/MessagesComponent/EditName'
import MemberListAction from '../../components/MessagesComponent/memberListAction'
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { renderImage, renderTitle } from '../../redux/Utility'
import { primaryColor} from '../../redux/Constant'
import { removeUsers, updateRole, editGroup} from '../../redux/api/messages'
import { onChangeText } from '../../redux/actions/messages'
import ContentLoader from '../../components/common/ContentLoader'
import FormatText from '../../components/common/FormatText'


const { width, height } = Dimensions.get('screen');
const thumbMeasure = (width - 48 - 32) / 3;

const ThreadDetail = (props) => {
  const [isInvitationForm, setIsInvitationForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState('')
  const modalRef = useRef(null)
  const actionRef = useRef(null)
  const editRef = useRef(null)

  /*
  * Set profile Image
  */
  const profileImage = (image) => {
    if (Array.isArray(image)){
      return image.map((img,key) => <Image key={key} style={[styles.profileContainer, styles['image'+image.length]]} source={renderImage(img, 'user')} />)
    } else {
      return <Image style={styles.profileContainer} source = {renderImage(image, 'user')}/>
    }
  }

  /*
  * Save textinput value in reducer
  */
  const onChangeName = (text) => {
    props.dispatch(onChangeText(text))
  }

  /*
  * Change Group Name
  */
  const setGroupName = (name) => {
    let threadId = props.messages.current_thread_detail.id
    let groupName = props.messages.group_name
    props.dispatch(editGroup(groupName, threadId, name))
    editRef.current.close()
  }

  /*
  * Open bottom slider to perform actions for group mambers
  */
  const openOptions = (item) => {
    setSelectedMember(item)
    let id = props.auth.userData.id 
    if (props.messages.current_thread_detail.is_group){
      if((props.messages.current_thread_detail.admin_id).indexOf(id) > -1 || (props.messages.current_thread_detail.sub_admin).indexOf(id) > -1){
        actionRef.current.open()
      }
    }
  }

  /*
  * Remove member from group
  */
  const removeMember = (exit) => {
    actionRef.current.close()
    let threadId = props.messages.current_thread_detail.id
    let user = selectedMember;
    if (exit === 'exit_group') {
      user = {id : props.auth.userData.id}
      props.dispatch(removeUsers(threadId, user, exit))
      // props.navigation.navigate('Messages')
      props.navigation.navigate('Footer', {
        routeId : 2
      })
    } else {
      props.dispatch(removeUsers(threadId, user))
    }
  }

  /*
  * Change role of group member
  */
  const changeRole = (role) => {
    actionRef.current.close()
    let threadId = props.messages.current_thread_detail.id
    props.dispatch(updateRole(threadId, selectedMember, role))
  }

  /*
  * Render role of group member
  */
  const renderUserRole = (item) => {
    let role = ''
    if (!props.messages.current_thread_detail.is_group) {
      role = 'Owner'
    }else if ((props.messages.current_thread_detail.admin_id).indexOf(item.id) === -1 && (props.messages.current_thread_detail.sub_admin).indexOf(item.id) === -1) {
      role = 'Member'
    } else {
      role = 'Admin'
    }
    return <Text>{`${role}${item.id === null ? ' (you)' : ''}`}</Text>
  }

  /*
  * Render group member list
  */
  const renderMemberList = () => {
    return props.messages.current_thread_detail.members_list.map((item, index) => {
      return <Ripple  style={styles.userDetail} 
                      rippleColor="#ccc" 
                      rippleOpacity={0.2} 
                      rippleDuration={700} 
                      key={index}
                      onLongPress={() => item.id !== 1 && openOptions(item)}>
              <View style={styles.userImgCon}>
                <Image style={styles.userImg} source = {renderImage(item.image)}/>
              </View>
              <View style={styles.userCon}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.text}>test</Text>
              </View>
              <View style={styles.labelCon}>
                <Text style={[styles.adminLabel, styles.label]}>{renderUserRole(item)}</Text>
              </View>
            </Ripple>
    })
  }

  /*
  * Show Exit group option in case of group
  */
  const groupAction = () => {
    if(props.messages.current_thread_detail.is_group){
      return <View>
              <Ripple 
                rippleColor="#ccc" 
                rippleOpacity={0.2} 
                rippleDuration={700} 
                onPress={() => modalRef.current.open()}
                >
                <Block row style={[styles.menuCon, styles.borderTop]} >
                  <Icon name="sign-out-alt" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
                  <Text size={15} style={styles.redText}><FormatText variable='messages.exit_group' /></Text>
                </Block>
              </Ripple>
             {/* <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700}>
                <Block row style={styles.menuCon}>
                  <Icon name="trash" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
                  <Text size={15} style={styles.redText}>Delete Group</Text>
                </Block>
              </Ripple>*/}
              <Block style={{ paddingBottom: -50 * 2 }}>
              </Block>
            </View>
    }
  }

  /*
  * Show Exit group option in case of group
  */
  const addparticipant = () => {
    let id = props.auth.userData.id;
    if (props.messages.current_thread_detail.is_group){
      if((props.messages.current_thread_detail.admin_id).indexOf(id) > -1 || (props.messages.current_thread_detail.sub_admin).indexOf(id) > -1){
      return  <Ripple style={styles.userDetail} 
                    rippleColor="#ccc" 
                    rippleOpacity={0.2} 
                    rippleDuration={700}
                    onPress={() => props.navigation.navigate('FriendList', {type: ''})} >
                <View style={styles.userImgCon}>
                  <Icon name="user-plus" type="FontAwesome5" style={styles.addUser} />
                </View>
                <View style={styles.userCon} >
                  <Text style={styles.name}><FormatText variable='messages.add_participants' /></Text>
                </View>
              </Ripple>
    }}
  }

  /*
  * Create button for edit Group name
  */
  const editNameBtn = () => {
    if (props.messages.current_thread_detail.is_group) {
      return <TouchableOpacity style={styles.editCon} onPress = {() => editRef.current.open()}>
                <Icon name="pen" type="FontAwesome5" style={styles.edit} />
              </TouchableOpacity>
    }
  }

  return (
    <>
      <View style={{position:'absolute', zIndex: 10, width: '100%'}}>
        <Header 
          transParent 
          backEnd  
          navigation={props.navigation} 
          nextScreen="ChatBox" 
          threeDotMenu={props.messages.current_thread_detail.is_group}
          editGroupPicture 
          groupImage
        />
      </View>
      <ParallaxScrollView
        parallaxHeaderHeight={330}
        contentBackgroundColor="transparent"
        renderBackground={() => (
          <View>
            <View key="background" style={{flexDirection: 'row', flexWrap: 'wrap'}}>
              {profileImage(props.messages.current_thread_detail.image)}
            </View>
            <View style={styles.imageoverlay} pointerEvents="none">
              {props.messages.loading && <ContentLoader size={40} color={'#fff'} />}
            </View>
          </View>
          )}
        renderForeground={() => (
          <Block flex style={styles.profileDetails}>
            <Block style={styles.profileTexts}>
              <Text color="white" size={28} style={{ paddingBottom: 8 }}>{renderTitle(props.messages.current_thread_detail.title)}</Text>
              {editNameBtn()}
              {/*<Block row space="between">
                <Block row>
                  <Block middle style={styles.pro}>
                    <Text size={16} color="white">Pro</Text>
                  </Block>
                  <Text color="white" size={16} muted style={styles.seller}>Seller</Text>
                  <Text size={16} color={'#000'}>4.8</Text>
                </Block>
                <Block>
                  <Text color={theme.COLORS.MUTED} size={16}>Los Angeles, CA</Text>
                </Block>
              </Block>*/}
            </Block>
          </Block>
        )}
        >
        <ScrollView showsVerticalScrollIndicator={false} style={styles.listCon}>
          {/*<Block row space="between" style={{ paddingVertical: 16, paddingalignItems: 'baseline' }}>
            <Text size={16}>Notifications</Text>
          </Block>*/}
          <Block row space="between" style={{ paddingVertical: 16, flexDirection: 'column'}}>
            <Text size={14} style={styles.noOfUsers}>{props.messages.current_thread_detail.members_list.length} <FormatText variable='messages.participants' /></Text>
            {addparticipant()}
            {renderMemberList()}
          </Block>
          {groupAction()}
          {/*<Ripple 
            rippleColor="#ccc" 
            rippleOpacity={0.2} 
            rippleDuration={700} 
            onPress={() => modalRef.current.open()}
            >
            <Block row style={[styles.menuCon, styles.borderTop]}>
              <Icon name="sign-out-alt" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
              <Text size={15} style={styles.redText}>Exit Group</Text>
            </Block>
          </Ripple>
          <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700}>
            <Block row style={styles.menuCon}>
              <Icon name="trash" type="FontAwesome5" style={[styles.menuIcon, styles.redText]} />
              <Text size={15} style={styles.redText}>Delete Group</Text>
            </Block>
          </Ripple>*/}
          {/*<Block style={{ paddingBottom: -50 * 2 }}>
          </Block>*/}
        </ScrollView>
        <RBSheet
          ref={modalRef}
          height={150}
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
          <Exit exitThread={removeMember} closeModal = {() => modalRef.current.close()}/>
        </RBSheet>
        <RBSheet
          ref={actionRef}
          height={140}
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
          <MemberListAction removeBtn={removeMember} changeRoleBtn={changeRole} currentAdmins={props.messages.current_thread_detail.sub_admin} selectedMember={selectedMember} />
        </RBSheet>
        <RBSheet
          ref={editRef}
          height={140}
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
          <EditName {...props} onChange={onChangeName} changeName={setGroupName} defaultValue={props.messages.current_thread_detail.title} />
        </RBSheet>
      </ParallaxScrollView>
    </>
  );
}
  /*<Block flex style={styles.profile}>
      
      <Block flex>
        <ImageBackground
          imageStyle={styles.profileImage}>
        </ImageBackground>
      </Block>
      <Block flex style={styles.options}>
      </Block>
    </Block>*/
const styles = StyleSheet.create({
  profile: {
    flex: 1
  },
  profileImage: {
    width: width * 1.1,
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
    paddingVertical: theme.SIZES.BASE,
    zIndex: 2,
  },
  pro: {
    backgroundColor: '#000',
    paddingHorizontal: 6,
    marginRight: theme.SIZES.BASE / 2,
    borderRadius: 4,
    height: 19,
    width: 38,
  },
  seller: {
    marginRight: theme.SIZES.BASE / 2,
  },
  options: {
    position: 'relative',
    paddingVertical: theme.SIZES.BASE,
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
    position: 'absolute'
  },
/*  borderTop: {
    borderBottomWidth: 0,
  },*/
  menuCon: {
    paddingVertical: 15, 
    paddingHorizontal: 20,
    alignItems: 'baseline',
    borderTopWidth: 10,
    borderBottomWidth: 10,
    borderColor: '#f5f5f5',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 10,
    width: 25,
    color: '#999',
    marginLeft: 5
  },
  redText: {
    color: 'red'
  },
  userDetail: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userCon:{
    marginLeft: 10,
    justifyContent: 'center',
    width: (width - 180),
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  text: {
    color: 'grey'
  },
  userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: primaryColor
  },
  imgCon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  userImg: {
    width: '100%',
    height: '100%',
  },
  chatCon: {
    marginTop: 10,
    marginBottom: 60,
  },
  exitBtn: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'red',
    paddingVertical: 10,
  },
  btnIcon: {
    color: 'red',
    fontSize: 15,
    marginLeft: 10,
  },
  labelCon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 80,
  },
  label: {
    fontSize: 12,
    paddingHorizontal: 5,
    paddingVertical: 1,
    textAlign: 'right',
    borderRadius: 3,
    borderWidth: 0.5,
  },
  adminLabel: {
    color: 'green',
    borderColor: 'green'
  },
  memberLabel: {
    color: 'grey',
    borderColor: 'grey'
  },
  listCon: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20, 
    paddingBottom: 200,
  },
  image2: {
    width: '50%',
  },
  image3: {
    width: '33%',
    height: '50%',
  },
  image4: {
    width: '50%',
    height: '50%'
  },
  addUser: {
    color: '#fff',
    fontSize: 18,
  },
  noOfUsers:{
    paddingLeft: 25,
    paddingVertical: 10,
  },
  editCon: {
    position: 'absolute',
    right: 20,
    bottom: 30
  },
  edit: {
    color: '#fff',
    fontSize: 18,
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
});

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetail); 