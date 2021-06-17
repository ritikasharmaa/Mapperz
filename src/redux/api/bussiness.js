import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import { setCountries } from "../actions/bussiness";

export const getCountries = (dispatch) => {  
  var options = GenerateOptions('get_country', "GET");
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setCountries(response.data.Country_flag))
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
};