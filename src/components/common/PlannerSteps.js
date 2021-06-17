import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Animated,
} from 'react-native';

import {
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {connect} from 'react-redux';
import { Icon, Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import FormatText from './FormatText'
import { convertText } from '../../redux/Utility'

const { width, height } = Dimensions.get('screen');

const PlannerSteps = (props) => {

  let lang = props.uiControls.lang
  
  const isDisabledNext = () => {
    if ( props.currentStep === 0 && !Object.keys(props.plannerData.centerData).length ) {
      return true
    } else if( props.currentStep === 1 && !Object.keys(props.plannerData.methodType).length) {
      return true
    } else if( props.currentStep === 2 && !props.selectedSpots.length ) {
      return true
    }
    return false
  }

  const renderStepTitle = () => {
   switch(props.currentStep){
      case (0): 
        return convertText('planner.setting_center_of', lang)
      break;
      case (1): 
        return convertText('planner.setting_center_of', lang) 
        break;
      case (2): 
        return convertText('planner.setting_center_of', lang) 
        break;
      case (3): 
        return convertText('planner.setting_center_of', lang) 
        break;
      default:
        'test'

    }
  }
  return (
  	<View style={styles.stepsCon}>
      <View style={styles.bar}>
      	{Array.from(Array(props.steps), (e, i) => {
			    return <View style={styles.step} key={i}>
					          <View style={[styles.line, (i >= props.currentStep) && {backgroundColor: '#eee'}]}></View>
					          <View style={[styles.circle, (i >= props.currentStep + 1) && {backgroundColor: '#eee'}]}></View>
					          {(i+1) === (props.steps) && <View style={[styles.circle, {left: 'auto', right: -7}, (i+1) !== (props.currentStep) && {backgroundColor: '#eee'}]}></View>}
					        </View>
			  })}
      </View>
      <View style={styles.bottomCon}>
        <View style={styles.textCon}>
          <Text style={styles.text} >{renderStepTitle()}</Text>
        </View>
        <View style={styles.buttonCon}>
          <Ripple 
            style={[styles.directionBtn, styles.backButton, props.currentStep === 0 && {opacity: 0.4}]} 
            disabled={props.currentStep === 0} 
            onPress={() => props.changeStep('prev')}
            rippleOpacity={0.2} 
            rippleDuration={600}
          >
            <Icon type="FontAwesome5" name={'chevron-left'} style={styles.btnIcon} />
            <Text><FormatText variable='common.back' /></Text>
          </Ripple>
          {props.currentStep !== props.steps && 
            <Ripple 
              style={[styles.directionBtn, styles.nextButton, isDisabledNext() && {opacity: 0.4}]} 
              disabled={isDisabledNext()} 
              onPress={() => props.changeStep('next')}
              rippleOpacity={0.2} 
              rippleDuration={600}
            >
              <Text style={styles.nextBtnText}><FormatText variable='common.next' /></Text>
              <Icon type="FontAwesome5" name={'chevron-right'} style={[styles.btnIcon, styles.btnIconNext]} />
            </Ripple>
          }
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  barContainer: {
    flex: 1,
    width: '100%',
    paddingTop: 60,
  },
  stepsCon: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    height: 90
  },
  bar: {
    flex: 1,
    flexDirection: 'row',
    padding: 15,
    paddingTop: 20,
    paddingBottom: 0,
  },
  step: {
    flex: 1
  },
  circle: {
    width: 16,
    height: 16,
    backgroundColor: primaryColor,
    borderRadius: 7,
    position: 'absolute',
    left: -8,
    top: -2
  },
  line: {
    width: '100%',
    height: 2,
    backgroundColor: primaryColor,
    marginVertical: 5,
  },
  directionBtn: {
    padding: 5,
    width: 60,
    marginHorizontal: 5,
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30
  },
  backButton: {
    borderColor: '#ccc',
  },
  nextButton: {
    backgroundColor: primaryColor,
    borderColor: primaryColor
  },
  buttonCon: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  nextBtnText: {
    color: '#fff'
  },
  btnIcon: {
    fontSize: 15,
    marginRight: 5
  },
  btnIconNext:{
    marginRight: 0,
    marginLeft: 5,
    color: '#fff'
  },
  bottomCon: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  textCon: {
    flexDirection: 'row',
    paddingLeft: 10,
    marginTop: 10,
  },
  text: {
    fontWeight: '600',
  },
  headingLine: {
    width: 2,
    height: 20,
    backgroundColor: primaryColor,
  }
});

const mapStateToProps = (state) => ({
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(PlannerSteps);  



