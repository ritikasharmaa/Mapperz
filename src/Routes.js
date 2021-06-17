import React from 'react';
import { createStackNavigator, CommonActions  } from '@react-navigation/stack';
import HomeContainer from "./containers/Home/HomeContainer";
import Planner from './containers/Planner';
import SignupContainer from './containers/Auth/Signup/SignupContainer';
import GoToAuthContainer from './containers/Auth/GoToAuth/GoToAuthContainer';
import LoginContainer from './containers/Auth/Login/LoginContainer';
import ForgotPasswordContainer from './containers/Auth/ForgotPassword/ForgotPasswordContainer';
import ProfileContainer from './containers/Profile/ProfileContainer'
import Messages from './containers/Messages'
import MapSearch from './containers/MapSearch'
import ScheduleMessage from './containers/Messages/ScheduleMessage'
import ChatBox from './containers/Messages/ChatBox'
import Friends from './containers/Profile/Friends'
import EditProfile from './containers/Profile/EditProfile'
import FindFriends from './containers/Profile/FindFriends'
import ThreadDetail from './containers/Messages/ThreadDetail'
import Invites from './containers/Profile/Invites'
import SentRequests from './containers/Profile/SentRequests'
import NewsFeed from './containers/NewsFeed'
import SyncStorage from 'sync-storage';
import { connect } from 'react-redux';
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';
import { PermissionsAndroid ,Platform} from 'react-native'
import { authSuccess, setToken } from './redux/actions/auth'
import { notificationCount, updateNotification } from './redux/actions/notifications'
import { setSocket, updateLocation, updateUserCheckinMessage, updateUserSpotMessage, removePopup, updateUserCheckin } from './redux/actions/socket'
import { setLanguage } from './redux/actions/uiControls'
import CreatePost from './containers/NewsFeed/CreatePost.js'
import EditImages from './containers/NewsFeed/EditImages.js'
import Notifications from './containers/Notifications'
import FriendList from './containers/Messages/FriendList'
import Geolocation from 'react-native-geolocation-service';
import Initial from './containers/Auth/Initial'
import Name from './containers/Auth/Signup/Name'
import SocialLogin from './containers/Auth/Signup/SocialLogin' 
import DOB from './containers/Auth/Signup/DOB'
import Email from './containers/Auth/Signup/Email'
import UploadPicture from './containers/Auth/Signup/UploadPicture'
import SocialLoginUser from './containers/Auth/Signup/SocialLoginUser'
import { updateThread, updateMessage } from './redux/actions/messages'
import HomeBase from './containers/Auth/Signup/HomeBase'
import FriendProfile from './containers/Profile/FriendProfile'
import Toast from 'react-native-root-toast';
import Ripple from 'react-native-material-ripple';
import {setCenterCord} from './redux/actions/map'
import CustomeToast from './components/common/Toast'
import {setPostFeedEvent, updateFeedList} from './redux/actions/feed'
import { NetworkInfo } from 'react-native-network-info';
import Areas from './containers/Auth/Signup/Areas'
import FirstRender from './containers/Auth/FirstRender';
import Footer from './components/common/Footer'
import CheckFooter from './containers/Home/CheckFooter';
import Intro from './containers/Auth/Intro'
import Loading from './containers/Auth/Signup/Loading'
import GPSState from 'react-native-gps-state'
import FacebookFriends from './containers/Profile/FacebookFriends'
import UserContacts from './containers/Profile/UserContacts'

const Stack = createStackNavigator();
const handler = null;

class Router extends React.Component {

	constructor(props){
    super(props)
    this.state = {
      checkinData: {},
      netInfo : null
    }
  }
   
