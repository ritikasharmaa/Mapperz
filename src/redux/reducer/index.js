import {combineReducers} from 'redux';
import auth from './auth.js';
import bussiness from './bussiness.js'
import uiControls from './uiControls.js';
import search from './search.js';
import activity from './activity.js'
import planner from './planner.js'
import map from './map.js'
import messages from './messages.js'
import feed from './feed.js'
import socket from './socket.js'
import notifications from './notifications.js'

export default combineReducers({
  auth,
  bussiness,
  uiControls,
  search,
  activity,
  planner,
  map,
  messages,
  feed,
  socket,
  notifications,
});