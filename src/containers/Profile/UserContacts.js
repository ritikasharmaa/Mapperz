import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image,
  Platform,
  PermissionsAndroid
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Icon
} from 'native-base'
import {connect} from 'react-redux';
import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Header from '../../components/common/Header'
//import Footer from '../../components/common/Footer'
import Ripple from 'react-native-material-ripple';
import {renderImage, convertText} from '../../redux/Utility'
import {SkypeIndicator} from 'react-native-indicators';
import Toast from 'react-native-root-toast';
import { getProfile, getFriendsRequestList, deleteFriend } from '../../redux/api/auth'
import NoData from '../../components/common/NoData'
import Contacts from 'react-native-contacts';
import {primaryColor} from './../../redux/Constant'

const { width, height } = Dimensions.get('screen');

const UserContacts = (props) => {
  let lang = props.uiControls.lang

  const [loading, setLoading] = useState(null)
  const [search, setSearch] = useState('')
  const [contacts, setContacts] = useState(null)

  useEffect(() => {
    if (Platform.OS === 'android') {
      PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
          title: 'Contacts',
          message: 'This app would like to view your contacts.',
        }).then(() => {
          loadContacts();
        }
      );
    } else {
      loadContacts();
    }
  }, [])

  const loadContacts = () => {
    Contacts.getAll()
    .then((contacts) => {
      setContacts(contacts)
    })
    .catch((e) => { 
    })
  };

  const renderLoader = (id) => {
    return <Text style={{color: '#fff'}}>Invite</Text>
  }

  const removeFriend = (id) => {
    setLoading(id)
    props.dispatch(deleteFriend(id)).then(res=>{
      setLoading(null)
      Toast.show(convertText("profile.friendRemoved", lang))
    })
  }

  const searchFriend = (val) => {
    setSearch(val)
  }

  const goToFriendsProfile = (item) => {
    props.auth.loading = true,
    props.dispatch(getProfile(item.id))
    props.navigation.navigate('FriendProfile') 
  }
 
  const renderList = () => {
    if(contacts){
      //let filteredList = props.auth.userData.friends.filter(item => item.name.indexOf(search) !== -1)
      return contacts.map((item, index) => {
              return <TouchableOpacity key={index} style={styles.profileCon} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => goToFriendsProfile(item)} >
                      <View style={styles.picCon}>
                        <Image source={renderImage(item.profile_image, 'user')} style={styles.imgStyle} />
                      </View>
                      <View style={styles.profileTextCon}>
                        <Text style={styles.nameText}>{item.displayName || 'No Name Given'}</Text>
                        <View style={styles.listingInfo}>
                          {/* <Icon type="FontAwesome5" name='users' style={styles.btnIconList} /> */}
                          <Text style={styles.iconInfo}>{item.phoneNumbers.length && item.phoneNumbers[0]?.number}</Text>
                          {/* <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                          <Text style={styles.iconInfo}>{item.common_Friends_count}</Text> */}
                        </View>
                      </View>
                      <Ripple style={styles.inviteBtn} disabled={loading} >
                        {renderLoader(item.id)}
                      </Ripple>
                    </TouchableOpacity>
            })
    } else {
      return <View style={styles.noDataCon}>
              <NoData title={convertText("profile.no_friends", lang)} />
            </View>
    }    
  }

  return(
    <Container style={styles.mainContainer}>
    	<Header backEnd blackBackBtn nextScreen="Footer" heading="Friends" navigation={props.navigation} centerHeading/>
      <View style={styles.formBox}>
        <TextInput 
          placeholder={convertText("profile.searchForFriends", lang)}
          style={[styles.inputBox, styles.inputBoxLast]}
          onChangeText={(val) => searchFriend(val)}
          value={search}
        />
        <Icon name="search" type="FontAwesome5" style={styles.menuIcon} />
      </View>
      <Content>
        <View style={styles.body}>
          {renderList()}
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
    borderColor: '#f5f5f5'
  },
  picCon: {
    width: 50,
    height: 50,
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#aaa'
  },
  imgStyle:{
    width: 50,
    height: 50
  },
  profileTextCon:{
    paddingLeft: 15
  },
  nameText:{
    fontSize: 16
  },
  nameSubText: {
    fontSize: 12,
    color: '#a5a5a5'
  },
  listingInfo: {
    flexDirection: 'row',
    marginTop: 10
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
  filterCon:{
  	backgroundColor: Colors.lighter,
  	padding: 5,
  	paddingLeft: 15,
  	paddingRight: 15,
  },
  filterConText: {
  	color: '#828282'
  },
  inviteBtn: {
    position: 'absolute',
    right: 15,
    top: 22,
    backgroundColor: primaryColor,
    width: 50,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  btnIconListArrow:{
    fontSize: 12,
    color: '#fff'
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
  noDataCon: {
    height: height, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: 350
  },
});

const mapStateToProps = (state) => ({
  auth:  state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(UserContacts);  