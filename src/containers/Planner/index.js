import React, {useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Dimensions,
  Animated
} from 'react-native';

import {connect} from 'react-redux';
import Header from '../../components/common/Header';
import Footer from '../../components/common/Footer';
import { Icon, Button, Container, Content } from 'native-base'
import PlannerSteps from '../../components/common/PlannerSteps'
import CenterStep from './CenterStep'
import CenterTypeStep from './CenterTypeStep'
import DataSourceStep from './DataSourceStep'
import SelectSpotStep from './SelectSpotStep'
import ReviewStep from './ReviewStep'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import AddSpotMethod from './AddSpotMethod'
import RBSheet from "react-native-raw-bottom-sheet";
import SelectedSpots from '../../components/Planner/SelectedSpots'
import { toggleSpot } from '../../redux/actions/planner'
import { getCenterSpots } from '../../redux/api/planner'
import AddingSpot from './AddingSpot'
import FormatText from '../../components/common/FormatText'
import DeviceInfo from 'react-native-device-info';

//import SwipeablePanel from 'rn-swipeable-panel';


const { width, height } = Dimensions.get('screen');
const notch = DeviceInfo.hasNotch()

const Planner = (props)  => {
  const [currentStep, setCurrentStep] = useState(0)
  const [openModal, setOpenModal] = useState(false)
  const [isActive, setIsActive] = useState('station')
  const modalRef = useRef(null)
  
  const containerLeft = useRef(new Animated.Value(0)).current

  const changeStep = (direction) => {
    if (direction === 'next') {
      setCurrentStep(currentStep + 1)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  useEffect(() => {
    Animated.timing(
      containerLeft,
      {
        toValue: -(currentStep * width),
        duration: 250,
      }
    ).start();
  }, [currentStep])

  const togglePanel = () => {
    setOpenModal(!openModal)
  }

  useEffect(() => {
    if(props.route.params && props.route.params.step == 3){
      setCurrentStep(3)
  } else if(props.route.params && props.route.params.step == 1){
    setCurrentStep(1)
  }
},[])

  const renderBadgeCount = () => {
    if (props.planner.selectedSpots.length) {
      return  <View style={styles.badgeCount}>
                <Text style={styles.badgeText}>{props.planner.selectedSpots.length}</Text>
              </View>
    }
  }

  const removeSpot = (item) => {
    props.dispatch(toggleSpot(item))
  }
  
  const activateTab = (key) => {
    setIsActive(key)
    if (key === 'spot'){
      props.dispatch(getCenterSpots())
    }
  }


  return (
    <Container style={styles.mainContainer}>
      <Header backEnd blackBackBtn nextScreen="Footer" navigation={props.navigation} />
      <PlannerSteps 
        steps={3} 
        currentStep = {currentStep} 
        changeStep = {changeStep} 
        plannerData = {props.planner.formData}
        selectedSpots = {props.planner.selectedSpots}
      />
      <Content scrollEnabled={false}>
        <Animated.View style={[styles.animatedCon, currentStep === 0 && styles.haveTabs, {left: containerLeft}]}>
          <View style={styles.innerContainer}>
            <ScrollView>
              <CenterStep 
                changeStep={changeStep}
                activeTab={isActive}
              />
            </ScrollView>
          </View>
          <View style={styles.innerContainer}>
            <ScrollView>
              <AddSpotMethod 
                changeStep={changeStep}
              />
            </ScrollView>
          </View> 
          <View style={styles.innerContainer}>
            <ScrollView>
              {props.planner.formData.methodType.method === 'by_spot' ? 
                <SelectSpotStep 
                  changeStep={changeStep}
                />
                :
                null
                // <AddingSpot />
              }
            </ScrollView>
          </View> 
          <View style={styles.innerContainer}>
            <ScrollView>
              <ReviewStep 
                navigation={props.navigation}
              />
            </ScrollView>
          </View>            
        </Animated.View>
      </Content>
      {currentStep === 0 && <View style={styles.options}>
                              <Ripple 
                                style={[styles.btmTabs, isActive === 'station' && styles.activeTextCon]}
                                rippleColor="#444" 
                                rippleOpacity={0.2} 
                                rippleDuration={700}
                                onPress={() => activateTab('station')}
                              >
                                  <Text style={[styles.text, isActive === 'station' && styles.activeText]}><FormatText variable='planner.choose_station' /></Text>
                              </Ripple>
                              <Ripple
                                style={[styles.btmTabs, isActive === 'spot' && styles.activeTextCon]}
                                rippleColor="#444" 
                                rippleOpacity={0.2} 
                                rippleDuration={700}
                                onPress={() => activateTab('spot')}
                              >
                                <Text style={[styles.text, isActive === 'spot' && styles.activeText]}><FormatText variable='planner.choose_spot' /></Text>
                              </Ripple>
                            </View>
      }
      {currentStep === 2 && <Ripple 
                              style={styles.favButton} 
                              rippleContainerBorderRadius={30} 
                              rippleColor="#eee" 
                              rippleOpacity={0.2} 
                              rippleDuration={700} 
                              onPress={() => modalRef.current.open()}
                            >
                              {renderBadgeCount()}
                              <Icon type="FontAwesome5" name={'map-marker'} style={styles.favIcon} />
                            </Ripple>
      }
      {/*<Footer navigation={props.navigation} />*/}
      <RBSheet
        ref={modalRef}
        height={400}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            justifyContent: "flex-start",
            alignItems: "center"
          },          
        }}
      >
        <SelectedSpots spots={props.planner.selectedSpots} removeSpot={removeSpot} />
      </RBSheet>
    </Container>
  );
};

const styles = StyleSheet.create({
  animatedCon: {
    flexDirection: 'row',
    flex: 1,
    height: notch ? height - 210 : height - 160,
    //height: height - 160,
    //paddingBottom: 150
  },
  haveTabs:{
    height: notch ? height - 265 : height - 200,
  },
  innerContainer: {
    width: width,
    height: '100%',
    zIndex: 10
  },
  mainContainer: {
    backgroundColor: '#fff'
  },
  favButton:{
    backgroundColor: primaryColor,
    borderRadius:25,
    marginLeft: 20,
    position: 'absolute',
    bottom: 20,
    right: 20, 
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'lightgrey',
    shadowRadius: 10,
    shadowOpacity: 1,
  },
  favIcon:{
    fontSize:16,
    color: '#fff'
  },
  options: {   
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 50
  },
  btmTabs: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5'
  },
  activeTextCon: {
    backgroundColor: '#fff'
  },
  text: {
    color: '#ccc',
  },
  activeText: {
    color: primaryColor,
  },
  line: {
    fontSize: 20,
    color: 'grey',
  },
  badgeCount: {
    position: 'absolute',
    top: -10,
    right: -5,
    width: 25,
    height: 25,
    backgroundColor: 'red',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700'
  }

});

const mapStateToProps = (state) => ({
  planner: state.planner
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Planner);  



