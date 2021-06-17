import React, {useState} from 'react';
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
import { cancelFriendRequest, acceptFriendRequest, getProfile } from '../../redux/api/auth'
import {SkypeIndicator} from 'react-native-indicators';
import Toast from 'react-native-root-toast';
import FormatText from '../../components/common/FormatText'
import NoData from '../../components/common/NoData'
import {renderImage, convertText} from '../../redux/Utility'


const { width, height } = Dimensions.get('screen');

const Invites = (props) => {

  let lang = props.uiControls.lang
  const [loading, setLoading] = useState(null)
  const [acceptLoading, setAcceptLoading] = useState(null)

  const removeFriendRequest = (id) => {
    setLoading(id)
    props.dispatch(cancelFriendRequest(id, 'incoming_requests')).then(res=>{
      setLoading(null)
    })
  }

  const renderLoader = (id) => {
    if (loading !== id) {
      return <Icon type="FontAwesome5" name='times' style={styles.btnIconListArrow} />
    } else {
      return <SkypeIndicator color='white' size={20} />
    }
  }

  const renderAcceptLoader = (id) => {
    if (acceptLoading !== id) {
      return <Icon type="FontAwesome5" name='user-plus' style={styles.btnIconListArrow} />
    } else {
      return <SkypeIndicator color='white' size={20} />
    }
  }

  const acceptRequest = (id) => {
    setAcceptLoading(id)
    props.dispatch(acceptFriendRequest(id, 'incoming_requests')).then(res => {
      setAcceptLoading(null)
     // props.dispatch(getProfile())
      Toast.show('Request Accepted')
    })
  }

  const goToFriendsProfile = (item) => {
    props.auth.loading = true,
    props.dispatch(getProfile(item.id))
    props.navigation.navigate('FriendProfile') 
  }

  return(
    <Container style={styles.mainContainer}>
    	<Header backEnd blackBackBtn nextScreen="Footer" heading="Recieved Friends Requests" navigation={props.navigation} centerHeading/>
      <Content>
        <View style={styles.body}>
          {(!props.auth.requestData.incoming_requests || !props.auth.requestData.incoming_requests.length) && 
            <View style={styles.noDataCon}>
              <NoData title={convertText("profile.no_invites", lang)} />
            {/*<Text style={{fontSize: 18}}><FormatText variable='profile.unfriend'/></Text>*/}
            </View>
          }
          {props.auth.requestData.incoming_requests && props.auth.requestData.incoming_requests.map((item, index) => {
            return  <TouchableOpacity style={styles.profileCon} key={index} onPress={() => goToFriendsProfile(item)}>
                      <View style={styles.picCon}>
                        <Image source={renderImage(item.profile_image, 'user')} style={styles.imgStyle} />
                      </View>
                      <View style={styles.profileTextCon}>
                        <Text style={styles.nameText}>{item.name || 'No Name'}</Text>
                      </View>
                     {/* <Ripple style={styles.addBtn} disabled={acceptLoading} onPress={() => acceptRequest(item.id)}>
                        {renderAcceptLoader(item.id)}
                      </Ripple>
                      <Ripple style={styles.removeBtn} disabled={loading} onPress={() => removeFriendRequest(item.id)}>
                        {renderLoader(item.id)}
                      </Ripple>*/}
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
    paddingBottom: 10
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
    backgroundColor: '#f5f5f5'
  },
  inputBox: {
    height: 35,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingLeft: 10,
    paddingRight: 10
  },
  inputBoxLast: {
    borderBottomWidth: 0
  },
  btnIconListArrow:{
  	fontSize: 12,
    color: '#fff'
  },
  addBtn:{
    backgroundColor: secondaryColor,
    position: 'absolute',
    right: 50,
    height: 25,
    top: 18,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  removeBtn: {
    position: 'absolute',
    right: 10,
    top: 18,
    backgroundColor: 'gray',
    width: 30,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5
  },
  noDataCon: {
    height: height, 
    justifyContent: 'center', 
    alignItems: 'center', 
    paddingBottom: 250
  }
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Invites); 