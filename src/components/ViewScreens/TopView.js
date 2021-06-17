import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  RefreshControl,
} from "react-native";
import { primaryColor } from "../../redux/Constant";
import { connect } from "react-redux";
import { getSpecificMapDetail } from "../../redux/api/map";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import BaseMaps from "./BaseMaps";
import FavoritedMaps from "./FavoritedMaps";
import UserCreatedMaps from "./UserCreatedMaps";
import SuggestedMaps from "./SuggestedMaps";
import { getAllMaps } from "../../redux/api/map";
import { convertText } from "../../redux/Utility";
import Ripple from "react-native-material-ripple";
import { Icon, Button } from "native-base";

const TopView = (props) => {
  const [refreshing, setRefreshing] = useState(false);

  const Tab = createMaterialTopTabNavigator();
  let lang = props.lang;

  const renderTabs = () => {
    return (
      <Tab.Navigator
        tabBarOptions={{
          labelStyle: { fontSize: 12, fontWeight: "700" },
        }}
        style={{backgroundColor: "#ffff"}}
        
      >
        {/* <Tab.Screen
          options={{backgroundColor: 'red'}}
          name={convertText("screencomp.suggested", lang)}
          children={() => (
            <SuggestedMaps
              {...props}
              addSpotToFav={props.addSpotToFav}
              lang={lang}
            />
          )}
        /> */}
        <Tab.Screen
          options={{backgroundColor: 'red'}}
          name={convertText("screencomp.userMap", lang)}
          children={() => (
            <>
            <BaseMaps
              {...props}
              // handleMapSelected={() => props.handleMapSelected()}
              // addSpotToFav={props.addSpotToFav}
              // removeToFav={props.removeToFav}
              // lang={lang}
              // getNearestSpots={props.getNearestSpots}
              // currentMap={props.currentMap}
              // fetchingAllMaps={props.fetchingAllMaps}
              // allMaps={props.allMaps}
              // dispatch={props.dispatch}
            />
            <UserCreatedMaps 
              {...props}
            />
            </>
          )}
        />
        {/* <Tab.Screen
          name={convertText("screencomp.userMap", lang)}
          children={() => (
            <UserCreatedMaps
              {...props}
              // addSpotToFav={props.addSpotToFav}
              // handleMapSelected={() => props.handleMapSelected()}
              // deleteUser={props.DeleteMap}
              // lang={lang}
              // removeToFav={props.removeToFav}
              // getNearestSpots={props.getNearestSpots}
              // currentMap={props.currentMap}
              // fetchingAllMaps={props.fetchingAllMaps}
              // allMaps={props.allMaps}
              // getSuggestedSpot={props.getSuggestedSpot}
              // updatingSuggestion={props.updatingSuggestion}
              // suggestedSpot={props.suggestedSpot}
              // dispatch={props.dispatch}
              // loading={props.loading}
              // updateHomemap={props.updateHomemap}
              // getAllMaps={props.getAllMaps}
              // navigation={props.navigation}
            />
          )}
        /> */}
        <Tab.Screen
          name={convertText("screencomp.favorite", lang)}
          children={() => (
            <FavoritedMaps
              {...props}
              // addSpotToFav={props.addSpotToFav}
              // handleMapSelected={() => props.handleMapSelected()}
              // lang={lang}
              // dispatch={props.dispatch}
              // removeToFav={props.removeToFav}
              // fetchingAllMaps={props.fetchingAllMaps}
              // allMaps={props.allMaps}
              // currentMap={props.currentMap}
            />
          )}
        />
      </Tab.Navigator>
    );
  };
  const onRefresh = () => {
    setRefreshing(true);
    props.dispatch(getAllMaps()).then((res) => {
      setRefreshing(false);
    });
  };

  return (
    <ScrollView
      style={styles.mainCon}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={{backgroundColor: 'red'}}>
      {renderTabs()}
      </View>
        
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: "#fff",
  },
  btn: {
    shadowColor: "lightgrey",
    shadowRadius: 10,
    shadowOpacity: 1,
    width: 50,
    height: 50,
    borderRadius: 30,
    position: "absolute",
    bottom: 50,
    right: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  actionBtns: {
    backgroundColor: primaryColor,
    //bottom: 0,
    zIndex: 11,
  },
  actionButtonIcon: {
    color: "#fff",
    fontSize: 20,
  },
});

const mapStateToProps = (state) => ({
  //map: state.map,
  //planner: state.planner,
  //uiControls: state.uiControls,
});

const mapDispatchToProps = (dispatch) => ({
  dispatch,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TopView);
