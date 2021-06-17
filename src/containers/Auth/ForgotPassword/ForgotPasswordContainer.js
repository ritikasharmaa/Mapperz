import { connect } from 'react-redux';
import ForgotPassword from './ForgotPassword';
import { forgotPassword } from '../../../redux/api/auth'

const mapStateToProps = (state) => {
  return {
    state
  };
};

const mapDispatchtoProps = {
    forgotPassword
};


export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(ForgotPassword);