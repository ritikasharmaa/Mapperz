import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import { 
  setMapDetail, 
  fetchingMapDetail, 
  fetchingAllMaps, 
  setMaps, 
  setCurrentMapId, 
  fetchingMapsFeed, 
  setMapFeed, 
  setWeatherData,
  fetchingNearestSpot,
  setNearestSpot,
  toggleFavSpot,
  deleteUserMap,
  setGoogleSpot,
  saveSuggestedSpot,
  setSpotMessage,
  mapList,
  updateSuggestedSpot,
  setCenterCord,
  saveListedMaps,
  toggleFavMap,
  toggleFavBtn
    } from "../actions/map";
import { checkinUsers } from '../actions/socket'
import SyncStorage from 'sync-storage';
import Geolocation from 'react-native-geolocation-service';
import GPSState from 'react-native-gps-state'

export const getSpecificMapDetail = (id, key) => {  

  var options = GenerateOptions(`mappers/${id}`, "GET");
  return dispatch => {
    dispatch(fetchingMapDetail())
    dispatch(setCurrentMapId(id))
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "cgjdfhghf")
        dispatch(setMapDetail(response.data))
        SyncStorage.set('mapData', response.data)       
        getWeatherInfo(response.data.latitude, response.data.longitude, dispatch)
        return response.data;
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const getWeatherInfo = (lat, lng, dispatch) => {  
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=35&lon=139&appid=86cb73a2f38da7577e1230e17661c71c`)
    .then(res => res.json())
    .then(
      (result) => {
        dispatch(setWeatherData(result))
      });
};

export const getAllMaps =  () => {
  let lat
  let long
  let isAuthrized = GPSState.isAuthorized()
  // if(isAuthrized){
  //   Geolocation.getCurrentPosition(info => {
  //       lat = info.coords.latitude;
  //       long = info.coords.longitude;
  //     }
  //   );
  // }   
  var options = GenerateOptions(`mappers?[user][latitude]=${lat}&[user][longitude]=${long}`, "GET");     
  return dispatch => {
    dispatch(fetchingAllMaps())
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setMaps(response.data))
        let allMap = SyncStorage.set('allMap', response.data)
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const getNearestSpots = (id, lat, lng, googleSpot, val) => {  
  //lat = 35.6863
  //lng = 139.782
  if(googleSpot){
    var options = GenerateOptions(`mappers/search_remote?token=avFP6zd8MwcfySTkdQ_s&latitude=${lat}&longitude=${lng}&[checkin]=true&name=${val}`, "GET");
  } else {
    var options = GenerateOptions(`checkins/spots?latitude=${lat}&longitude=${lng}&thread_type=Mapper&thread_id=${id}`, "GET");
  }
  return dispatch => {
    dispatch(fetchingNearestSpot())
    return MakeTheApiCall(options)
      .then(response => {
        if (googleSpot){
          dispatch(setGoogleSpot(response.data))
        } else {
          dispatch(setNearestSpot(response.data))
        }
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const spotCheckin = (data, userCoords) => { 
  let apiData = {'minutes': data.time, 'share_with': data.access}
  if(Object.keys(data.google_spot).length !== 0){
    apiData.spot = data.google_spot
  } else {
    data.nearestspot.id && (apiData.spot_id = data.nearestspot.id)
    if (userCoords) {
      delete apiData.spot_id;
      apiData.latitude = userCoords.lat;
      apiData.longitude = userCoords.lng;
    } else {
      apiData.mapper_id = data.mapper_id
    }
  }
  var options = GenerateOptions(`checkins`, "POST", {'checkin': apiData});
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, 'check in')
        if(userCoords){
          dispatch(setCenterCord({centerCords : [response.data.result.longitude, response.data.result.latitude], id: response.data.result.user_id, zoomLevel: 20}))
        } else {
          dispatch(setCenterCord({centerCords : [data.nearestspot.longitude || data.google_spot.longitude, data.nearestspot.latitude || data.google_spot.latitude], id: response.data.result.user_id, zoomLevel: 20}))
        }       
        return response.data;
      })
      .catch(error => {
        //console.log(error, 'error 123')
        //return error.response.data;
      });
  };
};

export const addSpotToFav = (data) => { 
  let token = SyncStorage.get('token')
  let apiData = {favorite: {target_type: data.type, target_id: data.id}}
  var options = GenerateOptions(`favorites?token=${token}`, "POST", apiData);
  return dispatch => {
    if(data.location === 'map'){
      dispatch(toggleFavBtn(data))
    } else if(data.location === 'mapListing'){
      dispatch(toggleFavMap(data))
    } else {
      dispatch(toggleFavSpot(data))
    }
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;        
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const removeToFav = (data) => {  
  let apiData = {favorite: {target_type: data.type, target_id: data.id}}
  var options = GenerateOptions(`favorites/remove?`, "DELETE", apiData);
  return dispatch => {
    if(data.location === 'map'){
      dispatch(toggleFavBtn(data))
    } else if(data.location === 'mapListing'){
      dispatch(toggleFavMap(data))
    } else {
      dispatch(toggleFavSpot(data))
    }
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;        
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const getCheckins = () => {  
  let token = SyncStorage.get('token')
  var options = GenerateOptions(`checkins/checked_in?token=${token}`, "GET");
  return dispatch => {
    //dispatch(toggleFavSpot(id))
    return MakeTheApiCall(options)
      .then(response => {
        if (response.data && !response.data.checked_in) {
          response.data.checked_in = []
        }
        dispatch(checkinUsers(response.data))
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const DeleteMap = (id) => {
  var options = GenerateOptions(`mappers/${id}`, "DELETE");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        dispatch(deleteUserMap(id));
        return response
      })
      .catch((error) => {
        //alert('hi')
        return error.data;
      });
  };
};

export const sendSuggestion = (message, suggest_id , suggest_type, suggested_to_id, suggested_to_type, SelectedSpot) => {
  let spotDetail = JSON.stringify(SelectedSpot)
  let data = new FormData();
  data.append("[suggestion][content]", message)
 // data.append("[suggestion][suggest_id]", suggest_id)
  data.append("[suggestion][suggest_type]", suggest_type)
  data.append("[suggestion][suggested_to_id]", suggested_to_id)
  data.append("[suggestion][suggested_to_type]", suggested_to_type)
  SelectedSpot.forEach((item, index) => {
    //data.append(`[spots][${index}][weight]`, item['weight'])
    data.append(`[spots][${index}][latitude]`, item['latitude'])
    data.append(`[spots][${index}][longitude]`, item['longitude'])
    data.append(`[spots][${index}][attname]`, item['name'])
    data.append(`[spots][${index}][attname_local]`, item['name_local'])
    data.append(`[spots][${index}][description]`, 'test')
    data.append(`[spots][${index}][description_local]`, 'test')
    data.append(`[spots][${index}][refbase]`, item['refbase'])
    data.append(`[spots][${index}][address]`, item['address'])
    // Object.keys(item).forEach(function(key) {
    //   data.append(`[spots][${index}][${key}]`, item[key])
    // });
  })
  var options = GenerateOptions(`suggestions`, "POST", data);
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error.data;
      });
  };
}

export const getSuggestedSpot = (id) => {
  var options = GenerateOptions(`mappers/${id}/suggestions`, "GET");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        dispatch(saveSuggestedSpot(response.data))
        return response
      })
      .catch((error) => {
        return error.data;
      });
  };
};

export const updatingSuggestion = (spotDetail, key) => {
  let status
  if(key === 'accept'){
    status = 'true'
  } else {
    status = 'false'
  }  
  var options = GenerateOptions(`suggestions/${spotDetail.id}?[suggestion][acceptance]=${status}`, "PUT");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        dispatch(updateSuggestedSpot(response.data, spotDetail))        
        return response
      })
      .catch((error) => {
        return error.data;
      });
  };
}

export const getSpotMessage = (id) => {
  var options = GenerateOptions(`spots/posts/${id}`, "GET");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        dispatch(setSpotMessage(response.data))
        return response
      })
      .catch((error) => {
        return error.data;
      });
  };
};


export const getMaps = (val, cords, neighborhoodsId, purpose) => {
  var options = GenerateOptions(`mappers/search/mappers?q[map_name_or_map_name_local_or_description_or_description_local_cont]=${val}&[latitude]=${35.6863}&[longitude]=${139.782}&[rang]=500&[neighborhood_id]=${neighborhoodsId}&[mapper][tags]=${purpose}
`, "GET");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        //console.log(response, "res")
        dispatch(mapList(response.data))
        return response
      })
      .catch((error) => {
        //console.log(error, "err")
        return error.data;
      });
  };
};

export const updateHomemap = (id) => {
  var options = GenerateOptions(`registrations/update_home_map?mapper_id=${id}`, "PUT");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        return response
      })
      .catch((error) => {
        return error.data;
      });
  };
};

export const mapListing = (lat, long) => {
  var options = GenerateOptions(`mappers/listings?[user][latitude]=${lat}&[user][longitude]=${long}`, "GET");
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        dispatch(saveListedMaps(response.data))
        return response
      })
      .catch((error) => {
        return error.data;
      });
  };
}

