import React from 'react';
import { View, StyleSheet,Text, Image, ScrollView, Dimensions} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon,
  Picker
} from 'native-base'
import GestureRecognizer, {swipeDirections} from 'react-native-swipe-gestures';
import Feed from '../../components/SidebarComponents/Feed';
import Header from '../../components/common/Header';
//import Footer from '../../components/common/Footer';
import { connect } from 'react-redux';

const { width, height } = Dimensions.get('screen');

const NewsFeed = (props) =>{
	return(
		<Container>
			<Header navigation={props.navigation}/>
			<Content>
				<View style={styles.mainCon}>
					<Feed noGroupCard />	
				</View>
			</Content>
			{/*<Footer navigation={props.navigation}/>*/}
		</Container>
	)
}


const styles= StyleSheet.create({
	mainCon: {
		paddingBottom: 50,
	}
})


const mapStateToProps = (state) => ({
  state
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(NewsFeed);  
