import * as Actions from '../actions/types';
let defaultProps = {
  notifications: [],
  isLoading: false,
  count: 0,
}
const notifications = (state = defaultProps, action) => {
  switch (action.type) {
    case Actions.SET_NOTIFICATION: {
      return {
      	...state,
        notifications: action.page === 1 ? action.data : state.notifications.concat(action.data),
        isLoading: false,
        count: 0
      }
    }
    case Actions.SET_LOADING_N: {
      return {
        ...state,
        isLoading: true
      }
    }
    case Actions.SET_COUNT: {
      return {
        ...state,
        count: state.count + 1,        
      }
    }
    case Actions.UPDATE_NOTIFICATION: {
      let data = [...state.notifications]
      data.unshift(action.data)
      return {
        ...state,
        notifications: data,
      }
    }
    default:
    return state;
  }
};

export default notifications;