import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import SyncStorage from 'sync-storage';
import { authSuccess, toggleLoading, setToken, setFriendsRequest, setUserList, removeFriendRequest, removeFriend, setProfile, setFriendProfile, clearFriendProfile, updateFriendsStatus, setUserDetail, logoutAction, updateStatus } from '../actions/auth'
import { setMapDetail } from '../actions/map'
import {mainUrl, apiUrl} from '../Constant'
import { setLanguage, setActiveTab, modalVisibale } from '../actions/uiControls'
import { objectToFormData } from '../Utility'


export const checkLogin = (data) => {  
  //console.log(data,'data')
  var options = GenerateOptions(`registrations/check_user?email=${data.email}`, "GET");
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, 'login response')
        return response;
      })
      .catch(error => {
        //console.log(error, 'error')
        return error.response;
      });
  };
};

export const logout = (data, dispatch) => {  
  let token = SyncStorage.get('token')
  let options = GenerateOptions(`sessions/${token}`, "DELETE");
  return dispatch => {
    dispatch(setActiveTab())
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(logoutAction())
        //console.log(response, "resss")
        SyncStorage.remove('token')
        SyncStorage.remove('userData')
        SyncStorage.remove('credentials')
        SyncStorage.remove('mapData')
        dispatch(modalVisibale(''))
        //dispatch(setToken(''))
        //dispatch(authSuccess({}))
        return response.data
      })
      .catch(error => {
        SyncStorage.remove('token')
        SyncStorage.remove('userData')
        dispatch(setToken(''))
        //console.log(error, 'test')
        return error.response.data;
      });
  };
};


export const login = (data) => {  
  let token = SyncStorage.get('deviceToken')
  let options  
  if (!data.social_login) {
    options = GenerateOptions(`sessions?[session][email]=${data.email}&[session][device_token]=${token}&[session][password]=${data.password}&[session][mobile_user_agent]=${data.mobile_user_agent}`, "POST");
  } else{
    options = GenerateOptions(`sessions?[session][email]=${data.email}&[session][device_token]=${token}&social_login=${true}&[session][uid]=${data.uid}&[session][provider]=${data.type}`, "POST");
  }

  let newOptions = {
    method: options.method,
      url: options.url
  }

  return dispatch => {
    return MakeTheApiCall(newOptions).then(response => {
        //console.log(response, 'login response')
        if (response.data.id) {
          dispatch(setLanguage(response.data.default_locale))
          SyncStorage.set('token', response.data.token)
          SyncStorage.set('userData', response.data)
          SyncStorage.set('provider', response.data.provider)
          SyncStorage.set('credentials', {email: data.email, password: data.password})
          dispatch(authSuccess(response.data))
          dispatch(setToken(response.data.token))
          //dispatch(setLanguage(response.data.default_locale))
        }
        return response.data;
      })
      .catch(error => {
        //console.log(error, 'error')
        return error.response.data;
      });
  };
};

export const signup = (data, social_login) => { 
  let token = SyncStorage.get('deviceToken')
  let DOB = data.user_dob_date + '/' + data.user_dob_month + '/' + data.user_dob_year
  let userData = new FormData()
    userData.append('[user][nick_name]', data.user_name)
    if (data.user_dob_date) {
      userData.append('[user][birthday]', DOB)
    }
    userData.append('[user][email]', data.email)
    if (data.first_name) {
      userData.append('[user][first_name]', data.first_name)
    }
    if (data.last_name) {
      userData.append('[user][last_name]', data.last_name)
    }
    userData.append('[user][terms]', true)
    userData.append('[user][status]', 'signed_up')
    userData.append('[user][default_locale]', 'ja')
    if (data.mobile_user_agent) {
      userData.append('[user][mobile_user_agent]', data.mobile_user_agent)
    }
    userData.append('[user][latitude]', data.latitude)
    userData.append('[user][longitude]', data.longitude)
    userData.append('[user][device_token]', token)
    if(data.password){
      userData.append('[user][password]', data.password)
    }
    if(data.profile_pic){
      userData.append('[user][profile_image]', data.profile_pic)
    }
    if(social_login){
      userData.append('[user][social_login]', true)
      userData.append('[user][provider]', data.type)
      userData.append('[user][uid]', data.uid)
    }
    if(data.spots){
      console.log(data.spots, "spots....")      
      data.spots.forEach((item, index) => {
        userData.append(`[user][favorites_attributes][${index}][owner_type]`, 'User')
        userData.append(`[user][favorites_attributes][${index}][target_type]`, 'Spot')
        //userData.append(`[user][favorites_attributes][${index}][owner_id]`, 'nil')
        userData.append(`[user][favorites_attributes][${index}][target_id]`, item.id)
      });      
    }

  var options = GenerateOptions(`registrations?locale=en`, "POST", userData, '');
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "response....")
        if (response.data.email === ["has already been taken"]){
          alert('User is already Registered with Mapperz')
        }
        let credentialData = {email: data.email || '', password: data.password || ''}
        if(social_login) {
          credentialData.nick_name = data.user_name || ''
          credentialData.profile_image = data.profile_image || ''
          credentialData.latitude = data.latitude || ''
          credentialData.longitude = data.longitude || ''
        }
          if (response.data.id) {
            SyncStorage.set('token', response.data.token)
            SyncStorage.set('userData', response.data)
            SyncStorage.set('credentials', credentialData)
            dispatch(authSuccess(response.data))
            dispatch(setToken(response.data.token))
            //dispatch(setLanguage(response.data.default_locale))
          }
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        return error.response.data;
      });
  };
};

