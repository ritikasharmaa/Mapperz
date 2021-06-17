import * as Actions from '../actions/types.js';
const userDetailObj ={
    user_name: '',
    user_dob_date: '',
    user_dob_month: '',
    user_dob_year: '',
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    profile_pic: '',
    type:'',
    uid:'',
    spots: ''
}

let initialState = {
  loggedIn: false, 
  userData: {},
  token: '',
  requestData: {},
  userList: [],
  loading: false,
  user_detail: userDetailObj,
  friendData: {},
  isUpdated: ''
}

const auth = (state = initialState, action) => {
  switch (action.type) {
  case Actions.TOGGLE_LOADING: {
    return {
        ...state,
        loading: !state.loading,
    }
  }
  case Actions.LOGGED_IN: {
    return {
        ...state,
        loggedIn: true,
        userData: action.data
    }
  }
  case Actions.LOGGED_OUT: {
    return {
        ...state,
        loggedIn: false
    }
  }
  case Actions.SET_PROFILE: {
    return {
      ...state,
      userData : action.data,
      loading: false
    }
  }
  case Actions.SET_TOKEN: {
    return {
      ...state,
      token: action.token
    }
  }
  case Actions.SET_FRIENDS_REQUEST: {
    return {
      ...state,
      requestData: action.data
    }
  }
  case Actions.SET_USER_LIST: {
    return {
      ...state,
      userList: action.data
    }
  }
  case Actions.REMOVE_FRIEND_REQUEST: {
    let list = JSON.parse(JSON.stringify(state.requestData));
    let reqIndex = list[action.data.type].findIndex(item => item.id === action.data.id);
    list[action.data.type].splice(reqIndex, 1)
    return {
      ...state,
      requestData: list
    }
  }
  case Actions.REMOVE_FRIEND: {
    let currentUserData = {...(state.userData)}
    currentUserData.friends = currentUserData.friends.filter(item => item.id !== action.id)
    return {
      ...state,
      userData: currentUserData
    }
  }
  case Actions.REMOVE_PROFILE_PIC: {
    let currentUserData = {...(state.userData)}
    currentUserData.profile_image = ''
    return {
      ...state,
      userData: currentUserData
    }
  }
  case Actions.USER_DETAIL: {
    let detail = {...state.user_detail};
    detail[action.key] = action.value;
    return {
      ...state,
      user_detail: detail
    }
  }

  case Actions.USER_DETAIL_CLEAR: {
    return {
      ...state,
      user_detail: userDetailObj
    }
  }

  case Actions.UPDATE_CHECKIN: {
    let userData = state.userData;
    userData.checked_in = true;
    return {
      ...state,
      userData: userData
    }
  }
  case Actions.SET_FRIEND_PROFILE: {
    return {
      ...state,
      friendData: action.data,
      loading: false
    }
  }
  case Actions.CLEAR_FRIEND_DATA: {
    return {
      ...state,
      friendData: {}
    }
  }
  case Actions.UPDATE_FRIENDS_PROFILE: {
    let friends_data = {...state.friendData};
    if (action.data === 'Sent request') {
      friends_data.friend_status = 'request_sent'
    } else if (action.data === 'deleted'){
      friends_data.friend_status = 'none'
    } else if (action.data === 'accepted'){
      friends_data.friend_status = 'friend'
    }
    return {
      ...state,
      friendData: friends_data
    }
  }
  case Actions.UPDATE_STATUS: {
    return {
      ...state,
      isUpdated: action.data.has_changes
    }
  }
  default:
    return state;
  }
};

export default auth;