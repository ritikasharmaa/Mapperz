import {
  FETHCING_MAP_FEED,
  SET_MAP_FEED,
  UPDATE_MAP_FEED,
  UPDATE_MAP_FEED_LIST,
  DELETE_FEED_POST,
  ADD_NEW_COMMENT,
  SHARE_NEW_POST,
  FETCHING_MORE_FEED,
  APPEND_COMMENTS,
  DELETE_COMMENTS,
  CURRENT_COMMENT,
  ADD_NEW_REPLY,
  UPDATE_REPLY_STATUS,
  SET_SCROLL,
  SET_POST_FEED_EVENT,
  SET_FALSE,
  SET_FILTERED_LIST
} from './types';

export function setMapFeed(data, page) {
    return {
      type: SET_MAP_FEED,
      data,
      page
    };
}

export function fetchingMapsFeed() {
    return {
      type: FETHCING_MAP_FEED
    };
}

export function updateFeed(data) {
    return {
      type: UPDATE_MAP_FEED,
      data
    };
}

export function updateFeedList(data) {
    return {
      type: UPDATE_MAP_FEED_LIST,
      data
    };
}

export function deleteFeedpost(id) {
    return {
      type: DELETE_FEED_POST,
      id
    };
}

export function addNewComment(data, commentData) {
    return {
      type: ADD_NEW_COMMENT,
      data,
      commentData
    };
}

export function sharedNewPost(data) {
    return {
      type: SHARE_NEW_POST,
      data
    };
}

export function fetchingMoreFeed(page) {
    return {
      type: FETCHING_MORE_FEED,
      page
    };
}

export function appendNewComments(data) {
    return {
      type: APPEND_COMMENTS,
      data
    };
}

export function deleteComment(data) {
    return {
      type: DELETE_COMMENTS,
      data
    };
}

export function setCurrentComment(data) {
    return {
      type: CURRENT_COMMENT,
      data
    };
}

export function addNewReply(data, replyData) {
  return {
      type: ADD_NEW_REPLY,
      data, 
      replyData
    };
}

export function updateReplyStatus(data) {
  return {
    type: UPDATE_REPLY_STATUS,
    data
  }
}

export function setScroll() {
  return {
    type: SET_SCROLL,
  }
}

export function setPostFeedEvent() {
  return {
    type: SET_POST_FEED_EVENT,
  }
}

export function setFalse() {
  return {
    type: SET_FALSE,
  }
}

export function setFilteredList(data) {
  return {
    type: SET_FILTERED_LIST,
    data
  }
}
