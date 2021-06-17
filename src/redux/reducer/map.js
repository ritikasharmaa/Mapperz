import * as Actions from '../actions/types.js';
let defaultProps = {
  mapDetail: {},
  fetchingDetail: false,
  fetchingAllMaps: false,
  allMaps: {},
  currentMap: null,
  spotDetail: {},
  searchText: '',
  filters: [],
  fetchingMapFeed: false,
  mapFeed: [],
  weatherInfo: {},
  fetchingNearestSpot: false,
  nearestSpotList: [],
  googleSpotList: [],
  centerCords: [],
  page:1,
  loading: false,
  map_marker_id: 0,
  suggestedSpot: [],
  spot_message: [],
  isOpen: false,
  selected_neighborhood: '',
  selected_purpose: '',
  mapList: [],
  listedMaps: [],
  isSliderOpen: false,
  isLoading: '',
  count: 0,
  hideButtons: false,
  toggleValue: true
}
const map = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.SET_MAP_DETAIL: {
    return {
      ...state,
      mapDetail: action.data,
      fetchingDetail: false
    }
  }
  case Actions.FETCHING_MAP_DETAIL: {
    return {
      ...state,
      fetchingDetail: true
    }
  }
  case Actions.FETCHING_ALL_MAP: {
    return {
      ...state,
      fetchingAllMaps: true
    }
  }
  case Actions.SET_ALL_MAPS: {
    return {
      ...state,
      allMaps: action.data,
      fetchingAllMaps: false
    }
  }
  case Actions.SET_CURRENT_MAP_ID: {
    return {
      ...state,
      currentMap: action.id
    }
  }
  case Actions.SET_SPOT_DETAIL: {
    return {
      ...state,
      spotDetail: action.data
    }
  }
  case Actions.ON_SEARCH_SPOT: {
    return {
      ...state,
      searchText: action.text,
      page: 1
    }
  }
  case Actions.ON_FILTER_SPOT: {
    let allFilters = [...state.filters];
    let index = allFilters.indexOf(action.value)
    if (index === -1) {
      allFilters.push(action.value)
    } else {
      allFilters.splice(index, 1)
    }
    return {
      ...state,
      filters: allFilters,
      page: 1
    }
  }
  case Actions.FETHCING_MAP_FEED: {
    return {
      ...state,
      fetchingMapFeed: true
    }
  }
  case Actions.SET_MAP_FEED: {
    return {
      ...state,
      mapFeed: action.data,
      fetchingMapFeed: false
    }
  }
  case Actions.SET_WEATHER_INFO: {
    return {
      ...state,
      weatherInfo: action.data
    }
  }
  case Actions.FETHCING_NEAREST_SPOT: {
    return {
      ...state,
      fetchingNearestSpot: true
    }
  }
  case Actions.SET_NEAREST_SPOT: {
    return {
      ...state,
      nearestSpotList: action.data,
      fetchingNearestSpot: false
    }
  }
  case Actions.SET_PAGE_COUNT:{
    return{
      ...state,
      page: action.page
    }
  }
  case Actions.TOGGLE_FAV_SPOT: {
    let currentMapDetail = {...state.mapDetail};
    let currentArray = currentMapDetail.spots
    let spotIndex;
    if(action.data.type !== 'Spot') {
      currentArray = state.allMaps.suggested_maps
    }
    spotIndex = currentArray.findIndex(item => item.id === action.data.id);
    currentArray[spotIndex].isFav = !currentArray[spotIndex].isFav;
    return {
      ...state,
      mapDetail: currentMapDetail,
    }
  }
  case Actions.SET_CENTER_CORDS: {
    return {
      ...state,
      centerCords: action.cord
    }
  }
  case Actions.MAP_MARKER_ID: {
    let markerId = state.map_marker_id;
    if(markerId === action.id){
      markerId = 0
    } else {
      markerId = action.id
    }
    return {
      ...state,
      map_marker_id: markerId
    }
  }
  case Actions.REMOVE_FAV_MAP: {
    let oldArray = {...state.allMaps}
    let updatedFavRecords = state.allMaps.favorite_maps.filter(item.id !== action.id)
    return {
      ...state,
      allMaps: [...oldArray, updatedFavRecords]
    }
  }
  case Actions.DELETE_USER_MAP: {
    let oldArray = {...state.allMaps}
    let updatedFavRecords = state.allMaps.user_maps.filter(item.id !== action.id)
    return {
      ...state,
      allMaps: [...oldArray, updatedFavRecords]
    }
  }
  case Actions.SET_GOOGLE_SPOTS: {
    return {
      ...state,
      googleSpotList: action.data,
      fetchingNearestSpot: false
    }
  }
  case Actions.SAVE_SUGGESTED_SPOT: {
    return {
      ...state,
      suggestedSpot: action.data,
    }
  }
  case Actions.SET_SPOT_MESSAGE: {
    return {
      ...state,
      spot_message: action.data,
    }
  }
  case Actions.SET_TOGGLE_BTN: {
    let opened = state.isOpen
    if(opened){
      opened = false
    } else {
      opened = true
    }
    return {
      ...state,
      isOpen: opened,
    }
  }
  case Actions.SET_SEARCH_OPTION: {
    let neighborhood = state.selected_neighborhood
    let purpose = state.selected_purpose

    if(action.key === 'neighborhood'){
      neighborhood = action.val
    } else {
      purpose = action.val;
    } 
    return {
      ...state,
      selected_neighborhood: neighborhood,
      selected_purpose: purpose
    }
  }
  case Actions.CLOSE_OVERLAY: {
    return {
      ...state,
      isOpen: false,
    }
  }
  case Actions.SET_MAP_LIST: {
    return {
      ...state,
      mapList: action.data,
      selected_neighborhood: '',
      selected_purpose: '',
    }
  }
  case Actions.UPDATE_SUGGESTIONS: {
    let spots = [...state.suggestedSpot]
    let index = spots.findIndex(item => item.id === action.spotDetail.id)
    spots.splice(index, 1) 
    return {
      ...state,
      suggestedSpot: spots,
    }
  }
  case Actions.SAVE_LISTED_MAP: {
    return {
      ...state,
      listedMaps: action.data,
      selected_neighborhood: '',
      selected_purpose: '',
    }
  }
  case Actions.UPDATE_USER_CREATED_MAP: {
    let maps = {...state.allMaps}
    maps.user_maps.push(action.data)
    return {
      ...state,
      allMaps: maps,
    }
  }
  case Actions.TOGGLE_FAV_MAP: {
    let maps = {...state.listedMaps}
    if(action.data.category === 'closeby'){
      let index = maps.close_by_maps.findIndex(item => item.id === action.data.id)
      maps.close_by_maps[index].isFav = !maps.close_by_maps[index].isFav
    } else if(action.data.category === 'liked'){
      let index = maps.ranked_maps.liked_maps.findIndex(item => item.id === action.data.id)
      maps.ranked_maps.liked_maps[index].isFav = !maps.ranked_maps.liked_maps[index].isFav
    } else if(action.data.category === 'viewed'){
      let index = maps.ranked_maps.viewed_maps.findIndex(item => item.id === action.data.id)
      maps.ranked_maps.viewed_maps[index].isFav = !maps.ranked_maps.viewed_maps[index].isFav
    } else if(action.data.category === 'areaMaps'){
      let index = maps.area_maps.findIndex(item => item.id === action.data.id)
      maps.area_maps[index].isFav = !maps.area_maps[index].isFav
    }
    return {
      ...state,
      listedMaps: maps
    }
  }
  case Actions.TOGGLE_FAV_BTN: {
    let currentMaps = {...state.mapDetail}
    currentMaps.isFav = !currentMaps.isFav
    return {
      ...state,
      mapDetail: currentMaps
    }
  }
  case Actions.SLIDER_OPEN: {
    return {
      ...state,
      isSliderOpen: true
    }
  }
  case Actions.SLIDER_CLOSE: {
    return {
      ...state,
      isSliderOpen: false
    }
  }
  case Actions.MAP_LOADING: {
    return {
      ...state,
      isLoading: false
    }
  }  
  case Actions.SET_CLICK_COUNT: {
    return {
      ...state,
      count: state.count + 1,
    }
  }
  case Actions.HIDE_BUTTONS: {
    let value = state.hideButtons
    if(value){
      value = false
    } else {
      value = true
    }
    return {
      ...state,
      hideButtons: value,
    }
  }
  case Actions.TOGGLE_STATE: {
    return {
      ...state,
      toggleValue: action.value,
    }
  }
  default:
    return state;
  }
};

export default map;