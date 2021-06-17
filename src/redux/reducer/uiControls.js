import * as Actions from '../actions/types';

const uiControls = (state = {activeTabIndex: 1, lang: 'en', modalVisible: '', globe: false, chat: false}, action) => {
  switch (action.type) {
    case Actions.SET_ACTIVE_TAB_INDEX: {
      return {
      	...state,
        activeTabIndex: action.data
      }
    }
    case Actions.SET_LANGUAGE: {
    	return {
    		...state,
    		lang: action.lang
    	}
    }
    case Actions.SET_ACTIVE_TAB: {
    	let activeTab = state.activeTabIndex
    	return {
    		...state,
    		activeTabIndex: 1
    	}
    }
    case Actions.MODAL_VISIBLE: {
      return {
        ...state,
        modalVisible: action.data
      }
    }
    default:
    return state;
  }
};

export default uiControls;