import React, { Component, memo } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  Modal,
  PermissionsAndroid,
  TouchableOpacity,
  Animated
} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { primaryColor, secondColor } from "../../redux/Constant";
import FriendsBtn from "../common/FriendsBtn";
import CenterBtn from "../common/CenterBtn";
import SlideScreenIcon from "../common/SlideScreenIcon";
import PulseCircleLayer from "./PulseCircle";
import MapMarker from "./MapMarker";
import Geolocation from 'react-native-geolocation-service';
import UserMarker from "./UserMarker";
import PopupMessage from "./PopupMessage";
import MarkerDescription from "./MarkerDescription";
import RBSheet from "react-native-raw-bottom-sheet";
import SyncStorage from "sync-storage";
import Header from '../../components/common/Header';
import { Alert } from "react-native";
import BaseMarker from './BaseMarker';
import { convertText } from '../../redux/Utility'
import LottieView from 'lottie-react-native';
import TopSlideBar from '../SlideBars/TopSlideBar'
import moment from 'moment'
import GPSState from 'react-native-gps-state'

// import { TouchableOpacity } from "react-native-gesture-handler";
const { width, height } = Dimensions.get("screen");
const IS_ANDROID = Platform.OS === 'android';

var location = {};
let startTimeU;
let durationU;
let featuresObjects = []

MapboxGL.setAccessToken(
  "pk.eyJ1IjoicnVwaW5kZXIiLCJhIjoiY2s5MWM1eXYyMDloMjNnbzk1OXpxcjkxMyJ9.4aU23jLL3m6tTz_Sp8lajA"
);

const HackMarker = ({ children }) =>
  Platform.select({
    ios: children,
    android: (
      <View style={{width:35, height: 60}}>
        <Text
          style={{
            lineHeight: 78,
            backgroundColor: 'transparent',
            // there is some weird gap, add 40+ pixels
          }}
        >
          {children}
        </Text>
      </View>
    ),
  });

class Maps extends Component {
  constructor(props){
    super(props);
    this.state = {
      isUserCenterLocatied: true,
      color: "red",
      centerCoordinate: [],
      mapLoaded: false,
      isBigMarkers: false,
      region: null,
      name: `mapperz-${Date.now()}`,
      offlineRegion: null,
      offlineRegionStatus: null,
      isMoving: false,
      isNew: true,
      isMapFullyRendered: false,
      featuresObject: []
    };
    this._loopAnim = null;
  }

  setModalVisible = (visible) => {
    this.props.fncModalVisible(visible)
  }

  onDownloadProgress = (offlineRegion, offlineRegionStatus) => {
    this.setState({
      name: offlineRegion.name,
      offlineRegion: offlineRegion,
      offlineRegionStatus: offlineRegionStatus,
    });
  };
  
