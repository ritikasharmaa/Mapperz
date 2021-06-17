import React from 'react';
import { StyleSheet, Text, View} from 'react-native';
import Breadcrumb from 'react-native-breadcrumb';

const OwnBreadcrumb = (props) => {
  return (
  	<View style={styles.container}>
	    <Breadcrumb
	      entities={['My Tab 1', 'My Tab 2', 'My Tab 3']}
	      isTouchable={false}
	      flowDepth={1}
	      height={30}
	      onCrumbPress={index => {}}
	      borderRadius={5}
        crumbStyle={styles.itemStyle}
	      activeCrumbStyle={styles.activeItem}
	      activeCrumbTextStyle={styles.activeItemText}
        crumbsContainerStyle={styles.crumbsContainerStyle}
	    />
    </View>
  )
}
  
export default OwnBreadcrumb;

const styles = StyleSheet.create({
    container: {
    	marginBottom: 20,

    },
    itemStyle:{
      backgroundColor: '#fff',
    },
    activeItem: {
    	backgroundColor: '#eee'
    },
    activeItemText: {
    	color: '#000'
    },
    crumbsContainerStyle: {
      backgroundColor: '#fff'
    }
});

