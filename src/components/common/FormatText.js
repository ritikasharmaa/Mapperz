import React from 'react';
import textResource from '../../assets/textResource'
import { connect } from 'react-redux';

const FormatText = (props) => {
	return (
		<>
			{textResource[`${props.variable}.${props.uiControls.lang}`]}
		</>
	)
  
}


const mapStateToProps = (state) => ({
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(FormatText); 


  