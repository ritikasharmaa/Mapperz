import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import { Block, theme, Input } from 'galio-framework';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import FormatText from './FormatText'
import { connect } from 'react-redux';
import { changeLanguage } from '../../redux/api/auth'

const SelectLanguage = (props) => {

  const selectLang = (lang) => {
    props.hideModal()
    props.dispatch(changeLanguage(lang))
  }

	return(
		<View style={styles.mainCon}>
			<Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => {selectLang('en');}}>
        <Block row style={styles.menuCon}>
          <Text size={15} style={props.uiControls.lang === 'en' && styles.text}>English</Text>
        </Block>
      </Ripple>
      <Ripple rippleColor="#ccc" rippleOpacity={0.2} rippleDuration={700} onPress={() => {selectLang('ja');}}>
        <Block row style={[styles.menuCon, {borderBottomWidth: 0}]}>
          <Text size={15} style={props.uiControls.lang === 'ja' && styles.text}>日本語</Text>
        </Block>
      </Ripple>
		</View>
	)
}

const styles = StyleSheet.create({
	mainCon: {
		marginHorizontal: 15,
	},
	menuCon: {
    paddingVertical: 16, 
    alignItems: 'baseline',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center'
  },
  text: {
  	color: primaryColor,
  }
})

const mapStateToProps = (state) => ({
  uiControls: state.uiControls
});
const mapDispatchToProps = (dispatch) => ({
    dispatch
});
export default connect(mapStateToProps, mapDispatchToProps)(SelectLanguage);
