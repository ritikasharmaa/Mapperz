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
import FormatText from '../../components/common/FormatText'

const { width, height } = Dimensions.get('screen');

class ReviewList extends React.Component {
    render() {
        return(
            <Container style={styles.mainContainer}>
            	<Header backEnd blackBackBtn nextScreen="Footer" heading="Reviews" navigation={this.props.navigation}/>
              <Content>
                <View style={styles.body}>
                	<TouchableOpacity style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <Icon type="FontAwesome5" name='chevron-right' style={styles.btnIconListArrow} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Kings of Dumling</Text>

                      <View style={styles.listingInfo}>
                        <Rating
                          ratingCount={5}
                          imageSize={20}
                        />

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <Icon type="FontAwesome5" name='chevron-right' style={styles.btnIconListArrow} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Kings of Dumling</Text>

                      <View style={styles.listingInfo}>
                        <Rating
                          ratingCount={5}
                          imageSize={20}
                        />

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <Icon type="FontAwesome5" name='chevron-right' style={styles.btnIconListArrow} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Kings of Dumling</Text>

                      <View style={styles.listingInfo}>
                        <Rating
                          ratingCount={5}
                          imageSize={20}
                        />

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <Icon type="FontAwesome5" name='chevron-right' style={styles.btnIconListArrow} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Kings of Dumling</Text>

                      <View style={styles.listingInfo}>
                        <Rating
                          ratingCount={5}
                          imageSize={20}
                        />

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</Text>
                    </View>
                  </TouchableOpacity>


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
  profileCon: {
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderColor: '#eaeaea'
  },
  imgStyle:{
    width: 50,
    height: 50
  },
  profileTextCon:{
    paddingLeft: 15
  },
  nameText:{
    fontSize: 16
  },
  nameSubText: {
    fontSize: 16,
    color: '#a5a5a5',
    paddingRight: 100
  },
  listingInfo: {
    flexDirection: 'row',
    marginBottom: 10,
    marginTop: 10
  },
  btnIconList: {
    fontSize: 16,
    marginRight: 4,
    top: 2,
    color: '#9e9a9a',
    marginLeft: 10
  },
  iconInfo: {
    marginRight: 10,
    color: '#9e9a9a',
    fontSize: 16,
    top: 1
  },
  categoryBox: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    borderBottomWidth: 0,
    marginTop: 5
  },
  categoryCon: {
    padding: 15,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingLeft: 50,
    flexDirection: 'row'
  },
  categoryText: {
    fontSize: 16,
    fontWeight: '500'
  },
  btnIcon: {
    position: 'absolute',
    left: 10,
    top: 14,
    fontSize: 22
  },
  btnIconNext: {
    right: 15,
    left: 'auto',
    position: 'absolute',
    fontSize: 18,
    color: '#636363',
    top: 15
  },
  filterCon:{
  	backgroundColor: Colors.lighter,
  	padding: 5,
  	paddingLeft: 15,
  	paddingRight: 15,
  },
  filterConText: {
  	color: '#828282'
  },
  btnIconListArrow:{
    position: 'absolute',
    right: 15,
    fontSize: 18,
    top: '50%'
  }
});

export default ReviewList;