export const getProfile = (id) => {  
  let token = SyncStorage.get('token');
  let userData = SyncStorage.get('userData');
  let apiId = id ? id : userData.id;
  var options = GenerateOptions(`users/${apiId}`, "GET");
  return dispatch => {
    if (id) {
      dispatch(clearFriendProfile())
    }
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, "resProfile")
        if(id){
          dispatch(setFriendProfile(response.data))
        } else {
          //SyncStorage.set('userData', response.data)
          dispatch(setProfile(response.data))
        }
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const saveProfile = (data) => {  
  let apiData = {
                  first_name: data.first_name, 
                  last_name: data.last_name,
                  nick_name: data.nick_name,
                  email: data.email,
                  phone: data.phone,
                  birthday: data.birthday,
                  gender: data.gender
                }
  let token = SyncStorage.get('token')
  var options = GenerateOptions(`registrations/${token}`, "PUT", {user: apiData});
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
          //console.log(response, "res..")
          SyncStorage.set('userData', response.data)
          dispatch(setProfile(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const getFriendsRequestList = () => {  
  
  var options = GenerateOptions(`social/friend_requests`, "GET", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "friend list")
        dispatch(setFriendsRequest(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const findUserList = (text) => {  
  var options = GenerateOptions(`search/users?q[first_name_or_last_name_or_nick_name_or_email_cont]=${text}&exclude_friends=true`, "GET", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setUserList(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const sendFriendRequest = (id) => {  
  var options = GenerateOptions(`social/friend_requests?friend_id=${id}`, "POST", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "response")
        dispatch(updateFriendsStatus(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
      });
  };
};

export const cancelFriendRequest = (id, type) => {  
  var options = GenerateOptions(`social/friend_requests/${id}`, "DELETE", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "cancel req")
        dispatch(updateFriendsStatus(response.data))
        //dispatch(removeFriendRequest({id: id, type: type}))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const acceptFriendRequest = (id, type) => {
  var options = GenerateOptions(`social/friend_requests/${id}?accept=${type}`, "PUT", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "req status")
        dispatch(updateFriendsStatus(response.data))
        //dispatch(removeFriendRequest({id: id, type: type}))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const deleteFriend = (id) => {
  var options = GenerateOptions(`social/friendships/${id}`, "DELETE", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)      
      .then(response => {
        //dispatch(removeFriend(id))
        //console.log(response, "delete")
        dispatch(updateFriendsStatus(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const changePassword = (form) => {
  let token = SyncStorage.get('token')
  var options = GenerateOptions(`registrations/${token}`, "PUT", {user: form});
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        return response.data
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const sendInitation = (form) => {
  // let data = new FormData()
  // data.append("[user][email]", form.email);
  // data.append("[user][nick_name]", form.nick_name);
  // data.append("[user][message]", form.message);

  let data = {user : {email: form.email, nick_name: form.nick_name, message: form.message}}

  var options = GenerateOptions(`invitations/`, "POST", data);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, 'response')
        if (response.data.email = ["has already been taken"]){
          alert('Email is already Registered with Mapperz')
        }
        //dispatch(removeFriend(id))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const changeLanguage = (lang) => {
  let apiData = {
                  default_locale: lang
                }
  let token = SyncStorage.get('token')
  var options = GenerateOptions(`registrations/${token}`, "PUT", {user: apiData});
  return dispatch => {
    dispatch(setLanguage(lang))
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, 'tets tatat')
        SyncStorage.set('userData', response.data)
        dispatch(setProfile(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const uploadProfilePic = (pic) => {
  var data = new FormData();
  data.append("[user][profile_image]", pic);
  let token = SyncStorage.get('token')
  var options = GenerateOptions(`registrations/${token}`, "PUT", data, '');
  return dispatch => {
    dispatch(toggleLoading())
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, "Res")
        SyncStorage.set('userData', response.data)
        dispatch(setProfile(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const forgotPassword = (email) => {
  var options = GenerateOptions(`users/password`, "POST", {user: email}, '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "res")
        return response.data
      })
      .catch(error => {
        //console.log(error, "error")
        //return error.response.data;
      });
  };
};
export const searchUserDetail = (text) => {  
  var options = GenerateOptions(`registrations/address?address=${text}`, "GET", '', '', apiUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "res")
        dispatch(setUserDetail(response.data))
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error')
        //return error.response.data;
      });
  };
};

export const isUpdated = () => {
  let mapData = SyncStorage.get('mapData')
  var options = GenerateOptions(`mappers/${mapData.id}/updates?updated_at=${mapData.updated_at}`, "GET", '', '', apiUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, "res ...")
        // dispatch(updateStatus(response.data))
        // if(!response.data.has_changes){
        //   dispatch(setMapDetail(mapData))
        // }        
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error ...')
        //return error.response.data;
      });
  };
}

export const getFacebookFriends = () => {
  var options = GenerateOptions(`user/friendships/facebook`, "GET", '', '', apiUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response.data, "rgetFacebookFriends")      
        return response.data
      })
      .catch(error => {
        //console.log(error, 'error ...')
      });
  }; 
}