  async componentWillMount(): void {
   let abc = await NetworkInfo.getIPV4Address()
   this.setState({
    netInfo: abc
   })
    const data = await SyncStorage.init();

  	// await PermissionsAndroid.requestMultiple(
    //   [PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //   PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION],
    //   {
    //       title: 'Give Location Permission',
    //       message: 'App needs location permission to find your position.'
    //   }
    // ).then(granted => {
    //     console.log(granted);
    //     //resolve();
    // }).catch(err => {
    //     //console.warn(err);
    //     //reject(err);
    // });

    let token = SyncStorage.get('token');
    let userData = SyncStorage.get('userData');
    if (userData) {
      this.props.dispatch(setToken(token))
      this.props.dispatch(authSuccess(userData))
      this.props.dispatch(setLanguage(userData.default_locale))  
    }
    if (token) {
      this.setupSocket()
      this.setConversationSocket()
    }
  }

  componentDidMount(){
    //this.checkForLocation()
  }

  componentDidUpdate(prevProps){
    if (prevProps.auth.userData.id !== this.props.auth.userData.id && this.props.auth.userData.id) {
      this.setupSocket()
      this.setConversationSocket()
    }    
  }

  componentWillUnmount(){
    Geolocation.watchPosition((info)=>{
      console.log('info')
    })
  }

  checkForLocation = () => {
    if (Platform.OS == 'android') {
      RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({interval: 10000, fastInterval: 5000})
      .then(data => {
      if (data === "already-enabled" || data === "enabled") {
        return true
      } else {
          this.checkForLocation()
        }
      }).catch(err => {
        this.checkForLocation()
      })
    }
  }

