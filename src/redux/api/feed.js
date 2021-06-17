import MakeTheApiCall, { GenerateOptions } from "./ApiCalls";
import {
  fetchingMapsFeed,
  setMapFeed,
  updateFeed,
  updateFeedList,
  deleteFeedpost,
  addNewComment,
  addNewReply,
  sharedNewPost,
  fetchingMoreFeed,
  appendNewComments,
  deleteComment, 
  updateReplyStatus,
  setFilteredList} from "../actions/feed";
import { fetchingAllMaps } from "../actions/map"
import SyncStorage from 'sync-storage';
import { objectToFormData } from '../Utility';
import {apiUrl, mainUrl} from '../Constant';
import { updateUserCheckin } from '../actions/auth'
import { addScheduleMessage, deleteScheduleMsg, editScheduleMsg } from "../actions/messages";

export const getMapFeed = (id, pageNo) => {
  let page = pageNo ? pageNo : 1;
  var options = GenerateOptions(`mappers/feed/${id}?page=${page}`, "GET");
  return (dispatch) => {
    if (pageNo) {
      dispatch(fetchingMoreFeed(pageNo))
    } else {
      dispatch(fetchingMapsFeed());  
    }
    
    return MakeTheApiCall(options)
      .then((response) => {
        //console.log(response, "feed res")
        dispatch(setMapFeed(response.data, page));
        return response.data;
      })
      .catch((error) => {
        //console.log(error, "error 123");
      });
  };
};

export const doLike = (id, status, postId, parentCommentId) => {
  let token = SyncStorage.get("token");
  let data = {
    format: "json",
    like: {
      likeable_type: "Post",
      likeable_id: id,
    },
    token: token,
  };
  if (postId) {
    data.like.likeable_type = 'Comment'
  }
  var options;
  if (status) {
    data = { like: { likeable_type: "Post", likeable_id: id } };
    options = GenerateOptions(`likes/remove`, "DELETE", data);
  } else {
    options = GenerateOptions(`likes`, "POST", data);
  }
  return (dispatch) => {
    if(parentCommentId){
      dispatch(updateReplyStatus({ id: id, postId, parentCommentId}));
    } else {
      dispatch(updateFeed({ toggleLike: true, id: id, postId }));
    }
    return MakeTheApiCall(options)
      .then((response) => {
        //console.log(response, "response")
        return response.data;
      })
      .catch((error) => {
        //console.log(error, "error 123");
        //return error.response.data;
      });
  };
};

export const postApiPosts = (inputValue, imageArr, threadId, ownerId, mapType, checkinData, threadType) => {
  let filterImages = imageArr.map((item) => {
    return {
      uri: item.path,
      type: item.mime,
      name: item.filename, 
    };
  });

  let formData = new FormData();
  if (filterImages.length) {
    filterImages.forEach((item, index) => {
      formData.append(`[post][photos_attributes][${index}][main_image]`, item);
      formData.append(`[post][photos_attributes][${index}][owner_id]`, ownerId);
      formData.append(`[post][photos_attributes][${index}][owner_type]`,"User");
    });
  }
  formData.append("[post][content]", inputValue);
  formData.append("[post][thread_id]", threadId);
  formData.append("[post][thread_type]", threadType ? threadType : "Mapper");
  formData.append("[post][user_id]", ownerId);
  //formData.append("[post][owner_type]", "User");

  if (mapType) {
    formData.append("[post][map_type]", mapType);
  }

  if (checkinData && checkinData.lets_checkin) {
    formData.append("[post][lets_checkin]", true);
    formData.append("[post][latitude]", checkinData.latitude);
    formData.append("[post][longitude]", checkinData.longitude);
    if(inputValue){
      formData.append("[post][for_popup]", true)
    }
  }

  if (checkinData && checkinData.schedule_message) {
    formData.append("[post][start_at]", checkinData.time);
    formData.append("[post][repetition]", /*'minutely'*/checkinData.repitition);
  }

  var options = GenerateOptions(`posts`, "POST", formData, "", apiUrl);
  return (dispatch) => {
    //dispatch(fetchingAllMaps())
    return MakeTheApiCall(options)
      .then((response) => {
        //console.log(response, 'test')
        if (response.data.posts) {
          alert(response.data.posts)
          return {status: 'error', message: response.data.posts[0]}
        } else if (response.data && !response.data.for_popup && !response.data.spot_popup) {
          let postData = response.data;
          //postData.message = inputValue;
          postData.post_owner = true;
          postData.total_like = 0;
          postData.total_comment = 0;
          postData.total_share = 0;
          dispatch(updateFeedList(postData))
        } else if (response.data.for_popup && checkinData && checkinData.lets_checkin) {
          dispatch(updateUserCheckin())
        } else if (response.data.spot_popup) {
          dispatch(addScheduleMessage(response.data))
        }

        return response.data;
      })
      .catch((error) => {
        //console.log(error, "error");
        return error.response
      });
  };
};

