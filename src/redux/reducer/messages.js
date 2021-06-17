import * as Actions from '../actions/types.js';

let defaultProps = {
  isFetching: false,
  room_list: [],
  friends_list: [],
  search_value: '',
  isMessageFetching: false,
  allMessages: [],
  current_thread_detail: {},
  friends_search: '',
  selected_users: [],
  updated_member_list: [],
  search_chat: '',
  conversation_form: {
    room_name: '',
    selected_users: [],
    message: ''
  },
  isGetting: false,
  loading: false,
  group_name: '' ,
  isMoreMessages: false,
  unread_message: false,
  schedulesMessages: [],
  spot_posts: [],
  user_posts: []

}

const messages = (state = defaultProps, action) => {
  switch (action.type) {
  case Actions.GETTING_THREAD_LIST: {
    return {
      ...state,
      isFetching: true
    }
  }
  case Actions.SET_THREAD_LIST: {
    return {
      ...state,
      room_list: action.page === 1 ? action.data.room_list : state.room_list.concat(action.data.room_list),
      friends_list: action.data.friends_list,
      isFetching: false 
    }
  }
  case Actions.SEARCH_VALUE: {
    return {
      ...state,
      search_value: action.text
    }
  }
  case Actions.GETTING_THREAD_MESSAGES: {
    return {
      ...state,
      isMessageFetching: true,
    }
  }
  case Actions.SET_THREAD_MESSAGES: {
    return {
      ...state,
      allMessages: action.data,
      isMessageFetching: false,
      isMoreMessages: action.isPreviousMessage
    }
  }
  case Actions.CURRENT_THREAD_DETAIL: {
    /*let updatedList = [...state.room_list]
    let index = updatedList.findIndex(item => item.id === action.item.id)
    console.log(action.item, "action.item")
    console.log(updatedList[index], "updatedList[index]")*/
    action.item.unreadMessage = 0
    return {
      ...state,
      current_thread_detail: action.item
    }
  }
  case Actions.SET_FRIEND_SEARCH: {
    return {
      ...state,
      friends_search: action.text
    }
  }
  case Actions.SET_SELECTED_USERS: {
    let userList = [...state.selected_users]
    let index = userList.findIndex(item => item.id === action.item.id)
    if (index === -1) {
      userList.push(action.item)
    } else {
      userList.splice(index, 1)
    }
    return {
      ...state,
      selected_users: userList,
    }
  }
  case Actions.UPDATE_THREAD_MEMBERS: {
    let allRooms = JSON.parse(JSON.stringify(state.room_list))
    let index = allRooms.findIndex(item => item.id === action.threadId)
    allRooms[index].members_list = allRooms[index].members_list.concat(action.selectedUser);

    return {
      ...state,
      current_thread_detail: allRooms[index],
      room_list: allRooms,
      selected_users: []
    }
  }
  case Actions.REMOVE_MEMBER: {
    let allRooms = JSON.parse(JSON.stringify(state.room_list))
    let index = allRooms.findIndex(item => item.id === action.threadId)
    if (action.isExit) {
      allRooms.splice(index, 1)
    } else {
      allRooms[index].members_list = allRooms[index].members_list.filter(item => item.id !== action.selectedMember.id)
    }
    return {
      ...state,
      current_thread_detail: allRooms[index],
      room_list: allRooms
    }
  }
  case Actions.UPDATE_ROLE: {
    let allRooms = JSON.parse(JSON.stringify(state.room_list))
    let index = allRooms.findIndex(item => item.id === action.threadId)
    let roleIndex = (allRooms[index].sub_admin).indexOf(action.selectedMember.id);

    if(roleIndex === -1){
      allRooms[index].sub_admin.push(action.selectedMember.id)
    } else {
      allRooms[index].sub_admin.splice(roleIndex, 1)
    }
    return {
      ...state,
      current_thread_detail: allRooms[index],
      room_list: allRooms
    }
  }
  case Actions.SET_SEARCHING_CHAT: {
    return {
      ...state,
      search_chat: action.text
    }
  }
  case Actions.CHANGE_CONVERSATION_FORM: {
    let form = {...state.conversation_form};
    form[action.key] = action.data;
    return {
      ...state,
      conversation_form: form,
      selected_users: []
    }
  }
  case Actions.UPDATE_SELECTED_USERS: {
    return {
      ...state,
      selected_users: action.data
    }
  }
  case Actions.CLEAR_FORM: {
    return {
      ...state,
      conversation_form: {
        room_name: '',
        selected_users: [],
        message: ''
      },
    }
  }
  case Actions.UPDATE_ROOM_LIST: {
    let updatedList = [...state.room_list]
    let index = updatedList.findIndex(item => item.id === action.data.id)
    updatedList.splice(index, 1)
    updatedList.unshift(action.data)
    return {
      ...state,
      room_list: updatedList,
      isGetting: false,
      conversation_form: {
        room_name: '',
        selected_users: [],
        message: ''
      },
    }
  } 
  case Actions.CREATING_GROUP: {
    return {
      ...state,
      isGetting: true,
    }
  } 
  case Actions.UPDATING_THREAD: {
    let updatedList = [...state.room_list]
    let index = updatedList.findIndex(item => item.id === action.threadObject.id)
    updatedList.splice(index, 1)
    updatedList.unshift(action.threadObject)
    return {
      ...state,
      room_list: updatedList,
    }
  } 
  case Actions.LOADING_PROFILE_PIC: {
    return {
        ...state,
        loading: !state.loading,
    }
  }
  case Actions.SET_GROUP_DETAIL: {
    let allRooms = JSON.parse(JSON.stringify(state.room_list))
    let index = allRooms.findIndex(item => item.id === action.threadId)
    if (action.data.groupName) {
      allRooms[index].title = action.data.groupName; 
    } else {
      allRooms[index] = action.data
    }
    return {
      ...state,
      current_thread_detail: allRooms[index],
      loading: false,
      room_list: allRooms
    }
  }
  case Actions.ON_CHANGE_NAME: {
    return {
      ...state,
      group_name: action.text
    }
  }
  case Actions.REMOVE_PICTURE: {
    let updatedList = [...state.room_list]
    let index = updatedList.findIndex(item => item.id === action.threadId)
    updatedList[index].image = ''
    return {
      ...state,
      current_thread_detail: updatedList[index],
    }
  }
  case Actions.UPDATE_THREAD_LIST: {
    let updatedList = [...state.room_list]
    let currentThreadId = state.current_thread_detail.id;
    let index = updatedList.findIndex(item => item.id === action.data.id)
    if(action.data.id !== currentThreadId){
      if (index !== -1) {
        action.data.unreadMessage = updatedList[index].unreadMessage ? updatedList[index].unreadMessage + 1 : 1;
      } else {
        action.data.unreadMessage = 1;     
      }
    }
    if(index !== -1){
      updatedList.splice(index, 1)
    }
    updatedList.unshift(action.data)
    return {
      ...state,
      room_list: updatedList
    }
  }
  case Actions.CLEAR_CURRENT_THREAD: {
    return {
      ...state,
      current_thread_detail: {},
      allMessages: [],
    }
  }
  case Actions.UPDATE_MESSAGE: {
    let newArray = [...state.allMessages]
    newArray.push(action.data)
    return {
      ...state,
      allMessages: newArray,
    }
  }
  case Actions.SET_SCHEDULE_MESSAGES: {
    return {
      ...state,
      schedulesMessages: action.data
    }
  }
  case Actions.ADD_SCHEDULE_MESSAGE: {
    let newScheduleMessage = [...state.schedulesMessages]
    newScheduleMessage.unshift(action.data)
    return {
      ...state,
      schedulesMessages: newScheduleMessage
    }
  }
  case Actions.DELETE_SCHEDULE_MESSAGE: {
    let newScheduleMessage = [...state.schedulesMessages]
    let index = newScheduleMessage.findIndex(item => item.id === action.id)
    newScheduleMessage.splice(index, 1)
    return {
      ...state,
      schedulesMessages: newScheduleMessage
    }
  }
  case Actions.EDIT_SCHEDULE_MESSAGE: {
    let newScheduleMessage = [...state.schedulesMessages]
    let index = newScheduleMessage.findIndex(item => item.id === action.data.id)
    newScheduleMessage[index] = action.data
    return {
      ...state,
      schedulesMessages: newScheduleMessage
    }
  }
  case Actions.SAVE_POST_MESSAGE: {
    return {
      ...state,
      spot_posts: action.data.spot_posts,
      user_posts: action.data.user_posts,
      isFetching: false
    }
  }

  default:
    return state;
  }
}
  

export default messages;