import React, { useRef, useState } from 'react';
import { StyleSheet, Dimensions, TextInput, Image, ImageBackground, Platform, View, TouchableOpacity, Text, ScrollView } from 'react-native';
import { Icon, Container, Content, } from 'native-base'
import Header from '../../components/common/Header';
import {connect} from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import Ripple from 'react-native-material-ripple';
import { renderImage, renderTitle, convertText } from '../../redux/Utility'
import { primaryColor} from '../../redux/Constant'
import moment from 'moment'
import {setFriendSearch, setSelectedUsers, onChangeConvesationsForm} from '../../redux/actions/messages'
import { addUsers }  from '../../redux/api/messages'
import FormatText from '../../components/common/FormatText'


const { width, height } = Dimensions.get('screen');


const FriendList = (props) => {
  let lang = props.uiControls.lang

  /*
  * Call action to save onchange value of search Box
  */
  const onSearch = (text) => {
    props.dispatch(setFriendSearch(text))
  }
 
  /*
  * Call action to save selected users
  */
  const selectedUser = (item) => {
    props.dispatch(setSelectedUsers(item))
  }

  /*
  * Show Tick Mark on selected users
  */
  const isSelected = (id) => {
    let index = props.messages.selected_users.findIndex(item => item.id === id)
    if(index > -1){
      return  <View style={styles.selection}>
                <View>
                  <Icon type="FontAwesome5" name={'check-circle'} style={styles.selectedUser} />
                </View>
              </View>
    }      
  }

  /*
  * Disable users those are already member of group
  */
  const isDisabled = (id) => {
    if (props.route.params && props.route.params.type === 'new') {

    } else if (props.messages.current_thread_detail.members_list.findIndex(item => item.id === id) !== -1) {
      return true
    }
  }
  /*
  * Render Friend List 
  */
  const renderFriendList = () => {
    if(props.messages.friends_list && props.messages.friends_list.length){
      let filteredList = props.messages.friends_list.filter(item => item.name.indexOf(props.messages.friends_search) != -1)
      return filteredList.map((item, index) => {
        // return <Ripple style={[styles.userDetail, isDisabled(item.id) && {opacity: 0.4}]} 
        //         rippleColor="#ccc" 
        //         rippleOpacity={0.2} 
        //         rippleDuration={700}
        //         onPress={() => selectedUser(item)}
        //         key={index}
        //         disabled={isDisabled(item.id)}
        //       >
        //         <View style={styles.userImgCon}>
        //           <Image style={styles.userImg} source = {{uri: renderImage(item.image)}}></Image>
        //         </View>
        //         <View style={styles.userCon}>
        //           <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{item.name}</Text>
        //           {isSelected(item.id)}
        //           {isDisabled(item.id) && <Text style={styles.italic}><FormatText variable="message.alreadyAddedGroup" /></Text>}
        //         </View>
        //       </Ripple>
          return <TouchableOpacity key={index} style={styles.profileCon} onPress={() => selectedUser(item)}>
                  {isSelected(item.id)} 
                  <View style={styles.picCon}>
                    <Image source={renderImage(item.image, 'user')} style={styles.imgStyle} />
                  </View>
                  <View style={styles.profileTextCon}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.nameText}>{item.name}</Text>
                  </View>  
                  {/* {renderFriendStatusButtons(item)} */}
                </TouchableOpacity>
      })
    }
  }

  /*
  * Render Selected Users on top of screen 
  */
  const renderSelectedUsers = () => {
      return props.messages.selected_users.map((item, index) => {
        return <View key={index} style={styles.friendList}>
                <View style={styles.userImgCon}>
                  <Image style={styles.userImg} source = {renderImage(item.image)}></Image>
                </View>
                <View style={styles.userDetails}>
                  <Text numberOfLines={1}  style={[styles.name, styles.fontSize]}>{item.name}</Text>
                </View>
                <TouchableOpacity style={styles.remove} onPress={() => selectedUser(item)}>
                  <Icon type="FontAwesome5" name={'times-circle'} style={styles.removeIcon} />
                </TouchableOpacity>
              </View>
      })
    
  }

  /*
  * On save actions 
  */
  const onSave = () => {
    //let userIds = props.messages.selected_users.map(item => item.id)
    /*
    * In case if we are creating new group
    */
    if (props.route.params && props.route.params.type === 'new') {
      props.dispatch(onChangeConvesationsForm(props.messages.selected_users, 'selected_users'))
      // props.navigation.navigate('Messages') 
      props.navigation.navigate('Footer', {
        routeId : 2
      })
    } 
    /*
    * In case if we are adding member in group
    */
    else {
      let threadId = props.messages.current_thread_detail.id
      props.dispatch(addUsers(props.messages.selected_users, threadId))
      props.navigation.navigate('ThreadDetail')  
    }
  }

  return (
    // <View style={styles.mainCon}>
    //   <Header rightBtn={props.messages.selected_users.length && "check"} onRightBtnClick={onSave} backgroundColor={primaryColor} leftHeading="Friends" textAlignLeft navigation={props.navigation} nextScreen= {props.route.params.type === 'new' ? "Footer" : "ThreadDetail"}   />
    //   <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.selectedRow}>
    //     {renderSelectedUsers()}
    //   </ScrollView>
    //   <ScrollView style={styles.friendListCon}>
    //     <View>
    //       <View>
    //         <TextInput style={styles.searchBar}
    //           placeholder={convertText("message.search", lang)}
    //           placeholderTextColor="black"
    //           onChangeText={text => onSearch(text)}
    //         />
    //       </View>
    //       <View style={styles.chatCon}>
    //         {renderFriendList()}
    //       </View>
    //     </View>
    //   </ScrollView>
    // </View>
    <Container style={styles.mainCon}>
      <Header rightBtn={props.messages.selected_users.length && "check"} onRightBtnClick={onSave} backgroundColor={primaryColor} leftHeading="Friends" textAlignLeft navigation={props.navigation} nextScreen= {props.route.params.type === 'new' ? "Footer" : "ThreadDetail"}   />
      <View style={styles.formBox}>
        <TextInput 
          placeholder={convertText("message.search", lang)}
          style={[styles.inputBox, styles.inputBoxLast]}
          onChangeText={text => onSearch(text)}
          //value={search}
        />
      <Icon name="search" type="FontAwesome5" style={styles.menuIcon} />
      </View>
      <Content>
        <View style={styles.body}>
          {renderFriendList()}
          {/* {props.auth.userList.map((item, index) => {
              return  <TouchableOpacity style={styles.profileCon} onPress={() => goToFriendsProfile(item)}>
                        <View style={styles.picCon}>
                          <Image source={{uri: renderImage(item.profile_image)}} style={styles.imgStyle} />
                        </View>
                        <View style={styles.profileTextCon}>
                          <Text style={styles.nameText}>{renderName(item)} </Text>
                        </View>
                        {renderFriendStatusButtons(item)}
                    </TouchableOpacity>
          })} */}
        </View>
      </Content>
      {/*<Footer navigation={props.navigation} />*/}
    </Container>
  )
}
  
