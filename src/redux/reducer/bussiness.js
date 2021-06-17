import * as Actions from '../actions/types.js';
let defaultProps = {
  allCountries: []
}
const bussiness = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.GET_COUNTRIES: {
    return {
        allCountries: action.data
    }
  }
  
  default:
    return state;
  }
};

export default bussiness;