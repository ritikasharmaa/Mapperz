import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import { setCategories, setSearchDetail } from "../actions/search";

export const getCategories = (dispatch) => {    
  var options = GenerateOptions('getcategory', "GET");
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setCategories(response.data.cat_detail))
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
};


export const getCategoryDetail = (cat_id, parent_id, dispatch) => {  
  let apiData = {cat_id: cat_id, parent: parent_id}  
  var options = GenerateOptions('filtercat', "GET", apiData);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //dispatch(setCategories(response.data.cat_detail))
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
};


export const getCategoriesDetail = (id, type, dispatch) => {  
  let apiData = {list_id: id, list_type: type}  
  var options = GenerateOptions('listing_detail', "GET", apiData);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setSearchDetail(response.data.listings))
        return response.data;
      })
      .catch(error => {
        return error.response.data;
      });
  };
};

