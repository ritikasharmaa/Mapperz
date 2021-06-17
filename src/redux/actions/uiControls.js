import {
	SET_ACTIVE_TAB_INDEX,
	SET_LANGUAGE,
  SET_ACTIVE_TAB,
  MODAL_VISIBLE,
} from './types';

export function setActiveTabIndex(data) {
    return {
      type: SET_ACTIVE_TAB_INDEX,
      data
    };
}

export function setLanguage(lang) {
    return {
      type: SET_LANGUAGE,
      lang
    };
}

export function setActiveTab() {
  return {
    type: SET_ACTIVE_TAB,
  };
}

export function modalVisibale(data) {
  return {
    type: MODAL_VISIBLE,
    data
  };
}

