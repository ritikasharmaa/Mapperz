import React, { useRef, useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Dimensions, TextInput, ScrollView, Animated, Switch, Alert } from 'react-native';
import { Icon, Button, Container, Content, Picker } from 'native-base'
import Ripple from 'react-native-material-ripple';
import ContentLoader from '../common/ContentLoader'
import { convertText, renderImage } from '../../redux/Utility'
import NoData from '../common/NoData'
import {primaryColor, dummyImage} from '../../redux/Constant'
import {connect} from 'react-redux';
import { editPlannerDetail } from "../../redux/actions/planner";
import FormatText from '../common/FormatText'
import { getSpecificMapDetail } from "../../redux/api/map";
import { getMapFeed } from "../../redux/api/feed";

const { width, height } = Dimensions.get('screen');

const CommonButtons = (props) => {

  let lang = props.lang

  const addSpot = () => {
    props.navigation.navigate('Planner', {step: 1})
    props.modalRef.current.close()
  }

  const editMap = () => {
    let item = props.selectedItem;
    
      let data = {
    	centerData: {
				id : item.id,
				image_url: item.image_url,
				label: item.neighborhood_name + ' ' + item.prefecture_name,
				latitude: item.latitude,
				longitude: item.longitude,
				//name_local: item.spots.attname_local,
				pref_cd: item.prefecture_id,
				tours_count: item.spots_count,
				value:item.neighborhood_name + ' ' + item.prefecture_name,
		  },
		  finalFormData : {
			tour_name : item.map_name,
            description: item.description,
             date: '',
			 status: item.status,
            group: ''
		  },
		  methodType: {
        caption: '',
        commingSoon: Boolean,
        image: '',
        method: '',
        subCaption:''
      }
	  }
    props.dispatch(editPlannerDetail(data));
    props.modalRef.current.close()
    props.navigation.navigate('Planner', {step: 3})
  };
  const deleteUserMap = (id) => {
    Alert.alert(
      convertText("common.are_you_sure", lang),
      convertText("map.do_you_want_to_delete_map", lang),
      [
        {
          text: convertText("message.no", lang),
          //onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: convertText("message.yes", lang),
          onPress: () => {
            props.modalRef.current.close()
            props.deleteUser(id).then((res) => {
            props.getAllMaps();
            });
          },
        },
      ],
      { cancelable: false }
	  );	 
  };

  const convertToHomemap = (id) => {
    props.updateHomemap(id)
    props.modalRef.current.close()
    props.dispatch(getSpecificMapDetail(id));
    props.dispatch(getMapFeed(id));
    props.handleMapSelected()
  }

  const renderList = () => {
    if (props.loading) {
      return <ContentLoader />
    } else if (props) {
      return <View style={styles.subCon}>
          			<TouchableOpacity style={[styles.actionCon]} onPress={() => addSpot()}>
          				<Icon type="FontAwesome5" name={'plus'} style={styles.icon}/>
          				<Text style={styles.text}><FormatText variable='screencomp.add_spot' /></Text>
          			</TouchableOpacity>
          			<TouchableOpacity  style={[styles.actionCon]} onPress={() => editMap()}>
          				<Icon type="FontAwesome5" name={'pen'} style={styles.icon}/>
          				<Text style={styles.text}><FormatText variable='screencomp.edit_map' /></Text>
          			</TouchableOpacity>
          			{/*<TouchableOpacity style={[styles.actionCon]}>
          				<Icon type="FontAwesome5" name={'pen'} style={styles.icon}/>
          				<Text style={styles.text}><FormatText variable='screencomp.edit_spot' /></Text>
          			</TouchableOpacity>*/}
                <TouchableOpacity style={[styles.actionCon]} onPress={() => deleteUserMap(props.selectedItem.id)}>
                  <Icon type="FontAwesome5" name={'trash'} style={styles.icon}/>
                  <Text style={styles.text}><FormatText variable='sidebarcomp.delete' /></Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionCon]} onPress={() => convertToHomemap(props.selectedItem.id)}>
                  <Icon type="FontAwesome5" name={'map'} style={styles.icon}/>
                  <Text style={styles.text}><FormatText variable='screencomp.convert_to' /></Text>
                </TouchableOpacity>
          		</View>
    } else  {
      return <NoData title="No Spot Found" />
    } 
  }

  return(
    <View style={styles.mainCon}>
      {renderList()}
    </View>
  )
}


const styles = StyleSheet.create({
	icon: {
		fontSize: 18,
		color: '#495057',
		minWidth: 35,
	},
	actionCon: {
		flexDirection: 'row',
		marginBottom: 30,
    alignItems: 'center'
    //borderBottomWidth: 1,
    //borderColor: '#aaa'
	},
  subCon: {
    paddingVertical: 10
  },
	mainCon: {
		paddingHorizontal: 20,
	},
	text: {
		fontSize: 16,
		color: '#495057',
	}
});

const mapStateToProps = (state) => ({
  //map: state.map,
  //planner: state.planner,
  //uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(CommonButtons); 