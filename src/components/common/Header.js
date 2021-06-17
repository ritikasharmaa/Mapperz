import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, Switch } from 'react-native';
import {Icon} from 'native-base'
import { NavigationActions } from 'react-navigation'
import { setActiveTabIndex } from '../../redux/actions/uiControls';
import RBSheet from "react-native-raw-bottom-sheet";
import EditImage from './EditImage';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import SyncStorage from 'sync-storage';
import{ renderImage} from '../../redux/Utility'
import { primaryColor } from '../../redux/Constant';
import {connect} from 'react-redux';
import {setToggleState} from '../../redux/actions/map'


const Header = (props) => {
	const modalRef = useRef(null)
  const toggleSwitch = (e) => {
    
    props.dispatch(setToggleState(e))
  }
 
	const leftDataCon = () => {
		if(props.backEnd){
			return 	<TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.navigate(props.nextScreen)}>
								<Icon type="FontAwesome5" name={'chevron-left'} style={[styles.backBtnIcon, props.blackBackBtn && {color: '#aaa'}]} />
							</TouchableOpacity>
		} else if(props.textAlignLeft){
			return 	<>
								<TouchableOpacity style={styles.backBtn} onPress={() => props.navigation.navigate(props.nextScreen)}>
									<Icon type="FontAwesome5" name={'chevron-left'} style={[styles.backBtnIcon, props.blackBackBtn && {color: '#aaa'}]} />
								</TouchableOpacity>
								<View style={[styles.leftTextCon]}>
									<Text style={[styles.leftText, (props.transParent || props.backgroundColor) && {color: '#fff'}]}>{props.leftHeading}</Text>
								</View>
							</>
		} else if(props.centerHeading){
			return 	<></>
		}/* else if(props.barSide === 'right1'){
				return  <TouchableOpacity style={styles.backBtn} onPress={() => props.toggleBar('', 'right', true)}>
									<Icon type="FontAwesome5" name={'chevron-left'} style={styles.backBtnIcon, props.barSide && {color:'#aaa', fontSize:17} } />
									<Text style={styles.homeBtn}>Home</Text>
								</TouchableOpacity>
		}	*/
		 else if (!props.barSide) {
			let userData = SyncStorage.get('userData');
			if (!userData) {
				return null
			} 
			return	<View style={styles.headerProfile}>
								<TouchableOpacity style={styles.imageCon} onPress={() =>  props.navigation.navigate('Footer', {
																																	routeId : 4
																																})}>
									<Image source={userData && renderImage(userData.profile_image, 'user')} style={styles.headerLogo} />
								</TouchableOpacity>
								{userData.nick_name ? <View style={styles.profileText}>
									<Text style={styles.mainText}>{userData.nick_name}</Text>
								</View> : <View style={styles.profileText}>
									<Text style={styles.mainText}>{(userData.first_name + ' ' +userData.last_name)}</Text>
								</View>}
							</View>
		}
	}

	const menuOption = () => {
		if(props.editGroupPicture){
			return <MenuOption style={styles.menuItem} onSelect={() => modalRef.current.open()} text='Edit Group Picture' />
		} else {
			return 	<View style={styles.threeDot}>
					  <MenuOption style={styles.menuItem} onSelect={() => modalRef.current.open()} text='Change Profile Picture' />
					</View>
		}
	}

	const renderRightContent = () => {
		if (props.threeDotMenu) {
			return <Menu>
					      <MenuTrigger >
					      	<Icon type="FontAwesome5" name={'ellipsis-v'} style={styles.editIcon} />
					      </MenuTrigger>
					      <MenuOptions>
					        {menuOption()}
					      </MenuOptions>
					    </Menu>
		} else if (props.rightBtn) {
			return 	<TouchableOpacity style={styles.rightBtn} onPress={() => props.onRightBtnClick()}>
								<Icon type="FontAwesome5" name={props.rightBtn} style={[styles.btnIcon, props.blackBackBtn && {color: '#aaa'}]} />
							</TouchableOpacity>
		} else if(props.switch) {
			return <View style={{flexDirection: 'row'}}>
              <Text numberOfLines={2} style={styles.switchText}>Position Sharing</Text>
              <View style={{alignSelf: 'center'}}>
                <Switch
                  trackColor={{ false: "#767577", true: primaryColor }}
                  thumbColor={"#f4f3f4"}
                  ios_backgroundColor="#3e3e3e"
                  onValueChange={toggleSwitch}
                  value={props.toggleValue}
                />
              </View>             
            </View>
		}
			/*else if(props.barSide === 'left1'){
			return  <TouchableOpacity style={[styles.backBtn]} onPress={() => props.toggleBar('', 'left', true)}>
								<Icon type="FontAwesome5" name={'chevron-right'} style={styles.backBtnIcon, props.barSide && {color:'#aaa', fontSize:17, top:-5}} />
							</TouchableOpacity>
		}*/ /*else if(props.barSide === 'right1') {
			return <TouchableOpacity style={[styles.rightBtn]} >
								<Icon type="FontAwesome5" name={'search'} style={styles.search } />
						</TouchableOpacity>
		}*/ /*else {
			return <TouchableOpacity style={styles.rightBtn} disable onPress={() => props.navigation.navigate('Notifications')}>
							<Icon type="FontAwesome5" name={'globe'} style={styles.btnIcon} />
						</TouchableOpacity>
		}*/
	}

	return(
		<View style={[styles.headerCon, props.transParent && {backgroundColor: 'transparent', borderWidth: 0}, props.backgroundColor && {backgroundColor: props.backgroundColor}]}>
			<View style={styles.leftCon}>
				 {leftDataCon()}
			</View>
			<View style={styles.centerCon}>
				<Text style={[styles.topText, (props.transParent || props.backgroundColor) && {color: '#fff'}]}>{props.heading}</Text>
			</View>
			 <View style={styles.rightCon}>
				{renderRightContent()}			
			</View>	
			<RBSheet
        ref={modalRef}
        height={170}
        openDuration={250}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
          }
        }}
      >
        <EditImage hideModal={() => modalRef.current.close()} groupImage={props.groupImage} />
      </RBSheet>
		</View>
	)
}

