import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Platform,
  RefreshControl,
  PermissionsAndroid
} from 'react-native';
import {connect} from 'react-redux';
import { Container, Content, Picker, Icon, Button } from "native-base";
import { purpose, prefecture, cities, primaryColor } from '../../redux/Constant'
import GridCard from '../../components/common/GridCard'
import { changeSearchOption } from '../../redux/actions/map'
import Ripple from 'react-native-material-ripple';
import FormatText from '../../components/common/FormatText'
import ContentLoader from "../../components/common/ContentLoader"
import{ convertText } from '../../redux/Utility'
import Header from '../../components/common/Header';
//import Footer from '../../components/common/Footer';
import NoData from '../../components/common/NoData';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { getMaps, getSpecificMapDetail, mapListing, getAllMaps, addSpotToFav, removeToFav } from '../../redux/api/map'
import { getMapFeed } from '../../redux/api/feed'
import moment from 'moment'
import Geolocation from 'react-native-geolocation-service';
import { setActiveTabIndex } from '../../redux/actions/uiControls';
import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('screen');

const MapSearch = (props)  => {

  //console.log(props.map.listedMaps, "listed maps")

  const Tab = createMaterialTopTabNavigator();
  const [cords, setCords] = useState({lat: null, long: null})
  const [isloading, setIsloading] = useState(true)
  const [searchValue, setSearchValue] = useState('')
  const [filters, setFilters] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [favourite, setFavourite] = useState(false)

  let lang = props.uiControls.lang

  useEffect(() => {
    /*props.dispatch(getMaps('')).then(res => {
      setIsloading(false)
    })*/
    Geolocation.getCurrentPosition((info) =>{
      props.dispatch(mapListing(info.coords.latitude, info.coords.longitude)).then(res => {
        setIsloading(false)
      })
    },
    (error) => {
      alert(convertText('map.please_turn_on_your_location', lang))
    },
    {
      // enableHighAccuracy: true,
      // timeout: 2000,
      // maximumAge: 120000,
      showLocationDialog: true,
      // forceRequestLocation: true
    }
    )
  }, [])

  useEffect(() => {
    const listener = props.navigation.addListener('focus', () => {
       props.dispatch(setActiveTabIndex(2))
     });
     return () => {listener}
   }, [props.navigation]);

  const onChange = (val, key) => {
    props.dispatch(changeSearchOption(val, key))
  }

  const onRefresh = () => {
    setRefreshing(true);
    //setIsloading(true)
    Geolocation.getCurrentPosition((info) =>{
      props.dispatch(mapListing(info.coords.latitude, info.coords.longitude)).then(res => {
        setRefreshing(false);
        //setIsloading(false)
      })
      },
      err => {
        alert("please turn on your location first")
      },
      {
        enableHighAccuracy: true,
        timeout: 2000,
        maximumAge: 120000,
        showLocationDialog: true,
        //forceRequestLocation: true
      }
    )
  }
    
  const onSearch = (val) => {
    /*let neighborhoodsId = props.map.selected_neighborhood
    let purpose = props.map.selected_purpose
    props.dispatch(getMaps(val, cords, neighborhoodsId, purpose)).then(res => {
      setIsloading(false)
    })*/
    setSearchValue(val)
  }

  const selectMap = (id) => {
    props.dispatch(getSpecificMapDetail(id))
    props.dispatch(getMapFeed(id))
    // props.navigation.navigate('Home')
    props.navigation.navigate('Footer', {
      routeId : 0
    })    
  } 

  const addToFav = (data, key) => {
    if(data.isFav){
      props.dispatch(removeToFav({id: data.id, type: 'Mapper', location: 'mapListing', category: key}))      
    } else {
      props.dispatch(addSpotToFav({id: data.id, type: 'Mapper', location: 'mapListing', category: key}))
    }    
    //setFavourite(!favourite)
  }

  const picker = () => {
    if(filters){
      return <View style={styles.picker}>
              <View style={{width: '57%', marginRight: '3%'}}>
                <Picker
                  mode="dropdown"
                  //iosHeader={convertText("mapSearch.neighborhoods",lang)}
                  iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
                  style={styles.pickerElement}
                  selectedValue={props.map.selected_neighborhood}
                  onValueChange={(val) => onChange(val, 'neighborhood')}
                  itemTextStyle={styles.itemTextStyle}
                  placeholder={convertText("mapSearch.neighborhoods",lang)}
                >
                  {prefecture.map((item, index) => {
                    return <Picker.Item key={index} label={item.prefecture_en} value={item.id} />
                  })}
                </Picker>
              </View>
              <View style={{width: '40%'}}>
                <Picker
                  mode="dropdown"
                  //iosHeader={convertText("mapSearch.purpose",lang)}
                  iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
                  style={styles.pickerElement}
                  selectedValue={props.map.selected_purpose}
                  onValueChange={(val) => onChange(val, 'purpose')}
                  itemTextStyle={styles.itemTextStyle}
                  placeholder={convertText("mapSearch.purpose",lang)}
                >
                  {purpose.map((item, index) => {
                    return <Picker.Item key={index} label={item.purpose_en} value={item.value} />
                  })}
                </Picker>
              </View>
            </View>
    }
  }

  const searchBar = () => {
    return <View style={styles.pickerCon}>
            <View style={styles.textBox}>
              <TextInput style={styles.searchBar}
                placeholder={convertText("message.search", lang)}
                placeholderTextColor="grey"
                onChangeText={text => onSearch(text)}
                onFocus={event => setFilters(true)}
                onBlur={event => setFilters(false)}
                value={searchValue}
              />
            </View>
            {picker()}           
          </View>
  }

  const renderList = () => {
    let filteredList = props.map.listedMaps.area_maps.filter(item => item.map_name_local.indexOf(searchValue) !== -1)
    return filteredList.map((item, index) => {
      return <View key={index} style={styles.itemCon}>
              <Text style={styles.topRight}>{item.neighborhood_name}</Text>
              <TouchableOpacity style={styles.favIconCon} onPress={() => addToFav(item, 'areaMaps')}>
                <Icon type="FontAwesome5" name={'heart'} style={[styles.favIcon]} />
              </TouchableOpacity>
              <GridCard 
                //isActive={isSelected(item.id)} 
                caption={item.map_name_local} 
                image={item.image_url} 
                onPress={() => selectMap(item.id)}
              />
              {/*<Text style={styles.spotName}>{item.map_name_local}</Text>*/}
              <View style={styles.itemDetailCon}>
                <View style={styles.itemDetail}> 
                  <Icon type="FontAwesome5" name={'eye'} style={styles.icon} />
                  <Text style={styles.iconText}>{item.view_count}</Text>
                </View>
                <View style={styles.itemDetail}>
                  <Icon type="FontAwesome5" name={'clock'} style={styles.icon} />
                  <Text style={styles.iconText}>{moment(item.created_at).format('l')}</Text>
                </View>
              </View>
            </View>
    })
  }

  const areaMaps = () => {
    if(isloading){
      return <ContentLoader />
    } else if(props.map.listedMaps.area_maps && props.map.listedMaps.area_maps.length !== 0){
      return <View style={styles.mainCon}>
              <ScrollView style={styles.bottomCon} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.spots}>
                  {renderList()}
                </View>
              </ScrollView>
            </View>
    } else {
      return <View style={styles.placeholderCon}> 
              <NoData /> 
            </View>
    }    
  }

  const likedMapsList = () => {
    let filteredList = props.map.listedMaps.ranked_maps && props.map.listedMaps.ranked_maps.liked_maps.filter(item => item.map_name_local.indexOf(searchValue) !== -1)
    return filteredList.map((item, index) => {
      return <View key={index} style={styles.itemCon, styles.vertical}>
              <View style={{width: '50%'}}>
                <Text style={styles.topRight}>{item.neighborhood_name}</Text>
                <GridCard 
                  //isActive={isSelected(item.id)} 
                  //caption={item.map_name_local} 
                  decreaseHeight
                  image={item.image_url} 
                  onPress={() => selectMap(item.id)}
                />
              </View>              
              {/*<Text style={styles.spotName}>{item.map_name_local}</Text>*/}
              <View style={[styles.itemDetailCon, styles.detailCon]}>
                <TouchableOpacity style={[styles.favIconCon, styles.rightIcon]} onPress={() => addToFav(item, 'liked')}>
                  <Icon type={item.isFav ? "FontAwesome" : "FontAwesome5"} name={'heart'} style={[styles.favIcon, styles.darkHeart, item.isFav && {color: primaryColor} ]} />
                </TouchableOpacity>
                <Text numberOfLines={1} style={styles.spotName}>{item.map_name_local}</Text>
                <View>
                  <View style={styles.itemDetail}> 
                    <Icon type="FontAwesome5" name={'thumbs-up'} style={styles.icon} />
                    <Text style={styles.iconText}>{item.likes_count}</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Icon type="FontAwesome5" name={'comments'} style={styles.icon} />
                    <Text style={styles.iconText}>{item.comments_count}</Text>
                  </View>
                  <View style={styles.itemDetail}> 
                    <Icon type="FontAwesome5" name={'eye'} style={styles.icon} />
                    <Text style={styles.iconText}>{item.view_count}</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Icon type="FontAwesome5" name={'clock'} style={styles.icon} />
                    <Text style={styles.iconText}>{moment(item.created_at).format('l')}</Text>
                  </View> 
                </View>                                                            
              </View>
            </View>
    })
  }

  const likedMaps = () => {
    if(isloading){
      return <ContentLoader />
    } else if(props.map.listedMaps.ranked_maps && props.map.listedMaps.ranked_maps.liked_maps !== 0){
      return <View style={styles.mainCon}>
              <ScrollView style={styles.bottomCon} 
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.spots}>
                  {likedMapsList()}
                </View>
              </ScrollView>
            </View>
    } else {
      return <View style={styles.placeholderCon}> 
              <NoData /> 
            </View>
    } 
  }

  //console.log(props.map.listedMaps, "props.map.listedMaps")

  const rankedMaps = () => {
    return <View style={{flex: 1}}>
              <Tab.Navigator
                tabBarOptions={{
                  labelStyle: { fontSize: 11, height: 25 },
                }}
              >
                <Tab.Screen name={convertText("mapSearch.liked", lang)} children={likedMaps}  />
                <Tab.Screen name={convertText("mapSearch.viewed", lang)} children={viewedMaps}  />
              </Tab.Navigator>
            </View>
  }

  const closebyList = () => {
    let filteredList = props.map.listedMaps.close_by_maps.filter(item => item.map_name_local.indexOf(searchValue) !== -1)
    return filteredList.map((item, index) => {
      return <View key={index} style={styles.itemCon}>
              <Text style={styles.topRight}>{item.neighborhood_name}</Text>
              <TouchableOpacity style={styles.favIconCon} onPress={() => addToFav(item, 'closeby')}>
                <Icon type={item.isFav ? "FontAwesome" : "FontAwesome5"} name={'heart'} style={[styles.favIcon, item.isFav && {color: primaryColor} ]} />
              </TouchableOpacity>
              <GridCard 
                //isActive={isSelected(item.id)} 
                caption={item.map_name_local} 
                image={item.image_url} 
                onPress={() => selectMap(item.id)}
              />
              {/*<Text style={styles.spotName}>{item.map_name_local}</Text>*/}
              <View style={styles.itemDetailCon}>
                <View style={styles.itemDetail}> 
                  <Icon type="FontAwesome5" name={'eye'} style={styles.icon} />
                  <Text style={styles.iconText}>{item.view_count}</Text>
                </View>
                <View style={styles.itemDetail}>
                  <Icon type="FontAwesome5" name={'clock'} style={styles.icon} />
                  <Text style={styles.iconText}>{moment(item.created_at).format('l')}</Text>
                </View>
              </View>
            </View>
    })
  }

  const closeby = () => {
    if(isloading){
      return <ContentLoader />
    } else if(props.map.listedMaps.close_by_maps && props.map.listedMaps.close_by_maps.length !== 0){
        return <View style={styles.mainCon}>
                <ScrollView style={styles.bottomCon} 
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }>
                  <View style={styles.spots}>
                    {closebyList()}
                  </View>
                </ScrollView>
              </View>
    } else {
      return <View style={styles.placeholderCon}> 
              <NoData /> 
            </View>
    }         
  }

  const ranked = () => {
    if(isloading){
      return <ContentLoader />
    } else if(props.map.listedMaps.ranked_maps && (props.map.listedMaps.ranked_maps.liked_maps.length !== 0 || props.map.listedMaps.ranked_maps.viewed_maps.length !== 0)){
        return <View style={styles.mainCon}>
                <ScrollView style={styles.bottomCon} 
                  showsVerticalScrollIndicator={false}
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }>
                  <View style={styles.spots}>
                    <Text style={{marginVertical: 10, width: '100%'}}>Most Liked maps</Text>
                    {likedMapsList()}
                    <Text style={{marginVertical: 10, width: '100%'}}>Most Viewed Maps</Text>
                    {viewedMapList()}
                  </View>
                </ScrollView>
              </View>
    } else {
      return <View style={styles.placeholderCon}> 
              <NoData /> 
            </View>
    } 
  }

  const viewedMapList = () => {
    let filteredList = props.map.listedMaps.ranked_maps && props.map.listedMaps.ranked_maps.viewed_maps.filter(item => item.map_name_local.indexOf(searchValue) !== -1)
    return filteredList.map((item, index) => {
      return <View key={index} style={styles.itemCon, styles.vertical}>
              <View style={{width: '50%'}}>
                <Text style={styles.topRight}>{item.neighborhood_name}</Text>
                <GridCard 
                  //isActive={isSelected(item.id)} 
                  //caption={item.map_name_local} 
                  decreaseHeight
                  image={item.image_url} 
                  onPress={() => selectMap(item.id)}
                />
              </View>              
              {/*<Text style={styles.spotName}>{item.map_name_local}</Text>*/}
              <View style={[styles.itemDetailCon, styles.detailCon]}>
                <TouchableOpacity style={[styles.favIconCon, styles.rightIcon]} onPress={() => addToFav(item, 'viewed')}>
                  <Icon type={item.isFav ? "FontAwesome" : "FontAwesome5"} name={'heart'} style={[styles.favIcon, styles.darkHeart, item.isFav && {color: primaryColor} ]} />
                </TouchableOpacity>
                <Text style={styles.spotName}>{item.map_name_local}</Text>
                <View>
                  <View style={styles.itemDetail}> 
                    <Icon type="FontAwesome5" name={'thumbs-up'} style={styles.icon} />
                    <Text style={styles.iconText}>{item.likes_count}</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Icon type="FontAwesome5" name={'comments'} style={styles.icon} />
                    <Text style={styles.iconText}>{item.comments_count}</Text>
                  </View>
                  <View style={styles.itemDetail}> 
                    <Icon type="FontAwesome5" name={'eye'} style={styles.icon} />
                    <Text style={styles.iconText}>{item.view_count}</Text>
                  </View>
                  <View style={styles.itemDetail}>
                    <Icon type="FontAwesome5" name={'clock'} style={styles.icon} />
                    <Text style={styles.iconText}>{moment(item.created_at).format('l')}</Text>
                  </View> 
                </View>                                                            
              </View>
            </View>
    })
  }

  const viewedMaps = () => {
    if(isloading){
      return <ContentLoader />
    }else if(props.map.listedMaps.ranked_maps && props.map.listedMaps.ranked_maps.viewed_maps !== 0){
      return <View style={styles.mainCon}>
              <ScrollView style={styles.bottomCon} 
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>
                <View style={styles.spots}>
                  {viewedMapList()}
                </View>
              </ScrollView>
            </View>
    } else {
      return <View style={styles.placeholderCon}> 
              <NoData /> 
            </View>
    }
  }

  return (
    <Container style={styles.mainCon}>
      <Header />
      {searchBar()}
      <View style={{flex: 1}}>
        <Tab.Navigator
          tabBarLabel={{
            labelStyle: { fontSize: 12, height: 25 },
          }}
          initialRouteName={convertText("mapSearch.closeby", lang)}
        >
          <Tab.Screen name={convertText("mapSearch.area_maps", lang)} children={areaMaps}  />
          <Tab.Screen name={convertText("mapSearch.closeby", lang)} children={closeby}  />
          <Tab.Screen name={convertText("mapSearch.ranked", lang)} children={ranked}  />
        </Tab.Navigator>
      </View>
      {/*<Footer navigation={props.navigation} />*/} 
    </Container>
  );
  

};

