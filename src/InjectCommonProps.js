import React, {useEffect} from 'react';
import {View} from 'react-native';
import {
  setCustomText,
} from 'react-native-global-props';
import { connect } from 'react-redux';


const InjectCommonProps = (props) => {
	useEffect(() => {
		const customTextProps = {
		  style: {
		    fontFamily: ((Platform.OS === 'ios') && (props.uiControls.lang === 'ja')) ? 'HiraMaruProN-W4' : 'Roboto',
		  }
		}
		setCustomText(customTextProps);
	}, [props.uiControls.lang])
	return <View></View>
}

const mapStateToProps = (state) => ({
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch,
});

export default connect(mapStateToProps, mapDispatchToProps)(InjectCommonProps);