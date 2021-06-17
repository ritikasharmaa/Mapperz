import { connect } from 'react-redux';
import Home from './index';
import { getProfile, getFriendsRequestList } from '../../redux/api/auth'
import { getSpecificMapDetail, getAllMaps, getNearestSpots, addSpotToFav, getCheckins, removeToFav, DeleteMap, getSuggestedSpot, updatingSuggestion, getSpotMessage, updateHomemap } from '../../redux/api/map'
import { setSpotDetail, onSearchSpots, onFilterSpots, setCenterCord, setPageCount, saveMapMarkerId, setMapDetail, setMaps, favIconIsOpen, hideOverlay, sliderClose, sliderOpen, setClickCount} from '../../redux/actions/map'
import { getMapFeed, searchPost } from '../../redux/api/feed'
import { editPlannerDetail } from "../../redux/actions/planner";
import { setActiveTabIndex, modalVisibale } from '../../redux/actions/uiControls';

const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    map: state.map,
    socket: state.socket,
    planner: state.planner,
    feed: state.feed,
    uiControls: state.uiControls
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfile:(data)=>dispatch(getProfile(data)),
    getFriendsRequestList:() => dispatch(getFriendsRequestList()),
    getSpecificMapDetail: (data) => dispatch(getSpecificMapDetail(data)),
    getAllMaps: () => dispatch(getAllMaps()),
    setSpotDetail:(data) => dispatch(setSpotDetail(data)),
    onSearchSpots:(text) => dispatch(onSearchSpots(text)),
    onFilterSpots:(value) => dispatch(onFilterSpots(value)),
    getMapFeed:(value) => dispatch(getMapFeed(value)),
    getNearestSpots:(id, lat, lng, googleSpot, val) => dispatch(getNearestSpots(id, lat, lng, googleSpot, val)),
    addSpotToFav:(data) => dispatch(addSpotToFav(data)),
    setCenterCord:(data) => dispatch(setCenterCord(data)),
    setPageCount: (value) =>dispatch(setPageCount(value)),
    getCheckins: () => dispatch(getCheckins()),
    saveMapMarkerId: (id) => dispatch(saveMapMarkerId(id)),
    removeToFav:(data) => dispatch(removeToFav(data)),
    DeleteMap:(data) => dispatch(DeleteMap(data)),
    getSuggestedSpot:(id) => dispatch(getSuggestedSpot(id)),
    updatingSuggestion: (id, key) => dispatch(updatingSuggestion(id, key)),
    getSpotMessage: (id) => dispatch(getSpotMessage(id)),
    setMapDetail : (data) => dispatch(setMapDetail(data)),
    setMaps: (data) => dispatch(setMaps(data)),
    searchPost: (text, threadId, threadtype) => dispatch(searchPost(text, threadId, threadtype)),
    favIconIsOpen: () => dispatch(favIconIsOpen()),
    hideOverlay: () => dispatch(hideOverlay()),
    editPlannerDetail: (data) => dispatch(editPlannerDetail(data)),
    updateHomemap: (id) => dispatch(updateHomemap(id)),
    setActiveTabIndex : (data) => dispatch(setActiveTabIndex(data)),
    sliderOpen: () => dispatch(sliderOpen()),
    sliderClose: () => dispatch(sliderClose()),
    modalVisibale: (status) => dispatch(modalVisibale(status)),
    setClickCount: () => dispatch(setClickCount()),
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);