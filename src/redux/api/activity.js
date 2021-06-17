import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import { setActivity, activityLoading } from "../actions/activity";

export const getActivities = () => {  
  var options = GenerateOptions('get_recent_activity', "GET");
  return dispatch => {
    dispatch(activityLoading())
    return MakeTheApiCall(options)
      .then(response => {
        if (response.data.success) {
          dispatch(setActivity(response.data.recent_activity))  
        }
        else {
          dispatch(activityLoading())          
        }
      })
      .catch(error => {
        return error.response.data;
      });
  };
};