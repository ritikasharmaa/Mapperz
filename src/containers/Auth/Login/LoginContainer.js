import { connect } from 'react-redux';
import Login from './Login';
import { authSuccess } from '../../../redux/actions/auth';
import { getFriendsRequestList, login } from '../../../redux/api/auth'
import {
  getSpecificMapDetail,
  getAllMaps,
  getCheckins,
} from "../../../redux/api/map";
import { getMapFeed } from '../../../redux/api/feed';
const mapStateToProps = (state) => {
  return {
    auth: state.auth,
    uiControls: state.uiControls
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProfile: (data) => dispatch(getProfile(data)),
    getSpecificMapDetail: (data) => dispatch(getSpecificMapDetail(data)),
    getFriendsRequestList: () => dispatch(getFriendsRequestList()),
    getAllMaps: () => dispatch(getAllMaps()),
    getMapFeed: (value) => dispatch(getMapFeed(value)),
    getCheckins: () => dispatch(getCheckins()),
    setToken: (token) => dispatch(setToken(token)),
    authSuccess: (data) => dispatch(authSuccess(data)),
    setLanguage: (data) => dispatch(setLanguage(data)),
    login:(data)=>dispatch(login(data))
  }
}


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);