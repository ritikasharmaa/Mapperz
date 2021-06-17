import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import {
  Container,
} from 'native-base';
import { primaryColor } from '../../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import { CommonActions  } from '@react-navigation/native';
import SyncStorage from 'sync-storage';
import LinearGradient from 'react-native-linear-gradient';
import {connect} from 'react-redux';
import {userDetail} from '../../../redux/actions/auth'
import FormatText from '../../../components/common/FormatText'


const { width, height } = Dimensions.get('screen');


const DOB = (props) => {

  const inputRef = useRef(null)
  const inputRef2 = useRef(null)

  const onChange = (value, key) => {
    if(value.length === 2 && key === 'user_dob_date'){
      inputRef.current.focus()
    } else if(value.length === 2 && key === 'user_dob_month'){
      inputRef2.current.focus()
    }
    props.dispatch(userDetail(value, key))
  }

	return(
    <Container style={styles.mainCon}>
      <LinearGradient 
        colors={['#9248e7', '#9949e8', '#bb4fef', '#9949e8', '#9248e7']} 
        style={styles.background}
       >
  			<View style={styles.nameCon}>
          <Text style={styles.text}><FormatText variable='signup.hey' /> {props.auth.user_detail.user_name}, <FormatText variable='signup.when_birthday' />  </Text>
          <View style={styles.inputCon}>
            <View style={styles.boxWidth}>
              <TextInput style={[styles.inputBox]}
                 placeholder="DD"
                 placeholderTextColor= '#dfe1df'
                 keyboardType= 'numeric'
                 onChangeText= {data => onChange(data, 'user_dob_date')}
                 maxLength= {2}
              />
            </View>
            <View style={styles.boxWidth}>
              <TextInput style={[styles.inputBox]}
                 placeholder="MM"
                 placeholderTextColor= '#dfe1df'
                 keyboardType= 'numeric'
                 onChangeText= {data => onChange(data, 'user_dob_month')}
                 maxLength= {2}
                 ref={inputRef}
              />
            </View>
            <View style={styles.yearBoxWidth}>
              <TextInput style={[styles.inputBox]}
                 placeholder="YYYY"
                 placeholderTextColor= '#dfe1df'
                 keyboardType= 'numeric'
                 onChangeText= {data => onChange(data, 'user_dob_year')}
                 maxLength= {4}
                 ref={inputRef2}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity style={styles.continueBtnCon} onPress={() => props.navigation.navigate('Email')}>
          <Text style={styles.continueBtn}><FormatText variable='signup.continue' /></Text>
        </TouchableOpacity>
      </LinearGradient>
    </Container>
	)
}

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%'
  },
  nameCon: {
    paddingHorizontal: 20,
    paddingTop: 50,
    flex: 1,
  },
  text: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff'
  },
  boxWidth: {
    width: '25%',
    marginRight: '5%'
  },
  yearBoxWidth: {
    width: '40%',
  },
  inputCon: {
    flexDirection: 'row',
  },
  inputBox: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10,
    color: '#dfe1df',
    textAlign: 'center'
  },
  continueBtnCon: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
  continueBtn: {
    borderWidth: 1,
    borderColor: '#dfe1df',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 20,
    color: '#dfe1df'
  }
})

const mapStateToProps = (state) => ({
  auth: state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(DOB); 
