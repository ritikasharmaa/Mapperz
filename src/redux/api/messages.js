import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import { 
  gettingThreadList, 
  setThreadList, 
  gettingThreadMessages, 
  setThreadMessages, 
  updateThreadMembers, 
  removeMembers, 
  updatingRole, 
  searchingChat, 
  updateRoomList, 
  creatingGroup, 
  updateThreadList, 
  setGroupDetail,
  toggleLoading, 
  removePic,
  setScheduleMessages,
  savePostMessage } from "../actions/messages";
import { removeUserProfilePic, authSuccess } from '../actions/auth'
import {mainUrl, apiUrl} from '../Constant'
import moment from 'moment'
import SyncStorage from 'sync-storage';


export const getAllThreads = (page) => {  
  var options = GenerateOptions(`chat/rooms?thread_page=${page}`, "GET", '', '', mainUrl);
  return dispatch => {
    if(page === 1) { 
      dispatch(gettingThreadList()) 
    }
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, 'thread response')
        dispatch(setThreadList(response.data, page))
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const getScheduleMessages = () => {  
  var options = GenerateOptions(`posts/scheduled`, "GET", '', '');
  return dispatch => {   
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setScheduleMessages(response.data))
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const getThreadMessages = (threadId, page) => {  
  var options = GenerateOptions(`chat/rooms/${threadId}?page=${page}`, "GET", '', '', mainUrl);
  return dispatch => {
    if(page === 1){
      dispatch(gettingThreadMessages())
    }
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "get messages")
        dispatch(setThreadMessages(response.data.messages, response.data.previous))
        return response.data.messages;
      })
      .catch(error => {
        //console.log(error, 'error')
      });
  };
};

export const sendMessages = (chat, threadId, threadObject, ownerId) => { 
  let data = new FormData();
  data.append("[chat][body]", chat.body)
  data.append("[chat][owner_id]", chat.owner_id)
  data.append("[chat][owner_type]", chat.owner_type)
  if(chat.images && chat.images.length){
    chat.images.forEach((item, index) => {
      let photoData = {
                        uri: item.path,
                        type: item.mime,
                        name: item.filename,
                      };
      data.append(`[chat][photos_attributes][${index}][main_image]`, photoData)
      data.append(`[chat][photos_attributes][${index}][owner_id]`, ownerId)
      data.append(`[chat][photos_attributes][${index}][owner_type]`, "User")
    })
  }
  var options = GenerateOptions(`chat/conversations/${threadId}/chats`, "POST", data, '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "messages response")
        threadObject.last_chat.body = chat.body;
        threadObject.last_chat.updated_at = moment()
        dispatch(updateThreadList(threadObject))
        return response.data;
      })
      .catch(error => {
        //console.log(error, 'error')
      });
  };
};

export const addUsers = (selectedUser, threadId) => { 
  let userIds = selectedUser.map(item => item.id)
  let roles = '';
  userIds.forEach(item => {
    roles += `&roles[${item}]=member`
  })
  let userIdsString = JSON.stringify(userIds)
  var options = GenerateOptions(`chat/conversations/${threadId}/participants?format=js&request_is=add&participant_ids=${userIdsString}${roles}`, "PUT", '', '', mainUrl);
  return dispatch => {
    dispatch(updateThreadMembers(selectedUser, threadId))
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const removeUsers = (threadId, selectedMember, isExit) => { 
  var options = GenerateOptions(`chat/conversations/${threadId}/participants?format=js&request_is=remove&participant_ids=[${selectedMember.id}]`, "PUT", '', '', mainUrl);
  return dispatch => {
    dispatch(removeMembers(threadId, selectedMember, isExit))
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const updateRole = (threadId, selectedMember, role) => { 
  let currentRole = `roles[${selectedMember.id}]=${role}`
  var options = GenerateOptions(`chat/conversations/${threadId}/participants?format=js&request_is=update&participant_ids=[${selectedMember.id}]&${currentRole}`, "PUT", '', '', mainUrl);
  return dispatch => {
    dispatch(updatingRole(threadId, selectedMember, role))
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const onSearchText = (threadId, text) => { 
  var options = GenerateOptions(`search/conversation?q=${text}&conversation_id=${threadId}`, "GET", '', '', mainUrl);  
  return dispatch => {
    dispatch(searchingChat(text))
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const createNewRoom = (data) => { 
  var options = GenerateOptions(`chat/conversations`, "POST", data, '', mainUrl);  
  return dispatch => {
    dispatch(creatingGroup())
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(updateRoomList(response.data))
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const editGroup = (key, threadId, name) => { 
  let data = new FormData();
  if (name === 'name'){
    data.append("[conversation][title]", key)
  } else {
    data.append("[conversation][img_url]", key)
  }
  var options = GenerateOptions(`chat/conversations/${threadId}`, "PUT", data, '', mainUrl);
  return dispatch => {
    if(name === 'name'){
      dispatch(setGroupDetail({'groupName' : key}, threadId))
    } else {
      dispatch(toggleLoading())
    }
    return MakeTheApiCall(options)
      .then(response => {
        if (name !== 'name') {
          dispatch(setGroupDetail(response.data, threadId))  
        }
        
        return response.data;
      })
      .catch(error => {
      });
  };
};

export const removeImage = (type, objectId, userObject) => { 
  var options = GenerateOptions(`api/v1/users/image?object_type=${type}&object_id=${objectId}`, "DELETE", '', '', mainUrl);  
  return dispatch => {
    if (type === 'Conversation') {
      dispatch(removePic(objectId))  
    } else {
      dispatch(removeUserProfilePic(objectId))
    }
    return MakeTheApiCall(options)
      .then(response => {
        userObject.profile_image = '';
        SyncStorage.set('userData', userObject)
        dispatch(authSuccess(userObject))
        return response.data;
      })
      .catch(error => {
      });
  };
};


export const checkinMessage = () => { 
  var options = GenerateOptions(`checkins/posts`, "GET", '', '', apiUrl);  
  return dispatch => {
    dispatch(gettingThreadList())
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(savePostMessage(response.data))
        return response.data;
      })
      .catch(error => {
      });
  };
};

