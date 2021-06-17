import {
SET_CATEGORIES,
SET_SEARCH_DETAIL
} from './types';

export function setCategories(data) {
  return {
    type: SET_CATEGORIES,
    data
  };
}

export function setSearchDetail(data) {
  return {
    type: SET_SEARCH_DETAIL,
    data
  };
}

  