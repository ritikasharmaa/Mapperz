import {
  SET_NOTIFICATION,
  SET_LOADING_N,
  SET_COUNT,
  UPDATE_NOTIFICATION
} from './types';

export const setNotification = (data, page) => {
  return {
    type: SET_NOTIFICATION,
    data,
    page
  };
}

export const setloading = () => {
	return {
		type: SET_LOADING_N
	}
}

export const notificationCount = () => {
	return {
		type: SET_COUNT,
	}
}

export const updateNotification = (data) => {
	return {
		type: UPDATE_NOTIFICATION,
		data
	}
}