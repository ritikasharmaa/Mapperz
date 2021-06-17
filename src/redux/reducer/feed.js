import * as Actions from '../actions/types.js';
let defaultProps = {
  fetchingMapFeed: false,
  mapFeed: [],
  page: 1,
  loadingMore: false,
  endOfPosts: false,
  current_comment: {},
  scroll: false,
  post_feed_event: false
}
const feed = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.FETHCING_MAP_FEED: {
    return {
      ...state,
      fetchingMapFeed: true
    }
  }
  case Actions.SET_MAP_FEED: {
    let allPost = [...state.mapFeed]
    if (action.page === 1) {
      allPost = action.data
    } else {
      allPost = allPost.concat(action.data)  
    }
    
    return {
      ...state,
      mapFeed: allPost,
      fetchingMapFeed: false,
      loadingMore: false,
      endOfPosts: action.data.length < 10 ? true : false
    }
  }
  case Actions.UPDATE_MAP_FEED: {
    let allFeed = [...state.mapFeed];
    let index = allFeed.findIndex(item => item.id === action.data.id);
    if (action.data.postId) {
      index = allFeed.findIndex(item => item.id === action.data.postId);
      let commentIndex = allFeed[index].comments.comments.findIndex(item => item.id === action.data.id)
      allFeed[index].comments.comments[commentIndex].isLiked = !allFeed[index].comments.comments[commentIndex].isLiked

      if (allFeed[index].comments.comments[commentIndex].isLiked) {
        allFeed[index].comments.comments[commentIndex].likes = allFeed[index].comments.comments[commentIndex].likes ? allFeed[index].comments.comments[commentIndex].likes + 1 : 1;
      } else {
        allFeed[index].comments.comments[commentIndex].likes -= 1;
      }
    } else {
      allFeed[index].liked = !allFeed[index].liked;
      if (allFeed[index].liked) {
        allFeed[index].total_like += 1;
      } else {
        allFeed[index].total_like -= 1;
      }
    }

    return {
      ...state,
      mapFeed: allFeed
    }
  }
  case Actions.UPDATE_MAP_FEED_LIST: {
    let feeds = [...state.mapFeed]
    let index = feeds.findIndex(item => (item.id || item.post_id) === action.data.post_id);
    if(index === -1){
      feeds.unshift(action.data)
    }
    return {
      ...state,
      mapFeed: feeds
    }
  }

  case Actions.DELETE_FEED_POST: {
    let feedPosts = [...state.mapFeed]
    let index = feedPosts.findIndex(item => item.id === action.id)
    feedPosts.splice(index, 1)
    return {
      ...state,
      mapFeed: feedPosts
    }
  }

  case Actions.ADD_NEW_COMMENT: {
    let feedPosts = [...state.mapFeed]
    let index = feedPosts.findIndex(item => item.id === action.commentData.commented_id)
    if (feedPosts[index].comments) {
      feedPosts[index].comments.comments.push(action.data)
    } else {
      feedPosts[index].comments = {comments: [action.data]}
    }
    feedPosts[index].total_comment = feedPosts[index].total_comment ? feedPosts[index].total_comment + 1 : 1;

    return {
      ...state,
      mapFeed: feedPosts
    }
    
  }

  case Actions.SHARE_NEW_POST: {
    return {
      ...state,
      mapFeed: [action.data, ...state.mapFeed]
    }
  }
  case Actions.FETCHING_MORE_FEED: {
    return {
      ...state,
      loadingMore: true,
      page: action.page
    }
  }

  case Actions.APPEND_COMMENTS: {
    let allPost = [...state.mapFeed]
    let index = allPost.findIndex(item => item.id === action.data.postId)
    allPost[index].comments.comments = allPost[index].comments.comments.concat(action.data.data.comments)
    allPost[index].comments.previous = action.data.data.previous;
    allPost[index].currentPage = action.data.page
    return {
      ...state,
      mapFeed: allPost
    }
  }

  case Actions.DELETE_COMMENTS: {
    let allPost = [...state.mapFeed]
    let index = allPost.findIndex(item => item.id === action.data.postId)
    let commentIndex = allPost[index].comments.comments.findIndex(item => item.id === action.data.id)
    allPost[index].comments.comments.splice(commentIndex, 1)
    allPost[index].total_comment -= 1;
    return {
      ...state,
      mapFeed: allPost
    }
  }
  
  case Actions.CURRENT_COMMENT: {
    return {
      ...state,
      current_comment: action.data
    }
  }

  case Actions.ADD_NEW_REPLY: {
    let feedPosts = [...state.mapFeed]
    let index = feedPosts.findIndex(item => item.id === action.replyData.commented_id)
    let commentindex = feedPosts[index].comments.comments.findIndex(item => item.id === action.replyData.parent_comment_id)
    let currentComment = JSON.parse(JSON.stringify(feedPosts[index].comments.comments[commentindex]))

    currentComment.replies.comments.push(action.data)
    feedPosts[index].comments.comments[commentindex] = currentComment;

    feedPosts[index].total_comment = feedPosts[index].total_comment ? feedPosts[index].total_comment + 1 : 1;
    return {
      ...state,
      mapFeed: feedPosts,
      current_comment: currentComment
    }
  }
  case Actions.UPDATE_REPLY_STATUS: {
    let allFeed = [...state.mapFeed];
    let index = allFeed.findIndex(item => item.id === action.data.postId);
    let commentIndex = allFeed[index].comments.comments.findIndex(item => item.id === action.data.parentCommentId)
    let currentComment = JSON.parse(JSON.stringify(allFeed[index].comments.comments[commentIndex]))
    let replyIndex = currentComment.replies.comments.findIndex(item => item.id === action.data.id)
    
    currentComment.replies.comments[replyIndex].isLiked = !currentComment.replies.comments[replyIndex].isLiked

      if (currentComment.replies.comments[replyIndex].isLiked) {
        currentComment.replies.comments[replyIndex].likes = currentComment.replies.comments[replyIndex].likes ? currentComment.replies.comments[replyIndex].likes + 1 : 1;
      } else {
        currentComment.replies.comments[replyIndex].likes -= 1;
      }

    allFeed[index].comments.comments[commentIndex] = currentComment;

    return {
      ...state,
      mapFeed: allFeed,
      current_comment: currentComment
    }
  }
  case Actions.SET_SCROLL: {
    return {
      ...state,
      scroll: true
    }
  }
  case Actions.SET_POST_FEED_EVENT: {
    return {
      ...state,
      post_feed_event: true
    }
  }

  case Actions.SET_FALSE: {
    return {
      ...state,
      post_feed_event: false,
      scroll: false
    }
  }

  case Actions.SET_FILTERED_LIST: {
    return {
      ...state,
      mapFeed: action.data,
    }
  }

  default:
    return state;
  }
};

export default feed;