  /*
  * setup socket for mapper
  */
  setupSocket () {
    let token = SyncStorage.get('token');
    let socket = new WebSocket(`wss://www.mapperz.jp/cable?token=${token}`)
    socket.onopen = (event) => {
      let isConnected = SyncStorage.get('isConnected')
      if(!isConnected) {
        SyncStorage.set('isConnected', true)
      }
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: "MapperChannel"
        })
      }
      socket.send(JSON.stringify(msg))
      window.socket = socket;
      this.props.dispatch(setSocket(socket))
      this.watchUserLocation(socket)
      /*if (this.checkForLocation() && Platform.OS == 'android') {
          this.watchUserLocation(socket)
      }else{
        this.watchUserLocation(socket)
      }*/
      //this.addLocation(socket)   
    }
    socket.onmessage = (event) => {
      clearTimeout(handler);
      setTimeout(() => socket.close(),3000);
      const msg = JSON.parse(event.data)
      if (msg.type === 'ping') {
        return
      }
      if (msg.message) {
        let socketData = JSON.parse(JSON.stringify(msg.message));
        let data = (msg.message.message && typeof(msg.message.message) === 'object') ? msg.message.message : msg.message
        if ( (!data.status || data.status === "checkin_start" || data.status === "location_stop")) {
          this.props.dispatch(updateLocation(data))  
        } else if ( data.status === 'post_mapper' && data.for_popup) {
          this.props.dispatch(updateUserCheckinMessage(data))          
        } else if (data.status === 'post_user' && !data.for_popup ) {
        	let postData = data;
          postData.post_owner = true;
          postData.total_like = 0;
          postData.total_comment = 0;
          postData.total_share = 0;

          this.props.dispatch(updateFeedList(postData))

        	if(this.props.feed.scroll && data.sender_id !== this.props.auth.userData.id){
        		this.props.dispatch(setPostFeedEvent())
        	} else {
        		return
        	}
        } 
        	else if (data.status === 'post_spot' && data.for_popup) {
          this.props.dispatch(updateUserSpotMessage(data))
        } else if (data.status === 'remove'){
        	this.props.dispatch(removePopup(data))
        } else if (data.status === 'notification') {
        	if(this.props.uiControls.activeTabIndex === 4){ 
        		this.props.dispatch(updateNotification(data))
        	} else {  
        		this.props.dispatch(notificationCount())
        	}       	
        }
        if (data.status === "checkin_start") {
        	this.setState({checkinData: data})
        	setTimeout(() => {
        		this.setState({checkinData: {}})
        	}, 5000);
        }
      }
    }

    socket.onclose = (e) => {  
      //console.log(this.props.socket.isConnected, 'Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      let isConnected = SyncStorage.get('isConnected')
      if(isConnected) {
        SyncStorage.remove('isConnected')
      }
      setTimeout(() => {
        this.setupSocket();
      }, 1000);
    };  

    socket.onerror = (err) => {
      let isConnected = SyncStorage.get('isConnected')
       if(isConnected) {
        SyncStorage.remove('isConnected')
       }
      // console.error('Socket encountered error5555: ', err.message, 'Closing socket');
      //socket.close();
    };

  }

  centerOnSpot( cord, id ) {
		return this.props.dispatch(setCenterCord({centerCords : cord, id: id}))
	}

	renderToast () {
		let data = this.state.checkinData
		if(data.status === "checkin_start") {
			if(data.id === this.props.auth.userData.id){
				return <CustomeToast 
						toastText = 'You has just checked in'
						data= {data}
					/>
			} else {
				return <CustomeToast 
								toastText = 'has just checked in'
								name = {data.name}
								data= {data}
							/>
			}
		} 
	}

  /*
  * setup conversation socket
  */
  setConversationSocket () {
    let token = SyncStorage.get('token');
    let conversationSocket = new WebSocket(`wss://www.mapperz.jp/cable?token=${token}`)    
    conversationSocket.onopen = (event) => {
      let isConnected = SyncStorage.get('isConnected')
      if(!isConnected) {
        SyncStorage.set('isConnected', true)
      }
      const msg = {
        command: 'subscribe',
        identifier: JSON.stringify({
          channel: "ConversationChannel"
        })
      }
      conversationSocket.send(JSON.stringify(msg))
      window.conversationSocket = conversationSocket;
    }

    conversationSocket.onmessage = (event) => {
      const msg = JSON.parse(event.data)
      if (msg.type === 'ping'){
        return
      }
      if (msg.message) {
        //let data = msg.message.chat.length && msg.message.chat[0]
        let data = msg.message.chat
        //let threadData = msg.message.conversation.length && msg.message.conversation[0]
        let threadData = msg.message.conversation
        let id = this.props.auth.userData.id
        if(data.owner_id !== id){
          this.props.dispatch(updateThread(threadData))
        } 
        if(data.conversation_id === this.props.messages.current_thread_detail.id){
        	data.newMessage = true;
    			this.props.dispatch(updateMessage(data))
    	  }
      }
    }

    conversationSocket.onclose = (e) => {
      let isConnected = SyncStorage.get('isConnected')
      if(isConnected) {
        SyncStorage.remove('isConnected')
      }
     // console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
      setTimeout(() => {
        this.setConversationSocket();
      }, 1000);
    };

    conversationSocket.onerror = (err) => {
      // console.log("hi")
      let isConnected = SyncStorage.get('isConnected')
      if(isConnected) {
        SyncStorage.remove('isConnected')
      }
      //console.error('Socket encountered error22222: ', err.message, 'Closing socket');
      //conversationSocket.close();
    };
  }

  /*
  * watch user location on real time
  */
  watchUserLocation (socket) {
    let isAuthrized = GPSState.isAuthorized()
    // if(isAuthrized){
    //   Geolocation.watchPosition(info => {
    //     //let {socket} = this.props.socket
    //     if (socket) {
    //       const msg = {
    //         command: 'message',
    //         identifier: JSON.stringify({
    //           channel: "MapperChannel"
    //         }),
    //         data: JSON.stringify({
    //           lat: info.coords.latitude,
    //           lng: info.coords.longitude,
    //           captured_at: info.timestamp
    //         })
    //       }
  
    //       socket.send(JSON.stringify(msg))
    //     }
    //   }, {}, {enableHighAccuracy: true, distanceFilter: 50})
    // }    
  }

  showFooter = () => {
  	let navigation = SyncStorage.get('navigation');
    if(navigation && (Object.keys(navigation).length !== 0) && this.props.auth.loggedIn){
        return <Footer navigation={navigation} lang={this.props.uiControls.lang}/>
    }
  }

  render(){
  	/*if(navigation && (Object.keys(navigation).length !== 0)){
  		console.log(navigation.dangerouslyGetState(), "navigation")
  	}*/
    return(
    	<> 	
    	{this.renderToast()}
      <Stack.Navigator>

	      {/*<Stack.Screen name="FirstRender" component={FirstRender} options={{ animationEnabled :false ,  headerShown: false }}/> */} 
	      <Stack.Screen name="Initial" component={Initial} options={{  animationEnabled :false ,headerShown: false }} />
	      <Stack.Screen name="Intro" component={Intro} options={{ headerShown: false }}/>
	      <Stack.Screen name="Footer" component={CheckFooter} options={{ headerShown: false }}/>            


            <Stack.Screen name="Home" component={HomeContainer} options={{ headerShown: false }}/>            
            <Stack.Screen name="Messages" component={Messages} options={{ headerShown: false }}/>
            <Stack.Screen name="ChatBox" component={ChatBox} options={{ headerShown: false }}/>
            <Stack.Screen name="ScheduleMessage" component={ScheduleMessage} options={{ headerShown: false }}/>
            <Stack.Screen name="FriendList" component={FriendList} options={{ headerShown: false }}/>
            <Stack.Screen name="ThreadDetail" component={ThreadDetail} options={{ headerShown: false }}/>
            <Stack.Screen name="Profile" component={ProfileContainer} options={{ headerShown: false }}/>  
            <Stack.Screen name="FacebookFriends" component={FacebookFriends} options={{ headerShown: false }}/>          
            <Stack.Screen name="Planner" component={Planner} options={{ headerShown: false }}/>
            <Stack.Screen name="Notifications" component={Notifications} options={{ headerShown: false }}/>
          	<Stack.Screen name="EditImages" component={EditImages} options={{ headerShown: false }}/>
            <Stack.Screen name="Invites" component={Invites} options={{ headerShown: false }}/>      
            <Stack.Screen name="SentRequests" component={SentRequests} options={{ headerShown: false }}/>     
            <Stack.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }}/>  
            <Stack.Screen name="Friends" component={Friends} options={{ headerShown: false }}/> 
            <Stack.Screen name="FindFriends" component={FindFriends} options={{ headerShown: false }}/>
            <Stack.Screen name="UserContacts" component={UserContacts} options={{ headerShown: false }}/>
            <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }}/>
            <Stack.Screen name="NewsFeed" component={NewsFeed} options={{ headerShown: false }}/>
            <Stack.Screen name="FriendProfile" component={FriendProfile} options={{ headerShown: false }}/>
            <Stack.Screen name="MapSearch" component={MapSearch} options={{ headerShown: false }}/>
          {/* </>
          :
          <> */}
          	
            <Stack.Screen name="GoToAuth" component={GoToAuthContainer} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={LoginContainer} options={{ headerShown: false }}/>
            <Stack.Screen name="Name" component={Name} options={{ headerShown: false }}/>  
            <Stack.Screen name="SocialLogin" component={SocialLogin} options={{ headerShown: false }}/>
            <Stack.Screen name="SocialLoginUser" component={SocialLoginUser} options={{ headerShown: false }}/>
            <Stack.Screen name="DOB" component={DOB} options={{ headerShown: false }}/>  
            <Stack.Screen name="HomeBase" component={HomeBase} options={{ headerShown: false }}/>
            <Stack.Screen name="Loading" component={Loading} options={{ headerShown: false }}/>
            <Stack.Screen name="Email" component={Email} options={{ headerShown: false }}/> 
            <Stack.Screen name="Areas" component={Areas} options={{ headerShown: false }}/>
            <Stack.Screen name="UploadPicture" component={UploadPicture} options={{ headerShown: false }}/> 
            <Stack.Screen name="Signup" component={SignupContainer} options={{ headerShown: false }}/>
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordContainer} options={{ headerShown: false }}/>
          {/* </>
        } */}
      </Stack.Navigator>
      {/* {this.showFooter()} */}
      
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth,
  socket: state.socket,
  map: state.map,
  feed: state.feed,
  uiControls: state.uiControls,
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch,
    authSuccess
});

export default connect(mapStateToProps, mapDispatchToProps)(Router); 
