import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, TextInput, ScrollView, Animated, Switch, Alert } from 'react-native';
import { Icon, Button, Container, Content, Picker } from 'native-base'
import Ripple from 'react-native-material-ripple';
import ContentLoader from './ContentLoader'
import { renderImage } from '../../redux/Utility'
import NoData from './NoData'
import {primaryColor, dummyImage} from '../../redux/Constant'
import OwnButton from './OwnButton'
import {connect} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {sendSuggestion} from '../../redux/api/map'
import FormatText from './FormatText'

const { width, height } = Dimensions.get('screen');

const SuggestSpot = (props) => {

  //const stepTransitionout = useRef(new Animated.Value(1)).current
  const [searchText, setSearchText] = useState('')
  const [selectedSpot, setSelectedSpot] = useState([])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const onSearch = (text, key) => {
    if(key === 'message'){
      setMessage(text)
    } else {
      setSearchText(text)
    }
  }

  const selectSpot = (item) => {
    let list = [...selectedSpot];
    let index = selectedSpot.findIndex(spot => spot.refbase === item.refbase)
    if(index === -1){
      list.push(item)
    } else {
      list.splice(index, 1)
    }
    setSelectedSpot(list)
  }

  const submit = () => {
    props.closeModal.current.close()
    props.dispatch(sendSuggestion(message, selectedSpot[0].id, 'Spot', props.mapperId, 'Mapper', selectedSpot))
    setSelectedSpot([])
    setMessage('')
  }

  const renderSelectedSpot = () => {
    if(selectedSpot.length !== 0){
      return <View>
                <Text style={styles.selectedSpot}><FormatText variable='common.selected_spot' /></Text>
                <View style={styles.spotCon}>
                  {selectedSpot.map((item, index) => {
                    return <View style={styles.spotNameCon}>
                              <Text numberOfLines={1} style={styles.spotName}>{item.name_local}</Text>
                          </View> 
                  })}
                </View>
                <View>
                  <TextInput style={styles.messageText}
                    multiline={true}
                    numberOfLines={3}
                    placeholder="Type your Message"
                    placeholderTextColor= 'grey'
                    onChangeText={text => onSearch(text, 'message')}
                    editable={true}
                    value={message}
                  />
                </View>
                <TouchableOpacity onPress={() => submit()}>
                  <Text style={styles.submitBtn}><FormatText variable='signup.submit' /></Text>
                </TouchableOpacity>
              </View>
    }    
  }

  const renderSpotList = () => {
    if (props.fetchingNearestSpot){
      return <ContentLoader />
    } else if (props.googleSpotList && props.googleSpotList.length) {
      let filteredList = props.googleSpotList.filter(item => item.name_local.indexOf(searchText) != -1)      
      return  <View style={[styles.friendslistCon/*, {opacity: stepTransitionout}*/]}>
                <Text style={styles.totalNo}><FormatText variable='common.suggest_spot' /></Text>
                {renderSelectedSpot()}
                <View style={styles.searchWrapper}>
                  <View style={styles.searchBar}>
                    <TextInput
                      style={styles.textBox}
                      placeholder="Search Spot"
                      onChangeText={(text) => onSearch(text, 'spotSearch')}
                      value={searchText}
                    />
                    <Icon type="FontAwesome5" name={'search'} style={styles.searchIcon} />
                  </View>
                </View>
                <Animated.ScrollView>
                {filteredList.map((item, index) => {
                  let spotindex = props.spot_details.findIndex(curItem => curItem.refbase === item.refbase)
                  return  <Ripple 
                            style={[styles.userDetail, spotindex > -1 && {backgroundColor: '#f5f5f5'}]}
                            rippleColor="#ccc"
                            rippleOpacity={0.2}
                            rippleDuration={700}
                            onPress={() => selectSpot(item)}
                            key={index}
                            disabled={spotindex > -1 && true}
                          >
                            <View style={styles.userImgCon}>
                              <Image style={styles.userImg} source = {renderImage(item.image)}/>
                            </View>
                            <View style={styles.userCon}>
                              <Text numberOfLines={1} style={[styles.name]}>{item.name_local}</Text>
                              <Text numberOfLines={1} style={styles.text}>{item.address}</Text>
                            </View>
                          </Ripple>
                })}
                </Animated.ScrollView>
              </View>
    } else  {
      return <NoData title="No Spot Found" />
    }
  }

  return(
    <View style={styles.mainCon}>
       {renderSpotList()}
    </View>
  )
}


const styles = StyleSheet.create({
  mainCon: {
    paddingHorizontal: 15,
    flex: 1,
  },
  userDetail: {
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    marginHorizontal: -15,
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
  userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 5,
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
    fontWeight: '500'
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
  totalNo: {
    fontSize: 20,
    fontWeight: '500',
    alignSelf: 'center',
    marginBottom: 10
  },
  text: {
    color: 'grey'
  },
  radioBtn: {
    width: 16,
    height: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: primaryColor,
    marginRight: 5
  },
  
  userDetailSelected: {
    marginBottom: 10
  },
  textBox: {
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 0,
    paddingLeft: 40,
  },
  searchIcon: {
    color: 'grey',
    fontSize: 16,
    position: 'absolute',
    top: 12,
    left: 15,
  },
  searchWrapper: {
    flexDirection: 'row',
    marginTop: 15
  },
  searchBar: {
    width: '100%'
  },
  buttonCon: {
    width: '100%',
    paddingLeft: 10,
    marginTop:10,
    height:50
  },
  selectedSpot: {
    fontSize: 16,
    marginBottom: 10
  },
  spotNameCon: {
    width: 80,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 5,
    marginBottom: 5
  },
  spotName: {
    paddingVertical: 5,
    paddingHorizontal: 8,
    backgroundColor: primaryColor,
    color: '#fff',
    fontSize: 13
  },
  spotCon: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  submitBtn: {
    color: primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: primaryColor,
    textAlign: 'center',
    borderRadius: 20,
    width: 150,
    alignSelf: 'center',
    marginTop: 10
  },
  messageText: {
    borderWidth: 1,
    borderColor: 'grey',
    height: 70,
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    color: '#000'
  }
})
const mapStateToProps = (state) => ({
  //map: state.map,
  //planner: state.planner
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SuggestSpot); 
