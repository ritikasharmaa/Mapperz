import React, { useRef, Component, useState, useEffect, useCallback}from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions, Modal,
  FlatList,
  Alert,
  RefreshControl
} from 'react-native';
import {
  Button,
  Container,
  Content,
  Icon,
  DatePicker,
  Input,
  Item, Card, CardItem, Thumbnail, Left, Body, Right
} from 'native-base'
import { primaryColor} from '../../redux/Constant'
import Ripple from 'react-native-material-ripple';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import RBSheet from "react-native-raw-bottom-sheet";
import PostAction from '../common/PostAction';
import ImageViewer from 'react-native-image-zoom-viewer';
import ContentLoader from '../common/ContentLoader'
import { renderImage, convertText } from '../../redux/Utility'
import moment from 'moment'
import {connect} from 'react-redux';
import { doLike, deletePost, getMapFeed } from '../../redux/api/feed'
import Confirmation from '../common/Confirmation'
import Toast from 'react-native-root-toast';
import Comments from './Comments'
import ShareAction from "../common/ShareAction";
import FormatText from '../common/FormatText'
import {setScroll, setFalse} from '../../redux/actions/feed'
import PostFeed from '../SidebarComponents/PostFeed';

const { width, height } = Dimensions.get('screen');

const Feed = (props) => {
  let lang = props.uiControls.lang
  const modalRef = useRef(null)
  const confirmation = useRef(null)
  const [imageViewer, setImageViewer] = useState(false)
  const [allImages, setAllImages] = useState([])
  const [currentItem, setCurrentItem] = useState({})
  const [loading, setLoading] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState(null)
  const [formType, setFormType] = useState(false)
  const [isFetching, setIsFetching] = useState(false)
  const scroll = useRef(null)

  useEffect(() => {
    if(scroll && scroll.current){
      scroll.current.scrollToOffset({offset: 0, animated: true});
    }  
  }, [props.feed && props.feed.mapFeed && props.feed.mapFeed.length && props.feed.mapFeed[0].post_owner])

  const viewImages = (images) => {
    let allImages = renderViewerImages(images)
    setAllImages(allImages)
    setImageViewer(true)
  }

  const renderViewerImages = (images) => {
    let photos = []
    if (typeof(images) === 'object' && images.length) {
      images.forEach(item=>{
        photos.push({url: renderImage(item, "", "pathOnly")})
      })
    } else {
      photos = [
        {
          url: renderImage(images, "", "pathOnly")
        }
      ]
    }
    return photos; 
  }

  const renderPostMessage = (msg) => {
    return <Text style={styles.bodyText}>{msg}</Text> 
  }

  const openActionSheet = (item) => {
    setFormType('actions')
    let data = JSON.parse(JSON.stringify(item))
    setCurrentItem(data)
    modalRef.current.open()
  }

  const openShareSheet = (item) => {
    setFormType('share')
    let data = JSON.parse(JSON.stringify(item))
    setCurrentItem(data)
    modalRef.current.open();
  }

  /*
  * render post owner detail
  */
  const renderPostUserDetail = (item, isInner) => {
    let title = <Text style={styles.blueColor}><FormatText variable='sidebarcomp.no_name' /></Text>
    if (item.quote && item.user && item.user.name && !isInner) {
      title = <Text style={styles.blueColor}>{item.user.name}<Text style={styles.grayText}> <FormatText variable='sidebarcomp.shared' /> </Text> {item.quote.user.name}'s <Text style={styles.grayText}><FormatText variable='sidebarcomp.post' /></Text></Text>
    } else if ( item.user && item.user.name) {
      title = <Text style={styles.blueColor}>{item.user.name}</Text>
    } else if(item.sender_name) {
      title = <Text style={styles.blueColor}>{item.sender_name}</Text>
    }
    return <CardItem >
            <Left style={{flex: 0.9}}>
              <Thumbnail source={renderImage((item.user && item.user.avatar_img) || item.image, 'user')} style={styles.headerImg}/>
              <Body> 
                {title}
                  <Text note style={{color:'grey'}}>{moment(item.date).fromNow()}</Text>
              </Body>
            </Left>            
            {!isInner &&  <Right style={{flex: 0.1}}>
                            <Ripple style={styles.ellipsisIconCon} onPress={() => openActionSheet(item)}>
                              <Icon type="FontAwesome5" name={'ellipsis-h'} style={styles.ellipsisIcon}/>
                            </Ripple>
                          </Right>
            }
          </CardItem>
  }

  /*
  * render post images it can be one or many
  */
  const renderImages = (images) => {
    if (!images) {return}
    if (typeof(images) === 'string') {
      return <Ripple 
              rippleOpacity={0.2} 
              rippleDuration={700}
              style={{height: 200, width: '100%'}}
              onPress={() => viewImages(images)}
            >
              <Image source={renderImage(images)} style={{height: '100%', width: '100%'}}/>           
            </Ripple>
    } else if (typeof(images) === 'object') {
      return  <View style={{flexDirection: 'row', flexWrap: 'wrap', margin: -2}}>
                {images.map((image, i) => {
                  if (i > 3) {return}
                  return  <Ripple
                            rippleOpacity={0.2} 
                            rippleDuration={700}
                            style={{height: 150, width: '50%', borderWidth: 2, borderColor: '#fff'}}
                            key={i}
                            onPress={() => viewImages(images)}
                          >
                            <Image source={renderImage(image)} style={{height: '100%', width: '100%'}}/>  
                            {i === 3 && images.length > 4 && 
                              <View style={styles.moreImages}>
                                <Text style={styles.moreImagesText}>{images.length - 4} <FormatText variable='sidebarcomp.more' /></Text>
                              </View>
                            }
                          </Ripple>
                })}      
              </View>
    }
  }

  const onRefresh = () => {
    setIsFetching(true)
    let currentMap = props.map.currentMap;
    props.dispatch(getMapFeed(currentMap, 1, 'stopLoading')).then(res => {
      setIsFetching(false)
    })
  }

  const getScrollEvent = (event) => {
    if(event > 250){
      props.dispatch(setScroll())
    } else {
      props.dispatch(setFalse())
    }
  }

  /*
  * render post items in loop or show loading until api responde
  */

  const keyExtractor = useCallback((item, index) => index.toString(), [])

  const renderFeeds = () => {
    if (props.feed.fetchingMapFeed) {
      return <ContentLoader />
    } else {
      return  <>
                <FlatList
                  ref={scroll}
                  onScroll={(e) => getScrollEvent(e.nativeEvent.contentOffset.y)}
                  style={{ flex: 1, width: '100%', height: '100%' }}
                  onEndReached={fetchResult}
                  onEndReachedThreshold={0.7}
                  data={props.feed.mapFeed}
                  renderItem={rowData => renderFeedItem(rowData)}
                  refreshControl={
                    <RefreshControl
                      onRefresh={() => onRefresh()}
                      refreshing={isFetching}
                    />
                  }
                 // keyExtractor={keyExtractor/*(item, index) => index.toString()*/}
                  ListFooterComponent={renderLoadMoreLoader()}
                  // ListHeaderComponent={renderListHeader()}
                />
              </>
    }
  }

  const renderListHeader = () => {
    return  <View style={styles.listheader}>
              <Image source={require('../../assets/images/banner-ads-copy.jpg')} style={styles.headerBanner} />
            </View>
  }

  const renderFeedItem = (data) => {
    //console.log(data, "data")
    let item = data.item
    return <View style={{marginLeft:0,marginRight:0, marginBottom: 10}}>
            {renderPostUserDetail(item)}
            <CardItem style={{marginHorizontal: -16}}>
              <Body>
                {renderPostMessage(item.message)}
                {item.quote && renderInnerPost(item.quote)}
                {renderImages(item.images || item.image)}
              </Body>           
            </CardItem>
            {renderPostCounts(item)}
            {renderActions(item)}
          </View>
  }

  const fetchResult = () => {
    if (!props.feed.fetchingMapFeed && !props.feed.endOfPosts) {
      let currentMap = props.map.currentMap;
      props.dispatch(getMapFeed(currentMap, props.feed.page + 1))
    }
  }

  const renderInnerPost = (innerPost) => {
    return <View style={styles.innerPost}>
              <View style={styles.innerContainer}>
                {renderPostUserDetail(innerPost, 'inner')}
                <CardItem style={{marginHorizontal: -16}}>
                  <Body>
                    {renderPostMessage(innerPost.message)}
                    {renderImages(innerPost.images || innerPost.image)}
                  </Body>           
                </CardItem>
                {/*renderPostCounts(innerPost)*/}
                {/*renderActions(innerPost)*/}
              </View>
            </View>
  }

  const renderLikeCount = (item) => {
    if (!item.total_like) {
      return convertText('sidebarcomp.0like', lang)
    }
    let text = '';
    let count = item.total_like;
    if (item.liked) {
      count -= 1;
      text +=  convertText('sidebarcomp.you', lang) + " "
    }
    if (count && item.liked) {
      text += convertText('sidebarcomp.and', lang)
    }
    if (count) {
      return text += `${count}`+ convertText('sidebarcomp.othersThis', lang)
    }
    return text +=  convertText('sidebarcomp.likeThis', lang)
  }

  const likestatus = (item) => {
    if(item.liked){
      return <Left style={styles.likeStatus}>
                <Icon type="FontAwesome" name={'thumbs-up'} style={[styles.btnIcon, item.liked && {color: primaryColor}]} />
                <Text style={styles.footerTextColor}>{renderLikeCount(item)}</Text>
              </Left>
    }
  }

  const commentStatus = (item) => {
    if(item.total_comment) {
      return <Text style={styles.comment}>{item.total_comment || 0} <FormatText variable='sidebarcomp.comments' /></Text>
    }
  }

  const shareStatus = (item) => {
    if(item.total_share) {
      return <Text style={styles.comment}>{item.total_share || 0} <FormatText variable='sidebarcomp.shares' /></Text>
    }
  }

  const renderPostCounts = (item) => {
    return  <CardItem  bordered style={styles.status}>
              {likestatus(item)} 
              <Right style={{flexDirection: 'row', justifyContent: 'flex-end', flex: 1}}>
                {commentStatus(item)}
                {shareStatus(item)}
              </Right>
            </CardItem>
  }

  /*
  * hit on like the post
  */
  const likePost = (item, status) => {
    props.dispatch(doLike(item.id, status))
  }

  /*
  * delete post
  */
  const onDeletePost = () => {
    Alert.alert(
      convertText('sidebarcomp.areYouSure', lang),
      convertText('sidebarcomp.wantToDel', lang),
      [
        {
          text: convertText('sidebarcomp.no', lang),
          //onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text: convertText('sidebarcomp.yes', lang), onPress: () => {
            props.dispatch(deletePost(currentItem.id))
            //setConfirmationModal(true)
            modalRef.current.close()
            
            Toast.show(convertText('sidebarcomp.postDel', lang))
          }
        }
      ],
      { cancelable: false }
    );
  }

  /*
  * set current post and open  comment sheet
  */
  const hitComment = (item) => {
    let data = JSON.parse(JSON.stringify(item))
    setCurrentItem(data)
    setFormType('comments')
    modalRef.current.open()
  }

  /*
  * render post actions buttons
  */
  const renderActions = (item) => {
    return  <CardItem bordered style={styles.footer}>
              <Ripple 
                transparent 
                style={styles.footerBtn}
                rippleOpacity={0.2} 
                rippleDuration={700}
                onPress={() => likePost(item, item.liked)}
              >
                <Icon type="FontAwesome5" name={'thumbs-up'}  style={[styles.footerIcon, item.liked && styles.footerIconBlue]}/>
                <Text style={[styles.footerTextColor, item.liked && styles.footerTextBlue]}><FormatText variable='sidebarcomp.like' /></Text>
              </Ripple>
              <Ripple
                transparent 
                style={styles.footerBtn}
                rippleOpacity={0.2} 
                rippleDuration={700}
                onPress={() => openShareSheet(item)}
              > 
                <Icon type="FontAwesome5" name={'share'} style={styles.footerIcon}/>
                <Text style={styles.footerTextColor} ><FormatText variable='sidebarcomp.share' /></Text>
              </Ripple>
              <Ripple
                transparent 
                style={styles.footerBtn}
                rippleOpacity={0.2} 
                rippleDuration={700}
                onPress={() => hitComment(item)}
              >
                <Icon type="FontAwesome5" name={'comment'} style={styles.footerIcon} />
                <Text style={styles.footerTextColor}><FormatText variable='sidebarcomp.comment' /></Text>
              </Ripple>
            </CardItem>
  }

  /*
  * render group card with all information
  */
  const renderGroupCard = () => {
    if (!props.noGroupCard && false) {
      return <Card style={styles.dashboard}>
              <CardItem>
                <Left>
                  <Text style={styles.dashboardHeader}>User</Text>
                </Left>
                <Right>
                  <Icon type="FontAwesome5" name={'question-circle'} style={styles.ellipsisIcon}/>
                </Right>
              </CardItem>
              <CardItem style={{paddingTop:0}}>
                <Image source={require('../../assets/images/dummy.jpeg')} style={{height: 100, width: 100}}/>  
                <Body style={styles.dashboardRightCon}>
                  <Text style={styles.rightConHeader}>Lorem ipsum</Text>
                  <Text style={styles.rightConText}>Lorem ipsum</Text>
                  <Ripple style={styles.dashboardBtn}>
                    <Text style={styles.dashboardBtnText}>Group DashBoard</Text>
                  </Ripple>
                </Body>        
              </CardItem>
            </Card>
    }
  }

  const renderForm = () => {
    if (formType === 'actions') {
      return  <PostAction
                onDelete={onDeletePost}
                currentItem={currentItem}
              />
    } else if (formType === 'comments') {
      return  <Comments 
                currentPost={currentItem} 
                updatedCurrentPost={updatedCurrentPost}
              />
    } else {
      return  <ShareAction 
                currentItem={currentItem} 
                onClose={() => modalRef.current.close()}
              />
    }
  }

  const renderSheetHeight = () => {
    if (formType === 'actions') {
      return 350
    } else if (formType === 'comments') {
      return (height - 150) 
    } else {
      return 250 
    }
  }

  /*
  * update current post with updated comment
  */
  const updatedCurrentPost = (data) => {
    let post = {...currentItem};
    if (data.loadMore) {
      post.comments.comments = post.comments.comments.concat(data.res.comments)
      post.comments.previous = data.res.previous;
      post.currentPage = data.page;
    } else if (data.liking && !data.parentCommentId) {
      let commentIndex = post.comments.comments.findIndex(item => item.id === data.id)
      if (data.isLike) {
        post.comments.comments[commentIndex].isLiked  = false;
        post.comments.comments[commentIndex].likes -= 1;
      } else {
        post.comments.comments[commentIndex].isLiked = true; 
        post.comments.comments[commentIndex].likes += 1;
      }
    } else if(data.liking && data.parentCommentId){
      let commentIndex = post.comments.comments.findIndex(item => item.id === data.parentCommentId)
      let replyIndex = post.comments.comments[commentIndex].replies.comments.findIndex(item => item.id === data.id)
      if (data.isLike) {
        post.comments.comments[commentIndex].replies.comments[replyIndex].isLiked  = false;
        post.comments.comments[commentIndex].replies.comments[replyIndex].likes -= 1;
      } else {
        post.comments.comments[commentIndex].replies.comments[replyIndex].isLiked = true; 
        post.comments.comments[commentIndex].replies.comments[replyIndex].likes += 1;
      }
    } else if(data.isDelete) {
      let commentIndex = post.comments.comments.findIndex(item => item.id === data.id)
      post.comments.comments.splice(commentIndex, 1)
    } else if(data.reply && post.comments){
      let commentIndex = post.comments.comments.findIndex(item => item.id === data.commentId)
      post.comments.comments[commentIndex].replies.comments.push(data.comment)
    } else {
      if (post.comments ) {
        post.comments.comments.push(data.comment)
      } else {
        post.comments = {comments: [data.comment]}
      }  
    }
    post = JSON.parse(JSON.stringify(post))
    setCurrentItem(post)
  }

  const renderLoadMoreLoader = () => {
    if (props.feed.loadingMore) {
      return  <View>
                <ContentLoader />
              </View>
    }
  }

  const goToTop = () => {
    scroll.scrollToOffset({offset: 0, animated: true});
    props.dispatch(setFalse())
  }

  const floatingBtn = () => {
    if(props.feed.post_feed_event && props.feed.scroll){
      return <TouchableOpacity style={styles.btnCon} onPress={() => goToTop()}>
                <Icon type="FontAwesome5" name={'arrow-up'} style={styles.icon}/> 
                <Text style={styles.text}>More Post</Text>
             </TouchableOpacity>
    }
  }

  const renderMapDetail = () => {
    return <Card style={styles.dashboardMap}>
            <CardItem style={{paddingTop: 10}}>
              <Image source={renderImage(props.map.mapDetail.img_url, 'map')} style={{height: 50, width: 50}}/>  
              <Body style={styles.dashboardRightCon}>
                <Text style={styles.rightConHeader}>{props.map.mapDetail.map_name_local}</Text>
                <Text style={styles.rightConText}>Map Feed</Text>
              </Body>        
            </CardItem>
          </Card>
  }

	return(
    <View style={styles.mainCon}>
      <View style={styles.subCon}>
        <PostFeed {...props} />
        {renderMapDetail()}
        {renderGroupCard()}
        {renderFeeds()}
        {floatingBtn()}
        <RBSheet
          ref={modalRef}
          height={renderSheetHeight()}
          openDuration={250}
          closeOnDragDown={true}
          keyboardAvoidingViewEnabled={true}
          dragFromTopOnly={true}
          customStyles={{
            container: {
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10
            }
          }}
        >
          {renderForm()}
        </RBSheet>
        <Modal
          visible={imageViewer} 
          transparent={true}
        >
          <ImageViewer 
            imageUrls={allImages}
            onSwipeDown= {() => setImageViewer(false)}
            enableSwipeDown={true}
            swipeDownThreshold={10}
          />
        </Modal>      
      </View>
    </View>
	)
}

