import React, {useRef, useState, useEffect} from 'react';
import { View, StyleSheet, Dimensions, Text, Animated, TouchableOpacity, Image, Platform} from 'react-native';
import {Icon} from 'native-base'
import {primaryColor} from '../../redux/Constant'
import {setCenterCord} from '../../redux/actions/map'
import {connect} from 'react-redux';
import { renderImage, renderTitle, convertText, language } from '../../redux/Utility'
import _ from "lodash";
//import BottomSheet from 'reanimated-bottom-sheet';
import NoData from './NoData'
//import { scrollView } from 'react-native-parallax-scroll-view/src/styles';
//import {ScrollView}from  'react-native-gesture-handler'
import RBSheet from "react-native-raw-bottom-sheet";
import BottomDrawer from 'rn-bottom-drawer';
import DeviceInfo from 'react-native-device-info';
import {sliderOpen, sliderClose} from '../../redux/actions/map'


const { width, height } = Dimensions.get('screen');
const CARD_HEIGHT = 150/*height / 5*/;
const CARD_WIDTH = 100 /*CARD_HEIGHT - (Platform.OS === 'android' ? 40 : 40);*/
const notch = DeviceInfo.hasNotch()
const TAB_BAR_HEIGHT = 160



const Slider = (props) => {  
  let regionTimeout;
  let animationListerner;
  const animation = useRef(new Animated.Value(0)).current;
  const [isOpen, setIsOpen] = useState(false)
  const draweRef = useRef(null)

  useEffect(() => {
    let listener
    if(props.spot_details && props.spot_details.length){
      listener = animation.addListener(({ value }) => {
        let index = Math.floor(value / CARD_WIDTH + 0.2); // animate 30% away from landing on the next item
        if (index >= props.spot_details.length) {
          index = props.spot_details.length - 1;
        }
        if (index <= 0) {
          index = 0;
        }
        clearTimeout(regionTimeout); 
        regionTimeout = setTimeout(() => {
          const currentSpot = props.spot_details[index];    
          if(currentSpot){
            props.setCenterCord({centerCords : [currentSpot.longitude, currentSpot.latitude], id: currentSpot.id})
          }
        }, 1000)
      });
    }    
    return () => {listener}
  }, [animation.addListener])
  
  const openSpotDetail = (data) => {
    //props.toggleBar(0, 'left')
    props.setSpotDetail(data)
    props.getSpotMessage(data.id)
  }

  const renderSpots = () => {
    if(props.spot_details && props.spot_details.length){
      return props.spot_details.map((marker, index) => (
            <TouchableOpacity style={styles.card} key={index} onPress={() => openSpotDetail(marker)}>
              <Image
                source={renderImage(marker.img_url, 'spot')}/*marker.img_url ? {uri: marker.img_url} : require('../../assets/images/dummy.jpeg')*/
                style={styles.cardImage}
                resizeMode="cover"
              />
              <View style={styles.textContent}>
                <Text numberOfLines={1} style={styles.cardtitle}>{language(props.lang, marker.attname, marker.attname_local)}</Text>
                <Text numberOfLines={1} style={styles.cardDescription}>
                  {language(props.lang, marker.category, marker.categoryJa)}
                </Text>
              </View>
            </TouchableOpacity>
      ))
    } else {
      return <View style={styles.noDataCon}>
              <NoData noSubTitile/>
            </View>
    }
    // return <>
    //         <TouchableOpacity style={styles.card} >
    //           <Image
    //             source={require('../../assets/images/dummy.jpeg')}
    //             style={styles.cardImage}
    //             resizeMode="cover"
    //           />
    //           <View style={styles.textContent}>
    //             <Text numberOfLines={1} style={styles.cardtitle}>Name</Text>
    //             <Text numberOfLines={1} style={styles.cardDescription}>
    //               cardDescription
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.card} >
    //           <Image
    //             source={require('../../assets/images/dummy.jpeg')}
    //             style={styles.cardImage}
    //             resizeMode="cover"
    //           />
    //           <View style={styles.textContent}>
    //             <Text numberOfLines={1} style={styles.cardtitle}>Name</Text>
    //             <Text numberOfLines={1} style={styles.cardDescription}>
    //               cardDescription
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.card} >
    //           <Image
    //             source={require('../../assets/images/dummy.jpeg')}
    //             style={styles.cardImage}
    //             resizeMode="cover"
    //           />
    //           <View style={styles.textContent}>
    //             <Text numberOfLines={1} style={styles.cardtitle}>Name</Text>
    //             <Text numberOfLines={1} style={styles.cardDescription}>
    //               cardDescription
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //         <TouchableOpacity style={styles.card} >
    //           <Image
    //             source={require('../../assets/images/dummy.jpeg')}
    //             style={styles.cardImage}
    //             resizeMode="cover"
    //           />
    //           <View style={styles.textContent}>
    //             <Text numberOfLines={1} style={styles.cardtitle}>Name</Text>
    //             <Text numberOfLines={1} style={styles.cardDescription}>
    //               cardDescription
    //             </Text>
    //           </View>
    //         </TouchableOpacity>
    //       </>
    
  }

  const goToLeft = () => {
    //props.sliderClose()
    props.dispatch(sliderClose())
    props.toggleBar(0, 'left')
  }

  const renderContent = () => {
    return <View style={styles.sliderCon}>           
            {isOpen && <TouchableOpacity style={styles.expandCon} onPress={() => goToLeft()} >
              <Icon type="FontAwesome5" name={'arrows-alt'} style={styles.expandIcon} />
            </TouchableOpacity>}
            <Animated.ScrollView
              horizontal
              scrollEventThrottle={1}
              showsHorizontalScrollIndicator={false}
              snapToInterval={CARD_WIDTH}
              scrollToOverflowEnabled={true}
              onScroll={Animated.event(
                [
                  {
                    nativeEvent: {
                      contentOffset: {
                        x: animation,
                      },
                    },
                  },
                ],
                { useNativeDriver: true }
              )}
              style={styles.scrollView}
              contentContainerStyle={styles.endPadding}
            >
            {renderSpots()}
            </Animated.ScrollView>
          </View>
  }

  const onOpenEnd = () => { 
    setIsOpen(true)
    props.dispatch(sliderOpen())
    //props.sliderOpen()
    //props.hideOverlay()
  }

  const onCloseEnd = () => {
    setIsOpen(false)
    props.dispatch(sliderClose())
    //props.sliderClose()
  }

  {/* // <BottomDrawer
    //   containerHeight={notch ? 330 : 270}
    //   //offset={40}
    //   downDisplay={TAB_BAR_HEIGHT}
    //   onExpanded={onOpenEnd}
    //   onCollapsed={onCloseEnd}
    //   startUp={false}
    // >
    //   {renderContent()}
    // </BottomDrawer>  */}

  return(
    <View>
      <TouchableOpacity style={styles.btnIcon} onPress={() => draweRef.current.open()}>
        {!isOpen && <Icon type="FontAwesome5" name={'window-minimize'} style={{color: 'grey', marginBottom: 25}} />}
      </TouchableOpacity>
      <RBSheet
        ref={draweRef}
        height={250}
        onOpen={onOpenEnd}
        onClose={onCloseEnd}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        dragFromTopOnly={true}
        customStyles={{
          wrapper: {
            bottom: 90,
            position: 'absolute',
            zIndex: -99,
            backgroundColor: 'transparent'
          },
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }
        }}
      >
        {renderContent()}
      </RBSheet>
    </View>
  )  
}

