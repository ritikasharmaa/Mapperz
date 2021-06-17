import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  FlatList
} from "react-native";
import { Icon, Button } from "native-base";
import Ripple from "react-native-material-ripple";
import ContentLoader from "../common/ContentLoader";
import OptimizedFlatList from "react-native-optimized-flatlist";
import { primaryColor } from "../../redux/Constant";
import {language, renderImage} from "../../redux/Utility"

const { width, height } = Dimensions.get("screen");

const SpotList = (props) => {

  /*const renderItem = (item) => {
		return 	<TouchableOpacity style={styles.detailSection} key={index} onPress={() => props.selectSpot(item)}>
							<View style={styles.leftCon}>
								<FastImage source={item.img_url ? {uri: item.img_url} : require('../../assets/images/dummy.jpeg')} style={styles.headerLogo} />
							</View>
							<View style={styles.centerCon}>
								<Text style={styles.title}>{item.attname_local.substring(0, 13)}</Text>
								<Text style={styles.subTitle}>{item.category.substring(0,16)}</Text>
								<Text style={styles.footerTitle}>{item.address.substring(0,14)}</Text>
							</View>
							<View style={styles.btnCon}> 
								<Ripple 
									rippleOpacity={0.2} 
			          	rippleDuration={600}
									style={[styles.actionBtn, styles.bookmarkBtn]}
								>
									<Icon type="FontAwesome5" name={'bookmark'} style={styles.mapIcon} />
			          </Ripple>
								<Ripple style={[styles.actionBtn, styles.mapBtn]}>
									<Icon type="FontAwesome5" name={'map-marker'} style={styles.mapIcon} />
			          </Ripple>
							</View>
						</TouchableOpacity>
	}*/

  let lang = props.lang

	const centerOnSpot = ( cord, id ) => {
		 props.setCenterCord({centerCords : cord, id: id} )
		 props.toggleBar('', 'left')
	}

	const changePage = (dir) => {
    let currentpage = props.page;
    if (dir === "next") {
      currentpage += 1;
    } else {
      currentpage -= 1;
    }
    props.setPageCount(currentpage);
  };

	const getSpotMessages = (item) => {
		props.selectSpot(item)
		props.getSpotMessage(item.id)
	}

	const renderSpotList = () => {
		if (props.fetchingDetail) {
			return <ContentLoader />
		} else if (props.spotList && props.spotList.length) {
			let filteredList = props.spotList.filter(item => {
				if (item.attname_local && item.attname_local.indexOf(props.searchText) !== -1 && (!props.filters.length || props.filters.indexOf(item.category)) !== -1 ) {
					return item
				}
			})

			let start = (props.page - 1) * 10;
      let end = props.page * 10;
      let data = 'spot'
			return filteredList.slice(start, end).map((item, index) => {
				return 	<TouchableOpacity style={styles.detailSection} key={index} onPress={() => getSpotMessages(item)}>
									<View style={styles.leftCon}>
										<Image source={renderImage(item.img_url, 'spot')} style={styles.headerLogo} />
									</View>
									<View style={styles.centerCon}>
										<Text numberOfLines={1} style={styles.title}>{language(lang, item.attname, item.attname_local)}</Text>
										<Text style={styles.subTitle}>{language(lang, item.category, item.categoryJa)}</Text>
										<Text style={styles.footerTitle}>{item.address && item.address.substring(0,14)}</Text>
									</View>
									<View style={styles.btnCon}> 
										<Ripple 
											rippleOpacity={0.2} 
					          	rippleDuration={600}
											style={[styles.actionBtn, styles.bookmarkBtn, item.isFav && {backgroundColor: primaryColor}]}
											onPress={() => props.addSpotToFav({id: item.id, type: 'Spot'})}
										>
											<Icon type={item.isFav ? "FontAwesome" : "FontAwesome5"} name={'heart'} style={[styles.mapIcon, item.isFav && {color: '#fff'}]} />
					          </Ripple>
										<Ripple 
											rippleOpacity={0.2} 
					          	rippleDuration={600}
											style={[styles.actionBtn, styles.mapBtn]}
											onPress={() => centerOnSpot([item.longitude, item.latitude], item.id)}
										>
											<Icon type="FontAwesome5" name={'map-marker'} style={styles.mapIcon} />
					          </Ripple>
									</View>
								</TouchableOpacity>
			})
		}
	}

	let totalPages = Math.ceil(props.spotList && props.spotList.length / 10);

  const renderButtons = () => {
    if (!props.spotList) {return}
    let filteredList = props.spotList.filter(item => {
        if (item.attname_local && item.attname_local.indexOf(props.searchText) !== -1 && (!props.filters.length || props.filters.indexOf(item.category)) !== -1 ) {
          return item
        }
      })

    if (filteredList.length > 10) {
      return  <View style={styles.pageCon}>
                <Button
                  style={[
                    props.page === 1 && styles.buttonDisabled,
                    styles.pageButtonCon,
                  ]}
                  onPress={() => changePage("prev")}
                  disabled={props.page === 1}
                >
                  <Icon type="FontAwesome5" name={"arrow-left"} style={[styles.icon]} />
                </Button>
                <Button
                  style={[
                    props.page === totalPages && styles.buttonDisabled,
                    styles.pageButtonCon,
                  ]}
                  onPress={(e) => changePage("next")}
                  disabled={props.page === totalPages}
                >
                  <Icon
                    type="FontAwesome5"
                    name={"arrow-right"}
                    style={[styles.icon]}
                  />
                </Button>
              </View>
    }
  }

	return(
		<View>
      {renderSpotList()}
      {renderButtons()}
    </View>
	)
}

const styles = StyleSheet.create({
  centerCon: {
    paddingLeft: 15,
    width: width - 200,
  },
  title: {
    fontSize: 14,
    fontWeight:'bold'
  },
  subTitle: {
    color: "#959DA2",
    fontSize: 14,
    marginVertical: 10,
  },
  footerTitle: {
    fontSize: 12,
  },
  detailSection: {
    flexDirection: "row",
    flexWrap: "nowrap",
    borderBottomWidth: 1,
    paddingTop: 6,
    paddingBottom: 6,
    borderBottomColor: "#E5E5E6",
  },
  leftCon: {
    width: 100,
    paddingLeft: 15,
  },
  headerLogo: {
    width: 80,
    height: 80,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  actionBtn: {
    borderColor: "#E5E5E6",
    borderWidth: 1,
    backgroundColor: "#fff",
    width: 35,
    height: 35,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  mapBtn: {},
  mapIcon: {
    color: "#000000",
    fontSize: 14,
  },
  bookmarkBtn: {
    marginRight: 10,
  },
  btnCon: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    top: 25,
  },
  pageCon: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    paddingVertical: 20
  },
  icon: {
    fontSize: 18,
    color: "#000000",
  },
  pageButtonCon: {
    borderColor: "#E5E5E6",
    borderWidth: 1,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  
});

export default SpotList;
