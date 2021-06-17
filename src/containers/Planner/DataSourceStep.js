import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
} from 'react-native';

import {connect} from 'react-redux';
import { Icon, Button} from 'native-base'
import GridCard from '../../components/common/GridCard'
import {dataSourceList} from '../../redux/Constant'
import OwnBreadcrumb from '../../components/common/OwnBreadcrumb'
import FormatText from '../../components/common/FormatText'

const { width, height } = Dimensions.get('screen');


const DataSourceStep = (props)  => {
  return (
    <View style={styles.innerContainer}>
      <View style={styles.heading}>
        <Text style={styles.mainHeading}><FormatText variable='planner.choose_spots_data' /></Text>
      </View>

      <OwnBreadcrumb
        entities={['My Tab 1', 'My Tab 2', 'My Tab 3']}
      />

      <View style={styles.gridListCon}>
      	{dataSourceList.map((item, index) => {
      		return 	<View key={index} style={styles.gridItem}>
			          <GridCard data={item} isActive={index === 1} centerContent />
			        </View>
      	})}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    height: height - 125
  },
  heading: {
    alignItems: 'center'
  },
  innerContainer: {
    padding: 10
  },
  mainHeading:{
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center'
  },
  recommendedCon: {
    
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10
  },
  gridListCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: -6,
    marginRight: -6
  },
  gridItem: {
    width: '50%',
    padding: 4
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textBoxCon: {
    width: '65%',
  },
  pickerCon: {
    width: '35%',
  },
  textBox: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 50
  },
  picker: {
    backgroundColor: '#fff',
    height: 40,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  submitBtn:{
    width: 50,
    position: 'absolute',
    right: 0,
    top: 0,
    height: 40,
    borderRadius: 5,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0
  },
  btnIcon: {
    fontSize: 16
  }

});

const mapStateToProps = (state) => ({
  state
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(DataSourceStep);  



