import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated
} from 'react-native';
import { connect } from 'react-redux';
import { Icon, Button} from 'native-base'
import Ripple from 'react-native-material-ripple';
import { primaryColor, dummyImage } from '../../redux/Constant'
import FormatText from './FormatText'


const { width, height } = Dimensions.get('screen');

const GridCard = (props)  => {
  const checkPosition = useRef(new Animated.Value(-30)).current

  useEffect(() => {
    Animated.timing(
      checkPosition,
      {
        toValue: props.isActive ? 0 : -30,
        duration: 200,
      }
    ).start();

  }, [props.isActive])

  /*
  * Caption of Grid Card 
  */
  const caption = () => {
    if(props.singleLine){
      return <Text numberOfLines={1} style={styles.mainCaption}>{props.caption}</Text>
    } else {
      return <Text style={styles.mainCaption}>{props.caption}</Text>
    }
  } 

  return (
    <Ripple 
      style={[styles.innerGrid, props.decreaseHeight && {height: 150}]} 
      onPress={() => (!props.commingSoon && props.onPress) && props.onPress()}
      rippleOpacity={0.2} 
      rippleDuration={600}
    >
      {props.commingSoon && 
        <View style={styles.commingSoonCon}>
          <Text style={styles.commingSoonText}><FormatText variable='common.coming_soon' /></Text>
        </View>
      }
      {props.singleLine ? <Image source={props.image} style={styles.gridImage} /> : <Image source={props.image ? props.image : {uri: dummyImage}} style={styles.gridImage} />}
      
      {props.isCount && <View style={styles.countCon}>
                          <Text style={styles.text}>{props.count}</Text>
                        </View>
      }
      {props.isRegistered && <View style={styles.registerCon}><Text style={[styles.text, styles.white]}>Registered</Text></View>}
      <View style={[styles.overlay, props.isActive && {backgroundColor: 'rgba(146, 72, 231, 0.6)'}]}></View>
      <Animated.View style={[styles.activeIconCon, {top: checkPosition}]}>
        <Icon type="FontAwesome5" name={'check'} style={styles.activeIcon} />
      </Animated.View>
      {!props.noCaption && 
        <View style={[styles.gridCaption, props.centerContent && styles.centerContent, props.spotView && styles.spotView]}>
          {caption()}
          {props.address && <Text numberOfLines={1} style={styles.subCaption}>{props.address}</Text>}
          {props.subCaption && <Text numberOfLines={1} style={styles.subCaption}>{props.subCaption}</Text>}
        </View>
      }
    </Ripple>
  );
};

const styles = StyleSheet.create({
  innerGrid: {
    height: 200,
    overflow: 'hidden',
    borderRadius: 10,
  },
  gridCaption:{
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 15,
    zIndex: 2
  },
  mainCaption:{
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  gridImage: {
    width: '100%',
    height: '100%'
  },
  overlay: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  subCaption:{
    color: '#fff',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 5
  },
  centerContent:{
    height: '100%',
     width: '100%',
     alignItems: 'center',
     justifyContent: 'center'
  },
  spotView:{
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
  },
  activeIconCon: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: primaryColor,
    padding: 5,
    borderBottomLeftRadius: 10
  },
  activeIcon: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.6)'
  },
  registerCon: {
    position: 'absolute',
    zIndex: 9,
    right: 10,
    top: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'green',
    borderRadius: 15,
  },
  text:{
    fontSize: 10,
    color: '#000',
    textTransform: 'uppercase'
  },
  white: {
    color: '#fff'
  },
  countCon: {
    position: 'absolute',
    zIndex: 9,
    left: 10,
    top: 10,
    right: 'auto',
    backgroundColor: '#fff',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'

  },
  commingSoonCon: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    zIndex: 10
  },
  commingSoonText: {
    color: '#fff',
    fontSize: 20
  }

});

const mapStateToProps = (state) => ({
  state
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(GridCard);  



