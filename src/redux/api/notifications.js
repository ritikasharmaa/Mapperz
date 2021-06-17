import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
//import SyncStorage from 'sync-storage';
import { setNotification, setloading } from '../actions/notifications'
import {mainUrl, apiUrl} from '../Constant'
//import { setLanguage, setActiveTab } from '../actions/uiControls'
import { objectToFormData } from '../Utility'

export const getNotification = (page) => {  
  var options = GenerateOptions(`notifications?[page]=${page}`, "GET");
  return dispatch => {
    if(page === 1){
      dispatch(setloading())
    }    
    return MakeTheApiCall(options)      
      .then(response => {
        dispatch(setNotification(response.data, page))
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
};

export const readStatus = (id) => {
  let data = new FormData();

  data.append('[notification][read]', true)

  var options = GenerateOptions(`notifications/${id}`, "PUT", data);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
}