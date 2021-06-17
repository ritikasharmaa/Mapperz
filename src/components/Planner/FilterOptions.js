import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,  
  TouchableOpacity
} from 'react-native';
import {
  Container,
  Button,
  Picker,
  Icon,
} from 'native-base';
import {connect} from 'react-redux';
import Ripple from 'react-native-material-ripple';
import {primaryColor, genre, distance} from '../../redux/Constant'
import {changeSelectedValue} from '../../redux/actions/planner'
import FormatText from '../common/FormatText'
import { convertText } from '../../redux/Utility';


const Filters = (props) => {


  const changeValue = (val, key) => {
    props.dispatch(changeSelectedValue(val, key))
  }

	return(
		<View style={styles.container}>
      <View style={styles.filterCon}>
        <View style={styles.pickerCon}>
          <Text style={styles.heading}><FormatText variable='plannercomp.genre' /></Text>
          <View style={styles.pickerBorder}>
            <Picker
              iosHeader={convertText("planner.selectTime", props.lang)}
              mode="dropdown"
              selectedValue={props.planner.filteredValue.genre}
              style={styles.picker}
              iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
              onValueChange={(val) => changeValue(val, 'genre')}>
              {genre.map((item, index) => {
                return <Picker.Item key={index} label={item.genre_en} value={item.value} />
              })}
           </Picker>
         </View>
        </View>
        <View style={styles.pickerCon}>
          <Text style={styles.heading}><FormatText variable='plannercomp.distance' /></Text>
          <View style={styles.pickerBorder}>
            <Picker
              iosHeader={convertText("planner.selectTime", props.lang)}
              mode="dropdown"
              selectedValue={props.planner.filteredValue.distance}
              style={styles.picker}
              iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
              onValueChange={(val) => changeValue(val, 'distance')}>
              {distance.map((item, index) => {
                return <Picker.Item key={index} label={item.distance_en} value={item.value} />
              })}
           </Picker>
         </View>
        </View>
      </View>
      <View style={styles.filterCon}>
        <TouchableOpacity onPress={() => props.reset()}>
          <Text style={styles.button}><FormatText variable='plannercomp.reset' /></Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => props.applyFilters()}>
          <Text style={[styles.button, styles.blue]}><FormatText variable='plannercomp.apply' /></Text>
        </TouchableOpacity>
      </View>
    </View>
	)
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  filterCon: {
    flexDirection: 'row',
    marginBottom: 20,
    justifyContent: 'center',
  },
  pickerCon: {
    width: '45%',
    marginRight: '5%',
  },
  pickerBorder: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
  },
  picker: {
    height: 40,
    width: '100%'
  },
  heading: {
    fontSize: 15,
    marginBottom: 10,
  },
  arrowIcon: {
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    fontSize: 16
  }, 
  button:{
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginRight: 10,
    overflow: 'hidden'
  },
  blue: {
    backgroundColor: primaryColor,
    color: '#fff',
    borderColor: primaryColor
  },
  itemTextStyle: {
    width: '100%',
    backgroundColor: 'red'
  }
})

const mapStateToProps = (state) => ({
  planner: state.planner
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Filters);