  componentDidMount() {
    MapboxGL.setTelemetryEnabled(false);
    // const withinMap = bounds.contains([35.7017699, 139.7691895])
    // console.log(withinMap, "pointInView")
    //MapboxGL.locationManager.start();
    if (this.props.mapDetail && this.props.centerCords.length === 0 /*&& !this.props.centerCords.centerCords.length*/) {
      this.props.setCenterCord({
        centerCords: [
          this.props.mapDetail.longitude,
          this.props.mapDetail.latitude,
        ],
        id: "base_mark",
      });
    }
    if(this.props.route?.params?.user === 'new' && this.props.modalVisible === '' ){
      this.setModalVisible(true);
    }    
    setTimeout(() => {
      this.setModalVisible(false)
      PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
        ],
        {
          title: "Give Location Permission",
          message: "App needs location permission to find your position.",
        }
      )
      .then((granted) => {
        //resolve();
      })
      .catch((err) => {
        //console.warn(err);
          //reject(err);
      });
    }, 5000)
  }

  componentDidUpdate(prevProps) {
    //  console.log(this.state.coordinates[0], "lng test")
    if (prevProps.mapDetail !== this.props.mapDetail) {
      this.props.setCenterCord({
        centerCords: [
          this.props.mapDetail.longitude,
          this.props.mapDetail.latitude,
        ],
        id: "base_mark",
      });
      //this.props.setCenterCord({centerCords : [76.6948675, 30.7083438], id: 'base_mark'})
      //this.camera.setCamera({centerCoordinate: [this.props.map.mapDetail.longitude, this.props.map.mapDetail.latitude]})
      //this.setState({centerCoordinate: [this.props.map.mapDetail.longitude, this.props.map.mapDetail.latitude]})
    }
  }
  

  async componentWillMount() {
    startTimeU = new Date().getTime()
    const errorListener = (offlinePack, err) => console.warn(offlinePack, err);
    const offlinePacks = await MapboxGL.offlineManager.getPacks();
    const packs = offlinePacks.map((pack) => pack._metadata.name);
    // console.log('packs====', packs)
    for (let packName of packs) {
      MapboxGL.offlineManager.subscribe(
        packName, 
        this.onDownloadProgress,
        errorListener
      );
    }
    let mapData = SyncStorage.get("mapData");
    let isConnected = SyncStorage.get("isConnected");
    if (!isConnected && mapData) {
      this.props.setMapDetail(mapData);
    }
  }

  async componentWillUnmount() {
    MapboxGL.locationManager.stop();
    MapboxGL.offlineManager.unsubscribe(`mapperz-${Date.now()}`);
    await MapboxGL.offlineManager.deletePack(`mapperz-${Date.now()}`);
    this._loopAnim.stop();
  }

  onUpdate = () => {
    //this.setState({isUserCenterLocatied: false})
  };

  inBounds = (point, bounds, key) => {
    if(this.state.mapLoaded && this.state.isMapFullyRendered){
      if(bounds.nelon !== null && bounds.swlat !== null && (key && (point.coordinates[0] !== 0 && point.coordinates[1] !== 0)) ){
        let lngPoint = key ? point.coordinates[0] : point.coords.longitude 
        let latPoint = key ? point.coordinates[1] : point.coords.latitude 
        var lng = (lngPoint- bounds.nelon) * (lngPoint - bounds.swlon) < 0;
        var lat = (latPoint - bounds.nelat) * (latPoint - bounds.swlat) < 0;
        return lng && lat;
      }
    }       
  }

  centerOnUserLocation() {
    this.setState({isUserInteraction: true})
    let lang = this.props.lang
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){
      Geolocation.getCurrentPosition((info) =>{
        let withinBounds = this.inBounds(info, this.props.mapDetail)
        if(this.props.centerCords?.id !== "user_center"){
          if(withinBounds){
            this.props.setCenterCord({                          
              centerCords: [info.coords.longitude, info.coords.latitude],
              id: "user_center",  
            })
          } else {
            Alert.alert(
              convertText("maps.user_is_out", lang),
              convertText("maps.do_you_want_to_open", lang),
              [            
                {
                  text: convertText("message.cancel", lang),
                  //onPress: () => console.log("Cancel Pressed"),
                  style: "cancel"
                },
                { 
                  text: convertText("map.ok", lang), 
                  onPress: () => { 
                    this.props.setCenterCord({                          
                                    centerCords: [info.coords.longitude, info.coords.latitude],
                                    id: "user_center",
                                  })
                                }
                }
              ],
              { cancelable: false }
            );
          }  
        } else{
          this.props.setCenterCord({
            centerCords: [
              this.props.mapDetail.longitude,
              this.props.mapDetail.latitude,
            ],
            id: "base_mark",
          });
        }
      }) 
    } 
    // Geolocation.getCurrentPosition((info) =>{
    //   let withinBounds = this.inBounds(info, this.props.map.mapDetail)
    //   if(this.props.centerCords?.id !== "user_center"){
    //     if(withinBounds){
    //       this.props.setCenterCord({                          
    //         centerCords: [info.coords.longitude, info.coords.latitude],
    //         id: "user_center",  
    //       })
    //     } else {
    //       Alert.alert(
    //         convertText("maps.user_is_out", lang),
    //         convertText("maps.do_you_want_to_open", lang),
    //         [            
    //           {
    //             text: convertText("message.cancel", lang),
    //             onPress: () => console.log("Cancel Pressed"),
    //             style: "cancel"
    //           },
    //           { 
    //             text: convertText("map.ok", lang), 
    //             onPress: () => { this.props.setCenterCord({                          
    //                               centerCords: [info.coords.longitude, info.coords.latitude],
    //                               id: "user_center",
    //                             })
    //                           }
    //           }
    //         ],
    //         { cancelable: false }
    //       );
    //     }        
    //   } else{
    //     console.log('else')
    //     this.props.setCenterCord({
    //       centerCords: [
    //         this.props.map.mapDetail.longitude,
    //         this.props.map.mapDetail.latitude,
    //       ],
    //       id: "base_mark",
    //     });
    //   }
    // },
    // (error) => {
    //   alert(convertText('map.please_turn_on_your_location', lang))
    // },
    // {
    //   // enableHighAccuracy: true,
    //   // timeout: 2000,
    //   // maximumAge: 120000,
    //   showLocationDialog: true,
    //   // forceRequestLocation: true
    // }
    // );
  }
  onUserLocationUpdate(data) {
    this.camera.moveTo([90, 45])
    geolocation.getCurrentPosition(
      (cord) => {
      },
      [geo_error],
      [geo_options]
    );
  }

  onWillStartLoadingMap = () => {
    this.setState({ mapLoaded: false });
  }

  onDidFinishLoadingMap = () => {
    const options = {
      name: this.state.name,
      styleURL: MapboxGL.StyleURL.Street,
      bounds: [
        [this.props.mapDetail.nelon,
          this.props.mapDetail.nelat],
        [this.props.mapDetail.swlon,  
          this.props.mapDetail.swlat],
      ],
      minZoom: 1,
      maxZoom: 8,
    };
    // start download
    //MapboxGL.offlineManager.createPack(options, this.onDownloadProgress);
    this.setState({ mapLoaded: true });
  };

  centerOnBaseMarker = () => {
    this.props.setCenterCord({
      centerCords: [
        this.props.mapDetail.longitude,
        this.props.mapDetail.latitude,
      ],
      id: "base_mark",
    });
  };

  togglePopover = (id) => {
    this.props.saveMapMarkerId(id);
  };

  selectSpot(item) {
    this.props.setSpotDetail(item);
  }

  filteredList = () => {
    if (
      this.props.mapDetail.spot_details &&
      this.props.mapDetail.spot_details.length
    ) {
      let filteredList = this.props.mapDetail.spot_details.filter((item) => {
        if (
          item.attname_local && item.attname_local.indexOf(this.props.searchText) !== -1 &&
          (!this.props.filters.length ||
            this.props.filters.indexOf(item.category)) !== -1
        ) {
          return item;
        }
      });
      return filteredList
    }
  }

  renderClusterShapes = () => {
    if(this.state.region?.properties?.zoomLevel <= 15) {
      return this.filteredList()?.map((item, index) => {
        return {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [item.longitude, item.latitude]
          },
          properties: {
            //icon: 'get', 
            place_id: item.id, 
          }
        }
      })
    } else {
      return []
    }
  }

  renderMarkers = (list) => { 
    return this.filteredList()?.map((item, index) => {
      let isActive = item.id === this.props.centerCords.id;
      if(this.state.mapLoaded){
        if(this.state.region?.properties?.zoomLevel > 15){
          return (
            <MapboxGL.PointAnnotation
              coordinate={[item.longitude, item.latitude]}
              key={index}
              id={`marker-${index}`}
              belowLayerID='message-marker-0'
              title=""
              minZoomLevel={10}
              onSelected={() => {
                this.props.toggleBar(0, "left");
                this.selectSpot(item);
              }}
            >
              <MapMarker
                data={item}
                active={isActive}
                togglePopover={this.togglePopover}
                location={this.state.region}
              />
            </MapboxGL.PointAnnotation>
          );
        }
      }           
    });
  };

  closePopup = (index) => {
    this.props.socket.spotMessages.splice(index, 1)
  }

  renderMarkerMessages = () => {
    if (
      this.props.mapDetail.spot_details &&
      this.props.mapDetail.spot_details.length
    ) {
      let filteredList = this.props.mapDetail.spot_details.filter((item) => {
        if (
          item.attname_local && item.attname_local.indexOf(this.props.searchText) !== -1 &&
          (!this.props.filters.length ||
            this.props.filters.indexOf(item.category)) !== -1
        ) {
          return item;
        }
      });
      if (this.props.socket.spotMessages.length && filteredList.length) {
        return this.props.socket.spotMessages.map((item, index) => {
          let isNewest = this.props.socket.spotMessages.length === (index + 1);
          let spotIndex = filteredList.findIndex(spot => spot.id === item.spot_id);
          if (spotIndex === -1) {return null}
          return (
              <MapboxGL.MarkerView 
                coordinate={[item.longitude, item.latitude]}
                id={`message-marker-${index}`}
                belowLayerID='message-marker-0'
                key={index}
              >
                <PopupMessage data={item} isNewest={isNewest} closePopup={this.closePopup.bind(this,index)} category={filteredList[spotIndex]}/>  
              </MapboxGL.MarkerView>   
            )
        })    
      }
    }
  };

  renderBaseMarker = () => {
    if (this.props.mapDetail.id) {
      return (
        <MapboxGL.PointAnnotation
          coordinate={[
            this.props.mapDetail.longitude,
            this.props.mapDetail.latitude,
          ]}
          title={""}
          id="base_marker"
          layer={4}
        >
          <BaseMarker />
          <MapboxGL.Callout>
            <View style={styles.calloutArrow} />
            <Text style={styles.baseMarker}>Center Base</Text>
          </MapboxGL.Callout>
        </MapboxGL.PointAnnotation>
      );
    }
  };

  renderUserMarker = () => {
    if (
      this.props.socket.checkin_users.checked_in &&
      this.props.socket.checkin_users.checked_in.length
    ) {
      return this.props.socket.checkin_users.checked_in.map((item, index) => {
        if (item.time_left < 0 || (item.mapper_id && item.mapper_id !== this.props.currentMap) || (!item.lat || !item.lng)) {return false}
          return (
            <MapboxGL.MarkerView 
              coordinate={[item.lng, item.lat]}
              id={`a-user-marker-${index}`}
              key={index}
              layer={999}
            >
              <UserMarker data={item} />
            </MapboxGL.MarkerView>   
          ) 
        })
    }
  };

  renderUserPopupMessages = () => {
    if (
      this.props.socket.checkin_users &&
      this.props.socket.checkin_users.checked_in &&
      this.props.socket.checkin_users.checked_in.length
    ) {
      return this.props.socket.checkin_users.checked_in.map((item, index) => {
        let isNewest = this.props.socket.checkin_users.checked_in.length === index + 1;
        if(item.time_left < 0 || (item.mapper_id && item.mapper_id !== this.props.currentMap) || !item.message) {return false}
          return (
            <MapboxGL.MarkerView 
              coordinate={[item.lng, item.lat]}
              id={`a-user-popup-${index}`}
              belowLayerID='a-user-popup-0'
              key={index}
            >
              <PopupMessage data={item} isNewest={isNewest}/>
            </MapboxGL.MarkerView>   
          ) 
        })
    }
  };

  loadingMap(e) {
    //console.log(this.mapRef, 'test')
  }

  showSlideScreenIcon = () => {
    if (this.props.toggleBar) {
      return <SlideScreenIcon toggleBar={this.props.toggleBar} />;
    }
  };

  onRegionDidChange = (region) => {
    let userData = SyncStorage.get('userData');
    let lang = this.props.lang
    this.setState({
      region,
    });
    this.setState({isMoving: false})
    let withinBounds = this.inBounds(region.geometry, this.props.mapDetail, 'baseMap')    
    if(userData.base_mapper_id !== this.props.mapDetail.id && withinBounds === false && this.state.mapLoaded && this.state.isNew && this.props.mapDetail.nelat !== null){
      Alert.alert(
        convertText("map.you_are_out", lang),
        convertText("map.do_you_want_to_change_map", lang),
        [            
          {
            text: convertText("message.cancel", lang),
            onPress: () => this.setState({isNew: false}),
            style: "cancel"
          },
          { 
            text: convertText("map.ok", lang), 
            onPress: () => {this.props.getSpecificMapDetail(userData.base_mapper_id)}
          }
        ]
      )
    } 
  };

  /*shape = featureCollection([
    point([146.092859151588556, -38.026307135266585], {}),
    point([146.092859151588556 + 0.01, -38.026307135266585], {}),
    point([146.092859151588556, -38.026307135266585 + 0.01], {}),
    point([146.092859151588556, -38.026307135266585 + 2 * 0.01], {}),
    point([146.092859151588556, -38.026307135266585 + 3 * 0.01], {}),
  ]);*/

  addToFavourite = () => {   
    if(this.props.mapDetail.isFav){
      this.props.removeToFav({id: this.props.mapDetail.id, type: 'Mapper', location: 'map'})      
    } else{
      this.props.addSpotToFav({id: this.props.mapDetail.id, type: 'Mapper', location: 'map'})
    }
  }

  onChangingRegion = (event) => {
    this.setState({isMoving: true})
  } 

  onDidFinishRenderingFrameFully = () => {
    this.setState({isMapFullyRendered: true})
  }

