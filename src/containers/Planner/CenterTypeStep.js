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
import {centerTypeList} from '../../redux/Constant'
import FormatText from '../../components/common/FormatText'

const { width, height } = Dimensions.get('screen');


const CenterTypeStep = (props)  => {
  const [active, setActive] = useState(null)

  const onSelectItem = (index) => {
    setActive(index)
  }

  return (
    <View style={styles.innerContainer}>
      <View style={styles.heading}>
        <Text style={styles.mainHeading}><FormatText variable='planner.where_would_you' /></Text>
      </View>
      <View style={styles.gridListCon}>
      	{centerTypeList.map((item, index) => {
      		return 	<View key={index} style={styles.gridItem}>
    			          <GridCard data={item} isActive={index === active} onPress={() => onSelectItem(index)} />
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
  }

});

const mapStateToProps = (state) => ({
  state
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(CenterTypeStep);  



