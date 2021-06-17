
import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { connect } from 'react-redux';
import { Icon, Button, Picker } from 'native-base'
import GridCard from '../../components/common/GridCard'
import { selectedSpotsList } from '../../redux/Constant'
import { primaryColor } from '../../redux/Constant'
import OwnButton from '../../components/common/OwnButton'
import Ripple from 'react-native-material-ripple';
import RBSheet from "react-native-raw-bottom-sheet";
import EditSpotDetail from '../../components/Planner/EditSpotDetail'
import { setCurrentSpotDetail, changeForm } from '../../redux/actions/planner'
import { submitMapForm, updateMapForm } from '../../redux/api/planner'
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import Toast from 'react-native-root-toast';
import FormatText from '../../components/common/FormatText'
import{ convertText, renderImage } from '../../redux/Utility'
import { getSpecificMapDetail } from "../../redux/api/map";
import { getMapFeed } from "../../redux/api/feed";

const { width, height } = Dimensions.get('screen');


const ReviewStep = (props)  => {
	const [activeTab, setActiveTab] = useState(0);
	const modalRef = useRef(null)
	const [currentSpot, setCurrentSpot] = useState({})
	const [isDatePickerVisible, setIsDatePickerVisible] = useState(false)
	let lang = props.uiControls.lang
	const changeTab = (index) => {
		setActiveTab(index)
	}

	const editDetail = (data) => {
		setCurrentSpot(data)
		modalRef.current.open()
	}

	const onChangeValues = (key, value) => {
		let formData = {...currentSpot}
		formData[key] = value;
		setCurrentSpot(formData)
	}

	const saveSpot = () => {
		props.dispatch(setCurrentSpotDetail(currentSpot))
		setCurrentSpot({})
		modalRef.current.close()
	}

	const onChangeText = (val, key) => {
		props.dispatch(changeForm(val, key))
		setIsDatePickerVisible(false)
  }
  
	const submitForm = () => {
		console.log(props.planner, "props.planner")
		let id = props.planner.formData.centerData.id
		if(props.planner.isEditing === true){
			return props.dispatch(updateMapForm(props.planner.formData, id)).then(res =>{
			Toast.show(convertText("planner.mapUpdated", lang))
			// props.navigation.navigate('Home') 
			props.navigation.navigate('Footer', {
				routeId : 0
			  })
			})
		}
			else {
			  return props.dispatch(submitMapForm(props.planner.formData, props.planner.selectedSpots, props.auth.userData.id)).then(res=> {
				Toast.show(convertText("planner.mapAdded", lang))
				// props.navigation.navigate('Home') 
				props.navigation.navigate('Footer', {
					routeId : 0
				})
			})
		}		
	}

	

	const renderDate = () => {
		if (props.planner.formData.finalFormData.date) {
			return moment(props.planner.formData.finalFormData.date).format('DD/MM/YYYY')
		} else {
			return <FormatText variable="planner.SelDate" />
		}
	}

  return (
    <View style={styles.innerContainer}>
      <View style={styles.heading}>
        <Text style={styles.mainHeading}><FormatText variable='planner.review' /></Text>
      </View>
      <View>
      	<Text style={styles.label}><FormatText variable='planner.trip_name' /></Text>
      	<TextInput
          style={styles.textBox}
          placeholder={convertText("planner.enterTripName", lang)}
          onChangeText={(val) => onChangeText(val, 'tour_name')}
          value={props.planner.formData.finalFormData && props.planner.formData.finalFormData.tour_name}
        />
      </View>

      <View style={styles.tabsCon}>
      	<TouchableOpacity style={[styles.tab, activeTab === 0 && styles.activeTab]} onPress={() => setActiveTab(0)}>
      		<Text style={[styles.tabText, activeTab === 0 && styles.activeTabText]}><FormatText variable='planner.schdule' /></Text>
      	</TouchableOpacity>
      	<TouchableOpacity style={[styles.tab, activeTab === 1 && styles.activeTab]} onPress={() => setActiveTab(1)}>
      		<Text style={[styles.tabText, activeTab === 1 && styles.activeTabText]}><FormatText variable='planner.detail' /></Text>
      	</TouchableOpacity>
      </View>
      {activeTab == 0 ? 
      	<View style={styles.SpotsCon}>
      		<View style={styles.lineBetween}></View>
	      	{props.planner.selectedSpots.map((item, index) => {
	      		return 	<View key={index} style={styles.gridItem}>
	      							<View style={styles.innerGridCon}>
						          	<GridCard
						          		spotView 
						          		isRegistered={true} 
						          		isCount
						          		count={index + 1}
						          		noCaption
						          		image={renderImage(item.image || item.img_url, 'spot')}
						          	/>
						          </View>
						          <View style={styles.spotDetailCon}>
						          	<Text style={styles.title}>{item.attname_local || item.name}</Text>
						          	<Text style={styles.subTitle}>{item.genre}</Text>
						          	{item.visit_time && <View style={styles.timeCon}>
				          							          		<Icon type="FontAwesome5" name={'clock'} style={styles.btnIcon} />
				          							          		<Text style={styles.timeText}>{item.visit_time}</Text>
				          							          	</View>
				          			}
						          	<Text numberOfLines={5}>{item.description}</Text>
						          	<Ripple 
						          		style={styles.editBtn}
						          		rippleColor="#aaa" 
                          rippleDuration={700}
                          onPress={() => editDetail(item)}
						          	>
						          		<Text><FormatText variable='planner.edit' /></Text>
						          	</Ripple>
						          </View>
						        </View>
	      	})}
	      </View>
	      :
	      <View style={styles.detailCon}>
	      	<View style={styles.formGroup}>
		      	<Text style={styles.label}><FormatText variable='planner.trip_visi' /></Text>
		      	<Picker
	            mode="dropdown"
	            iosHeader={convertText("planner.selectSIM", lang)}
	            iosIcon={<Icon name="arrow-down" />}
	            style={styles.picker}
	            selectedValue={props.planner.formData.finalFormData.status}
	            onValueChange={(val) => onChangeText(val, 'status')}
	          >
	            <Picker.Item label={convertText("planner.private", lang)} value="public_false" />
	            <Picker.Item label={convertText("planner.public", lang)} value="public_true" />
	          </Picker>
		      </View>
		      {/*<View style={styles.formGroup}>
		      		      	<Text style={styles.label}>Select Group</Text>
		      		      	<Picker
		      	            mode="dropdown"
		      	            iosHeader="Select your SIM"
		      	            iosIcon={<Icon name="arrow-down" />}
		      	            style={styles.picker}
		      	          >
		      	            <Picker.Item label="Private" value="key0" />
		      	            <Picker.Item label="Public" value="key1" />
		      	          </Picker>
		      		      </View>*/}
		      {props.planner.formData.finalFormData.status === 'public_false' && 
		      	<View style={styles.formGroup}>
  		      	<Text style={styles.label}><FormatText variable='planner.date' /></Text>
  		      	<Ripple rippleColor="#aaa" rippleDuration={700} style={styles.datePickerCon} onPress={() => setIsDatePickerVisible(true)}>
  		      		<Text>{renderDate()}</Text>
  		      	</Ripple>
  		      </View>
  		   	}
		      <View style={styles.formGroup}>
		      	<Text style={styles.label}><FormatText variable='planner.description' /></Text>
		      	<TextInput
		          style={[styles.textBox, {height: 100}]}
		          placeholder={convertText("planner.enterTripDesc", lang)}
		          multiline
		          onChangeText={(val) => onChangeText(val, 'description')}
          		value={props.planner.formData.finalFormData.description}
		        />
		      </View>
		      {/*<View style={styles.formGroup}>
		      		      	<Text style={styles.label}>Trip Photos</Text>
		      		      	<TextInput
		      		          style={styles.textBox}
		      		          placeholder="Search Spot"
		      		        />
		      		      </View>*/}
	      </View>
      }
      
      

      <View style={styles.submitBtnCon}>
      	<OwnButton 
      		buttonText="Submit" 
      		disabled={props.planner.formData.finalFormData && !props.planner.formData.finalFormData.tour_name}
      		onPress={() => submitForm()}
      		loading={props.planner.formLoading}
      	/>
      </View>

      <RBSheet
        ref={modalRef}
        height={400}
        openDuration={150}
        closeOnDragDown={true}
      >
        <EditSpotDetail 
        	currentSpot={currentSpot}
        	onChangeValues={onChangeValues}
			saveSpot={saveSpot}
			lang={lang}
        />
      </RBSheet>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onCancel={() => setIsDatePickerVisible(false)}
        onConfirm={(date) => onChangeText(date, 'date')}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  innerContainer: {
    padding: 10,
  },
  mainHeading:{
    fontSize: 22,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center'
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
  label: {
  	marginBottom: 5,
  	fontSize: 16
  },
  tabsCon: {
  	flexDirection: 'row',
  	marginTop: 20,
  	borderBottomWidth: 1,
  	borderColor: '#d7d7d7'
  },
  tab: {
  	backgroundColor: '#d7d7d7',
  	paddingVertical: 5,
  	paddingHorizontal: 10,
  	marginRight: 10,
  	borderTopLeftRadius: 5,
  	borderTopRightRadius: 5
  },
  activeTab: {
  	backgroundColor: primaryColor,
  },
  tabText: {
  	color: '#869094'
  },
  activeTabText: {
  	color: '#fff'
  },
  detailCon: {
  	backgroundColor: '#f5f5f5',
  	marginTop: 10,
  	padding: 15,
  	borderRadius: 10
  },
  formGroup: {
  	marginBottom: 10
  },
  picker: {
    backgroundColor: '#fff',
    height: 40,
    borderWidth: 1,
    borderColor: 'lightgrey'
  },
  submitBtnCon: {
  	marginTop: 20,
  	marginBottom: 50
  },
  submitBtn: {
  	backgroundColor: primaryColor,
  	alignItems: 'center',
  	justifyContent: 'center'
  },
  spotDetailCon: {
  	backgroundColor: '#f5f5f5',
  	width: '50%',
  	borderTopRightRadius: 10,
  	borderBottomRightRadius: 10,
  	padding: 10
  },
  gridItem: {
  	flexDirection: 'row',
  	width: '100%',
  	marginVertical: 20,
  },
  innerGridCon: {
  	width: '50%',
  	backgroundColor: '#fff'
  },
  title: {
  	fontSize: 20,
  	marginBottom: 5
  },
  subTitle: {
  	fontSize: 16,
  	color: '#aaa',
  	marginBottom: 5
  },
  editBtn:{
  	position: 'absolute',
  	bottom: 10,
  	borderWidth: 1,
  	borderColor: '#ccc',
  	width: '100%',
  	left: 10,
  	height: 30,
  	alignItems: 'center',
  	justifyContent: 'center',
  	borderRadius: 5
  },
  timeCon: {
  	backgroundColor: primaryColor,
  	width: 70,
  	borderRadius: 2,
  	marginTop: 5,
  	marginBottom: 5,
  	flexDirection: 'row',
  	paddingVertical: 3
  },
  timeText:{
  	fontSize: 15,
  	textAlign: 'center',
  	color: '#fff',
  },
  btnIcon: {
  	fontSize: 14, 
  	padding: 2,
  	color: '#fff',
  	marginLeft: 3,
  	marginRight: 2
  },
  lineBetween: {
  	backgroundColor: primaryColor,
  	width: 5,
  	height: '80%',
  	position: 'absolute',
  	top: 40,
  	left: width / 4 - 5
  },
  datePickerCon: {
  	borderWidth: 1,
    borderColor: 'lightgrey',
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    fontSize: 15,
    paddingLeft: 10,
    paddingRight: 50,
    justifyContent: 'center'
  }

});

const mapStateToProps = (state) => ({
  planner: state.planner,
  uiControls: state.uiControls,
  auth: state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ReviewStep);  



