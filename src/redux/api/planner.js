import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import SyncStorage from 'sync-storage';
import { setSpots, toogleFormLoad, setCenterSpots, editPlannerDetail, saveCenterSpots } from '../actions/planner'
import { getMapFeed } from './feed'
import { getSpecificMapDetail } from './map'
import { updateUserCreatedMap } from '../actions/map'
import {mainUrl, apiUrl} from '../Constant'
import { objectToFormData } from '../Utility'
import moment from 'moment'

export const getSpots = (data) => {  
  let token = SyncStorage.get('token')
  var options = GenerateOptions(`mappers/search?token=${token}&latitude=${data.lat}&longitude=${data.lng}&prefecture=${data.prefecture}&lang=${data.lang}&name=${data.text}&predefined=${data.genre}&range=${data.range}`, "GET");
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setSpots(response.data))
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};
export const searchCenterSpot = (text, lang) => {  
  if(lang === 'en'){
    var options = GenerateOptions(`neighborhoods/autocomplete_neighborhood_attname?term=${text}`, "GET", '', '', mainUrl);
  } else {
    var options = GenerateOptions(`neighborhoods/autocomplete_neighborhood_attname_local?term=${text}`, "GET", '', '', mainUrl);
  }
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setCenterSpots(response.data))
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const submitMapForm = (formData, selectedSpots, ownerId) => { 
  let allSpots = []
  let spotIds = []
  selectedSpots.forEach((item, index) => {
    if (item.id === null) {
      allSpots.push({
        refbase: item.place_id,
        attname: item.name,
        attname_local: item.vicinity,
        img_url: '',
        latitude: item.lat,
        longitude: item.lng,
        img_copyright: '',
        description: item.description,
        description_local: item.description
      })
    } else {
      spotIds = [...spotIds, item.id]
      allSpots.push({
        id: item.id,
        attname: item.attname,
        attname_local: item.attname_local,
        img_url: '',
        latitude: item.latitude,
        longitude: item.longitude,
        img_copyright: item.img_copyright,
        description: item.description,
        description_local: item.description
      })  
    }
  })
  spotIds = spotIds.join(",")
  const dataTripReview = {
        created_with: "mappingator",
        description: formData.finalFormData.description,
        latitude: formData.centerData.latitude,
        longitude: formData.centerData.longitude,
        description_local: formData.finalFormData.description,
        genre: 'station_based',//formData.methodType.method,
        //group: formData.finalFormData.group,
        language: 'ja',
        map_name: formData.finalFormData.tour_name,
        map_name_local: formData.finalFormData.tour_name,
        neighborhood_id: formData.centerData.id,
        prefecture_id: formData.centerData.pref_cd,
        owner_id: ownerId,
        owner_type: 'User',
        status: formData.finalFormData.status,
      };

  //console.log(dataTripReview, 'dataTripReview')
 
  let submitFormData = objectToFormData({
    mapper: dataTripReview,
    spots: allSpots
  });
  if(spotIds.length) {
    submitFormData = objectToFormData({
      mapper: dataTripReview,
      spots: allSpots,
      spot_ids: spotIds
    });
  }
  var options = GenerateOptions(`mappers`, "POST", submitFormData);
  return dispatch => {
    dispatch(toogleFormLoad())
    return MakeTheApiCall(options)
      .then(response => {
        console.log(response, "resp")
        dispatch(toogleFormLoad())        
        dispatch(getMapFeed(response.data.mapper.id)); 
        dispatch(getSpecificMapDetail(response.data.mapper.id)); 
        dispatch(updateUserCreatedMap(response.data.mapper))      
        return response.data;
      })
      .catch(error => {
        console.log(error, "errr")
        dispatch(toogleFormLoad()) 
        //return error.response.data;
      });
  };
};

export const updateMapForm = (formData, id) => {  
  const dataTripReview = {
        created_with: "mappingator",
        date: moment(formData.finalFormData.date).format('DD/MM/YYYY'),
        description: formData.finalFormData.description,
        latitude: formData.centerData.latitude,
        longitude: formData.centerData.longitude,
        description_local: formData.finalFormData.description,
        group: formData.finalFormData.group,
        language: 'ja',
        map_name: formData.finalFormData.tour_name,
        map_name_local: formData.finalFormData.tour_name,
        neighborhood_id: formData.centerData.id,
        prefecture_id: formData.centerData.pref_cd,
        //owner_id: '',
        owner_type: 'User',
        status: formData.finalFormData.status,
      };

  //console.log(dataTripReview, 'dataTripReview')
  let submitFormData = objectToFormData({
        mapper: dataTripReview
      });
  var options = GenerateOptions(`mappers/${id}`, "PUT", submitFormData);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
         let data = {
          centerData: {
            id : response.data.mapper.id,
            image_url: response.data.mapper.image_url,
            label: '',
            latitude: response.data.mapper.latitude,
            longitude: response.data.mapper.longitude,
            name_local: "",
            pref_cd: response.data.mapper.prefecture_id,
            tours_count: '',
            value:response.data.mapper.neighborhood_name + ' ' + response.data.mapper.prefecture_name,
          },
          finalFormData : {
                tour_name : response.data.mapper.map_name,
                description: response.data.mapper.description,
                 date: response.data.mapper.date,
                status: response.data.mapper.status,
                group: response.data.mapper.group
          },
          methodType: {
            caption: '',
            commingSoon: Boolean,
            image: '',
            method: '',
            subCaption:''
          }
        }
      dispatch(editPlannerDetail(data))
      dispatch(toogleFormLoad())  
      dispatch(getSpecificMapDetail(response.data.mapper.id)); 
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
}; 

export const getCenterSpots = (lang) => { 
  //var options = GenerateOptions(`spots/search?locale=${lang}`, "GET", '', '', apiUrl); 
  var options = GenerateOptions(`spots/search?locale=${lang}&[predefined]='popular'`, "GET", '', '', apiUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(saveCenterSpots(response.data))
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
};
