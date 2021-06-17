import * as Actions from '../actions/types.js';
let defaultProps = {
    allCategories: [],
    searchDetail: {}
}
const search = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.SET_CATEGORIES: {
    return {
      ...state,
      allCategories: action.data
    }
  }
  case Actions.SET_SEARCH_DETAIL: {
    return {
      ...state,
      searchDetail: action.data
    }
  }
  
  default:
    return state;
  }
};

export default search;