const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: '#fff'
  },
  userDetail: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    marginHorizontal: -10,
    paddingHorizontal: 20
  },
  userCon:{
    justifyContent: 'center',
    width: (width - 190),
  },
  userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginRight: 10,
    
  },
  userImg: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    height: '100%',
   
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  text: {
    color: 'grey',
  },
  timeCon: {
    justifyContent: 'center',
    alignItems: 'flex-end',
    width: 120
  },
  time: {
    color: 'grey',
    textAlign: 'right',
  },
  searchBar: {
    backgroundColor: '#f0f0f1',
    marginTop: 10,
    height: 40,
    borderRadius: 20,
    position: 'relative',
    fontSize: 15,
    textAlign: 'center',
    marginHorizontal: 10,
    color: '#000'
  },
  selection: {
    position: 'absolute',
    right: 15,
    bottom: 0,
    height: '100%'
  },
  selectedUser: {
    backgroundColor: 'green',
    color: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    fontSize: 20,
  },
  selectedRow: {
    paddingHorizontal: 10,
    paddingTop: 10,
    paddingBottom: 20,
    flexDirection: 'row',
  },
  remove: {
    position: 'absolute',
    left: 25,
    top: 3,
  },
  removeIcon: {
    backgroundColor: 'grey',
    color: '#fff',
    borderRadius: 15,
    overflow: 'hidden',
    fontSize: 20,
    position:'absolute',
  },
  italic: {
    fontStyle: 'italic',
    color: 'grey'
  },
  friendListCon: {
    marginBottom: 130,  
  }, 
  userDetails:{
    paddingRight:10
  },
  friendList:{
    alignItems: 'center',
  },
  fontSize: {
    fontSize: 12
  },
  formBox: {
    padding: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  inputBox: {
    height: 47,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 45,
    paddingRight: 10,
    flex: 1,  
    flexDirection: 'row',
    color: '#000'
  },
  inputBoxLast: {
    borderBottomWidth: 0
  },
  menuIcon: {
    fontSize: 18,
    width: 25,
    color: '#999',
    top:25,
    left:25,
    position:'absolute'
  },
  body: {
    flex: 1,
    paddingBottom: 50
  },
  profileCon: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#f5f5f5',
    paddingTop: 10,
    paddingBottom: 10,
  },
  picCon: {
    width: 40,
    height: 40,
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ccc'
  },
  imgStyle:{
    width: 40,
    height: 40
  },
  profileTextCon:{
    paddingLeft: 15,
    marginTop: 10
  },
  nameText:{
    fontSize: 16,
    fontWeight: '700'
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

export default connect(mapStateToProps, mapDispatchToProps)(FriendList); 