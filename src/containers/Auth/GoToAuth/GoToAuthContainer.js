import { connect } from 'react-redux';
import GoToAuth from './GoToAuth';

const mapStateToProps = (state) => {
  return {
    uiControls: state.uiControls
  };
};

const mapDispatchtoProps = {
    
};

export default connect(
  mapStateToProps,
  mapDispatchtoProps
)(GoToAuth);
