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
  Platform,
} from 'react-native';
import {connect} from 'react-redux';
import { Icon, Button} from 'native-base'
import { Container, Content, Picker } from "native-base";
import { areasRecommended, prefecture, cities, primaryColor } from '../../redux/Constant'
import GridCard from '../../components/common/GridCard'
import OwnBreadcrumb from '../../components/common/OwnBreadcrumb'
import { changeForm, changeSelectedCity } from '../../redux/actions/planner'
import Ripple from 'react-native-material-ripple';
import Autocomplete from 'react-native-autocomplete-input'
import { searchCenterSpot } from '../../redux/api/planner'
import FormatText from '../../components/common/FormatText'
import ContentLoader from "../../components/common/ContentLoader"
import{ convertText } from '../../redux/Utility'



const { width, height } = Dimensions.get('screen');

const CenterStep = (props)  => {
  let lang = props.uiControls.lang
  const [query, setQuery] = useState('')
  const [hideResults, setHideResults] = useState(false)

  const selectItem = (item) => {
    props.dispatch(changeForm(item, 'centerData'))
    props.changeStep('next')
    setHideResults(true)
  }

  const isSelected = (id) => {
    if (id === props.planner.formData.centerData.id) {
      return true
    }
  }
  const renderPrefecture = () => {
    let filterCities = cities.filter(item => item.pref_cd == props.planner.selectedCity);
    return filterCities.map((item, index) => {
          const dataAreaTitle = item.label.split(' - ');
          return  <View key={index} style={styles.gridItem} >
                    <GridCard 
                      isActive={isSelected(item.id)} 
                      caption={dataAreaTitle[0] || item.label} 
                      image={item.image_url} 
                      onPress={() => selectItem(item)}
                    />
                  </View>
        })
  }

  const renderCenterSpots = () => {
    if(props.planner.center_spot){
      return props.planner.center_spot.map((item, index) => {
        return <View key={index} style={styles.gridItem}>
                <GridCard 
                  isActive={isSelected(item.id)} 
                  caption={item.attname} 
                  image={null} 
                  onPress={() => selectItem(item)}
                />
              </View>
      })
    } else {
      return <ContentLoader />
    }
  }

  const changeCity = (val) => {
    props.dispatch(changeSelectedCity(val))
  }

  const onSearch = (text) => {
    setQuery(text)
    props.dispatch(searchCenterSpot(text, props.uiControls.lang))
    setHideResults(false)
  }

  const spots = () => {
    if(props.activeTab === 'station'){
      return <View>
              <View style={styles.recommendedCon}>
                <Text style={styles.subheading}><FormatText variable='planner.popular' /></Text>
              </View>
              <View style={styles.gridListCon}>
                {renderPrefecture()}
              </View>
            </View>
    } else {
      return <View>
              <View style={styles.recommendedCon}>
                <Text style={styles.subheading}><FormatText variable='planner.center' /></Text>
              </View>
              <View style={styles.gridListCon}>
                {renderCenterSpots()}
              </View>
            </View>
    }
  } 

  const filters = () => {
    if(props.activeTab === 'station'){
      return <View>
                <View style={styles.heading}>
                  <Text style={styles.mainHeading}><FormatText variable='planner.where_is_the' /></Text>
                </View>
                <View style={[styles.filters, {zIndex: 10000}]}>
                  <View style={styles.textBoxCon}>
                    {/*<TextInput
                      style={styles.textBox}
                      placeholder="Search Spot"
                    />*/}
                    <Autocomplete 
                      data={props.planner.centerSpotsList}
                      inputContainerStyle={styles.textBox}
                      style={styles.autoCompleteCon}
                      defaultValue={query}
                      onChangeText={text => onSearch(text)}
                      renderItem={({ item, i }) => (
                        <TouchableOpacity style={styles.listItem} key={i} onPress={() => selectItem(item)}>
                          <Text>{item.label} ({item.name_local})</Text>
                        </TouchableOpacity>
                      )}
                      listContainerStyle={styles.listContainerStyle}
                      hideResults={hideResults}
                      placeholder={convertText("planner.searchCenter",lang)}
                    />
                    <Ripple style={styles.submitBtn}>
                      <Icon type="FontAwesome5" name={'search'} style={styles.btnIcon} />
                    </Ripple>
                  </View>
                  <View style={styles.pickerCon}>
                    <View style={styles.picker}>
                      <Picker
                        mode="dropdown"
                        iosHeader={convertText("planner.selectPrefecture",lang)}
                        iosIcon={<Icon name="arrow-down" style={styles.arrowIcon} />}
                        style={styles.pickerElement}
                        selectedValue={props.planner.selectedCity}
                        onValueChange={(val) => changeCity(val)}
                        itemTextStyle={styles.itemTextStyle}
                      >
                        {prefecture.map((item, index) => {
                          return <Picker.Item key={index} label={item.prefecture_en} value={item.id} />
                        })}
                      </Picker>
                    </View>
                  </View>
                </View>
              </View>
    }
  }

  return (
    <View style={styles.innerContainer}>
      {filters()}
      {/*<OwnBreadcrumb
              entities={['My Tab 1', 'My Tab 2', 'My Tab 3']}
            />*/}
      {spots()}
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
    padding: 10,
  },
  mainHeading:{
    fontSize: 20,
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
    marginRight: -6,
  },
  gridItem: {
    width: '50%',
    padding: 4,
    marginBottom:(Platform.OS == 'ios'? 0: 30)
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
    fontSize: 14,
    paddingLeft: 10,
    paddingRight: 50
  },
  picker: {
    backgroundColor: '#fff',
    height: 40,
    marginLeft: 10,
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 5
  },
  pickerElement: {
    padding: 0,
    width: '100%',
    height: '100%',
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
    justifyContent: 'center',
    zIndex: 10
  },
  btnIcon: {
    fontSize: 13,
    color: '#fff'
  },
  arrowIcon: {
    right: 0,
    position: 'absolute'
  },
  itemTextStyle: {
    fontSize: 13
  },
  autoCompleteCon: {
    height: 40
  },
  listContainerStyle: {

  },
  listItem: {
    padding: 5
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

export default connect(mapStateToProps, mapDispatchToProps)(CenterStep);  



