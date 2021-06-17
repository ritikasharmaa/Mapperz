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

const { width, height } = Dimensions.get('screen');

class Following extends React.Component {
    render() {
        return(
            <Container style={styles.mainContainer}>
              <Header backEnd blackBackBtn nextScreen="Footer" heading="Following" navigation={this.props.navigation}/>
              <Content>
                <View style={styles.body}>
                  <View style={styles.filterCon}>
                    <Text style={styles.filterConText}>A</Text>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>

                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>

                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>
                  <View style={styles.filterCon}>
                    <Text style={styles.filterConText}>B</Text>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
                  </View>
                  <View style={styles.profileCon}>
                    <Image source={require('../../assets/images/test.jpg')} style={styles.imgStyle} />
                    <View style={styles.profileTextCon}>
                      <Text style={styles.nameText}>Rupinderpal Singh</Text>
                      <View style={styles.listingInfo}>
                        <Icon type="FontAwesome5" name='users' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>67</Text>

                        <Icon type="FontAwesome5" name='star' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>167</Text>

                        <Icon type="FontAwesome5" name='camera' style={styles.btnIconList} />
                        <Text style={styles.iconInfo}>1,671</Text>
                      </View>
                      <Text style={styles.nameSubText}>Queens, NY</Text>
                    </View>
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
    fontSize: 12,
    color: '#a5a5a5'
  },
  listingInfo: {
    flexDirection: 'row'
  },
  btnIconList: {
    fontSize: 12,
    marginRight: 4,
    top: 2,
    color: '#9e9a9a'
  },
  iconInfo: {
    marginRight: 10,
    color: '#9e9a9a'
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
  }
});

export default Following;