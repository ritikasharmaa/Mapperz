import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Keyboard
} from 'react-native';
import {
  Container,
  Content,
  Icon
} from 'native-base';
import { primaryColor, secondColor, secondaryColor } from '../../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import {connect} from 'react-redux';
import {userDetail} from '../../../redux/actions/auth'
import FormatText from '../../../components/common/FormatText'
import Autocomplete from 'react-native-autocomplete-input'
import { convertText } from '../../../redux/Utility'
import { searchCenterSpot, getCenterSpots } from '../../../redux/api/planner'
import ContentLoader from '../../../components/common/ContentLoader'
import GridCard from '../../../components/common/GridCard'

const { width, height } = Dimensions.get('screen');


const Areas = (props) => {

  let lang = props.uiControls.lang
  const [query, setQuery] = useState('')
  const [hideResults, setHideResults] = useState(false)
  const [selectedItem, setSelectedItem] = useState([])
  const [isFocused, setIsFocused] = useState(null)


  useEffect(() => {
    props.dispatch(getCenterSpots(lang))
  },[])

  const onSearch = (text) => {
    setQuery(text)
    props.dispatch(searchCenterSpot(text, props.uiControls.lang))
    setHideResults(false)
  }

  const selectItem = (item) => {
    let list = [...selectedItem]
    let index = selectedItem.findIndex(spot => spot.id === item.id)
    if(index === -1){
      list.push(item)
    } else {
      list.splice(index, 1)
    }
    setHideResults(true)
    setSelectedItem(list)
  }

  const renderCenterSpots = () => {
    if(props.planner.center_spot){
      return props.planner.center_spot.map((item, index) => {
        let spotIndex = selectedItem.findIndex(curItem => curItem.id === item.id)
        return <View key={index} style={styles.gridItem}>
                <TouchableOpacity onPress={() => selectItem(item)}>
                  <Text numberOfLines={1} style={[styles.spotName, spotIndex > -1 && {backgroundColor: '#ebecf1'}]}>{item.attname || item.attname_local}</Text>
                </TouchableOpacity>
                {/* <GridCard 
                  //isActive={isSelected(item.id)} 
                  caption={item.attname || item.attname_local} 
                  image={item.img_url}                   
                /> */}
              </View>
      })
    } else {
      return <ContentLoader />
    }
  }

  const spots = () => {
    return  <ScrollView style={{zIndex: -1, borderRadius: 20}}>
              <View style={styles.spotCon}>
                <Text style={styles.subheading}><FormatText variable='signup.popular_areas' /></Text>
              </View>
              <View style={styles.gridListCon}>
                {renderCenterSpots()}
              </View>
            </ScrollView>
  }

  const removeItem = (item) => {
    let list = [...selectedItem]
    let index = selectedItem.findIndex(spot => spot.id === item.id)
    list.splice(index, 1)
    setSelectedItem(list)
  }

  const goToPicture= (key) => {
    if(key === 'skip'){
      setSelectedItem([])
    } else {
      props.dispatch(userDetail(selectedItem, "spots"))
    }
    Keyboard.dismiss()   
    props.navigation.navigate('UploadPicture')
  }

  const selectedItems = () => {
    if(selectedItem.length){
      return <View style={styles.selectedMainCon}>
              <Text style={styles.subheading}><FormatText variable='signup.selected_spots' /></Text>
              <View style={styles.selectedCon}>
                {selectedItem.map((item, index) => {
                return <View key={index} style={styles.selectedItemCon}>
                          <Text numberOfLines={1} style={styles.item}>{item.attname || item.attname_local}</Text>
                          <TouchableOpacity style={styles.btnCon} onPress={() => removeItem(item)}>
                            <Icon type="FontAwesome5" name={'times'} style={styles.crossBtn} />
                          </TouchableOpacity>
                        </View> })}
              </View> 
            </View>     
    }    
  } 

	return(
    <Container style={styles.mainCon}>
      <Content>
        <View style={styles.logoCon}>
          <Image source={require('../../../assets/images/sign_up3.png')} style={styles.iconImage} />
        </View>
      {/* <LinearGradient 
        colors={['#9248e7', '#9949e8', '#bb4fef', '#9949e8', '#9248e7']} 
        style={styles.background}
       > */}
  			<View style={styles.nameCon}>
          <View style={styles.textBoxCon}>
            <Text style={styles.heading}><FormatText variable='signup.choose_areas' /></Text>
            <View style={styles.autocompleteCon}>
              <Autocomplete 
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
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
                hideResults={hideResults}
                placeholder={convertText("msgscomp.select",lang)}
              />
              <Ripple style={styles.submitBtn}>
                <Icon type="FontAwesome5" name={'search'} style={styles.btnIcon} />
              </Ripple>
            </View>
            {selectedItems()}                      
          </View>
          {spots()}
        </View>
      {/* </LinearGradient> */}
        {isFocused && <View style={{alignSelf:'center' }}>
          <TouchableOpacity style={styles.continueBtnCon} onPress={() => goToPicture()}>
            <Text style={styles.continueBtn}><FormatText variable='signup.continue' /></Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.skipBtnCon, {borderWidth: 1, borderColor: primaryColor}]} onPress={() => goToPicture('skip')} >
            <Text style={styles.skipBtn}><FormatText variable='signup.skip' /></Text>
          </TouchableOpacity>
        </View>}
      </Content>
        {!isFocused && <View style={{position: 'absolute', bottom: -30, alignSelf:'center' }}>
          <TouchableOpacity style={styles.continueBtnCon} onPress={() => goToPicture()}>
            <Text style={styles.continueBtn}><FormatText variable='signup.continue' /></Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.skipBtnCon} onPress={() => goToPicture('skip')} >
            <Text style={styles.skipBtn}><FormatText variable='signup.skip' /></Text>
          </TouchableOpacity>
        </View>}    
    </Container>
	)
}

