import {
  GETTING_THREAD_LIST,
  SET_THREAD_LIST,
  SEARCH_VALUE,
  GETTING_THREAD_MESSAGES,
  SET_THREAD_MESSAGES,
  CURRENT_THREAD_DETAIL,
  SET_FRIEND_SEARCH,
  SET_SELECTED_USERS,
  UPDATE_THREAD_MEMBERS,
  REMOVE_MEMBER,
  UPDATE_ROLE,
  SET_SEARCHING_CHAT,
  CHANGE_CONVERSATION_FORM,
  UPDATE_SELECTED_USERS,
  CLEAR_FORM,
  UPDATE_ROOM_LIST,
  CREATING_GROUP,
  UPDATING_THREAD,
  SET_GROUP_DETAIL,
  LOADING_PROFILE_PIC,
  ON_CHANGE_NAME,
  REMOVE_PICTURE,
  UPDATE_MESSAGE,
  UPDATE_THREAD_LIST,
  CLEAR_CURRENT_THREAD,
  SET_SCHEDULE_MESSAGES,
  ADD_SCHEDULE_MESSAGE,
  DELETE_SCHEDULE_MESSAGE,
  EDIT_SCHEDULE_MESSAGE,
  SAVE_POST_MESSAGE
} from './types';

export const gettingThreadList = () => {
  return {
    type: GETTING_THREAD_LIST
  };
}

export const setThreadList = (data, page) => {
  return {
    type: SET_THREAD_LIST,
    data,
    page
  };
}

export const setSearchValue = (text) => {
  return {
    type: SEARCH_VALUE,
    text
  };
}

export const gettingThreadMessages = () => {
  return {
    type: GETTING_THREAD_MESSAGES,
  };
}

export const setThreadMessages = (data, isPreviousMessage) => {
  return {
    type: SET_THREAD_MESSAGES,
    data,
    isPreviousMessage
  };
}

export const currentThreadDetail = (item) => {
  return {
    type: CURRENT_THREAD_DETAIL,
    item
  };
}

export const setFriendSearch = (text) => {
  return {
    type: SET_FRIEND_SEARCH,
    text
  };
}

export const setSelectedUsers = (item) => {
  return {
    type: SET_SELECTED_USERS,
    item
  };
}

export const updateThreadMembers = (selectedUser, threadId) => {
  return {
    type: UPDATE_THREAD_MEMBERS,
    selectedUser,
    threadId
  };
}

export const removeMembers = (threadId, selectedMember, isExit) => {
  return {
  	type: REMOVE_MEMBER,
  	threadId,
  	selectedMember,
  	isExit
  }
}

export const updatingRole = (threadId, selectedMember, role) => {
  return {
  	type: UPDATE_ROLE,
  	threadId,
  	selectedMember,
  	role
  }
}

export const searchingChat = (threadId, text) => {
  return {
  	type: SET_SEARCHING_CHAT,
  	threadId,
  	text
  }
}

export const onChangeConvesationsForm = (data, key) => {
  return {
  	type: CHANGE_CONVERSATION_FORM,
  	data,
  	key
  }
}

export const updateSelectedUsers = (data) => {
  return {
  	type: UPDATE_SELECTED_USERS,
  	data,
  }
}

export const clearFormValue = () => {
  return {
  	type: CLEAR_FORM,
  }
}

export const updateRoomList = (data) => {
  return {
  	type: UPDATE_ROOM_LIST,
  	data
  }
}

export const creatingGroup = () => {
  return {
  	type: CREATING_GROUP
  }
}

export const updateThreadList = (threadObject) => {
  return {
  	type: UPDATING_THREAD,
  	threadObject
  }
}

export const setGroupDetail = (data, threadId) => {
  return {
  	type: SET_GROUP_DETAIL,
  	data,
  	threadId
  }
}

export const toggleLoading = () => {
	return {
		type: LOADING_PROFILE_PIC
	}
}

export const onChangeText = (text) => {
	return {
		type: ON_CHANGE_NAME,
		text
	}
}

export const removePic = (threadId) => {
	return {
		type: REMOVE_PICTURE,
		threadId
	}
}

export function updateThread(data) {
  return {
    type: UPDATE_THREAD_LIST,
    data,
  };
}

export function clearCurrentThread() {
  return {
    type: CLEAR_CURRENT_THREAD,
  };
}

export function updateMessage(data) {
  return {
    type: UPDATE_MESSAGE,
    data,
  };
}

export function setScheduleMessages(data) {
  return {
    type: SET_SCHEDULE_MESSAGES,
    data,
  };
}

export function addScheduleMessage(data) {
	return {
		type: ADD_SCHEDULE_MESSAGE,
		data,
	}
}

export function deleteScheduleMsg(id) {
	return {
		type: DELETE_SCHEDULE_MESSAGE,
		id
	}
}

export function editScheduleMsg(data) {
	return {
		type: EDIT_SCHEDULE_MESSAGE,
		data
	}
}

export function savePostMessage(data) {
  return {
    type: SAVE_POST_MESSAGE,
    data
  }
}