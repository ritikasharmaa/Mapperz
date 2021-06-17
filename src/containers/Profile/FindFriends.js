import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Image
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon
} from 'native-base'
import Header from '../../components/common/Header'
//import Footer from '../../components/common/Footer'
import { primaryColor, secondaryColor } from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import {connect} from 'react-redux';
import { findUserList, sendFriendRequest, getFriendsRequestList, acceptFriendRequest } from '../../redux/api/auth'
import {renderImage, convertText} from '../../redux/Utility'
import {SkypeIndicator} from 'react-native-indicators';
import Toast from 'react-native-root-toast';
import FormatText from '../../components/common/FormatText'
import { getProfile } from '../../redux/api/auth'


const { width, height } = Dimensions.get('screen');

const FindFriends = (props) => {
  let lang = props.uiControls.lang

  const [search, setSearch] = useState('')
  const [sendingReq, setSendingReq] = useState(null)
  const [filterFriend, setFilterFriends] = useState([])
  const [acceptLoading, setAcceptLoading] = useState(null)

  useEffect(() => {
    props.dispatch(findUserList(''))
      },[])

  const searchUser = (value) => {
    setSearch(value);
    props.dispatch(findUserList(value))
  }

  const sendRequest = (id) => {
    const filterList = [...filterFriend, id ]
    setSendingReq(id)
    props.dispatch(sendFriendRequest(id)).then(res=>{
      props.dispatch(getFriendsRequestList())
      Toast.show(convertText("profile.reqSent", lang))
      setSendingReq(null)
      setFilterFriends(filterList)
    })
  }
  const acceptRequest = (id) => {
    setAcceptLoading(id)
    props.dispatch(acceptFriendRequest(id, 'incoming_requests')).then(res => {
      setAcceptLoading(null)
      props.dispatch(getProfile())
      Toast.show(convertText("profile.reqAccept", lang))
    })
  }
  const renderLoader = (id) => {
    if (sendingReq !== id && acceptLoading !== id) {
      return <Icon type="FontAwesome5" name='user-plus' style={styles.btnIconListArrow} />
    } else if ( sendingReq !== id && acceptLoading !== id){
      return <Icon type="FontAwesome5" name='check' style={styles.btnIconListArrow} />
    }
    else {
      return <SkypeIndicator color='white' size={20} />
    }
  }

  const renderButton = () => {
     return (
        <>
          <Text style={styles.reqSentText} ><FormatText variable='profile.req_sent'/> <Icon type="FontAwesome5" name='user-check' style={styles.btnIconListArrow} /></Text>
        </>
     ) 
  }

  const renderFriendStatusButtons = (item) => {
    if(item.friend_status === "friend"){
      return <Ripple style={[styles.addBtn,styles.disableBtn, styles.reqSentBtn]} disabled={true}>
              <Text><FormatText variable='profile.friend'/></Text>
            </Ripple>
    } 
    else if(item.friend_status === "request_sent"){
      return <View style={styles.statusCon}>
              <Text style={styles.status}><FormatText variable='profile.req_sent'/></Text>
            </View>
    }
    else if(item.friend_status === "request_received"){
      return <Ripple style={styles.addBtn} disabled={acceptLoading} onPress={() => acceptRequest(item.id)}>
              {renderButton()}
            </Ripple>
    }
    /*else {
     return  ( 
       !filterFriend.includes(item.id) ? <Ripple style={styles.addBtn} disabled={sendingReq} onPress={() => sendRequest(item.id)}>
                {renderLoader(item.id)} 
                  </Ripple> : 
           <Ripple style={[styles.addBtn,styles.disableBtn]} disabled={acceptLoading} onPress={() => acceptRequest(item.id)}>
             {renderButton()}
               </Ripple>
             )
     }*/
  }

  const renderName = (item) => {
    if(item.first_name || item.nick_name){
      return item.nick_name ? item.nick_name : (item.first_name + ' ' + item.last_name)
    }
    else {
      return <Text><FormatText variable='profile.no_name'/></Text>     
    }
  }

  const goToFriendsProfile = (item) => {
    props.auth.loading = true,
    props.dispatch(getProfile(item.id))
    props.navigation.navigate('FriendProfile') 
  }

  return(
    <Container style={styles.mainContainer}>
      <Header backEnd blackBackBtn nextScreen="Footer" heading="Search Friends" navigation={props.navigation} centerHeading/>
      <View style={styles.formBox}>
        <TextInput 
          placeholder={convertText("profile.searchTravelz", lang)}
          style={[styles.inputBox, styles.inputBoxLast]}
          onChangeText={(val) => searchUser(val)}
          value={search}
        />
      <Icon name="search" type="FontAwesome5" style={styles.menuIcon} />
      </View>
      <Content>
        <View style={styles.body}>
          {(!props.auth.userList || !props.auth.userList.length) && 
            <View style={{alignItems: 'center', padding: 30}}>
              <Text style={{fontSize: 18}}><FormatText variable='profile.find_friend'/></Text>
            </View>
          }
          {props.auth.userList.map((item, index) => {
              return  <TouchableOpacity style={styles.profileCon} onPress={() => goToFriendsProfile(item)}>
                        <View style={styles.picCon}>
                          <Image source={renderImage(item.profile_image)} style={styles.imgStyle} />
                        </View>
                        <View style={styles.profileTextCon}>
                          <Text style={styles.nameText}>{renderName(item)} </Text>
                        </View>
                        {renderFriendStatusButtons(item)}
                    </TouchableOpacity>
          })}
        </View>
      </Content>
      {/*<Footer navigation={props.navigation} />*/}
    </Container>
  )
}

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    flex: 1,
    paddingBottom: 50
  },
  mainContainer: {
    backgroundColor: '#fff',
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
  nameSubText: {
    fontSize: 16,
    color: '#a5a5a5',
    fontWeight: '400'
  },
  listingInfo: {
    flexDirection: 'row'
  },
  btnIconList: {
    fontSize: 12,
    marginRight: 4,
    top: 2,
    color: '#9e9a9a'
  },
  iconInfo: {
    marginRight: 10,
    color: '#9e9a9a'
  },
  categoryBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    borderBottomWidth: 0,
    marginTop: 5
  },
  categoryCon: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 50,
    flexDirection: 'row'
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500'
  },
  btnIcon: {
    position: 'absolute',
    left: 10,
    top: 14,
    fontSize: 22
  },
  btnIconNext: {
    right: 15,
    left: 'auto',
    position: 'absolute',
    fontSize: 18,
    color: '#636363',
    top: 15
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
  btnIconListArrow:{
    fontSize: 12,
    color: '#fff',
  },
  addBtn:{
    backgroundColor: secondaryColor,
    position: 'absolute',
    right: 10,
    height: 25,
    top: 18,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  disableBtn:{
    opacity:0.5
  },
  menuIcon: {
    fontSize: 18,
    width: 25,
    color: '#999',
    top:25,
    left:25,
    position:'absolute'
  },
  reqSentBtn:{
    width:100
  },
  reqSentText:{
    color: '#fff',
    fontSize: 12,
  },
  status: {
    fontStyle : 'italic',
    color: 'green'
  },
  statusCon: {
    marginTop: 10,
    flex: 1,
    alignItems: 'flex-end'
  }

});

const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(FindFriends); 