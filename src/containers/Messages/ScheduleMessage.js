import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Keyboard,
  Alert
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon,
  Picker
} from 'native-base'

import {
  Colors
} from 'react-native/Libraries/NewAppScreen';
import { primaryColor } from '../../redux/Constant'
import {connect} from 'react-redux';
import { getScheduleMessages } from '../../redux/api/messages'
import ContentLoader from '../../components/common/ContentLoader'
import moment from 'moment'
import { renderImage, renderTitle, language } from '../../redux/Utility'
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import {clearCurrentThread} from '../../redux/actions/messages'
import RBSheet from "react-native-raw-bottom-sheet";
import EditImage from '../../components/common/EditImage'
import { postApiPosts, deletePost } from "../../redux/api/feed";
import Toast from 'react-native-root-toast';
import NoData from '../../components/common/NoData'
import Confirmation from '../../components/common/Confirmation'
import ScheduleOptions from '../../components/MessagesComponent/ScheduleOptions'
import FormatText from '../../components/common/FormatText'

const { width, height } = Dimensions.get('screen');

const ScheduleMessage = (props) => {
  const modalRef = useRef(null)
  const deleteRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(null)
  const [threadId, setThreadId] = useState(false)

  useEffect(() => {
    setLoading(true)
    props.dispatch(getScheduleMessages()).then(res => {
      setLoading(false)
    })
  }, [])

  const currentThread = (item) => {
   // props.dispatch(currentThreadDetail(item))
    props.navigation.navigate('ChatBox', {threadId: item.id})
  } 

  const editThread = (item) => {
    setCurrentMessage(item)
    modalRef.current.open()
  }

  const setDeleteId = (id) => {
    deleteRef.current.open()
    setThreadId(id)
  }

  const renderList = () => {
    if (loading) {
      return <ContentLoader />
    } else if (!props.messages.schedulesMessages.length) {
      return <NoData />
    } else if (props.messages.schedulesMessages.length) {
      return props.messages.schedulesMessages.map((item, index) => {
        let isEven = (((index + 1) % 2) === 0)
        return <TouchableOpacity style={[styles.cardView, isEven && styles.cardViewEven]} key={index} onPress={() => editThread(item)}>
                <View style={styles.topCon}>
                  <View style={styles.leftCon}>
                    <Text style={styles.spotName}>{item.spot_popup && item.spot_popup.spot_name}</Text>
                  </View>
                  <View style={styles.rightCon}>
                    {/*<View style={styles.editCon}>
                      <Icon type="FontAwesome5" name={'pen'}  style={[styles.label, styles.editIcon]} />
                      <Text style={styles.label}>Edit</Text>
                    </View>*/}
                    <View style={styles.timeTextCon}>
                      <Text style={styles.timeText}>{moment(item.spot_popup.start_at).format('hh:mm A')}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.messageCon, isEven && styles.messageConEven]}>
                  <Text>{item.message}</Text>
                </View>
                <View style={styles.bottomCon}>
                  <Text style={styles.label}><FormatText variable='messages.repetition' /></Text>
                  <View style={styles.timeTextCon}>
                    <Text style={styles.timeText}>{item.spot_popup.repetition}</Text>
                  </View>
                  <TouchableOpacity style={styles.rightCon}>
                    <Icon type="FontAwesome5" name={'trash'}  style={[styles.label, styles.editIcon]} onPress={() => setDeleteId(item.id)}/>
                  </TouchableOpacity>
                </View>                
              </TouchableOpacity>
      })
    }
  }

  const openForm = () => {
    setCurrentMessage('')
    modalRef.current.open()
  }

  const renderHeader = () => {
    return  <View style={[styles.userDetail, styles.userDetailCheckin]}>
                <TouchableOpacity onPress={() => currentThread({id: props.auth.userData.checkin_mapper_id, checkinThread: true})} style={styles.backBtnContainer}>
                  <Icon type="FontAwesome5" name={'arrow-left'} style={[styles.backIcon]} />
                </TouchableOpacity>
                <Text style={styles.checkinText}><FormatText variable='messages.schedule_msg' /></Text>
                <TouchableOpacity onPress={() => openForm()} style={styles.rightBtnContainer}>
                  <Icon type="FontAwesome5" name={'plus'} style={[styles.backIcon]} />
                </TouchableOpacity>
              </View>
  }

  const deleteMessage = () => {
    props.dispatch(deletePost(threadId, 'delete')).then(res => {
      deleteRef.current.close()
    })
  }
  
  return(
    <Container style={styles.mainContainer}>
      {renderHeader()}
      <Content style={styles.contentContainer}>
        {renderList()}
      </Content>
      <RBSheet
        ref={modalRef}
        height={400}
        openDuration={250}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }
        }}
      >
        <ScheduleOptions currentMessage={currentMessage} closeModal={() => modalRef.current.close()}/>
      </RBSheet>
      <RBSheet
        ref={deleteRef}
        height={170}
        openDuration={250}
        closeOnDragDown={true}
        keyboardAvoidingViewEnabled={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10
          }
        }}
      >
        <Confirmation deleteMessage={deleteMessage} closeModal={() => deleteRef.current.close()}/>
      </RBSheet>
    </Container>
  )
}

const styles = StyleSheet.create({
  userDetail: {
    borderBottomWidth: 1,
    borderBottomColor: 'lightgrey',
    paddingVertical: 8,
    flexDirection: 'row',
    position: 'relative',
    paddingHorizontal: 10,
    alignItems: 'center'
  },
  backBtnContainer: {
    position: 'absolute',
    left: 10
  },
  rightBtnContainer: {
    position: 'absolute',
    right: 10
  },
  backIcon: {
    color: primaryColor,
    fontSize: 20,
    marginRight: 10,
  },
  checkinText: {
    maxWidth: '80%',
    textAlign: 'center',
    fontSize: 18
  },
  userDetailCheckin: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%'
  },
  cardView: {
    borderWidth: 1,
    borderColor: '#ccc',
    minHeight: 100,
    marginTop: 10,
    padding: 10,
    borderRadius: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3.84,
    elevation: 5,
    backgroundColor: '#fff'
  },
  contentContainer: {
    paddingHorizontal: 10
  },
  topCon: {
    flexDirection: 'row'
  },
  leftCon: {
    flex: 1
  },
  rightCon: {
    flex: 1,
    alignItems: 'flex-end',
  },
  messageCon: {
    backgroundColor: '#f1f1f1',
    padding: 5,
    borderRadius: 4,
    marginTop: 10
  },
  timeText: {
    fontSize: 12,
    color: '#fff',
    
  },
  timeTextCon: {
    backgroundColor: primaryColor,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14
  },
  bottomCon: {
    flexDirection: 'row',
    paddingTop: 10
  },
  label: {
    marginRight: 5,
    lineHeight: 24
  },
  spotName:{
    lineHeight: 24
  },
  cardViewEven: {
    backgroundColor: '#f1f1f1'
  },
  messageConEven: {
    backgroundColor: '#fff'
  },
  editCon: {
    flexDirection: 'row',
    lineHeight: 24,
    marginRight: 10
  },
  editIcon: {
    fontSize: 13
  }
})

const mapStateToProps = (state) => ({
  messages: state.messages,
  auth: state.auth
});
  
const mapDispatchToProps = (dispatch) => ({
dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ScheduleMessage); 
