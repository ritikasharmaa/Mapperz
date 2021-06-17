import * as Actions from '../actions/types.js';
let defaultProps = {
    allActivity: [],
    isLoading: false
}
const activity = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.SET_ACTIVITY: {
    return {
        allActivity: action.data,
        isLoading: false
    }
  }
  case Actions.SET_LOADING: {
    return {
      isLoading: !state.isLoading
    }
  }
  
  default:
    return state;
  }
};

export default activity;