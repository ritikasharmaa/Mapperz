import React, {useRef} from 'react';
import { View, StyleSheet, Dimensions, Text, ScrollView, Image, TouchableOpacity} from 'react-native';
import {Icon,Button} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import FriendList from '../ViewMaps/FriendList'
import SuggestSpot from './SuggestSpot'
import Geolocation from 'react-native-geolocation-service';
import { renderImage } from '../../redux/Utility'
import FormatText from './FormatText'
import NoData from './NoData'
import ContentLoader from './ContentLoader'

const { width, height } = Dimensions.get('screen');

const SuggestedSpot = (props) => {

  const updateSuggestion = (item, key) => {
   // props.modal.current.close()
    props.updatingSuggestion(item, key)
  }

  const renderSpots = () => {
    if(props.isLoading){
      return <ContentLoader />
    } else if(props.suggestedSpot && props.suggestedSpot.length !== 0){
      return  <ScrollView>
                <Text style={styles.heading}><FormatText variable='common.suggested_spot' /></Text>
                {props.suggestedSpot.map((item, index) => {
                  return <View key={index} style={styles.userDetail}>
                          <View style={styles.userImgCon}>
                            <Image style={styles.userImg} source = {renderImage(item.suggest_image)}/>
                          </View>
                          <View style={styles.userCon}>
                            <Text numberOfLines={2} style={styles.name}>{item.suggest_name}</Text>
                          </View>
                          <View style={styles.direction}>
                            <TouchableOpacity style={styles.iconCon} onPress={() => updateSuggestion(item, 'accept')}>
                              <Icon type="FontAwesome5" name={'check'} style={styles.icon} />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.iconCon, styles.reject]} onPress={() => updateSuggestion(item, 'reject')}>
                              <Icon type="FontAwesome5" name={'times'} style={styles.icon} />
                            </TouchableOpacity>
                          </View>
                        </View>
                })}
              </ScrollView>
    } else {
        return <NoData />
    }
   
  }
  
	return(
    <View>     
      {renderSpots()}
    </View>
	)
}

const styles = StyleSheet.create({
  heading: {
    textAlign: 'center',
    fontSize: 18,
    paddingVertical: 10
  },
  userDetail: {
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#eee'
  },
	userImgCon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    marginVertical: 5,
  },
  userImg: {
    width: '100%',
    height: '100%',
  },
  userCon:{
    marginLeft: 10,
    width: (width - 140),
  },
  name: {
    fontSize: 15,
    fontWeight: '500'
  },
  direction: {
    flexDirection: 'row'
  },
  iconCon: {
    width: 25,
    height: 20,
    backgroundColor: 'green',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5,
    borderRadius: 5

  },
  icon: {
    color: '#fff',
    fontSize: 12,
  },
  reject: {
    backgroundColor: 'red'
  }
})

export default SuggestedSpot;