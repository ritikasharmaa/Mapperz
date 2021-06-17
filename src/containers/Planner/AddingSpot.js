import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
} from 'react-native';
import {connect} from 'react-redux';
import { Icon, Button, ListItem} from 'native-base'
import Ripple from 'react-native-material-ripple';
import {primaryColor} from '../../redux/Constant'
import Autocomplete from 'native-base-autocomplete'
import NoData from '../../components/common/NoData'
import Maps from '../../components/ViewMaps/Maps'
import FormatText from '../../components/common/FormatText'
import{ convertText } from '../../redux/Utility'



const { width, height } = Dimensions.get('screen');


const AddingSpot = (props)  => {
 
  let lang = props.uiControls.lang

  return (
    <View style={styles.innerContainer}>
      <View style={styles.textBoxCon}>
        <TextInput
          style={styles.textBox}
          placeholder={convertText("planner.enterAddress", lang)}
        />
        <Ripple style={styles.submitBtn}>
          <Icon type="FontAwesome5" name={'search'} style={styles.btnIcon} />
        </Ripple>
      </View> 
      <View style={styles.mapCon}>
        <View style={[styles.textBoxCon, styles.autoComCon]}>
          <TextInput
            style={[styles.textBox, styles.autoCom]}
            placeholder="2-8-1, Tokyo"
            placeholderTextColor="#000"
          />
          <Ripple style={styles.submitBtn}>
            <Icon type="FontAwesome5" name={'plus'} style={styles.btnIcon} />
          </Ripple>
        </View>
        <Maps />
        {/*<Image source ={require('../../assets/images/map_banner.png')}/>*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
  },
  textBoxCon: {
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 15,
  },
  textBox: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 50,
    color: '#000'
  },
  submitBtn:{
    width: 45,
    position: 'absolute',
    right: 10,
    top: 15,
    height: 40,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    backgroundColor: primaryColor,
    alignItems: 'center',
    justifyContent: 'center'
  },
  btnIcon: {
    fontSize: 13,
    color: '#fff',
  },
  mapCon: {
    marginLeft: 0,
    backgroundColor: 'red',
    height: height - 290
  },
  autoComCon: {
    position: 'absolute',
    zIndex: 9,
    top: 0,
    backgroundColor: 'rgba(0,0,0,0.3)'
  },
  autoCom: {
    backgroundColor: '#f5f5f5',
  }
});

const mapStateToProps = (state) => ({
  planner: state.planner,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(AddingSpot);  



