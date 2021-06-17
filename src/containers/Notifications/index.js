import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  Image,
  FlatList, Alert, AsyncStorage
} from 'react-native';
import { Container, Content } from 'native-base'
import {connect} from 'react-redux';
import Ripple from 'react-native-material-ripple';
//import Footer from '../../components/common/Footer';
import { getNotification, readStatus } from '../../redux/api/notifications'
import moment from 'moment'
import ContentLoader from '../../components/common/ContentLoader'
import {setCenterCord} from '../../redux/actions/map'
import {getProfile} from '../../redux/api/auth'
import { renderImage } from '../../redux/Utility'
import { setActiveTabIndex } from '../../redux/actions/uiControls';
import Toast from 'react-native-root-toast';
import { getSpecificMapDetail } from "../../redux/api/map";
import { getMapFeed } from "../../redux/api/feed";
import NoData from "../../components/common/NoData"
import FormatText from '../../components/common/FormatText'

const { width, height } = Dimensions.get('screen');

const Notifications = (props) => {

  const[page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [endOfThreads, setEndOfThreads] = useState(false)

  useEffect(() => {
    fetchThreads()  
  },[])

  useEffect(() => {
    const listener = props.navigation.addListener('focus', () => {
      props.dispatch(setActiveTabIndex(4))
    });
    return () => {listener}
  }, [props.navigation]);

  const fetchThreads =() => {
    if(!props.notifications.isLoading && !loading && !endOfThreads){
      if(page !== 1){
        setLoading(true)
      }
      props.dispatch(getNotification(page)).then(res => {
        if(res.length < 10){
          setEndOfThreads(true)
        }
        setPage(page + 1)
        setLoading(false)
      })
    }
    
  }

  const action = (item) => {
    props.dispatch(readStatus(item.id))
    let index = props.socket.checkin_users.checked_in.findIndex(data => data.id === item.sender_id)
    if(item.action === 'checkin'){       
      if(index === -1){
        Toast.show("User is no longer checked in")
      } else {
        props.dispatch(setCenterCord({centerCords : [item.link.longitude, item.link.latitude], id: item.sender_id}))
        props.navigation.navigate('Footer', {
            routeId : 0
          })
      }         
    } else if(item.action === 'followed'){
      if(item.sender_id === props.auth.userData.id){
        // props.navigation.navigate('Profile')
        props.navigation.navigate('Footer', {
          routeId : 4
        })
      } else {
        props.dispatch(getProfile(item.sender_id)).then(res => {
          props.navigation.navigate('FriendProfile')
        })
      }            
    } else if(item.action === 'post'){
      if(index === -1){
        Toast.show("Post is not longer found")
      } else {
        let data = props.socket.checkin_users.checked_in[index]
        props.dispatch(setCenterCord({centerCords : [data.lng, data.lat], id: item.sender_id}))
        props.navigation.navigate('Footer', {
            routeId : 0
          })
      }
    } else if(item.action === 'mapper'){
      props.navigation.navigate('Footer', {
            routeId : 0
          })
      props.dispatch(getSpecificMapDetail(item.link.thread_id));
      props.dispatch(getMapFeed(item.link.thread_id));
    }
  }

  const renderListItem = (data) => {
    let item = data.item
    return <Ripple style={[styles.listItem, !item.read && {backgroundColor: 'rgba(146, 72, 231, 0.1)'}]}
            rippleColor="#ccc" 
            rippleOpacity={0.2} 
            rippleDuration={700}
            onPress={() => action(item)}>
            <View style={styles.imgCon}>
              <Image style={styles.img} source = {renderImage(item.sender_image, 'user')}/>
            </View>
            <View style={styles.detailCon}>
              {/* <Text style={[styles.name, !item.read && {fontWeight: 'bold'}]}>{item.sender_name}</Text> */}
              {/*<Text style={styles.heading}>{item.action}</Text>*/}
              <Text style={styles.subText, !item.read && {fontWeight: 'bold'}}>{item.message}</Text>
            </View>
            <View style={styles.timeCon}>
              <Text style={styles.time}>{moment(item.updated_at).fromNow('lt')}</Text>
            </View>
          </Ripple>
  }

  const flatList = () => {
    if(props.notifications.isLoading){
      return <ContentLoader />
    } else if(props.notifications.notifications.length !== 0){
      return <FlatList
              style={{backgroundColor: '#fff'}}
              onEndReached={fetchThreads}
              onEndReachedThreshold={0.7}
              data={props.notifications.notifications}
              renderItem={rowData => renderListItem(rowData)}
              refreshing={loading}
              showsVerticalScrollIndicator={false}
            />
    } else {
      return <View style={{marginTop: 100}}>
              <NoData />
            </View>
    }      
  }

  return(
    <Container>
      <View style={styles.header}>
        {/* <TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.navigate('Footer')}>
          <Icon type="FontAwesome5" name={'chevron-left'} style={[styles.icon, styles.backBtnIcon]} />
        </TouchableOpacity> */}
        <Text style={styles.headerText}><FormatText variable='noti.notifications' /> </Text>
      </View>
      <Content style={styles.notificationCon}>
        <View style={styles.subCon}>
          {/*<View style={styles.textCon}>
            <Text style={styles.recent}>Recent</Text>
          </View>*/}
          {flatList()}
        </View>
      </Content>
       {/*<Footer navigation={props.navigation} />*/}
    </Container>
  );
};


const styles = StyleSheet.create({
  notificationCon: {
    paddingVertical: 15,
  },
  subCon: {
    marginBottom: 70,
  },
  textCon: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 5,
    marginBottom: 10,
  },
  recent: {
    textTransform: 'uppercase',
    color: 'grey',
    fontSize: 12,
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    paddingHorizontal: 15
  },
  imgCon: {
    width: 40,
    height: 40,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#ccc'
  },
  img: {
    width: '100%',
    height: '100%',
  },
  detailCon: {
    width: width - 160,
    marginLeft: 10,
  },
  name: {
    fontSize: 15,
  },
  heading: {
    fontSize: 15,
    fontWeight: '600',
  },
  time: {
    width: 80,
    fontSize: 12,
    color: 'grey',
    textAlign: 'right',
  },
  header: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 0.5,
    //borderTopWidth: 0.5,
    borderColor: '#aaa',
    paddingHorizontal: 15,
    zIndex: 99
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 18,
    color: '#aaa'
  },
  headerText: {
    marginLeft: 15,
    fontSize: 16,
  }
});

const mapStateToProps = (state) => ({
  notifications: state.notifications,
  auth: state.auth,
  socket: state.socket
});
const mapDispatchToProps = (dispatch) => ({
  dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(Notifications); 



