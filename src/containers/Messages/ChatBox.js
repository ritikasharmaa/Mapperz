import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Keyboard,
  Alert,
  ImageBackground
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
import { getThreadMessages, sendMessages, onSearchText } from '../../redux/api/messages'
import ContentLoader from '../../components/common/ContentLoader'
import moment from 'moment'
import { GiftedChat, SystemMessage, Send, Bubble} from 'react-native-gifted-chat'
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { renderImage, renderTitle, language, convertText } from '../../redux/Utility'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {clearCurrentThread} from '../../redux/actions/messages'
import _ from "lodash";
import RBSheet from "react-native-raw-bottom-sheet";
import EditImage from '../../components/common/EditImage'
import { postApiPosts } from "../../redux/api/feed";
import{ getProfile } from '../../redux/api/auth'
import Toast from 'react-native-root-toast';
import Geolocation from 'react-native-geolocation-service';
import FormatText from '../../components/common/FormatText'
import {setCenterCord} from "../../redux/actions/map";
import GPSState from 'react-native-gps-state'
import {setToggleState} from '../../redux/actions/map'


const { width, height } = Dimensions.get('screen');

const ChatBox = (props) => {

  const [emojiPicker, setEmojiPicker] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [spotCords, setSpotCords] = useState({centerCords: null, id: null})
  const [searchBar, setSearchBar] = useState(false)
  const [onTextChange, setOnTextChange] = useState(false)
  const [page, setPage] = useState(1)
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false)
  const [spotId, setSpotId] = useState('')
  const modalRef = useRef(null)
  let keyboardRef = useRef(null)
  let lang = props.uiControls.lang

  /*Set message in Reducer*/
  const onMessageChange = (text) => {
    setMessage(text)
  }
  /*
  * Set Thread messages
  */
  useEffect(() => {
    props.dispatch(getProfile())
    if (props.messages.current_thread_detail.checkinThread) {return}
    let threadId = props.route.params.threadId
    props.dispatch(getThreadMessages(threadId, page)).then(res => {
      renderMessage(res)
      renderBubble(res)
      setPage(page + 1)
    })
  }, []) 

  const sendCheckinMessage = (message, data) => {
    let threadId = props.messages.current_thread_detail.id;
    let ownerId = props.auth.userData.id;
    let spot = ''
    if(spotId) {
      threadId = spotId.id;
      spot = 'Spot'
    }
    props.dispatch(setToggleState(true))
    props.dispatch(postApiPosts(message, [], threadId, ownerId, 'checkin_map', data, spot)).then(res => {
      if (res.status === 'error') {
        Toast.show(res.message)
      } else {
        //Toast.show('Message Sent Successful')        
        // props.navigation.navigate('Home')    
        props.navigation.navigate('Footer', {
          routeId : 0
        })
        if(props.messages.current_thread_detail.post !== 'spot'){
          props.dispatch(setCenterCord({centerCords: [data.longitude, data.latitude], id: 'user_center'}))
        } else {
          props.dispatch(setCenterCord(spotCords))
        }       
      }
    })
  }

  const handleSavePost = (message) => {
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){
      if (!props.auth.userData.checked_in && !spotId) {
        Alert.alert(
          (convertText("message.userCheckin",lang)),
          (convertText("message.userCheckinPost",lang)),
          [
            {
              text: convertText("message.no",lang),
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel"
            },
            { 
              text: convertText("message.yes",lang), 
              onPress: () => {
                Geolocation.getCurrentPosition(info => {
                  let data = {lets_checkin: true, latitude: info.coords.latitude, longitude: info.coords.longitude}
                  sendCheckinMessage(message, data) 
                });
              }
            }
          ],
          { cancelable: false }
        );
      } else {
          Geolocation.getCurrentPosition(info => {
            let data = {lets_checkin: true, latitude: info.coords.latitude, longitude: info.coords.longitude}
            sendCheckinMessage(message, data) 
          });
      }
    } else {
      alert(convertText("map.please_turn_on_your_location", lang))
    }
  };   

  useEffect(() => {
    // console.log(props.messages.allMessages, 'allMessages')
    let item = props.messages.allMessages[props.messages.allMessages.length - 1]
    if (item && !item.newMessage || !item || !item.id ){
      return
    }
    if (item.image || item.images) {
      renderMessageImage(item)
      return
    }
    let newArray = []
    newArray.push({
      _id: item.id,
      text: item.body,
      image: '',
      createdAt: item.created_at,
      sent: true,
      received: true,
      pending: true,
      user: {
        _id: item.owner_id,
        name: item.chat_owner_name,
        avatar: renderImage(item.chat_owner_image, "", 'pathOnly'),
      }
    })
  setMessages(previousMessages => GiftedChat.append(previousMessages, newArray))
  }, [props.messages.allMessages.length])  
  
  /*
  * On send set messages
  */
  const onSend = useCallback((messages = []) => {
    if (props.messages.current_thread_detail.checkinThread) {
      handleSavePost(message)
      return
    }
    let threadId = props.route.params.threadId
    let sendingMessage = {
      body: message,
      owner_id: props.auth.userData.id, //props.auth.userData.id,
      owner_type: 'User'
    }
    props.dispatch(sendMessages(sendingMessage, threadId, props.messages.current_thread_detail))
  })

  /*
  * Render selected emoji in textBox
  */
  const selectedEmoji = (emoji) => {
    let newMessage = message + emoji
    setMessage(newMessage)
  }
   
  /*
  * Render Loader while getting response
  */
  const renderLoader = () => {
    if(props.messages.isMessageFetching){
      return <View style={styles.loader}>
                <ContentLoader/>
             </View>
    }
  }

  /*
  * Render Message
  */
  const renderMessage = (data) => {
    if (data.length) {
      let newArray = []
      data.forEach(item => {
        if (item.images && item.images.length) {
          item.images.forEach(image => {
            newArray.push({
              _id: item.id,
              text: item.body,
              image: renderImage(image, "", 'pathOnly'),
              createdAt: item.created_at,
              sent: true,
              received: true,
              pending: true,
              user: {
                _id: item.owner_id,
                name: item.owner_name,
                avatar: renderImage(item.owner_image, "", 'pathOnly'),
              }
            })
          })
        } else {
          newArray.push({
            _id: item.id,
            text: item.body,
            image: item.image ? renderImage(item.image, "", 'pathOnly') : '',
            createdAt: item.created_at,
            sent: true,
            received: true,
            pending: true,
            user: {
              _id: item.owner_id,
              name: item.owner_name,
              avatar: renderImage(item.owner_image, "", 'pathOnly'),
            }
          })
        }
      })

      //setMessages(newArray)
      setMessages(previousMessages => GiftedChat.append(newArray, previousMessages))
    }
  }

  /*
  * Render Image
  */
  const renderMessageImage = useCallback((data = []) => {
    let currentMessage = []
    if(data.images){
      data.images.forEach(image => {
        currentMessage.push({
          _id: data.id,
          text: '',
          image: renderImage(image, "", 'pathOnly'),
          createdAt: moment(),
          user: {
            _id: data.owner_id
          }
        })
      })
    } else {
        currentMessage.push({
          _id: data.id,
          text: '',
          image: renderImage(data.image, "", 'pathOnly'),
          createdAt: moment(),
          user: {
            _id: data.owner_id
          }
        })
    }
    setMessages(previousMessages => GiftedChat.append(previousMessages, currentMessage))
  })

  /*
  * Render send Icon and Send Messages
  */
  const renderSend = (props) => {
    return (
      <Send
        {...props}
      >
        <View style={styles.sendbtn}>
          <Icon type="FontAwesome5" name={'paper-plane'} style={styles.icon} />
        </View>
      </Send>
    );
  }

  /*
  * Show keyboard onfocus of textInput 
  */
  const showKeyboard = () => {
    keyboardRef.focusTextInput()
  }

  /*
  * Render Emoji Icon and Change action icon on click 
  */
  const renderActions = () => {
    if (props.messages.current_thread_detail.checkinThread) {return false}
    if (emojiPicker){
      return(
        <View style={styles.direction}>
          <TouchableOpacity style={styles.smilebtn} onPress={() => showKeyboard()}>
            <Icon type="FontAwesome5" name={'keyboard'} style={styles.icon} />
          </TouchableOpacity>
          {renderAttachment()}
        </View>
      )
    } else {
        return(
          <View style={styles.direction}>
            <TouchableOpacity style={styles.smilebtn} onPress={() => setEmojiPicker(!emojiPicker)}>
              <Icon type="FontAwesome5" name={'smile'} style={styles.icon} />
            </TouchableOpacity>
            {renderAttachment()}
          </View>
      )
    }   
  }

  /*
  * Render attachement Button
  */
  const renderAttachment = () => {
    return <TouchableOpacity style={styles.smilebtn} onPress = {() => modalRef.current.open()} >
            <Icon type="FontAwesome5" name={'paperclip'} style={styles.icon} />
          </TouchableOpacity>
  }

  /*
  * Render emoji picker 
  */
  const renderEmoji = () => {
    if (emojiPicker) {
      return (
        <View style={{height: 300}}>
          <EmojiSelector
            category={Categories.all}
            onEmojiSelected={(emoji) => selectedEmoji(emoji)}
            showSearchBar={false}
            showHistory={true}
            showTabs={true}
            columns={10}
          />
          {Keyboard.dismiss()}
        </View>
      )  
    }
  }

  /*
  * Render Profile picture of Group
  */
  const profileImage = (image) => {
    if (Array.isArray(image)){
      return image.map((img, key) => <Image key={key} style={[styles.userImg, styles['image'+image.length]]} source={{uri: renderImage(img, 'user')}} />)
    } else {
      return <Image style={styles.userImg} source = {renderImage(image, 'user')}/>
    }
  }

  /*
  * Search Message
  */
  const onSearch = _.debounce((text) => {
    setOnTextChange(text)
    searchChat(text)
  }, 1000);

  /*
  * Call API for search Message
  */
  const searchChat = (text) => {
    let threadId = props.messages.current_thread_detail.id
    props.dispatch(onSearchText(threadId, text)).then(res => {
      renderMessage(res)
    })
  }

  /*
  * Clear Search textInput
  */
  const clearText = () => {
    setOnTextChange('')
    searchChat('')
  }

  /*
  * Switch header Thread detail with search box
  */
  const openSearch = () => {
    if (searchBar){
      return <View>
              <TextInput 
                placeholder={convertText("message.search", lang)}
                placeholderTextColor="black"
                onChangeText={text => onSearch(text)}
                style={styles.searchText}
                value={onTextChange}
                //clearButtonMode='while-editing'
              />
                <TouchableOpacity style={styles.clearSearchBtn} onPress={() => clearText()}>
                  <Icon type="FontAwesome5" name={'times'} style={styles.clearIcon} />
                </TouchableOpacity>
              </View>
    } else {
      return <View>
              <Text style={styles.name}>{renderTitle(props.messages.current_thread_detail.title)}</Text>
              <Text style={styles.text}>test</Text>
            </View>
              
    }
  }

  const onLoadEarlier = (data) => {
    let threadId = props.messages.current_thread_detail.id
    setIsLoadingEarlier(true)
    props.dispatch(getThreadMessages(threadId, page)).then(res => {
      renderMessage(res)
      setIsLoadingEarlier(false)
      setPage(page + 1)
    })
  }
  
  const goToThreadList = () => {
    // props.navigation.navigate('Messages')
    props.navigation.navigate('Footer', {
      routeId : 2
    })
    props.dispatch(clearCurrentThread())
  }

  /*
  * Close Emoji picker on focus 
  */
  const closeEmojiPicker = () => {
    setEmojiPicker()
  }

  const scheduleMessageBtn = () => {
    let { owned_spots, default_locale } = props.auth.userData
    if (props.messages.current_thread_detail.checkinThread && owned_spots.length){
      return <TouchableOpacity onPress={() => props.navigation.navigate('ScheduleMessage')} style={styles.rightBtnContainer}>
                <Icon type="FontAwesome5" name={'comment-dots'} style={[styles.backIcon]} />
            </TouchableOpacity>
    }
  }

  const renderHeader = () => {
    if (props.messages.current_thread_detail.checkinThread) {
      return  <View style={[styles.userDetail, styles.userDetailCheckin]}>
                <TouchableOpacity onPress={() => goToThreadList()} style={styles.backBtnContainer}>
                  <Icon type="FontAwesome5" name={'arrow-left'} style={[styles.backIcon]} />
                </TouchableOpacity>
                <Text style={styles.checkinText}><FormatText variable='messages.checkin_msg' /></Text>
                {scheduleMessageBtn()}
              </View>
    } else {
      return  <View style={styles.userDetail}>
                <TouchableOpacity onPress={() => goToThreadList()}>
                  <Icon type="FontAwesome5" name={'arrow-left'} style={styles.backIcon} />
                </TouchableOpacity>
                <View style={styles.userImgCon}>
                  {profileImage(props.messages.current_thread_detail.image)}
                </View>
                <TouchableOpacity style={styles.userCon} onPress={() => props.navigation.navigate('ThreadDetail')}>
                   {openSearch()}     
                </TouchableOpacity>
                <Menu>
                  <MenuTrigger style={styles.menuIconCon} >
                    <Icon type="FontAwesome5" name={'ellipsis-v'} style={styles.menuIcon} />
                  </MenuTrigger>
                  <MenuOptions style={styles.menuCon}>
                    <MenuOption style={styles.menuItem} text={convertText("message.search", lang)} onSelect = {() => setSearchBar(true)}/>
                    <MenuOption style={styles.menuItem} text={convertText("message.clearConv", lang)} />
                  </MenuOptions>
                </Menu>
              </View>
    }
  }

  //<ImageBackground 
              //  source={require('../../assets/images/sms.png')}
               // style={styles.profileContainer}
               // imageStyle={styles.profileImage}>
               // </ImageBackground>
  const renderCheckinPlaceholder = () => {
    if (props.messages.current_thread_detail.checkinThread) {
      return   <View style={styles.checkinPlaceholder}>
                  <Text style={styles.checkinText}><FormatText variable='messages.write_checkin_msg' /></Text>
                </View>
               
              
    }
  }

  const onValueChange = (item) => {
    setSpotId(item)
    setSpotCords({centerCords: [item.longitude, item.latitude], id: item.id})
  }

  const renderDropdown = () => {
    let { owned_spots, default_locale } = props.auth.userData
    if (props.messages.current_thread_detail.checkinThread && owned_spots.length && props.route.params.post === 'spot') {
      return  <View style={styles.pickerCon}>
                <View style={styles.picker}>
                  <Picker
                    mode="dropdown"
                    iosHeader="Select Spot"
                    iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
                    style={styles.pickerElement}
                    onValueChange={(val) => onValueChange(val)}
                    itemTextStyle={styles.itemTextStyle}
                    selectedValue={spotId}
                    textStyle={{fontSize: 15}}
                    placeholder="Select.."
                  >
                    {props.route.params.post === 'spot' ? 
                      owned_spots.map((item, index) => {
                        return <Picker.Item key={index} label={language(default_locale, item.attname, item.attname_local)} value={item} />
                      })
                      /*<Picker.Item  label="Select Spot" value="0" />*/
                      :                       
                      <Picker.Item label={convertText("message.checkin", lang)} value="" /> 
                    }
                    {/*owned_spots.length ?
                      owned_spots.map((item, index) => {
                        return <Picker.Item key={index} label={language(default_locale, item.attname, item.attname_local)} value={item} />
                      })
                      :
                      null
                    */}
                  </Picker>
                </View>
              </View>
    }
  }


  return(
    <Container style={styles.mainContainer}>
      {renderHeader()}
      <GiftedChat
        ref={(ref) => (keyboardRef = ref)}
        messages={messages}
        onSend={messages => onSend(messages)}
        user={{
          _id: props.auth.userData.id,
        }}
        renderSend={renderSend}
        isCustomViewBottom={true}
        alwaysShowSend={true}
        renderActions={renderActions}
        text={message}
        onInputTextChanged={(text) => onMessageChange(text)}
        //focusTextInput= {() => console.log('here 123')}
        textInputProps={{onFocus: closeEmojiPicker}}
        loadEarlier={props.messages.isMoreMessages && !props.messages.isMessageFetching}
        onLoadEarlier={!props.messages.current_thread_detail.checkinThread && onLoadEarlier}
        isLoadingEarlier={!props.messages.current_thread_detail.checkinThread && isLoadingEarlier}
        //renderLoading={() => <Text>Loading...</Text>}
        //renderBubble={renderBubble}
      />
      {renderDropdown()}
      {renderCheckinPlaceholder()}
      {/*renderLoader()*/}
      {renderEmoji()}
      <RBSheet
        ref={modalRef}
        height={180}
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
        <EditImage multi renderMedia={renderMessageImage} removePhoto onSend SendMessage={message} hideModal={() => modalRef.current.close()} />
      </RBSheet>
    </Container>
  )
}

