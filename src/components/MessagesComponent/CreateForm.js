import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native';
import {
  Container,
  Button,
  Picker,
  Icon
} from 'native-base'
import {connect} from 'react-redux';
import {onChangeConvesationsForm, clearFormValue, currentThreadDetail} from '../../redux/actions/messages'
import {createNewRoom} from '../../redux/api/messages'
import ContentLoader from '../common/ContentLoader'
import FormatText from '../common/FormatText'


const { width, height } = Dimensions.get('screen');

const BottomSlider = (props) => {

  const onChange = (value, key) => {
    props.dispatch(onChangeConvesationsForm(value, key))
  }

  const clearForm = () => {
    props.dispatch(clearFormValue())
  }

  const createRoom = () => {
    if (props.messages.conversation_form.selected_users && !props.messages.conversation_form.selected_users.length) {return}
    
    let defaultRole = 'member';
    /*if (props.messages.conversation_form.selected_users.length === 1 && !props.messages.conversation_form.room_name) {
      defaultRole = 'owner'
    }*/

    let participants = props.messages.conversation_form.selected_users.map(item=>{
      return {
                "participant_id": item.id,
                "participant_type": "User",
                "role": defaultRole
              }
    })

    //add logged user's detail
    participants.push({
      "participant_id": props.auth.userData.id,
      "participant_type": "User",
      "role": "creator"
    })

    let data = {
                "conversation":{
                  //"title": props.messages.conversation_form.room_name || null,
                  "participants_count": participants.length,
                  "chats_attributes":[
                    {// "body": props.messages.conversation_form.message,
                      "owner_id": props.auth.userData.id,
                      "owner_type": "User"
                    },
                  ],
                  "conversation_groups_attributes": participants
                }
              }
    props.dispatch(createNewRoom(data)).then(res => {
      props.closeModal()
      props.dispatch(currentThreadDetail(res))
      props.navigation.navigate('ChatBox', {threadId: res.id})
    })
  }

  const addedUsers = () => {
    if(props.messages.conversation_form.selected_users.length){
      return props.messages.conversation_form.selected_users.map((item, index) => {
        if(index <= 3){ 
          return <View style={styles.chips} key={index}>
                  <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>{item.name}</Text>
                  {/*<TouchableOpacity >
                    <Icon type="FontAwesome5" name={'times-circle'} style={styles.cross} />
                  </TouchableOpacity>*/}
                </View>
        }
      })
    } else {
      return <View>
              <Text style={[styles.text, styles.color]}><FormatText variable='msgscomp.select' /></Text>
            </View>
    }
  }

  const addCount = () => {
    if(props.messages.conversation_form.selected_users.length > 4) {
      let count = props.messages.conversation_form.selected_users.length - 4
      return <View style={[styles.chips, styles.countCon]} >
                <Text numberOfLines={1} ellipsizeMode="tail" style={styles.userName}>+{count}</Text>
              </View>
    }
  }

  const creatingGroup = () => {
    if(props.messages.isGetting) 
      return <View style={styles.loaderCon}>
                <ContentLoader />
              </View>
  }

	return(
		<Container style= {styles.mainCon}>
			<Text style={styles.heading}><FormatText variable='msgscomp.start_convo' /></Text>
      {/*<View style={styles.subCon}>
        <Text style={styles.label}>Room Name</Text>
        <View style={styles.textInput}>
          <TextInput style={styles.text}
            placeholder="What do you want to call this room?"
            placeholderTextColor= 'grey'
            onChangeText={text => onChange(text, 'room_name')}
            value={props.messages.conversation_form.room_name}
            editable={true}
          />
        </View>
      </View>*/}
      <View style={styles.subCon} >
        <Text style={styles.label}><FormatText variable='msgscomp.add_people' /></Text>
        <TouchableOpacity style={styles.textInput} onPress={() => props.addMembers()}>
          {addedUsers()}
          {addCount()}
        </TouchableOpacity>
      </View>
      {/*<View style={styles.subCon}>
        <Text style={styles.label}>Message</Text>
        <View style={[styles.textInput,styles.textArea]}>
          <TextInput style={styles.text}
            multiline={true}
            numberOfLines={3}
            placeholder="Type your Message"
            placeholderTextColor= 'grey'
            onChangeText={text => onChange(text, 'message')}
            value={props.messages.conversation_form.message}
            editable={true}
          />
        </View>
      </View>*/}
      <View style={styles.buttonCon}>
        <Button style={styles.button} onPress = {() => createRoom()}>
          <Text style={styles.blueBtn}><FormatText variable='msgscomp.start' /></Text>
        </Button>
        <Button style={[styles.button, styles.whiteBtn]} onPress = {() => clearForm()}>
          <Text style={styles.whiteBtnText}><FormatText variable='common.cancel' /></Text>
        </Button>
      </View>
		</Container>
	)
}

const styles = StyleSheet.create({
  mainCon:{
    width: '100%',
    padding: 10,
  },
  heading: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 5,
    marginBottom: 20,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    height: 35,
    paddingHorizontal: 10,
  },
  text: {
    paddingVertical: 6,
    width: '100%',
    height: '100%',
  },
  color: {
    color: 'grey'
  },
  subCon: {
    marginBottom: 10,
  },
  label: {
    marginBottom: 5,
  },
  textArea: {
    height: 70,
    alignItems: 'flex-start',
  },
  button: {
    width: 80,
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    marginHorizontal: 5,
    borderRadius: 20,
  },
  buttonCon: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  blueBtn: {
    color: '#fff',
    fontSize: 12,
  },
  whiteBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: 'grey',
    fontSize: 12,
  },
  whiteBtnText: {
    fontSize: 12,
  },
  chips: {
    backgroundColor: '#ddd',
    flexDirection: 'row',
    width: 50,
    height: 25,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginRight: 5,
  },
  countCon: {
    justifyContent: 'center'
  },
  userName: {
    fontSize: 12,
    paddingLeft: 4,
  },
  cross: {
    fontSize: 14,
  },
  loaderCon: {
    position: 'absolute',
    left: -10,
    top: -35,
    width: width,
    height: 380,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  }
})

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
    dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(BottomSlider);  