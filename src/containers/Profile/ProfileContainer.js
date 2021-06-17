import { connect } from 'react-redux';
import Profile from './Profile';
import { logout } from '../../redux/api/auth'

const mapStateToProps = (state) => {
  return {
    auth: state.auth
  };
};

const mapDispatchtoProps = {
  logout
};


export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(Profile);