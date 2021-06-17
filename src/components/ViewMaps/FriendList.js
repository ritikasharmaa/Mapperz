import React, {useRef, useState} from 'react';
import { View, StyleSheet,Text,Image,TouchableOpacity, Dimensions, TextInput } from 'react-native';
import Header from '../common/Header'
import { Icon, Button, Container, Content } from 'native-base'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import FriendsListAction from '../common/FriendsListAction'
import NoData from '../common/NoData'
import { renderImage, convertText } from '../../redux/Utility';
import moment from 'moment'
import { getProfile } from '../../redux/api/auth'
import {connect} from 'react-redux';
import FormatText from '../common/FormatText'

const { width, height } = Dimensions.get('screen');

const FriendList = (props) =>{
	const modalRef = useRef(false)
  const [searchText, setSearchText] = useState('')

  const onSearch = (text) => {
    setSearchText(text)
	}
  const goToFriendsProfile = (item) => {
    props.loading = true,
    props.dispatch(getProfile(item.id))
    props.navigation.navigate('FriendProfile') 
    props.modalRef.current.close()

  }

  const openLocation = (item) => {
    centerOnSpot([item.lng, item.lat], item.id)
    //props.dispatch(getSpecificMapDetail(item.checkin_mapper_id));
    //props.dispatch(getMapFeed(item.checkin_mapper_id));
  }

	const renderList = () => {
		if(props.checkin_users.checked_in.length ){
      let filterList = props.checkin_users.checked_in.filter(item => item.name.indexOf(searchText) !== -1)
  		return filterList.map((item, index) => {
        if (item.time_left < 0 || item.id === props.userId) {return false}
  			return (	
  				<View style={styles.userDetail} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} key={index} >
  					<View style={styles.userImgCon}>
  					  <Image style={styles.userImg} source = {renderImage(item.profile_image, 'user')}/>
  					</View>
  					<View style={styles.userCon}>
    					<Text style={styles.name}>{item.name}</Text>
  					</View>
  					<Ripple 
  						rippleOpacity={0.2} 
  						rippleDuration={600}
  						style={[styles.actionBtn]}
  						onPress={() => openLocation(item)}
  					>
    					<Icon type="FontAwesome5" name={'map-marker'} style={styles.mapIcon} />
    				</Ripple>
  				</View>
  			)
  		})
	  } 
	}

  const renderOtherList = () => {
    if(props.checkin_users.other.length){
      let filterList = props.checkin_users.other.filter(item => item.name.indexOf(searchText) !== -1)
      return filterList.map((item, index) => {
        if(item.id === props.userId){
          return false
        }
        return (  
          <TouchableOpacity style={[styles.userDetail, {backgroundColor: '#f1f1f1'}]} rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} key={index} onPress={() => goToFriendsProfile(item)}>
            <View style={styles.userImgCon}>
              <Image style={styles.userImg} source = {renderImage(item.profile_image, 'user')}/>
            </View>
            <View style={styles.userCon}>
              <Text style={styles.name}>{item.name}</Text>
              {item.last_checkedin_time && 
                <Text style={styles.text}>
                 <FormatText variable='mapcomp.lastCheckin' /> {moment(item.last_checkedin_time).fromNow()}
                  {item.last_checkedin_at && <Text> <FormatText variable='mapcomp.at' /> {item.last_checkedin_at}</Text>}
                </Text>
              }
            </View>
          </TouchableOpacity>
        )
      })
    }
  }

	const centerOnSpot = ( cord, id ) => {
		props.setCenterCord({centerCords : cord, id: id})
		props.modalRef.current.close()
	}

  const renderData = () => {
    if(props.checkin_users && (props.checkin_users.checked_in.length !== 0 || props.checkin_users.other.length !== 0)) {
      return <Content style={styles.mainCon}>
              <View>
                <TextInput
                 style={styles.textBox}
                 placeholder={convertText("mapcomp.searchFriends", props.lang)}
                 onChangeText={(text) => onSearch(text)}
                />
                <Icon type="FontAwesome5" name={'search'} style={styles.searchIcon} />
              </View>          
              <View style={styles.friendslistCon}>
                {renderList()}
                {renderOtherList()}
              </View> 
            </Content>
    } else {
      return <View style={styles.placeholder}>
              <NoData />
            </View>
    }
  }

	return(
		<Container>
      {renderData()}
			<RBSheet
        ref={modalRef}
        height={410}
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
        <FriendsListAction/>
      </RBSheet>
		</Container>
	)
}

const styles = StyleSheet.create({
	mainCon: {
		paddingHorizontal: 15,
		marginTop: 10,
	},
	userDetail: {
    paddingVertical: 3,
    flexDirection: 'row',
    position: 'relative',
    marginHorizontal: -15,
    paddingHorizontal: 15,
    alignItems: 'center'
  },
  userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 5,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  userImg: {
    width: '100%',
    height: '100%',
  },
	userCon:{
    marginLeft: 10,
    width: (width - 110),
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  iconCon: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 30,
    height: 30,
    borderRadius: 15,
    overflow: 'hidden',
  },
  btnIcon: {
  	fontSize: 20,
  	color: 'grey',
  },
  textBox: {
  	backgroundColor: '#f5f5f5',
  	paddingVertical: 10,
  	borderRadius: 20,
  	marginTop: 15,
    paddingLeft: 40,
    color: '#000'
  },
  searchIcon: {
  	color: 'grey',
  	fontSize: 16,
  	position: 'absolute',
  	top: 25,
  	left: 15,
  },
  friendslistCon: {
  	marginVertical: 20,
  },
  totalNo: {
  	fontSize: 16,
  	fontWeight: '800',
  },
  text: {
    color: 'grey'
  },
  actionBtn: {
    borderColor: "#E5E5E6",
    borderWidth: 1,
    backgroundColor: "#fff",
    width: 35,
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    marginLeft:-7
  },
  mapIcon: {
    color: "#000000",
    fontSize: 14,
  },
  placeholder: {
    marginTop: 40
  }
})
const mapStateToProps = (state) => ({
  //auth:  state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);  
