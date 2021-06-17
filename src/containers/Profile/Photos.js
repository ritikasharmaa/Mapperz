import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  Image
} from 'react-native';

import {
  Button,
  Container,
  Content,
  Icon
} from 'native-base'

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import Header from '../../components/common/Header'
import { Rating, AirbnbRating } from 'react-native-ratings';

const { width, height } = Dimensions.get('screen');

class Photos extends React.Component {
    render() {
        return(
            <Container style={styles.mainContainer}>
            	<Header backEnd blackBackBtn nextScreen="Footer" heading="Photos" navigation={this.props.navigation}/>
              <Content>
                <View style={styles.body}>
                  <View style={styles.photoWrap}>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.imgCon}>
                      <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    </TouchableOpacity>
                  </View>
                </View>
              </Content>
            </Container>
        )
    }
}

const styles = StyleSheet.create({
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    flex: 1
  },
  mainContainer: {
    backgroundColor: Colors.lighter,
  },
  photoWrap:{
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: -2
  },
  imgStyle:{
    width: '100%',
    height: '100%'
  },
  imgCon:{
    width: '50%',
    height: width/2,
    borderWidth: 2,
    borderColor: '#fff'
  }
});

export default Photos;