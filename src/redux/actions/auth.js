import {
  LOGGED_IN,
  LOGGED_OUT,
  SET_PROFILE,
  SET_TOKEN,
  SET_FRIENDS_REQUEST,
  SET_USER_LIST,
  REMOVE_FRIEND_REQUEST,
  REMOVE_FRIEND,
  TOGGLE_LOADING,
  REMOVE_PROFILE_PIC,
  USER_DETAIL,
  USER_DETAIL_CLEAR,
  UPDATE_CHECKIN,
  SET_FRIEND_PROFILE,
  CLEAR_FRIEND_DATA,
  UPDATE_FRIENDS_PROFILE,
  SET_USER_LOCATION,
  UPDATE_STATUS
} from './types';

export const authSuccess = (data) => {
  return {
    type: LOGGED_IN,
    data
  };
}

export const setToken = (token) => {
  return {
    type: SET_TOKEN,
    token: token
  };
}

export const logoutAction = () => {
  return {
    type: LOGGED_OUT
  };
}

export const setProfile = (data) => {
	return {
		type: SET_PROFILE,
		data
	}
}

export const setFriendsRequest = (data) => {
	return {
		type: SET_FRIENDS_REQUEST,
		data
	}
}

export const setUserList = (data) => {
	return {
		type: SET_USER_LIST,
		data
	}
}

export const removeFriendRequest = (data) => {
	return {
		type: REMOVE_FRIEND_REQUEST,
		data
	}
}

export const removeFriend = (id) => {
	return {
		type: REMOVE_FRIEND,
		id
	}
}

export const toggleLoading = () => {
	return {
		type: TOGGLE_LOADING
	}
}

export const removeUserProfilePic = () => {
	return {
		type: REMOVE_PROFILE_PIC
	}
}

export const userDetail = (value, key) => {
	return {
		type: USER_DETAIL,
		value,
		key
	}
}

export const clearUserDetail = (value, key) => {
	return {
		type: USER_DETAIL_CLEAR,
		value,
		key
	}
}

export function updateUserCheckin() {
    return {
      type: UPDATE_CHECKIN
    };
}

export function setFriendProfile(data) {
	return {
      type: SET_FRIEND_PROFILE,
      data
    };
}

export function clearFriendProfile() {
	return {
		type: CLEAR_FRIEND_DATA,
	}
}

export function updateFriendsStatus(data) {
	return {
		type: UPDATE_FRIENDS_PROFILE,
		data
	}
}
export function setUserDetail (data) {
	return {
		type: SET_USER_LOCATION, 
		data
	}
}
export function updateStatus(data) {
	return {
		type: UPDATE_STATUS,
		data
	}
}