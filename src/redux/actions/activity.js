import {
    SET_ACTIVITY,
    SET_LOADING
  } from './types';
  
  export function setActivity(data) {
      return {
        type: SET_ACTIVITY,
        data
      };
  }

  export function activityLoading() {
      return {
        type: SET_LOADING
      };
  }