const styles = StyleSheet.create({
	headerCon: {
		height: 50,
		backgroundColor: '#fff',
		flexDirection: 'row',
		zIndex: 10,
		borderColor:"#ccc",
		borderWidth:1
	},
	imageCon: {
		width: 40,
		height: 40,
		borderRadius: 20,
		overflow: 'hidden',
		marginRight: 10,
		backgroundColor: '#000'
	},
	mainText: {
		fontSize: 16,
		fontWeight: '600'
	},
	leftCon: {
		height: 50,
		flex: 1,
		justifyContent: 'flex-start',
		paddingLeft: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	leftTextCon: {
		alignItems: 'flex-start',
		justifyContent: 'center',
		marginLeft: 20,
	},
	leftText: {
		fontSize: 16,
		fontWeight: '600'
	},
	centerCon: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
    height:50
	},
	rightCon: {
		flex: 1,
		justifyContent: 'flex-end',
		alignItems: 'center',
		paddingRight: 10,
		flexDirection: 'row'
	},
	headerLogo: {
		width: '100%',
		height: '100%',
	},
	backBtn: {
		flexDirection: 'row',
		paddingHorizontal: 5,
		alignItems: 'center'
	},
	backBtnText: {
		color: '#fff',
		fontSize: 20
	},
	rightBtn: {
		color: '#fff',
		fontSize: 20,
	},
	backBtnIcon: {
		color: '#fff',
		top: -3,
		fontSize: 20
	},
	logoText: {
		fontSize: 22,
		color: '#fff',
		fontWeight: '500'
	},
	btnIcon: {
		color: '#fff',
		fontSize: 20,
	},
	textMenu: {
		fontSize: 18,
		top: 8,
		color: '#fff'
	},
	topText:{
    fontSize:16,
    color:'#000',
    textAlign: 'center'
  },
  iconCon: {
    marginRight: 10,
  },
  editIcon: {
    color: '#fff',
    fontSize: 20,
  },
  menuItem: {
  	padding: 10,
  },
  menu: {
  	borderRadius: 20,
  },
  headerProfile: {
  	flexDirection: 'row'
  },
  profileText: {
  	justifyContent: 'center'
  },
  threeDot:{
	  borderRadius:50
  },
  search: {
  	color:'#aaa', 
  	fontSize: 17
  },
  homeBtn: {
  	marginLeft: 5,
  	fontSize: 16,
  	fontWeight: '600',
  	//color: '#aaa'
  },
  switchText: {
    fontSize: 10,
    width: 50,
    textAlign: 'center'
  }
})

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapDispatchToProps)(Header);