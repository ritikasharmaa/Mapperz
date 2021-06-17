import * as Actions from '../actions/types.js';
let defaultProps = {
  socket: '',
  checkin_users: {
    checked_in: [],
    other: []
  },
  spotMessages: [],
  checkinUser: [],
}
const bussiness = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.SET_SOCKET: {
    return {
      ...state,
      socket: action.socket
    }
  }
  case Actions.SET_CHECKIN_USERS: {
    return {
      ...state,
      checkin_users: action.data
    }
  }
  case Actions.UPDATE_CHECKIN_USER: {
    let all_checkin_users = {...state.checkin_users}
    if (action.data.message === 'not checked in') {
      return {
        ...state,
        checkin_users: all_checkin_users
      }
    }
    let index = all_checkin_users.checked_in.findIndex(item => item.id === (action.data.id || action.data.user_id))

    if (action.data.status === 'location_stop' && index !== -1) {
      all_checkin_users.checked_in.splice(index, 1)
      all_checkin_users.other.push(action.data.user)
    } else if (index !== -1) {
      let message = all_checkin_users.checked_in[index].message;
      all_checkin_users.checked_in[index] = action.data;
      if (message) {
        all_checkin_users.checked_in[index].message = message;
      }
    } else if(action.data.status !== 'location_stop') {
      let otherIndex = all_checkin_users.other.findIndex(item => item.id === (action.data.id || action.data.user_id))
      if (otherIndex !== -1) {
        all_checkin_users.other.splice(otherIndex, 1)
      }
      all_checkin_users.checked_in.push(action.data)
    }
    return {
      ...state,
      checkin_users: all_checkin_users
    }
  }
  case Actions.UPDATE_CHECKIN_USER_MESSAGE: {
    console.log(action.data, "vahdhdvhsa")
    let current_checkin_users = {...state.checkin_users}
    if (current_checkin_users.checked_in.length) {
      let index = current_checkin_users.checked_in.findIndex(item => item.id === action.data.sender_id)

      let currentCheckinUsers = current_checkin_users.checked_in[index]

      if (index !== -1) {
        current_checkin_users.checked_in.splice(index, 1)
        currentCheckinUsers.message = action.data.message; 
        currentCheckinUsers.post_id = action.data.post_id;  
      } 
      current_checkin_users.checked_in[index] = currentCheckinUsers
    }
    console.log(current_checkin_users, "current_checkin_users")
    return {
      ...state,
      checkin_users: current_checkin_users
    }
  }
  case Actions.UPDATE_SPOT_USER_MESSAGE: {
    let allSpotMessages = [...state.spotMessages]
    let index = allSpotMessages.findIndex(item => item.spot_id === action.data.spot_id)
    if (index === -1) {
      allSpotMessages.push(action.data);
    } else {
      allSpotMessages.splice(index, 1)
      allSpotMessages.push(action.data)
     // allSpotMessages[index] = action.data;
    }
    return {
      ...state,
      spotMessages: allSpotMessages
    }
  }
  case Actions.REMOVE_POPUP: {
    let allSpotMessages = [...state.spotMessages]
    let index = allSpotMessages.findIndex(item => item.post_id === action.data.post_id)
    if(index !== -1){
      allSpotMessages.splice(index, 1)
    }  

    let current_checkin_users = {...state.checkin_users}
    let indexUser = current_checkin_users.checked_in.findIndex(item => item.post_id === action.data.post_id)
    current_checkin_users.checked_in.splice(indexUser, 1)

    return {
      ...state,
      spotMessages: allSpotMessages,
      checkin_users: current_checkin_users
    }
  }
  default:
    return state;
  }
};

export default bussiness;