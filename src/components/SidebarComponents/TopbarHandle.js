import React from 'react';
import { View,StyleSheet,Text,Dimensions } from 'react-native';
import {Icon,Button} from 'native-base'
import {connect} from 'react-redux';
import ContentLoader from '../common/ContentLoader'

const { width, height } = Dimensions.get('screen');

const TopbarHandle = (props) => { 
  return(
    <View style={styles.viewMapButton}>
      <View style={styles.topMapButton}>
        {props.map.fetchingDetail ? 
          <View style={{top: -4}}><ContentLoader size={20} /></View>
          :
          <Text style={styles.topText}>{props.map.mapDetail && props.map.mapDetail.map_name_local}</Text>
        }
      </View>
    </View>
  )   
}

const styles = StyleSheet.create({
  viewMapButton:{
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    overflow: 'hidden',
  },
  topMapButton:{
    width:180,
    height:100,
    backgroundColor: '#fff',
    borderBottomRightRadius: 200,
    borderBottomLeftRadius: 200,
    paddingTop: 25,
    top: -20,
    alignItems: 'center',
    paddingLeft: 30,
    paddingRight: 30,
    justifyContent: 'center',
  },
  topText:{
    fontSize:14,
    textAlign: 'center',
    top: -4
  }
})
const mapStateToProps = (state) => ({
  map: state.map,
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(TopbarHandle); 
