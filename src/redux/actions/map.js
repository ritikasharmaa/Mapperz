import {
  SET_MAP_DETAIL,
  FETCHING_MAP_DETAIL,
  FETCHING_ALL_MAP,
  SET_ALL_MAPS,
  SET_CURRENT_MAP_ID,
  SET_SPOT_DETAIL,
  ON_SEARCH_SPOT,
  ON_FILTER_SPOT,
  SET_WEATHER_INFO,
  FETHCING_NEAREST_SPOT,
  SET_NEAREST_SPOT,
  TOGGLE_FAV_SPOT,
  SET_CENTER_CORDS,
  SET_PAGE_COUNT,
  MAP_MARKER_ID,
  REMOVE_FAV_MAP,
  SET_GOOGLE_SPOTS,
  SAVE_SUGGESTED_SPOT,
  SET_SPOT_MESSAGE,
  SET_TOGGLE_BTN,
  SET_SEARCH_OPTION,
  CLOSE_OVERLAY,
  SET_MAP_LIST,
  UPDATE_SUGGESTIONS,
  SAVE_LISTED_MAP,
  DELETE_USER_MAP,
  UPDATE_USER_CREATED_MAP,
  TOGGLE_FAV_MAP,
  TOGGLE_FAV_BTN,
  SLIDER_OPEN,
  SLIDER_CLOSE,
  MAP_LOADING,
  SET_CLICK_COUNT,
  HIDE_BUTTONS,
  TOGGLE_STATE
} from './types';


export function setMapDetail(data) {
    return {
      type: SET_MAP_DETAIL,
      data
    };
}

export function fetchingMapDetail() {
    return {
      type: FETCHING_MAP_DETAIL
    };
}

export function fetchingAllMaps() {
    return {
      type: FETCHING_ALL_MAP
    };
}

export function setMaps(data) {
    return {
      type: SET_ALL_MAPS,
      data
    };
}

export function setCurrentMapId(id) {
    return {
      type: SET_CURRENT_MAP_ID,
      id
    };
}

export function setSpotDetail(data) {
    return {
      type: SET_SPOT_DETAIL,
      data
    };
}

export function onSearchSpots(text) {
    return {
      type: ON_SEARCH_SPOT,
      text
    };
}

export function onFilterSpots(value) {
    return {
      type: ON_FILTER_SPOT,
      value
    };
}

export function setWeatherData(data) {
    return {
      type: SET_WEATHER_INFO,
      data
    };
}

export function setNearestSpot(data) {
    return {
      type: SET_NEAREST_SPOT,
      data
    };
}

export function fetchingNearestSpot() {
    return {
      type: FETHCING_NEAREST_SPOT
    };
}

export function setPageCount(page) {
    return {
      type: SET_PAGE_COUNT,
      page
    };
}

export function toggleFavSpot(data) {
    return {
      type: TOGGLE_FAV_SPOT,
      data
    };
}

export function setCenterCord(cord) {
    return {
      type: SET_CENTER_CORDS,
      cord
    };
}

export function saveMapMarkerId(id) {
    return {
      type: MAP_MARKER_ID,
      id
    };
}

export function removeFavMap(data) {
  return {
    type: REMOVE_FAV_MAP,
    data
  };
}
export function deleteUserMap(id) {
  return {
      type: DELETE_USER_MAP,
      id,
  };
}
export function setGoogleSpot(data) {
  return {
      type: SET_GOOGLE_SPOTS,
      data,
  };
}

export function saveSuggestedSpot(data) {
  return {
    type: SAVE_SUGGESTED_SPOT,
    data
  }
}

export function setSpotMessage(data) {
  return {
    type: SET_SPOT_MESSAGE,
    data
  }
}

export function favIconIsOpen() {
  return {
    type: SET_TOGGLE_BTN,
  }
}

export function changeSearchOption(val, key) {
  return {
    type: SET_SEARCH_OPTION,
    val,
    key
  }
}

export function hideOverlay() {
  return {
    type: CLOSE_OVERLAY
  }
}

export function mapList(data) {
  return {
    type: SET_MAP_LIST,
    data
  }
}

export function updateSuggestedSpot(data, spotDetail) {
  return {
    type: UPDATE_SUGGESTIONS,
    data,
    spotDetail,
  }
}

export function saveListedMaps(data) {
  return {
    type: SAVE_LISTED_MAP,
    data,
  }
}

export function updateUserCreatedMap(data) {
  return {
    type: UPDATE_USER_CREATED_MAP,
    data,
  }
} 

export function toggleFavMap(data) {
  return {
    type: TOGGLE_FAV_MAP,
    data
  }
}

export function toggleFavBtn(data) {
  return {
    type: TOGGLE_FAV_BTN,
    data
  }
}

export function sliderOpen() {
  return {
    type: SLIDER_OPEN,
  }
}

export function sliderClose() {
  return {
    type: SLIDER_CLOSE,
  }
}

export function mapLoading() {
  return {
    type: MAP_LOADING,
  }
}

export function setClickCount() {
  return {
    type: SET_CLICK_COUNT
  }
}

export function hideButtons() {
  return {
    type: HIDE_BUTTONS
  }
}

export function setToggleState(value) {
  return {
    type: TOGGLE_STATE,
    value
  }
}