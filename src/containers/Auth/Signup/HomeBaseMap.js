import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Platform,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
  PermissionsAndroid
} from "react-native";
import MapboxGL from "@react-native-mapbox-gl/maps";
import { Icon, Container } from "native-base";
import Geolocation from 'react-native-geolocation-service';
import { connect } from "react-redux";
import _ from "lodash";
import { setCenterCord, mapLoading } from "../../../redux/actions/map";
import {searchUserDetail } from "../../../redux/api/auth"
import FormatText from "../../../components/common/FormatText";
import { clearUserDetail, userDetail } from "../../../redux/actions/auth";
import Ripple from 'react-native-material-ripple';
import microValidator from "micro-validator";
import validationHelpers from "../../../assets/validationHelpers";
import { signup } from "../../../redux/api/auth";
import { getSpecificMapDetail } from '../../../redux/api/map';
import ContentLoader from "../../../components/common/ContentLoader";
import { convertText } from "../../../redux/Utility"
import Autocomplete from 'react-native-autocomplete-input'
import { searchCenterSpot } from '../../../redux/api/planner'
import GPSState from 'react-native-gps-state'
import PulseCircleLayer from '../../../components/ViewMaps/PulseCircle'
import { cleanSingle } from "react-native-image-crop-picker";

var location = {};

MapboxGL.setAccessToken(
  "pk.eyJ1IjoicnVwaW5kZXIiLCJhIjoiY2s5MWM1eXYyMDloMjNnbzk1OXpxcjkxMyJ9.4aU23jLL3m6tTz_Sp8lajA"
);

const { width, height } = Dimensions.get("screen");

class HomeBaseMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isUserCenterLocatied: true,
      color: "red",
      centerCoordinate: [],
      lng: '',
      lat: '',
      searchBar: false,
      searchText:'',
      loading: false,
      googleSignup: false,
      hideResult: false,
      isFocused: null
    };
  }

  locationAccess = () => {
    GPSState.requestAuthorization()
    GPSState.getStatus().then((status)=> {
    })
    let lang = this.props.uiControls.lang
    setTimeout(()=> {
      let isAuthorized = GPSState.isAuthorized()
      if(isAuthorized){
        Alert.alert(
          convertText("map.please_grant_us_loc", lang),
          convertText("map.loc_access", lang),
          [
            {
              text: convertText("sidebarcomp.cancel", lang),
              //onPress: () => console.log("Cancel Pressed"),
              style: "cancel",
            },
            {
              text: convertText("map.ok", lang),
              onPress: () => {
                Geolocation.getCurrentPosition((info) => {
                  this.props.dispatch(
                    setCenterCord([info.coords.longitude, info.coords.latitude])
                  );
                },
                (error) => {
                  alert(convertText('map.please_turn_on_your_location', lang))
                },
                {
                  showLocationDialog: true,
                }
                );
              },
            },
          ],
          { cancelable: false }
        ); 
      }
    }, 5000)
    
      
    
    // GPSState.openLocationSettings()
       // let lang = this.props.uiControls.lang
    // if(Platform.OS === 'android'){
    //   console.log("and entery")

    //   PermissionsAndroid.requestMultiple(
    //     [
    //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    //       PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    //     ],
    //     {
    //       title: "Give Location Permission",
    //       message: "App needs location permission to find your position.",
    //     }
    //   )
    //   .then((granted) => {
    //     console.log("hihihihiihhiih")
    //     console.log(granted, "granted")
    //     let isAuthrized = GPSState.isAuthorized()
    //     console.log(isAuthrized, "isAuthrized")
    //     // if(granted.android.permission.ACCESS_COARSE_LOCATION = "granted"){
    //     if(isAuthrized){
    //       console.log("trueee")
    //       console.log('permission!!!!!!!!!!!!!')
    //       Alert.alert(
    //         convertText("map.please_grant_us_loc", lang),
    //         convertText("map.loc_access", lang),
    //         [
    //           {
    //             text: convertText("sidebarcomp.cancel", lang),
    //             onPress: () => console.log("Cancel Pressed"),
    //             style: "cancel",
    //           },
    //           {
    //             text: convertText("map.ok", lang),
    //             onPress: () => {
    //               Geolocation.getCurrentPosition((info) => {
    //                 console.log(info.coords, "coordsNew")
    //                 this.props.dispatch(
    //                   setCenterCord([info.coords.longitude, info.coords.latitude])
    //                 );
    //               });
    //             },
    //           },
    //         ],
    //         { cancelable: false }
    //       ); 
    //      }      
    //   })
    // } else {
    //   let isAuthrized = GPSState.isAuthorized()
    //   console.log(isAuthrized, 'isAuthrized')
    //    if(isAuthrized){
    //     Alert.alert(
    //       convertText("map.please_grant_us_loc", lang),
    //       convertText("map.loc_access", lang),
    //       [
    //         {
    //           text: convertText("sidebarcomp.cancel", lang),
    //           onPress: () => console.log("Cancel Pressed"),
    //           style: "cancel",
    //         },
    //         {
    //           text: convertText("map.ok", lang),
    //           onPress: () => {
    //             console.log('hello')
    //             Geolocation.getCurrentPosition((info) => {
    //               console.log(info.coords, "coords")
    //               this.props.dispatch(
    //                 setCenterCord([info.coords.longitude, info.coords.latitude])
    //               );
    //             });
    //           },
    //         },
    //       ],
    //       { cancelable: false }
    //     ); 
    //   } 
  // }
    
  }

  async componentDidMount () {
    MapboxGL.setTelemetryEnabled(false);
    //MapboxGL.locationManager.start();
    //   this.props.dispatch(setCenterCord({
    //   centerCords: [139.7454, 35.6586],
    //   id:'home_mark'
    // })
    // )
    {this.locationAccess()}   
      //   console.log(isAuthrized, "isAuthrized2")
    
    // if(isAuthrized){
    //   await Alert.alert(
    //     convertText("map.please_grant_us_loc", lang),
    //     convertText("map.loc_access", lang),
    //     [
    //       {
    //         text: convertText("sidebarcomp.cancel", lang),
    //         onPress: () => console.log("Cancel Pressed"),
    //         style: "cancel",
    //       },
    //       {
    //         text: convertText("map.ok", lang),
    //         onPress: () => {
    //           Geolocation.getCurrentPosition((info) => {
    //             console.log(info.coords, "coords")
    //             this.props.dispatch(
    //               setCenterCord([info.coords.longitude, info.coords.latitude])
    //             );
    //           });
    //         },
    //       },
    //     ],
    //     { cancelable: false }
    //   ); 
    // }     
  }

  componentWillUnmount() {
    MapboxGL.locationManager.stop();
  }

  onDidFinishLoadingMap = () => {
    this.setState({ mapLoaded: true });
  };
  onRegionIsChanging = (region) => { 
    if (this.state.mapLoaded) {      
      let center = region.geometry.coordinates;
      this.props.setLat(center[1]);
      this.props.setLng(center[0]);
    }   
  };
  onRegionDidChange = (region) => {
    this.props.dispatch(
      setCenterCord([region.geometry.coordinates[0], region.geometry.coordinates[1]])
    );
    let center = region.geometry.coordinates;
    this.props.setLat(center[1]);
    this.props.setLng(center[0]);
  }

  onSearch = (text) => {
    this.setState({searchText: text})
    this.props.dispatch(searchCenterSpot(text, this.props.uiControls.lang))
    this.setState({hideResult: false})
  }

  selectItem = (item) => {
    this.setState({searchText: item.label || item.name_local})
    this.setState({hideResult: true})
    this.props.dispatch(
      setCenterCord([item.longitude, item.latitude])
    )
    // this.props.dispatch(searchUserDetail(text)).then ( res => {
    //   this.props.dispatch(
    //     setCenterCord([res[1], res[0]])
    //   )
    // })
  }  

  Continue = () => {
    Keyboard.dismiss()
    this.props.dispatch(userDetail(this.props.lat, "latitude"));
    this.props.dispatch(userDetail(this.props.lng, "longitude"));
    this.props.navigation.navigate("UploadPicture");
  };

  signUp = (detail, state) => {
    this.props.dispatch(signup(detail, state)).then((res) => {
      if (res.id) {
        this.props.dispatch(
          setCenterCord([])
        );
        this.props.dispatch(clearUserDetail())
       // this.props.dispatch(getSpecificMapDetail(res.home_mapper_id)).then(res => {
          this.setState({loading: false})
          this.props.navigation.navigate('Loading', {homeMapId: res.home_mapper_id})
          // if(res.data.status === 'done'){
          //   this.props.dispatch(getSpecificMapDetail(res.home_mapper_id)).then(res => {
          //     this.props.dispatch(mapLoading())
          //   })           
          // }          
          // })
          // Toast.show(convertText("signup.signup", lang));
          // props.navigation.navigate("Home", {data:1});       
      } else {
        let errorMsg = "";
        Object.keys(res).forEach((key) => (errorMsg += res[key][0]));
        Toast.show(errorMsg);
      }
    }).catch(err => {
      this.setState({loading: false})
    })
  }
 
  hitSignUp = () => {
    let lang = this.props.uiControls.lang
    let detail = this.props.auth.user_detail;
    const errors = microValidator.validate(
      validationHelpers.signupValidationSchema,
      detail
    );
    this.props.dispatch(userDetail(this.props.lat, "latitude"));
    this.props.dispatch(userDetail(this.props.lng, "longitude"));
    detail.latitude = this.props.lat
    detail.longitude = this.props.lng
    let isAuthrized = GPSState.isAuthorized()
    if(detail.latitude === (''|| 0) && detail.latitude === (''|| 0)){
      this.locationAccess()
    } else {
      this.setState({loading: true})
      let state = this.state.googleSignup
      if(this.props.route.params && this.props.route.params.data === "data"){
        this.setState({googleSignup: true})
        state = true
      }
      this.signUp(detail, state) 
    }        
  };

  centerOnCurrentLocation = () => {    
    let isAuthrized = GPSState.isAuthorized()
    if(isAuthrized){  
      Geolocation.getCurrentPosition((info) => {
        this.props.dispatch(
          setCenterCord([info.coords.longitude, info.coords.latitude])
        );
      });   
    }
  }


  render() {
    let lang = this.props.uiControls.lang
    //console.log(this.props.map.centerCords, "this.props.map.centerCords")
    return (
      <View style={styles.page}>
        <View style={styles.container}>
          {/*<View style={styles.latLng}>
            <Text style={styles.text}>Longitude: {this.props.lng}  | Latitude: {this.props.lat} 
            </Text>
          </View>*/}
          <View style={{position: 'absolute', zIndex: 99, width: '100%'}}>
            <Autocomplete 
              onFocus={() => this.setState({isFocused: true})}
              onBlur={() => this.setState({isFocused: false})}
              data={this.props.planner.centerSpotsList}
              inputContainerStyle={styles.textBox}
              style={styles.autoCompleteCon}
              defaultValue={this.state.searchText}
              onChangeText={text => this.onSearch(text)}
              renderItem={({ item, i }) => (
                <TouchableOpacity style={styles.listItem} key={i} onPress={() => this.selectItem(item)}>
                  <Text>{item.label} ({item.name_local})</Text>
                </TouchableOpacity>
              )}
              hideResults={this.state.hideResult}
              placeholder={convertText("msgscomp.select",lang)}
            />
      			{/* <TextInput
      			 style={styles.textBox}
             placeholder={convertText("sidebarcomp.search", lang)}
             value={this.state.searchText}
             placeholderTextColor={'#ccc'}
             onChangeText={(text) => this.onSearch(text)}
  		      /> */}
  		      <Icon type="FontAwesome5" name={'search'} style={styles.searchIcon} />
  			  </View>
          <MapboxGL.MapView
            ref={(_map) => {
              this.mapRef = _map;
            }}
            style={styles.map}
            compassEnabled
            localizeLabels={true}
            showUserLocation={true}
            onDidFinishLoadingMap={this.onDidFinishLoadingMap}
            onRegionIsChanging={this.onRegionIsChanging}
            onRegionDidChange={this.onRegionDidChange}
            //centerCoordinate={this.props && this.props.map && this.props.map.centerCords && this.props.map.centerCords.length ? this.props.map.centerCords : [139.7454, 35.6586]}
          >
          {/* <PulseCircleLayer /> */}
          <MapboxGL.Light />            
          <MapboxGL.Camera
            zoomLevel={18}
            centerCoordinate={
              this.props.map.centerCords && this.props.map.centerCords.length &&
              this.props.map.centerCords
            }
            //centerCoordinate={this.props && this.props.map && this.props.map.centerCords && this.props.map.centerCords.length ? this.props.map.centerCords :[139.7454, 35.6586]}
            // centerCoordinate={this.props.map.centerCords.length ? this.props.map.centerCords : this.props.map.centerCords.centerCords}
          />

      {/* <MapboxGL.PointAnnotation 
      coordinate={[
        139.7454, 35.6586,
          ]}
          title={"test"}
          id="base_marker"
          layer={4}>
        </MapboxGL.PointAnnotation>
             */}
           {/* <View style={{backgroundColor:'red', position: 'absolute', zIndex: 99}}>
      			<TextInput
      			 style={styles.textBox}
             placeholder={'search'}
             value={this.state.searchText}
             onChangeText={(text) => this.onSearch(text)}
  		      />
  		      <Icon type="FontAwesome5" name={'search'} style={styles.searchIcon} />
  			  </View> */}
          </MapboxGL.MapView>
        </View>
        {this.state.loading && 
          <View style={styles.loader}>
            <ContentLoader />
          </View>
        }
        {!this.state.isFocused && <Ripple 
          style={styles.round}
          rippleColor="#ccc" 
          rippleOpacity={0.5} 
          rippleDuration={700}
          rippleContainerBorderRadius={30}
          onPress={() => this.centerOnCurrentLocation()}
        >
          <Icon type="FontAwesome5" name={'map-marker-alt'} style={styles.usersIcon} />
        </Ripple>}
        {!this.state.isFocused && <View style={styles.iconOuterCon}>
          <View style={styles.iconCon}>
            <Icon
              type="FontAwesome5"
              name={"map-marker-alt"}
              style={styles.icon}
            />
          </View>
        </View>}
        {/* {this.props.route.params && this.props.route.params.data === "data" ? ( */}
          {!this.state.isFocused && <TouchableOpacity
            style={[styles.continueBtnCon, (this.state.loading && lang === 'ja') && {width: 'auto', left: width / 2 - 80}]}
            onPress={() => this.hitSignUp()}
          >
            <Text style={styles.continueBtn}>
              {
                this.state.loading ? convertText("sidebarcomp.loading", lang) : 
                <FormatText variable="signup.submit" />
              }
            </Text>
          </TouchableOpacity>}
        {/* ) 
        // : (
        //   <TouchableOpacity
        //     style={styles.continueBtnCon}
        //     onPress={() => this.Continue()}
        //   >
        //     <Text style={styles.continueBtn}>
        //       <FormatText variable="signup.continue" />
        //     </Text>
        //   </TouchableOpacity>
        // )}  */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  page: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
    height: "100%",
  },
  container: {
    position: "absolute",
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
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
  iconOuterCon: {
    position: "absolute",
    bottom: height / 4,
    left: width / 2 - 50,
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: "hidden",
    backgroundColor: "rgba(66,110,169,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconCon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    color: "#426ea9",
    fontSize: 16,
  },
  latLng: {
    backgroundColor: "#bb4fef",
    width: "100%",
  },
  text: {
    color: "#fff",
    fontSize: 14,
    paddingVertical: 5,
    paddingHorizontal: 50,
  },
  icon: {
    fontSize: 18,
    color: "#aaa",
  },
  homeBtn: {
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 5,
  },
  searchIcon: {
  	color: 'grey',
  	fontSize: 16,
  	position: 'absolute',
  	top: Platform.OS == 'ios' ? 12 : 18,
    left: 15,
    zIndex: 99
  },
  continueBtnCon: {
    position: "absolute",
    bottom: 50,
    left: width / 2 - 63,
    width: 130
  },
  continueBtn: {
    backgroundColor: "#9248e7",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: "#fff",
    overflow: "hidden",
    textAlign: 'center'
  },
  round: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    right: 10,
    top: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1,
    marginTop: 15,
    marginRight: 8
  },
  usersIcon: {
    color: 'grey',
    fontSize: 25,
    fontWeight: '600',
  },
  loader: {
    position: 'absolute',
    zIndex: 999,
    bottom: 80
  },
  autoCompleteCon: {
    height: 40,
    color: '#000',
  },
  listItem: {
    padding: 5,
  },
  textBox: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#f5f5f5',
    fontSize: 14,
    paddingLeft: 40,
    paddingRight: 50
  },
});

const mapStateToProps = (state) => ({
  auth: state.auth,
  map: state.map,
  uiControls: state.uiControls,
  planner: state.planner
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomeBaseMap);