const styles = StyleSheet.create({
  mainCon: {
    paddingBottom: (Platform.OS === 'android' ? 120 : 20), 
    paddingBottom: 20,
    height: '100%', 
    width:'100%'
  },
  subCon: {
    width: '100%', 
    backgroundColor: '#ddd', 
    height: '100%',
    paddingBottom: 70,
    //flex: 1
  },
  dashboard: {
    marginLeft:10,
    marginRight:10, 
    marginTop: 10, 
    paddingBottom: 6,
  },
  headerImg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ccc'
  },
  bodyText: {
    fontSize: 16,
    paddingBottom: 10,
    marginHorizontal: 16,
  },
  footerTextColor: {
    color: 'grey',
    paddingLeft: 5,
  },
  footerTextBlue: {
    color: primaryColor
  },
  comment: {
    color: 'grey',
    justifyContent: 'flex-end',
    marginLeft: 5
  },
  blueColor: {
    color: primaryColor,
    fontWeight: 'bold',
  },
  likeStatus: {
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  btnIcon: {
    fontSize: 18,
  },
  btnText: {
    paddingLeft: 45,
  },
  commentTextCon: {
    backgroundColor: '#f5f5f5',
    borderRadius: 15,
    overflow: 'hidden',
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  commentText: {
    fontWeight: 'bold',
    marginBottom: 2,
  },
  CommentStatus: {
    flexDirection: 'row',
  },
  CommentStatusText: {
    paddingHorizontal: 10,
    paddingTop: 2,
    fontSize: 13,
  },
  searchBarCon: {
    position: 'relative',
    width: '100%',
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: Colors.lighter,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  smileIconCon: {
    position: 'absolute',
    right: 10,
  },
  smileIcon: {
    color: 'grey',
    fontSize: 24,
  },
  shareIcon: {
    color: primaryColor,
    fontSize: 24,
    marginLeft: 10,
  },
  attachmentIcon: {
    color: primaryColor,
    fontSize: 22,
    marginHorizontal: 10,
  },
  ellipsisIconCon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 35,
    height: 35,
    borderRadius: 25,
    overflow: 'hidden',
  },
  ellipsisIcon: {
    fontSize: 18,
    color: 'grey',
  },
  dashboardRightCon: {
    marginLeft: 15,
  },
  rightConHeader: {
    fontSize: 16,
    fontWeight: '500',
    marginVertical: 5,
  },
  rightConText: {
    fontSize: 14,
    marginBottom: 20,
  },
  dashboardBtn: {
    width:'100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    backgroundColor: primaryColor,
    borderRadius: 5,
  },
  dashboardBtnText: {
    color: '#fff',
    fontWeight: '500',
  },
  dashboardHeader: {
    fontSize: 16,
    fontWeight: '500',
  },
  footer: {
    height: 50, 
    paddingLeft: 0, 
    paddingRight: 0
  },
  footerBtn: {
    flexDirection: 'row',
    height: 50,
    width: width/3,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  footerIcon: {
    fontSize: 20,
    width: 20,
    color: 'grey',
  },
  footerIconBlue: {
    color: primaryColor
  },
  moreImages: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.4)',
    top: 0,
    left: 0,
    justifyContent: 'center',
    alignItems: 'center'
  },
  moreImagesText: {
    color: '#fff',
    fontSize: 20
  },
  status: {
    marginTop: -10
  },
  innerPost: {
    width:'100%'
    
  },
  innerContainer: {
    borderTopWidth: 1,
    borderColor: '#f1f1f1',
    width: '100%'
  },
  grayText: {
    fontWeight: '400',
    color: 'gray',
    fontSize: 14
  },
  listheader: {
    backgroundColor: '#fff',
    height: 160,
    overflow: 'hidden',
    marginBottom: 10
  },
  headerBanner: {
    height: '100%',
    width: '100%'
  },
  btnCon: {
    position: 'absolute',
    top: 0,
    zIndex: 99,
    backgroundColor: primaryColor,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 13,
    borderRadius: 20,
    alignSelf: 'center'
  },
  text: {
    color: '#fff',
  },
  icon: {
    color: '#fff',
    fontSize: 14,
    marginRight: 5
  },
  dashboardMap: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    marginBottom: 10
  }
})

const mapStateToProps = (state) => ({
  feed: state.feed,
  map: state.map,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Feed); 
