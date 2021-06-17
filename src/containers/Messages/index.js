import React, { useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  Component,
  FlatList
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon,
  Picker
} from 'native-base'

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Header from '../../components/common/Header';
//import Footer from '../../components/common/Footer';
import { primaryColor } from '../../redux/Constant'
import {connect} from 'react-redux';
import RBSheet from "react-native-raw-bottom-sheet";
import Ripple from 'react-native-material-ripple';
import BottomSlider from '../../components/MessagesComponent/CreateForm'
import { getAllThreads, checkinMessage } from '../../redux/api/messages'
import ContentLoader from '../../components/common/ContentLoader'
import moment from 'moment'
import { renderImage, renderTitle, convertText } from '../../redux/Utility'
import {setSearchValue, currentThreadDetail, updateSelectedUsers} from '../../redux/actions/messages'
import NoData from '../../components/common/NoData'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FormatText from '../../components/common/FormatText'
import { setActiveTabIndex } from '../../redux/actions/uiControls';
import DeviceInfo from 'react-native-device-info';


const { width, height } = Dimensions.get('screen');
const notch = DeviceInfo.hasNotch()

const Messages = (props) => {
  const Tab = createMaterialTopTabNavigator();
  const modalRef = useRef(null)
  const [page, setPage] = useState(1)
  const [endOfThreads, setEndOfThreads] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSpotPost, setIsSpotPost] = useState(false)
  let lang = props.uiControls.lang

    

  /*
  * call fetchThreads function to call API
  */
  useEffect(() => {
    fetchThreads()
    props.dispatch(checkinMessage())
    //props.dispatch(getAllThreads(page)).then
  },[])

  useEffect(() => {
    const listener = props.navigation.addListener('focus', () => {
       props.dispatch(setActiveTabIndex(3))
     });
     return () => {listener}
   }, [props.navigation]);

  /*
  * Set profile image
  */
  const profileImage = (image) => {
    if (Array.isArray(image)){
      return image.map((img,key) => <Image key={key} style={[styles.userImg, styles['image'+image.length]]} source={renderImage(img, 'user')} />)
    } else {
      return <Image style={styles.userImg} source = {renderImage(image, 'user')}/>
    }
  }

  /*
  * Call action to save current thread detail in reducer
  */
  const currentThread = (item) => {
    props.dispatch(currentThreadDetail(item)),   
    props.navigation.navigate('ChatBox', {threadId: item.id, post: item.post})
  }

  /*
  * Render FlatList
  */
  const renderThreadList = () => {
    if (props.messages.isFetching) {
      return <ContentLoader />
    } else if(props.messages.room_list && props.messages.room_list.length) {
      let filteredList = props.messages.room_list.filter(item => renderTitle(item.title).indexOf(props.messages.search_value) != -1 )
      return (
        <>
          <FlatList
            style={{backgroundColor: '#fff'}}
            onEndReached={fetchThreads}
            onEndReachedThreshold={0.7}
            data={filteredList}
            renderItem={rowData => renderThreadItem(rowData)}
            refreshing={loading}
            showsVerticalScrollIndicator={false}
            //initialNumToRender={4}
            //initialScrollIndex={3}
          />             
          <Ripple 
            style={styles.iconCon} 
            rippleContainerBorderRadius={30} 
            rippleColor="#eee" 
            rippleOpacity={0.2} 
            rippleDuration={700} 
            onPress={() => modalRef.current.open()}
          >
            <Icon type="FontAwesome5" name={'plus'} style={styles.btnIcon} />
           </Ripple>  
        </>
      )
    } else {
      return <>
              <View style={styles.placeholderCon}>
                <NoData title={convertText("message.noChat", lang)} />
              </View>
              <Ripple 
                style={styles.iconCon} 
                rippleContainerBorderRadius={30} 
                rippleColor="#eee" 
                rippleOpacity={0.2} 
                rippleDuration={700} 
                onPress={() => modalRef.current.open()}
              >
                <Icon type="FontAwesome5" name={'plus'} style={styles.btnIcon} />
              </Ripple>
            </>
    }
  }

  const checkinList = () => {
    if(props.messages.isFetching){
      return <ContentLoader />
    } else if(props.messages.user_posts && props.messages.user_posts.length !== 0){
      return <View style={styles.listCon}>
            {props.messages.user_posts.map((item, index) => {
              return (index % 2) ? 
                    <View key={index} style={[styles.msgCon, {backgroundColor: 'lightgrey'}]}>
                      <Text style={[styles.userPostTime]}>
                        {showTime(item.date)}
                      </Text>
                      <Text style={[styles.msg, {color: '#fff'}]}>{item.message}</Text>
                    </View>
                    :
                    <View key={index} style={[styles.msgCon]}>
                      <Text style={styles.userPostTime}>
                        {showTime(item.date)}
                      </Text>
                      <Text style={styles.msg}>{item.message}</Text>
                    </View>
                  
            })}
            </View>     
    } else {
      <NoData title={convertText("message.noChat", lang)} />
    }
  }

  const checkinMsgBtn = (key) => {
    return <Ripple 
            style={styles.iconCon} 
            rippleContainerBorderRadius={30} 
            rippleColor="#eee" 
            rippleOpacity={0.2} 
            rippleDuration={700} 
            onPress={() => currentThread({id: props.auth.userData.checkin_mapper_id, checkinThread: true, post: key})}
          >
            {/*<Text style={styles.btnText}>New Map Status</Text>*/}
            <Icon type="FontAwesome5" name={'map-marked-alt'} style={styles.btnIcon} />
          </Ripple> 
  }
  
  const renderUserCheckinMessage = () => {
    return (
      <View style={styles.checkinMsgCon}>   
        <ScrollView showsVerticalScrollIndicator={false}>
          {checkinList()}
        </ScrollView>
        {checkinMsgBtn()}
      </View>
    )
  }

  const spotPostMessage = (data) => {
    if (data[1] && data[1].length !== 0){
      return data[1].map((item, index) => {
        return (index % 2) ?
                <View key={index} style={[styles.msgCon, {backgroundColor: 'lightgrey'}]}>
                  <Text style={[styles.userPostTime]}>
                    {showTime(item.date)}
                  </Text>
                  <Text style={[styles.msg, {color: '#fff'}]}>{item.message}</Text>
                </View>
                :
                <View key={index} style={[styles.msgCon]}>
                  <Text style={[styles.userPostTime]}>
                    {showTime(item.date)}
                  </Text>
                  <Text style={styles.msg}>{item.message}</Text>
                </View>
      })
    } else {
      return <View style={styles.placeholderCon}>
              <NoData />
            </View>
    }
  }

  const spotPostList = (params) => {
    if(props.messages.spot_posts && props.messages.spot_posts.length !== 0){
      return props.messages.spot_posts.map((item, index) => {
        if(params.route.name === item[0]){
          return <View key={index} style={styles.listCon}>
                  {spotPostMessage(item)}
                </View>
        }        
      })
    }
  }

  const spotTabs = () => {
    return props.messages.spot_posts.map((item, index) => {
      return <Tab.Screen key={index} name={item[0]} children={spotPostList}  />
    })
  }

  const renderSpotCheckinMessage = () => {
    if(props.messages.isFetching){
      return <ContentLoader />
    } else if(props.messages.spot_posts && props.messages.spot_posts.length !== 0){
      return <View style={styles.checkinMsgCon}>
              <Tab.Navigator
                tabBarOptions={{
                  labelStyle: { fontSize: 12, height: 25 },
                  style: {backgroundColor: '#f5f5f5'}
                }}
              > 
              {spotTabs()}
              </Tab.Navigator>
              {/*<ScrollView showsVerticalScrollIndicator={false}>
                {spotPostList()}
              </ScrollView>*/}              
            </View>
    } else {
      return <>
              <View style={styles.placeholderCon}>
                <NoData />
              </View>
              {checkinMsgBtn('spot')}
            </>
    }    
  }

  /*
  * Call API to get list of all threads
  */ 
  const fetchThreads = () => {
    //console.log(props.messages.isFetching, loading, endOfThreads, "endOfPost")
    //let endOfPost = props.messages.room_list.length < 10 ? true : false  
    if(!props.messages.isFetching && !loading && !endOfThreads){
      if(page !== 1) { 
        setLoading(true) 
      }
      props.dispatch(getAllThreads(page)).then(res => {
        if (res.room_list.length < 10) {
          setEndOfThreads(true)
        }
        setLoading(false)
        setPage(page + 1)
      })
    }
    props.messages.search_value = ''
  }

  const showTime = (time) => {
    let today     = moment().endOf('day');
    let yesterday = moment().add(-1, 'days').endOf('day');
    let previous  = moment().add(-2, 'days').endOf('day');
    if(moment(time) < previous){
      return <Text style={styles.time}>{moment(time).format('l')}</Text>
    } else if(moment(time) < yesterday){
      return <Text style={styles.time}><FormatText variable='messages.yesterday' /></Text>
    } else {
      return <Text style={styles.time}>{moment(time).format('LT')}</Text>
    }
  }
  /*
  * Render all Thread Item
  */ 
  const renderThreadItem = (data) => {
    let item = data.item
    return <Ripple style={styles.userDetail} 
              rippleColor="#ccc" 
              rippleOpacity={0.2} 
              rippleDuration={700}
              onPress={() => currentThread(item)}
            >
            <View style={styles.userImgCon}>
              {profileImage(item.image)}
            </View>
            {/*<View style={[styles.userOnlineStatus, styles.online]}></View>*/}
            <View style={styles.userCon}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.name}>{renderTitle(item.title)}</Text>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{item.last_chat.body}</Text>
            </View>
            <View style={styles.timeCon}>
              {showTime(item.last_chat.updated_at)}
              {renderUnreadMessage(item)}
            </View>
          </Ripple>
  }
  
  /*
  * Render unread message count
  */ 
  const renderUnreadMessage = (data) => {
    if(data.unreadMessage){
      return  <View style={styles.count}>
                <Text style={styles.countNo}>{data.unreadMessage}</Text>
              </View>
    }
  }

  /*
  * Call action to save onchange value of search Box
  */
  const onSearch = (text) => {
    props.dispatch(setSearchValue(text))
  }
 
  /*
  * Call action to save new selected members for creating new group
  */
  const goToFriendsList = () => {
    props.dispatch(updateSelectedUsers(props.messages.conversation_form.selected_users))
    props.navigation.navigate('FriendList', {type: 'new'})
    modalRef.current.close()
  }

  const renderTabs = () => {
    let { owned_spots, default_locale } = props.auth.userData
    return 	<Tab.Navigator
              tabBarLabel={{
                labelStyle: { fontSize: 12, height: 25 },
              }}
            >
              <Tab.Screen name={convertText("message.conversationRoom", lang)} children={renderThreadList}  />
              <Tab.Screen name={convertText("message.userPosts", lang)} children={renderUserCheckinMessage}  />
            {owned_spots.length ? <Tab.Screen name={convertText("message.spotPosts", lang)} children={renderSpotCheckinMessage}  /> : null}  
            </Tab.Navigator>
     
    }

  const renderOnlineUsers = () => {
    if(props.auth.userData && props.auth.userData.friends){
      let filterList = props.auth.userData.friends.filter(item => item.is_online === true)  
      if(!filterList.length){
        return  <Icon type="FontAwesome5" name={'user-slash'} style={[styles.noOnlineUser, styles.noOnlineUseIcon]} />
      } else {
        return filterList.map((item, index) => {
          return <View style={styles.userMainCon} key={index}>
                  <View style={styles.userImgCon}>
                    <Image style={styles.userImg} source = {renderImage(item.profile_image, 'user')}/>
                  </View>
                  <Text style={styles.userName}>{item.name.substring(0, 7)}</Text>
                  <View style={[styles.userStatus, styles.online]}></View>
                </View>
        })
      }  
    } else {
      return <Text style={styles.noOnlineUser}>"You have no Friends for now"</Text>
    }    
  }

  return(    
    <Container style={styles.mainContainer}>
      <Content scrollEnabled={false} style={styles.subCon}>
        <View>
          <View>
            <Text style={styles.heading}><FormatText variable='messages.online_users' /></Text>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true} style={styles.userList}>
              {renderOnlineUsers()}
            </ScrollView>
          </View> 
          <View>
            <View>
              <TextInput style={styles.searchBar}
                placeholder={convertText("message.search", lang)}
                placeholderTextColor="black"
                onChangeText={text => onSearch(text)}
              />
            </View>
            <View style={[styles.chatCon, {height: height - (notch ? 290 : 230)} ]}>
              {renderTabs()}
              {/*loading && <View><ContentLoader /></View>*/}
            </View>
          </View>
        </View>
      </Content>
      <RBSheet
        ref={modalRef}
        height={260}
        openDuration={250}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      >
        <BottomSlider navigation={props.navigation} addMembers={goToFriendsList} closeModal={() => modalRef.current.close()} openModal = {() => modalRef.current.open()}/>
      </RBSheet>
      {/*<Footer navigation={props.navigation} />*/}
    </Container>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  subCon: {
    paddingHorizontal: 10,
  },
  userList: {
    flexDirection: 'row',
    marginBottom: 5,
    height: 65
  },
  userMainCon: {
    marginRight: 15,
    position: 'relative',
  },
  userName:{
    fontSize: 11,
    textAlign: 'center'
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
  },
  userImg: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    height: '100%'
  },
  userStatus: {
    width: 14,
    height: 14,    
    borderWidth: 2,
    borderRadius: 7,
    borderColor: '#fff',
    bottom: 15,
    right: 3,
    position: 'absolute'
  },
  userOnlineStatus: {
    width: 14,
    height: 14,    
    borderWidth: 2,
    borderRadius: 7,
    borderColor: '#fff',
    bottom: 12,
    left: 40,
    position: 'absolute'
  },
  online: {
    backgroundColor: 'green',
  },
  offline: {
    backgroundColor: 'lightgrey',
  },
  away: {
    backgroundColor: 'orange',
  },
  listView: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingTop: 10,
    paddingBottom: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: Colors.lighter,
    marginHorizontal: -10,
  },
  btn: {
    width: 90,
    borderWidth: 1,
    borderColor: 'lightgrey',
  },
  btnText: {
    paddingVertical: 5,
    textAlign: 'center',
    color: primaryColor,
    fontWeight: 'bold'
  },
  iconCon: {
    shadowColor: 'lightgrey',
    shadowRadius: 10,
    shadowOpacity: 1,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: primaryColor,
    position: 'absolute',
    bottom: 25,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10
  },
  iconConSpecial: {
    shadowColor: 'lightgrey',
    shadowRadius: 10,
    shadowOpacity: 1,
    width: 50,
    height: 50,
    borderRadius: 30,
    backgroundColor: primaryColor,
    position: 'absolute',
    bottom: 150,
    right: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  btnIcon: {
    fontSize: 15,
    color: '#fff',
  },
  searchBar: {
    backgroundColor: '#f0f0f1',
    marginTop: 10,
    height: 40,
    borderRadius: 20,
    position: 'relative',
    fontSize: 15,
    textAlign: 'center',
    color: '#000'
  },
  searchIcon: {
    color: primaryColor,
    fontSize: 15,
    position: 'absolute',
    top: 20,
    left: 10,
  },
  picker: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    marginTop: 10,
    borderRadius: 5,  
    height: 40,  
  },
  userDetail: {
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    marginHorizontal: -10,
    paddingHorizontal: 15,
  },
  userCon:{
    marginLeft: 10,
    justifyContent: 'center',
    width: (width - 205),
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  text: {
    color: 'grey',
  },
  timeCon: {
    alignItems: 'flex-end',
    width: 120,
    marginTop: 5,
  },
  time: {
    color: 'grey',
    textAlign: 'right',
    fontSize: 12,
  },
  chatCon: {
    marginTop: 10,
    //height: height - (Platform.OS === 'android' ? 230 : 290),
    backgroundColor: 'red'
    //height: height - 290
  },
  image2: {
    width: '50%',
  },
  image3: {
    width: '50%',
    height: '50%',
  },
  image4: {
    width: '50%',
    height: '50%'
  },
  count: {
    backgroundColor: 'green',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
  },
  countNo: {
    color: '#fff',
    fontSize: 11,
  },
  btnText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 10,
    padding: 3
  },
  msgCon: {
    backgroundColor: '#f1f1f1',
    marginHorizontal: 10,
    marginTop: 10,
    borderRadius: 10,
    //borderWidth: 1,
    borderColor: '#ccc',
  },
  msg: {
    padding: 10,
    paddingTop: 5,
    //textAlign: 'center',
    color: '#565658'
  },
  checkinMsgCon: {
    flex: 1,
    backgroundColor: '#fff',
  //  paddingBottom: 100
  },
  spotName: {
    marginLeft: 10,
    marginTop: 15,
    fontWeight: '500',
    color: '#303031'
  },
  listCon: {
    paddingBottom: 90,
    backgroundColor: '#fff',
    flex: 1
  },
  userPostTime:{
    paddingTop: 5,
    paddingRight: 5,
   // backgroundColor: 'red'
    alignSelf: 'flex-end'
  },
  noOnlineUser: {
    color: 'grey',
    fontSize: 14,
    alignSelf: 'center'
  },
  placeholderCon: {
    marginTop: 30
  },
  noOnlineUseIcon:{
    fontSize: 18,
  }
});

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});


export default connect(mapStateToProps, mapDispatchToProps)(Messages);  