export const updatePost = (inputValue, imageArr, threadId, ownerId, mapType, checkinData, threadType, id) => {
  let formData = new FormData();
  formData.append("[post][start_at]", checkinData.time);
  formData.append("[post][content]", inputValue);
  formData.append("[post][repetition]", checkinData.repitition);
  formData.append("[post][thread_id]", threadId);
  formData.append("[post][thread_type]", threadType ? threadType : "Mapper");
  formData.append("[post][user_id]", ownerId);

  var options = GenerateOptions(`posts/${id}`, "PUT", formData, "", apiUrl);
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then(response => {
        //console.log(response, "editpost")
        dispatch(editScheduleMsg(response.data))
        return response.data;
      })
      .catch(error => {
        //console.log(error, 'error 123')
      });
  };
}

export const deletePost = (id, key) => {
  var options = GenerateOptions(`posts/${id}`, "DELETE", "", "", apiUrl);
  return (dispatch) => {
    if(key === 'delete'){
      dispatch(deleteScheduleMsg(id))
    } else {
      dispatch(deleteFeedpost(id));
    }
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch(error => {
        //return error.response.data;
      });
  };
};

export const addComment = (data, isReply) => {  
  var options = GenerateOptions(`comments`, "POST", {comment: data}, '', apiUrl);
  return dispatch => {
    //dispatch(deleteFeedpost(id))
    return MakeTheApiCall(options)
      .then(response => {
        if(isReply){
          dispatch(addNewReply(response.data, data))
        } else {
          response.data.replies = {comments: []}
          dispatch(addNewComment(response.data, data))
        }
        return response.data;
      })
      .catch((error) => {
        //return error.response.data;
      });
  };
};

export const getSharePost = (sharedId, threadId, inputValue, key) => {
  let data
  if(key){
    data = new FormData();
    data.append("[post][shared_type]", "Mapper");
    data.append("[post][[shared_id]", sharedId);
    data.append("[post][thread_id]", threadId);
    data.append("[post][thread_type]", "User");
    data.append("[post][content]", inputValue);
  } else {
    data = {
      post: {
        shared_id: sharedId,
        shared_type: key ? "Mapper" : "Post",
        thread_id: threadId,
        thread_type: key ? "User" : "Mapper", 
        content: inputValue,
        // user_id: 11           
      },
    };
  }

  var options = GenerateOptions(`posts/share`, "POST", data, apiUrl);
  return (dispatch) => {
    return MakeTheApiCall(options)
      .then((response) => {
        if(key === undefined){
          dispatch(sharedNewPost(response.data))
        }       
        return response.data;
      })
      .catch((error) => {
        //return error.response.data;
      });
  };
};

export const loadComments = (page, id, type) => {  
  let data = {page: page, object_id: id, object_type: type};
  var options = GenerateOptions(`comments`, "GET", data, '', apiUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(appendNewComments({data: response.data, postId: id, page: page}))
        return response.data;
      })
      .catch((error) => {
        //return error.response.data;
      });
  };
};

export const deleteCommentApi = (id, postId) => {  
  var options = GenerateOptions(`comments/${id}`, "DELETE", '', '', apiUrl);
  return dispatch => {
    dispatch(deleteComment({postId: postId, id: id}))
    return MakeTheApiCall(options)
      .then(response => {
        return response.data;
      })
      .catch((error) => {
        //return error.response.data;
      });
  };
};

export const searchPost = (text, threadId, threadtype) => {
  text = text.trim()
  var options = GenerateOptions(`search/thread?thread_id=${threadId}&thread_type=${threadtype}&q[user_first_name_or_user_last_name_or_user_nick_name_or_user_email_or_content_cont]=${text}`, "GET", '', '', mainUrl);
  return dispatch => {
    return MakeTheApiCall(options)
      .then(response => {
        dispatch(setFilteredList(response.data))
        return response.data;
      })
      .catch((error) => {
      });
  };
}
