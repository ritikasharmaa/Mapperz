import {
  CHANGE_FORM,
  CHANGE_CITY,
  SET_SPOTS,
  SET_SELECTED_SPOTS,
  SET_SPOT_DETAIL,
  TOGGLE_FORM_LOAD,
  SET_CENTER_SPOTS,
  SAVE_FILTER_VAL,
  RESET_FILTERS,
  EDIT_PLANNER_DETAILS,
  UPDATE_PLANNER_DETAILS,
  SET_CHOOSE_SPOTS,
  SAVE_CENTER_SPOTS
} from './types';

export const changeForm = (data, key) => {
  return {
    type: CHANGE_FORM,
    data,
    key
  };
}

export const changeSelectedCity = (val) => {
  return {
    type: CHANGE_CITY,
    val
  };
}

export const setSpots = (data) => {
  return {
    type: SET_SPOTS,
    data
  };
}

export const toggleSpot = (data, key) => {
  delete data.description_local;
  return {
    type: SET_SELECTED_SPOTS,
    data,
    key
  }
}

export const setCurrentSpotDetail = (data) => {
  return {
    type: SET_SPOT_DETAIL,
    data
  }
}

export const toogleFormLoad = () => {
  return {
    type: TOGGLE_FORM_LOAD
  }
}

export const setCenterSpots = (data) => {
  return {
    type: SET_CENTER_SPOTS,
    data
  }
}

export const changeSelectedValue = (val, key) => {
  return {
    type: SAVE_FILTER_VAL,
    val,
    key
  }
}

export const resetSearchFilters = () => {
  return {
    type: RESET_FILTERS,
  }
}

export const editPlannerDetail = (data) => {
  return {
    type: EDIT_PLANNER_DETAILS,
    data
  }
}
export function setChooseSpot(data) {
  return {
      type: SET_CHOOSE_SPOTS,
      data,
  };
}

export function saveCenterSpots(data) {
  return {
    type: SAVE_CENTER_SPOTS,
    data,
  }
}