const styles = StyleSheet.create({
  mainCon:{
    flex:1
  },
  logoCon: {
    width:width,
    height: width - 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  background: {
    width: '100%',
    height: '100%'
  },
  nameCon: {
    paddingHorizontal: 20,
  },
  continueBtnCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginVertical: 10,
    borderRadius: 20,
    backgroundColor:primaryColor,
    width: 130
  },
  continueBtn: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    color: '#fff'
  },
  /*autocompleteCon: {
    left: 0,
    //position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },*/
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
  autoCompleteCon: {
    height: 40,
    color: '#000'
  },
  listItem: {
    padding: 5,
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
    backgroundColor: 'rgba(146, 72, 231,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  btnIcon: {
    fontSize: 13,
    //color: '#fff'
  },
  heading: {
   fontSize: 18,
   fontWeight: '600',
   marginBottom: 10
  },
  spotCon: {
    marginBottom: 10,
    marginTop: 30
  },
  subheading: {
    fontWeight: '600',
    fontSize: 16
  },
  selectedCon: {
    flexDirection: 'row',  
    flexWrap: 'wrap'
  },
  selectedItemCon: {
    backgroundColor: primaryColor,
    width: 80,
    paddingVertical: 5,
    borderRadius: 15,
    paddingLeft: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 20,
    marginRight: 5,
    marginTop: 5,
  },
  item: {
    fontSize: 13,
    color: '#fff'
  },
  crossBtn: {
    fontSize: 13,  
    color: '#fff' 
  },
  btnCon: {
    position: 'absolute',
    right: 8,
    justifyContent: 'center',
  },
  selectedMainCon: {
    marginTop: 15,
    zIndex: -1,
  },
  gridListCon: {
   // marginTop: 10,
    flexDirection: 'row',
    //justifyContent: 'space-between',
    flexWrap: 'wrap' ,
  },
  gridItem: {
    width: '50%',
    padding: 4,
  },
  skipBtnCon: {
    width: 130,
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor:'#fff',
    borderRadius:20, 
    padding:10,
    borderWidth: 1,
    borderColor: primaryColor
  },
  skipBtn: {
    color: secondColor
  },
  spotName: {
    borderWidth: 1,
    borderColor: primaryColor,
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
    overflow: 'hidden'
  }
})

const mapStateToProps = (state) => ({
  planner: state.planner,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Areas); 