const styles = StyleSheet.create({
  scrollView: {
    paddingTop: 20,
  },
  endPadding: {
    paddingRight: width - CARD_WIDTH,
  },
  card: {
    padding: 10,
    elevation: 2,
    backgroundColor: "#FFF",
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowRadius: 5,
    shadowOpacity: 0.3,
    shadowOffset: { x: 2, y: -2 },
    height: CARD_HEIGHT,
    width: CARD_WIDTH,
    overflow: "hidden",
    zIndex: 1000
  },
  cardImage: {
    flex: 3,
    width: "100%",
    height: "100%",
    alignSelf: "center",
  },
  textContent: {
    flex: 1,
  },
  cardtitle: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: "bold",
  },
  cardDescription: {
    fontSize: 12,
    color: "#444",
  },
  markerWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  marker: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(130,4,150, 0.9)",
  },
  ring: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "rgba(130,4,150, 0.3)",
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(130,4,150, 0.5)",
  },
  sliderCon:{
    backgroundColor: '#f5f5f5',
    padding: 16,
    height: 280,
    zIndex: 99999
  },
  btnIcon: {
    position: 'absolute',
    color: 'grey',
    backgroundColor: '#f5f5f5',
    bottom: 60,
    height: 30,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  noDataCon: {
    height: 140, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: width,
    marginLeft: -10,
  },
  expandCon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 99
  },
  expandIcon: {
    color: primaryColor,
    fontSize: 18,    
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapDispatchToProps)(Slider);