const styles = StyleSheet.create({
  mainCon: {
    flex: 1,
    backgroundColor: '#fff',
  },
  placeholderCon:{
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 30
  },
  pickerCon: {
    backgroundColor: '#f5f5f5',
    margin: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
  },
  pickerElement: {
    backgroundColor: '#fff',
    marginVertical: 5,
    height: 35,
    width: '100%'
  },
  bottomCon: {
    marginHorizontal: 20,
  },
  date: {
    fontSize: 16,
    fontWeight: '600'
  },
  subText: {
    color: 'grey'
  },
  spots: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginBottom: 100
  },
  itemCon: {
    width: '50%',
    padding: 4,
  },
  itemDetailCon: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 4,
  },
  itemDetail: {
    flexDirection: 'row',
    marginVertical: 5
  },
  icon: {
    fontSize: 14,
    color: 'grey',
    marginRight: 5,
  },
  iconText: {
    color: 'grey',
    fontSize: 12
  },
  spotName: {
    fontSize: 17,
  },
  textBox: {
    marginVertical: 5
  },
  searchBar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000'
  },
  picker: {
    flexDirection: 'row'
  },
  arrowIcon: {
    right: 20
  },
  topRight: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: '#fff',
    zIndex: 99
    //textAlign: 'right'
  },
  favIconCon: {
    position: 'absolute',
    left: 12,
    top: 12,
    zIndex: 99,
  },
  favIcon: {    
    color: '#fff',    
    fontSize: 16,
  },
  vertical: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 10,
  },
  detailCon: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 10,
    paddingRight: 20,
    width: '50%',
  },
  rightIcon: {
    right: 10,
    left: 'auto',
    top: 3
  },
  darkHeart: {
    color: 'grey'
  }
  
});

const mapStateToProps = (state) => ({
  planner: state.planner,
  auth: state.auth,
  map: state.map,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(MapSearch);  

    