const styles = StyleSheet.create({
  userDetail: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  userCon:{
    marginLeft: 10,
    justifyContent: 'center',
    width: (width - 120),
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
    borderWidth: 1,
    borderColor: '#ccc',
    flexDirection: 'row',
    flexWrap: 'wrap'
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
    borderWidth: 1,
    borderColor: '#ccc',
  },
  chatCon: {
    paddingHorizontal: 10,
  },
  textMsgCon: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  textMsg: {
    padding: 10,
    backgroundColor: Colors.lighter,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginLeft: 10,
  },
  rightMsgCon: {
    alignItems: 'flex-end',
  },
  rightTextMsg: {
    padding: 10,
    backgroundColor: primaryColor,
    borderTopLeftRadius: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginVertical: 5,
  },
  msg: {
    color: '#fff',
    fontWeight: "600",
  },
  dateTime: {
    fontSize: 12,
    textAlign: 'center',
    color: 'grey',
    marginVertical: 5,
  },
  textInput: {
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'lightgrey',

  },
  searchBar: {
    backgroundColor: Colors.lighter,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  smileIconCon: {
    position: 'absolute',
    right: 10,
  },
  smileIcon: {
    color: primaryColor,
    fontSize: 24,
  },
  searchBarCon: {
    position: 'relative',
    width: '60%',
    justifyContent: 'center'
  },
  shareIcon: {
    color: primaryColor,
    fontSize: 24,
    marginLeft: 10,
  },
  attachmentIcon: {
    color: primaryColor,
    fontSize: 22,
    marginHorizontal: 10,
  },
  backIcon: {
    color: primaryColor,
    fontSize: 20,
    marginRight: 10,
  },
  sendbtn: {
    marginBottom: 15,
    marginRight:15,
  },
  icon: {
    fontSize: 20,
    color: primaryColor,
  },
  smilebtn: {
    marginBottom: 15,
    marginLeft: 10,
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
  chatImage: {
    width: 100,
    height: 100
  },
  menuIcon: {
    fontSize: 20,
  },
  menuItem: {
    padding: 10,
  },
  menuCon: {
    padding: 5,
  },
  searchText: {
    borderBottomWidth: 1,
    borderColor: primaryColor,
    padding: 8,
    width: '90%',
    color: '#000'
  },
  menuIconCon: { 
    width: 20, 
    alignItems: 'center',
  },
  clearSearchBtn: {
    position: 'absolute',
    right: 30,
    bottom: 10,
  },
  clearIcon: {
    fontSize: 14,
    color: 'grey'
  },
  direction: {
    flexDirection: 'row'
  },
  loader: {
    position: 'absolute', 
    width: '100%', 
    height: '100%', 
    justifyContent: 'center', 
    alignItems: 'center'
  },
  checkinText: {
    fontWeight: '600',
    textAlign: 'center'
  },
  userDetailCheckin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  checkinPlaceholder: {
    position: 'absolute',
    height: 200,
    top: '50%',
    marginTop: -100,
    justifyContent: 'center',
    alignItems:'center',
    width: '100%',
  },
  checkinText: {
    maxWidth: '80%',
    textAlign: 'center',
    fontSize: 18
  },
  backBtnIcon: {
    right:80
	},
  picker: {
  //  backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5,
    marginHorizontal: 10
  },
  pickerElement: {
    padding: 0,
    width: '100%',
    height: '100%',
  },
  arrowIcon: {
    right: 0,
    position: 'absolute',
    fontSize: 20
  },
  pickerCon: {
    width: '100%',
    position: 'absolute',
    top: '35%',
    left: 0,
    zIndex: 99,
  },
  backBtnContainer: {
    position: 'absolute',
    left: 10
  },
  rightBtnContainer: {
    position: 'absolute',
    right: 10
  },
  profileContainer: {
    width: width,
    height: height ,
  }
})

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth,
  map: state.map,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ChatBox); 
