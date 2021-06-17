import { connect } from 'react-redux';
import Signup from './Signup';
import {getCountries} from '../../../redux/api/bussiness'
import { signup } from '../../../redux/api/auth'

const mapStateToProps = (state,dispatch) => {
  return {
    bussiness: state.bussiness,
    uiControls: state.uiControls
  };
};

const mapDispatchtoProps = {
    getCountries,
    signup
};


export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(Signup);