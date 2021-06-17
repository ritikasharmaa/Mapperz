import * as Actions from '../actions/types.js';
let initalForm = {
                    centerData: {},
                    methodType: {},
                    finalFormData: {
                      tour_name: '',
                      description: '',
                      date: '',
                      status: 'public_true',
                      group: ''
                    },
                    
                  }

let defaultProps = {
  formData: initalForm,
  selectedCity: '13',
  spotList: {
    travelz: [],
    gpi: [],
    favorites: []
  },
  selectedSpots: [],
  spotType: [],
  formLoading: false,
  centerSpotsList: [],
  filteredValue: {
    genre: '',
    distance: 1000,
  },
  isEditing:false,
  spotDetail: null,
  spotMapDetail: null,
  center_spot: '',
}
const planner = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.CHANGE_FORM: {
    let form = state.formData;
    let allSelectedSpots = state.selectedSpots;
    if (action.key == 'centerData') {
      form = {centerData: action.data, methodType: {}}
      allSelectedSpots = []
    } else if(action.key == 'methodType') {
      form[action.key] = action.data;
      form.finalFormData =  {
                              tour_name: '',
                              description: '',
                              date: '',
                              status: 'public_true',
                              group: ''
                            };
      allSelectedSpots = []
    } else if(
        action.key === 'tour_name' || 
        action.key === 'description' || 
        action.key === 'status' || 
        action.key === 'date') {
      form['finalFormData'][action.key] = action.data
    } else {
      form[action.key] = action.data;  
    }
    
    return {
      ...state,
      formData: form,
      selectedSpots: allSelectedSpots
    }
  }
  case Actions.CHANGE_CITY: {
    return {
      ...state,
      selectedCity: action.val
    }
  }
  case Actions.SET_SPOTS: {
    return {
      ...state,
      spotList: action.data
    }
  }
  case Actions.SET_CENTER_SPOTS: {
    return {
      ...state, 
      centerSpotsList: action.data
    }
  }
  case Actions.SET_SELECTED_SPOTS: {
    let allSpots = state.selectedSpots
    let index
    let spotsKey = state.spotType
    if(action.key === 'gpi'){
      index = allSpots.findIndex(item => item.refbase === action.data.refbase);
    } else {
      index = allSpots.findIndex(item => item.id === action.data.id);
    }
    if (index === -1) {
      allSpots = [...allSpots, action.data]
      spotsKey = [...spotsKey, action.key]
    } else {
      allSpots.splice(index, 1)
      spotsKey.splice(index, 1)
    }
    return {
      ...state,
      selectedSpots: allSpots,
      spotType: spotsKey
    }
  }
  case Actions.SET_SPOT_DETAIL: {
    let allSpots = [...state.selectedSpots];
    let currentSpotIndex = allSpots.findIndex(item => item.id === action.data.id);
    allSpots[currentSpotIndex] = action.data;
    return {
      ...state,
      selectedSpots: allSpots
    }
  }
  case Actions.TOGGLE_FORM_LOAD: {
    return {
      ...state,
      formLoading: !state.formLoading,
      formData: initalForm,
      selectedSpots: [],
      selectedCity: '13',
      isEditing:false
    }
  }
  case Actions.SAVE_FILTER_VAL: {
    let value = {...state.filteredValue};
    value[action.key] = action.val;
    return {
      ...state,
      filteredValue: value,
    }
  }
  case Actions.RESET_FILTERS: {
    return {
      ...state,
      filteredValue: {
        genre: '',
        distance: 1000,
      }
    }
  }
  case Actions.EDIT_PLANNER_DETAILS: {
    return {
      ...state,
      formData: action.data,
      selectedSpots: [...state.selectedSpots],
      selectedCity: '13',
      isEditing: true,
      formLoading: false,
    };
  }
  case Actions.SAVE_CENTER_SPOTS: {
    return {
      ...state,
      center_spot: action.data
    }
  }
  default:
    return state;
  }
};

export default planner;