/* stopMoving = (event) => {
    this.setState({isMoving: false})
  }
*/
  layers = () => {
    if(this.state.region?.properties?.zoomLevel <= 15){
      return  <>
              <MapboxGL.SymbolLayer
                //minZoomLevel={15}
                id="pointCount"
                style={layerStyles.clusterCount}
              />
              <MapboxGL.CircleLayer
                id="clusteredPoints"
                //minZoomLevel={15}
                belowLayerID="pointCount"
                style={layerStyles.clusteredPoints}
              />
            </>
    }
  }

  render() {
    let userData = SyncStorage.get('userData'); 
    return (
      <View style={styles.page}>
        <View style={styles.container}>          
          <Header navigation={this.props.navigation} switch toggleValue={this.props.toggleValue}/>
          <TopSlideBar 
            //{...this.props}
            clickCount={this.props.clickCount}  
            isClicked={this.props.isClicked}
            fetchingDetail={this.props.fetchingDetail}
            map_name_local={this.props.mapDetail.map_name_local}
            addSpotToFav={this.props.addSpotToFav}
            removeToFav={this.props.removeToFav}
            getNearestSpots={this.props.getNearestSpots}
            currentMap={this.props.currentMap}
            fetchingAllMaps={this.props.fetchingAllMaps}
            allMaps={this.props.allMaps}
            deleteUser={this.props.DeleteMap}
            getSuggestedSpot={this.props.getSuggestedSpot}
            updatingSuggestion={this.props.updatingSuggestion}
            suggestedSpot={this.props.suggestedSpot}
            updateHomemap={this.props.updateHomemap}
            getAllMaps={this.props.getAllMaps}
            navigation={this.props.navigation}
            lang={this.props.lang}
            fetchingNearestSpot={this.props.fetchingNearestSpot} 
            nearestSpotList={this.props.nearestSpotList} 
            setCenterCord={this.props.setCenterCord}
            googleSpotList={this.props.googleSpotList}
            mapId={this.props.mapDetail.id}
            userId={this.props.userId}
          />                   
          <CenterBtn
            centerOnUserLocation={this.centerOnUserLocation.bind(this)}
            isUserCenterLocatied={this.props.centerCords.id === "user_center"}
            centerOnBaseMarker={this.centerOnBaseMarker.bind(this)}
            addToFavourite={this.addToFavourite.bind(this)}
            toggleBar={this.props.toggleBar}
            closeSlider={this.props.closeSlider}
            userId={this.props.userId}
            navigation={this.props.navigation}
            isSliderOpen={this.props.isSliderOpen}
            mapDetail={this.props.mapDetail}
            isShoutOpen={this.props.isShoutOpen}
            users_coverage={this.props.mapDetail.users_coverage}
            navigation={this.props.navigation}
            lang={this.props.lang} 
            isMoving={this.state.isMoving}
            //{...this.props.map}
          />
          {/*this.showSlideScreenIcon()*/}
          <MapboxGL.MapView
            ref={(map) => {
              this.mapRef = map;
            }}
            style={styles.map}
            compassEnabled
            compassViewPosition={0}
            localizeLabels={true}
            onRegionWillChange={this.onChangingRegion}
            onRegionDidChange={this.onRegionDidChange}
            onDidFinishLoadingMap={this.onDidFinishLoadingMap}
            logoEnabled={false}   
            onDidFinishRenderingFrameFully={this.onDidFinishRenderingFrameFully}
          >
            <MapboxGL.Light />
            <PulseCircleLayer />
            {!this.state.isMoving && this.renderUserMarker()}
            {this.renderMarkerMessages()}
            {this.renderBaseMarker()}
            {this.renderUserPopupMessages()}
            {this.state.mapLoaded && this.renderMarkers()}
            <MapboxGL.Camera
              followUserMode="compass"
              zoomLevel={this.props.centerCords.zoomLevel || 18}
              ref={(camera) => {
                this.camera = camera;
              }}
              centerCoordinate={
                this.props.centerCords &&
                this.props.centerCords.centerCords
              }
              isUserInteraction={true}
              bounds={
                this.props.mapDetail.nelon && {
                  ne: [
                    this.props.mapDetail.nelon,
                    this.props.mapDetail.nelat,
                  ],
                  sw: [
                    this.props.mapDetail.swlon,  
                    this.props.mapDetail.swlat,
                  ],
                } 
              }              
            >
            </MapboxGL.Camera>           
            <MapboxGL.ShapeSource
              id="symbolLayerSource"
              shape={{type: "FeatureCollection", features: this.renderClusterShapes()}}
              cluster
              clusterRadius={30}>
                <MapboxGL.SymbolLayer
                  //minZoomLevel={15}
                  id="pointCount"
                  style={layerStyles.clusterCount}
                />
                <MapboxGL.CircleLayer
                  id="clusteredPoints"
                  //minZoomLevel={15}
                  belowLayerID="pointCount"
                  style={layerStyles.clusteredPoints}
                />             
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        </View>
        <Image
          source={require("../../assets/images/mapboxLogo.png")}
          style={styles.mapboxText}
        />
        <RBSheet
          ref={(ref) => (this.modalRef = ref)}
          height={380}
          openDuration={250}
          closeOnDragDown={true}
        >
          <MarkerDescription
            markerId={this.props.map_marker_id}
            item={this.props.mapDetail.spot_details}
          />
        </RBSheet>        
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.props.modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              {userData && <Text style={styles.modalText}>Welcome {userData.nick_name || userData.first_name}!</Text>}
            </View>
            <View style={styles.overlay}></View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapStyles = {
  parameterIcon: {
    iconImage: ['get', 'icon'],
    iconSize: IS_ANDROID ? 0.3 : 0.06,
    iconAllowOverlap: true,
    textOffset: [0, -0.4],
    textField: '{text}',
    textSize: 14,
    textPitchAlignment: 'map',
    backgroundColor: 'red',
  },
};
 
 const layerStyles = {
  singlePoint: {
    circleColor: 'green',
    circleOpacity: 0.84,
    circleStrokeWidth: 2,
    circleStrokeColor: 'white',
    circleRadius: 5,
    circlePitchAlignment: 'map',
  },
 
  clusteredPoints: {
    circlePitchAlignment: 'map',
 
    circleColor: [
      'step',
      ['get', 'point_count'],
      '#51bbd6',
      10,
      '#f1f075',
      20,
      '#f28cb1',
    ],
 
    circleRadius: ['step', ['get', 'point_count'], 20, 10, 30, 50, 40], 
    circleOpacity: 0.8,
    circleStrokeWidth: 3,
    circleStrokeColor: 'white',
  },
 
  clusterCount: {
    textField: '{point_count}',
    textSize: 16,
    textPitchAlignment: 'map',
    lineWidth: 2,
  },
 };

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    height: "100%",
  },
  container: {
    height: "100%",
    width: "100%",
    backgroundColor: "#fff",
  },
  map: {
    flex: 1,
    backgroundColor: "#fff",
  },
  calloutContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 180,
    zIndex: 9999999,
    backgroundColor: "#fff",
  },
  callout: {
    position: "absolute",
    maxWidth: 150,
    width: 150,
    justifyContent: "center",
    alignSelf: "flex-start",
    backgroundColor: "#fff",
    bottom: "100%",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#aaa",
    left: -4.5,
    padding: 5,
    marginBottom: 10,
  },
  calloutArrow: {
    position: "absolute",
    width: 12,
    height: 12,
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    bottom: -7,
    left: 16,
    backgroundColor: "#fff",
    borderColor: "#aaa",
    transform: [{ rotate: "-45deg" }],
  },
  infoCon: {
    width: 200,
    height: Platform.OS === "android" ? 100 : 90,
    backgroundColor: "#fff",
    flexDirection: "row",
  },
  mapboxText: {
    position: "absolute",
    bottom: 10,
    right: 40,
    height: 8,
    width: 80,
    padding: 10,
  },
  img: {
    width: 35,
    height: 45,  
  },
  markerConOutter: {
    width: 35,
    height: 45,
  },
  baseMarker: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    width: 100,
    textAlign: "center",
    paddingVertical: 10,
    borderRadius: 10,
    overflow: "hidden",
    marginBottom: Platform.OS === "android" ? 9 : 15,
    //marginBottom: 15,
    fontWeight: "600",
  },
  calloutArrow: {
    position: "absolute",
    bottom: Platform.OS === "android" ? 0 : 5,
    left: "40%",
    transform: [{ rotate: "180deg" }],
    width: 0,
    height: 0,
    //bottom: 5,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgba(255, 255, 255, 0.8)",
  },
  spotName:{
    backgroundColor: '#fff',
    fontSize: 12,
    padding:5,
    width: 80,
    textAlign: 'center',
    borderRadius: 5,
    overflow: 'hidden'
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(146, 72, 231, 0.2)',
  },
  openButton: {
    backgroundColor: "#F194FF",
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalView: {
    backgroundColor: primaryColor,
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalText: {    
    color: '#fff',
    fontWeight: 'bold'
  },
  overlay: {
    backgroundColor: primaryColor,
    opacity: 0.5
  },
  usersIcon: {
    color: primaryColor,
    fontSize: 25,
    fontWeight: '600',
  },
  text: {
    fontSize:13, 
  },
  loadingLayer: {
    flex: 1,
    width: width, 
    height: height, 
    backgroundColor: 'rgba(0,0,0,0.3)', 
    position: 'absolute', 
    top: 50, 
    zIndex: 999
  }
})

export default memo(Maps);
