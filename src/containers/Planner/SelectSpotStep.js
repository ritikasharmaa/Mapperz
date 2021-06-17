import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  TextInput,
  Animated
} from 'react-native';

import {connect} from 'react-redux';
import { Icon, Button} from 'native-base'
import { Container, Content, Picker } from "native-base";
import { SpotsList } from '../../redux/Constant'
import GridCard from '../../components/common/GridCard'
import OwnBreadcrumb from '../../components/common/OwnBreadcrumb'
import {primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import { toggleSpot, resetSearchFilters } from '../../redux/actions/planner'
import { getSpots } from '../../redux/api/planner'
import ContentLoader from '../../components/common/ContentLoader'
import NoData from '../../components/common/NoData'
import FormatText from '../../components/common/FormatText'
import RBSheet from "react-native-raw-bottom-sheet";
import Filters from '../../components/Planner/FilterOptions'
import { renderImage, language, convertText } from '../../redux/Utility'

const { width, height } = Dimensions.get('screen');

const SelectSpotStep = (props)  => {
	const [loading, setLoading] = useState(false)
	const [text, setText] = useState('')
	const [currentTab, setCurrentTab] = useState(1)
	const containerLeft = useRef(new Animated.Value(0)).current
  const filterRef = useRef(null)
  let lang = props.uiControls.lang


	useEffect(() => {
		searchSpots()
	}, [props.planner.formData.methodType])

	useEffect(() => {
    Animated.timing(
      containerLeft,
      {
        toValue: -(currentTab * (width - 20)),
        duration: 150,
      }
    ).start();
  }, [currentTab])

  const searchSpots = () => {
    filterRef.current.close()
		setLoading(true)
		let data = {
								text : text, 
								lat: props.planner.formData.centerData.latitude, 
								lng: props.planner.formData.centerData.longitude, 
								range: props.planner.filteredValue.distance,
								prefecture: props.planner.formData.centerData.pref_cd,
                lang: props.uiControls.lang,
                genre: props.planner.filteredValue.genre,
							}
		props.dispatch(getSpots(data)).then((res) => {
			setLoading(false)
		})
	}

  const resetFilters = () => {
    props.dispatch(resetSearchFilters())
  }

	const selectSpot = (data, type) => {
    console.log(data, type, "data, type")
		props.dispatch(toggleSpot(data, type))
	}


	const isSelected = (id, type) => {
    //console.log(id, type, props.planner.selectedSpots, 'test')
		let index = props.planner.selectedSpots.findIndex(item => (type === 'gpi' ? item.refbase : item.id) === id);
		if (index !== -1) {
			return true
		}
	}

	const onChangeText = (val) => {
		setText(val)
	}

	// const renderImage = (item, type) => {
	// 	if (type === 'gpi') {
	// 		return item.icon ? {uri: item.icon} : ''
	// 	} else {
	// 		return (item.img_url && item.img_url.thumb.url) ? {uri: item.img_url.thumb.url} : ''
	// 	}
	// }

	const renderSpots = (type) => {     
		if (loading) {
			return <View style={styles.loaderCon}>
				<ContentLoader />
			</View>
		} else if(!loading && (!props.planner.spotList[type] || !props.planner.spotList[type].length)) {
			 return <View style={{alignItems: 'center', width: '100%', marginTop: 20}}><NoData /></View>
		} else {
			return props.planner.spotList[type].map((item, index) => {
        return  <View key={index} style={styles.gridItem}>
                  <GridCard 
                    caption={language(props.uiControls.lang, item.attname, item.attname_local)}
                  	data={item} 
                  	spotView 
                  	isActive={isSelected(type === 'gpi' ? item.refbase : item.id, type)}
                  	image={renderImage(item.img_url, 'spot', 'pathOnly')}
                  	onPress={() => selectSpot(item, type)}
                    singleLine
                    address={item.address !== "" && item.address}
                  />
                </View>
      })
		}
	}

  return (
    <View style={styles.innerContainer}>
      <View style={styles.heading}>
        <Text style={styles.mainHeading}><FormatText variable='planner.select_your' /></Text>
      </View>
      <View style={styles.filters}>
        <View style={styles.textBoxCon}>
          <TextInput
            style={styles.textBox}
            placeholder={convertText("planner.enterKeyword", lang)}
            onChangeText={(val) => onChangeText(val)}
          />
          <Ripple style={styles.submitBtn} onPress={() => searchSpots()}>
            <Icon type="FontAwesome5" name={'search'} style={styles.btnIcon} />
          </Ripple>
        </View>
        <View style={styles.pickerCon}>
          <Ripple style={styles.filterBtn} rippleColor="#aaa" rippleOpacity={0.2} rippleDuration={600} onPress={() => filterRef.current.open()}>
            <Icon type="FontAwesome5" name={'filter'} style={styles.filterBtnIcon} />
            <Text style={styles.filterBtnText}><FormatText variable='planner.filter' /></Text>
          </Ripple>
        </View>
      </View>
      <View style={styles.tabsCon}>
      	<Ripple style={[styles.tabItem, currentTab === 0 && styles.activeTab]} onPress={() => setCurrentTab(0)}>
      		<Text style={currentTab === 0 && styles.activeTabText}><FormatText variable='planner.travelz' /></Text>
      	</Ripple>
      	<Ripple style={[styles.tabItem, currentTab === 1 && styles.activeTab]} onPress={() => setCurrentTab(1)}>
      		<Text style={currentTab === 1 && styles.activeTabText}><FormatText variable='planner.google' /></Text>
      	</Ripple>
      	<Ripple style={[styles.tabItem, currentTab === 2 && styles.activeTab]} onPress={() => setCurrentTab(2)}>
      		<Text style={currentTab === 2 && styles.activeTabText}><FormatText variable='planner.favorites' /></Text>
      	</Ripple>
      </View>
      <View style={{overflow: 'hidden'}}>
	      <Animated.View style={[styles.innerTabs, {left: containerLeft}]}>
		      <View style={styles.gridListCon}>
		      	{currentTab === 0 ? renderSpots('travelz') : null}
		      </View>
		      <View style={styles.gridListCon}>
            {currentTab === 1 ? renderSpots('gpi') : null}
		      </View>
		      <View style={styles.gridListCon}>
            {currentTab === 2 ? renderSpots('favorites') : null}
		      </View>
	      </Animated.View>
      </View>
      <RBSheet
        ref={filterRef}
        height={250}
        openDuration={250}
        openDuration={250}
        closeOnDragDown={true}
        customStyles={{
          container: {
            justifyContent: "center",
            alignItems: "center"
          }
        }}
      >
        <Filters applyFilters={searchSpots} reset={resetFilters} lang={lang}/>
      </RBSheet>
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
    fontSize: 20,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center'
  },
  subheading: {
    fontSize: 18,
    marginBottom: 10
  },
  gridListCon: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%'
  },
  gridItem: {
    width: '50%',
    padding: 4,
    marginBottom: (Platform.OS== 'ios'? 0: 20),
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  textBoxCon: {
    width: '75%',
  },
  pickerCon: {
    width: '25%',
    paddingLeft: 10
  },
  textBox: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 50,
    color: '#000'
  },
  picker: {
    backgroundColor: '#fff',
    height: 40,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  submitBtn:{
    width: 40,
    position: 'absolute',
    right: 0,
    top: 0,
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
    color: '#fff'
  },
  filterBtn:{
  	height: 40,
  	justifyContent: 'flex-start',
  	backgroundColor: '#fff',
  	borderColor: '#ddd',
  	borderWidth: 1,
  	flexDirection: 'row',
  	justifyContent: 'center',
  	alignItems: 'center',
  	borderRadius: 5
  },
  filterBtnText:{
  	fontSize: 14,
  	color: '#000'
  },
  filterBtnIcon:{
  	fontSize: 13,
  	color: '#000',
  	marginRight: 10
  },
  loaderCon: {
  	height: '100%',
  	justifyContent: 'center',
  	alignItems: 'center',
  	width: '100%',
  },
  tabsCon: {
  	flexDirection: 'row',
  	marginHorizontal: -10
  },
  tabItem: {
  	flex: 1,
  	justifyContent: 'center',
  	alignItems: 'center',
  	height: 30,
  	backgroundColor: '#eee'
  },
  activeTab: {
  	backgroundColor: primaryColor
  },
  activeTabText: {
  	color: '#fff'
  },
  innerTabs: {
  	flexDirection: 'row',
  	width: '100%',
  }

});

const mapStateToProps = (state) => ({
  planner: state.planner,
  auth: state.auth,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(SelectSpotStep);  



