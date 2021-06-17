import React, {Component} from 'react';
import {View, Platform} from 'react-native';
import MapboxGL from '@react-native-mapbox-gl/maps';
//import {mapScreenStyles as styles} from '../styles';


const IS_ANDROID = Platform.OS === 'android';

class Test extends Component {
 render() {
   const featureCollection = {
     type: 'FeatureCollection',
     features: [
       {
         type: 'Feature',
         id: 59242,
         properties: {icon: 'free', place_id: 59242, text: 'P'},
         geometry: {type: 'Point', coordinates: [5.301958, 60.38595]},
       },
       {
         type: 'Feature',
         id: 59405,
         properties: {icon: 'blue', place_id: 59405, text: 'P'},
         geometry: {type: 'Point', coordinates: [5.331669, 60.38566]},
       },
       {
         type: 'Feature',
         id: 8651,
         properties: {icon: 'paid', place_id: 8651, text: 'S'},
         geometry: {type: 'Point', coordinates: [5.358708, 60.35445]},
       },
       {
         type: 'Feature',
         id: 27276,
         properties: {icon: 'paid', place_id: 27276, text: 'S'},
         geometry: {type: 'Point', coordinates: [5.361255, 60.35024]},
       },
     ],
   };

   return (
     <View style={{flex: 1}}>
       <MapboxGL.MapView
         ref={c => (this._map = c)}
         showUserLocation={true}
         style={{flex: 1, backgroundColor: '#fff'}}
         regionDidChangeDebounceTime={10}>
         <React.Fragment>
           <MapboxGL.Camera
             animationMode="moveTo"
             animationDuration={1000}
             centerCoordinate={[5.361255, 60.35024]}
             zoomLevel={13}
           />
           <MapboxGL.UserLocation />           
           <MapboxGL.ShapeSource
             id="symbolLayerSource"
             shape={featureCollection}
             cluster
             clusterRadius={30}>
             <MapboxGL.SymbolLayer
               minZoomLevel={3}
               id="pointCount"
               style={layerStyles.clusterCount}
             />

             <MapboxGL.CircleLayer
               id="clusteredPoints"
               minZoomLevel={3}
               belowLayerID="pointCount"
               //filter={['has', 'point_count']}
               style={layerStyles.clusteredPoints}
             />

             <MapboxGL.SymbolLayer
               sourceLayerID="symbolLayerSource"
               id="symbolLocationSymbols"
               minZoomLevel={3}
               //filter={['!has', 'point_count']}
               style={mapStyles.parameterIcon}
             />
           </MapboxGL.ShapeSource>
         </React.Fragment>
       </MapboxGL.MapView>
     </View>
   );
 }
}

const mapStyles = {
 parameterIcon: {
   iconImage: ['get', 'icon'],
   iconSize: IS_ANDROID ? 0.3 : 0.06,
   iconAllowOverlap: true,
   textOffset: [0, -0.4],
   textField: '{text}',
   textSize: 14,
   textPitchAlignment: 'map',
   backgroundColor: 'red',
 },
};

const layerStyles = {
 singlePoint: {
   circleColor: 'green',
   circleOpacity: 0.84,
   circleStrokeWidth: 2,
   circleStrokeColor: 'white',
   circleRadius: 5,
   circlePitchAlignment: 'map',
 },

 clusteredPoints: {
   circlePitchAlignment: 'map',

   circleColor: [
     'step',
     ['get', 'point_count'],
     '#51bbd6',
     10,
     '#f1f075',
     20,
     '#f28cb1',
   ],

   circleRadius: ['step', ['get', 'point_count'], 20, 10, 30, 50, 40],

   circleOpacity: 0.8,
   circleStrokeWidth: 3,
   circleStrokeColor: 'white',
 },

 clusterCount: {
   textField: '{point_count}',
   textSize: 16,
   textPitchAlignment: 'map',
   lineWidth: 2,
 },
};

export default Test;
