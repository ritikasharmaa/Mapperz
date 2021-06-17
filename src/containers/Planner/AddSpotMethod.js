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
import { Icon, Button} from 'native-base'
import { Container, Content, Picker } from "native-base";
import { spotMethods } from '../../redux/Constant'
import GridCard from '../../components/common/GridCard'
import OwnBreadcrumb from '../../components/common/OwnBreadcrumb'
import { changeForm } from '../../redux/actions/planner'
import FormatText from '../../components/common/FormatText'


const { width, height } = Dimensions.get('screen');

const AddSpotMethod = (props)  => {

  const selectItem = (item) => {
    props.dispatch(changeForm(item, 'methodType'))
    props.changeStep('next')
  }

  const isSelected = (type) => {
    if (type === props.planner.formData.methodType.method) {
      return true
    }
  }

  return (
    <View style={styles.innerContainer}>
      <View style={styles.heading}>
        <Text style={styles.mainHeading}><FormatText variable='planner.how_do_you' /> </Text>
      </View>
      <View style={styles.gridListCon}>
        {spotMethods.map((item, index) => {
          return  <View style={styles.gridItem} key={index}>
                    <GridCard 
                      centerContent 
                      caption={item.caption} 
                      subCaption={item.subCaption} 
                      image={item.image}
                      onPress={() => selectItem(item)}
                      isActive={isSelected(item.method)}
                      commingSoon={item.commingSoon}
                    />
                  </View>
        })}
      </View>    
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    alignItems: 'center'
  },
  innerContainer: {
    padding: 10
  },
  mainHeading:{
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center'
  },
  gridListCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -6,
    marginRight: -6
  },
  gridItem: {
    width: '100%',
    padding: 4
  },

});

const mapStateToProps = (state) => ({
  planner: state.planner
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(AddSpotMethod);  



