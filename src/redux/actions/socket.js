import {
	SET_SOCKET,
	SET_CHECKIN_USERS,
	UPDATE_CHECKIN_USER,
	UPDATE_CHECKIN_USER_MESSAGE,
  UPDATE_SPOT_USER_MESSAGE,
  REMOVE_POPUP,
} from './types';

export function setSocket(socket) {
  return {
    type: SET_SOCKET,
    socket
  };
}

export function checkinUsers(data) {
  return {
    type: SET_CHECKIN_USERS,
    data
  };
}

export function updateLocation(data) {
  return {
    type: UPDATE_CHECKIN_USER,
    data
  };
}

export function updateUserCheckinMessage(data) {
  return {
    type: UPDATE_CHECKIN_USER_MESSAGE,
    data
  };
}

export function updateUserSpotMessage(data) {
  return {
    type: UPDATE_SPOT_USER_MESSAGE,
    data
  };
} 

export function removePopup(data) {
  return {
    type: REMOVE_POPUP,
    data
  };
}


