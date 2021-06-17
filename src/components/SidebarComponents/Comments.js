import React, { useState } from 'react';
import { View, StyleSheet, Dimensions, Text, Image, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView } from 'react-native';
import { Icon, Button, Item, Card, CardItem, Thumbnail, Left, Body, Right} from 'native-base'
import { primaryColor } from '../../redux/Constant'
import { renderImage, convertText } from '../../redux/Utility'
import ActionButton from 'react-native-action-button';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import NoData from '../common/NoData'
import moment from 'moment'
import ContentLoader from '../common/ContentLoader'
import { connect } from 'react-redux';
import{ addComment, doLike, loadComments, deleteCommentApi } from '../../redux/api/feed'
import Toast from 'react-native-root-toast';
import {setCurrentComment} from '../../redux/actions/feed'
import FormatText from '../common/FormatText'

const { width, height } = Dimensions.get('screen');

const Comments = (props) => {
  let lang = props.uiControls.lang

  const [commentText, setCommentText] = useState('')
  const [loading, setLoading] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)
  const [isReply, setIsReply] = useState(false)

  const likeComment = (id, isLike, commentId) => {
    props.updatedCurrentPost({id: id, isLike: isLike, currentPostId: props.currentPost.id, liking: true, parentCommentId: commentId })
    props.dispatch(doLike(id, isLike, props.currentPost.id, commentId))
  }

  const deleteComment = (id) => {
    Alert.alert(
      convertText('sidebarcomp.areYouSure', lang),
      convertText('sidebarcomp.areYouReallySure', lang),
      [
        {
          text: convertText('sidebarcomp.no', lang),
          //onPress: () => console.log("Cancel Pressed"),
          style: "cancel"
        },
        { text:  convertText('sidebarcomp.yes', lang), onPress: () => hitDeleteComment(id) }
      ],
      { cancelable: false }
    );
  }

  const hitDeleteComment = (id) => {
    props.updatedCurrentPost({isDelete: true, id: id});
    props.dispatch(deleteCommentApi(id, props.currentPost.id))
  }

  const replyToComments = () => {
    if(isReply){
      return  <View style={styles.replySec}>
                <ScrollView style={styles.replyContainer}>
                {header()}
                  <CardItem>
                    <Left style={{alignItems: 'flex-start'}}>
                      <Thumbnail source={props.feed.current_comment.user && renderImage(props.feed.current_comment.user.avatar_img, 'user')} style={styles.headerImg}/>
                      <Body>
                        <View style={styles.commentTextCon}>
                          <Text style={styles.commentText}>{props.feed.current_comment.user && props.feed.current_comment.user.name}</Text>
                          <Text note>{props.feed.current_comment.comment || props.feed.current_comment.content}</Text>
                        </View>
                        <View style={styles.CommentStatus}>
                          <Text style={styles.CommentStatusText}>{renderDate(props.feed.current_comment.date_raw)}</Text>
                        </View>
                        {renderReplies(props.feed.current_comment)}
                      </Body>
                    </Left>
                  </CardItem>
                </ScrollView>
                {renderAddComment()}
              </View>
    }
   
    
  }

  const saveCurrentComment = (comment) => {
    setIsReply(true)
    props.dispatch(setCurrentComment(comment))
  }

  const header = () => {
    if(isReply){
      return <View style={styles.header}>
              <Icon style={styles.backIcon} onPress={() => setIsReply(false)} type="FontAwesome5" name={'chevron-left'}  />
              <Text style={styles.text}><FormatText variable='sidebarcomp.replies' /></Text>
            </View>
    } else {
      return renderLoadMore()
    }
  }

  const renderComments = () => {
    if (props.currentPost && props.currentPost.comments) {
      //let reverseComments = JSON.parse(JSON.stringify(props.currentPost.comments.comments.reverse()));
      return  <View style={styles.commentCon}>
                <ScrollView style={styles.commentContainer}>
                  {renderLoadMore()}
                  {props.currentPost.comments.comments.map((comment, i) => {
                    return <CardItem key={i}>
                              <Left style={{alignItems: 'flex-start'}}>
                                <Thumbnail source={comment.user && renderImage(comment.user.avatar_img, 'user')} style={styles.headerImg}/>
                                <Body>
                                  <View style={styles.commentTextCon}>
                                    <Text style={styles.commentText}>{comment.user && comment.user.name}</Text>
                                    <Text note>{comment.comment || comment.content}</Text>
                                  </View>
                                  <View style={styles.CommentStatus}>
                                    <Text style={styles.CommentStatusText}>{renderDate(comment.date_raw)}</Text>
                                    <TouchableOpacity onPress={() => likeComment(comment.id, comment.isLiked)}>
                                      <Text 
                                        style={[styles.CommentStatusText, comment.isLiked && {color: primaryColor}]}
                                      >
                                        {comment.isLiked ? 'Liked' : 'Like'}
                                      </Text>
                                    </TouchableOpacity>
                                    {comment.isOwner && 
                                      <TouchableOpacity onPress={() => deleteComment(comment.id)}>
                                        <Text style={[styles.CommentStatusText, styles.redText]}><FormatText variable='sidebarcomp.delete' /></Text>
                                      </TouchableOpacity>
                                    }
                                    <TouchableOpacity onPress={() => saveCurrentComment(comment)}>
                                      <Text style={[styles.CommentStatusText]}><FormatText variable='sidebarcomp.reply'/></Text>
                                    </TouchableOpacity>
                                    <View style={styles.commentsLike}>
                                      <Icon type="FontAwesome5" name={'thumbs-up'} style={styles.commentThumb} />
                                      <Text>{comment.likes || 0}</Text>
                                    </View>
                                  </View>
                                  {renderReplies(comment, "key")}
                                </Body>
                              </Left>
                            </CardItem>
                  })}
                </ScrollView>
              </View>
    } else {
      return <View style={styles.placeholder}>
              <NoData title={convertText('sidebarcomp.noComment', lang)} />
            </View>
    }
  }

  const renderDate = (date) => {
    if (moment(date).isValid()) {
      return moment(date).fromNow()
    } else {
      return moment().fromNow()
    }
  }

  const renderReplies = (comment, key) => {
    if (comment.replies && comment.replies.comments.length) {
      if(isReply){
        return comment.replies.comments.map((reply, i) => {
          return <CardItem key={i}>
                  <Left style={{alignItems: 'flex-start'}}>
                    <Thumbnail source={renderImage(reply.user.avatar_img, 'user')} style={{width: 30, height: 30}}/>
                    <Body>
                      <View style={styles.commentTextCon}>
                        <Text style={styles.commentText}>{reply.user.name}</Text>
                        <Text note>{reply.comment || reply.content}</Text>
                      </View>
                      <View style={styles.CommentStatus}>
                        <Text style={styles.CommentStatusText}>{renderDate(reply.date_raw)}</Text>
                        <TouchableOpacity onPress={() => likeComment(reply.id, reply.isLiked, comment.id)}>
                          <Text 
                            style={[styles.CommentStatusText, reply.isLiked && {color: primaryColor}]}
                          >
                            {reply.isLiked ? 'Liked' : 'Like'}
                          </Text>
                        </TouchableOpacity>
                        <View style={styles.commentsLike}>
                          <Icon type="FontAwesome5" name={'thumbs-up'} style={styles.commentThumb} />
                          <Text>{reply.likes || 0}</Text>
                        </View>
                      </View>
                    </Body>
                  </Left>
                </CardItem>
        })
      } else {
         return comment.replies.comments.map((reply, i) => {
          if(i < 1){
            return <View>
                    <CardItem key={i}>
                      <Left style={{alignItems: 'flex-start'}}>
                        <Thumbnail source={renderImage(reply.user.avatar_img, 'user')} style={{width: 30, height: 30}}/>
                        <Body>
                          <View style={styles.commentTextCon}>
                            <Text style={styles.commentText}>{reply.user.name}</Text>
                            <Text note>{reply.comment || reply.content}</Text>
                          </View>
                        </Body>
                      </Left>
                    </CardItem>
                    <TouchableOpacity style={styles.viewMore}  onPress={() => saveCurrentComment(comment)}>
                      {comment.replies.comments.length > 1 ? <Text style={styles.viewMoreText} ><FormatText variable='sidebarcomp.view' /> {comment.replies.comments.length - 1} <FormatText variable='sidebarcomp.more_replies' /></Text> : <Text/>}
                    </TouchableOpacity>
                  </View>
          }
        })
      }
    } 
  }

  const loadMoreComments = () => {
    let page = props.currentPost.currentPage ? props.currentPost.currentPage : 1;
    setLoadingComments(true)
    props.dispatch(loadComments((page + 1), props.currentPost.id, 'Post')).then(res => {
      setLoadingComments(false)
      props.updatedCurrentPost({res: res, loadMore: true, page: page + 1})
    })
  }

  const renderLoadMore = () => {
    if (loadingComments) {
      return  <CardItem>
                <Text style={{color: '#aaa'}}><FormatText variable='sidebarcomp.loading' /></Text>
              </CardItem>
    }
    if (props.currentPost.comments && props.currentPost.comments.previous) {
      return  <CardItem>
                <TouchableOpacity onPress={() => loadMoreComments()}>
                  <Text style={{color: '#aaa'}}><FormatText variable='sidebarcomp.load_previous' /></Text>
                </TouchableOpacity>
              </CardItem>
    }
  }

  const addNewComment = () => {
    if (commentText) {
        let data = {
          content: commentText,
          user_id: props.auth.userData.id,
          commented_id: props.currentPost.id,
          commented_type: 'Post',
          status: 'public_true',
        }
      if(isReply){
        data.parent_comment_id = props.feed.current_comment.id
      }
      setLoading(true)
      props.dispatch(addComment(data, isReply)).then(res => {
        setCommentText('')
        setLoading(false)
        props.updatedCurrentPost({comment: res, commentId: props.feed.current_comment.id, reply: isReply})
      })
    }
  }

  const renderAddComment = () => {
    return  <KeyboardAvoidingView style={styles.commentSec}>
              <CardItem>
                <Left style={{alignItems: 'flex-start'}}>
                  <Thumbnail source={props.auth.userData && renderImage(props.auth.userData.profile_image, 'user')} style={styles.headerImg}/>
                  <Body>
                    <View style={styles.searchBarCon}>
                      <TextInput 
                        style={[styles.searchBar, loading && {opacity: 0.4}]}
                        placeholder="Write a Comment..."
                        placeholderTextColor="grey"
                        onChangeText={(text) => setCommentText(text)}
                        value={commentText}
                        disabled={loading}
                      />
                      <TouchableOpacity 
                        style={styles.smileIconCon} 
                        disabled={!commentText.length}
                        onPress={() => addNewComment()}
                        disabled={loading}
                      >
                        <Icon type="FontAwesome5" name={'paper-plane'} style={[styles.smileIcon, commentText.length && {color: primaryColor}, loading && {opacity: 0.4}]} />
                      </TouchableOpacity>
                    </View>
                  </Body>
                </Left>
              </CardItem>
            </KeyboardAvoidingView>
  }
  return(
    <View style={styles.mainBox}>
      {renderComments()}
      {renderAddComment()}
      {replyToComments()}
    </View>
  )
}

const styles = StyleSheet.create({
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
    width: '100%',
  },
  CommentStatusText: {
    paddingHorizontal: 7,
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
    fontSize: 14,
    color: '#000'
  },
  smileIconCon: {
    position: 'absolute',
    right: 15,
  },
  smileIcon: {
    color: 'grey',
    fontSize: 20,
  },
  headerImg: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc'
  },
  commentSec: {
    position: 'absolute',
    bottom: 35,
    width: '100%'
  },
  mainBox: {
    height: '100%',
    //paddingBottom: 85
  },
  commentContainer: {
    height: '100%',    
  },
  commentsLike: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    justifyContent: 'flex-end',
    position: 'absolute',
    right: 0
  },
  commentThumb: {
    fontSize: 13,
    marginRight: 3,
    top: 2
  },
  redText: {
    color: 'red'
  },
  replySec: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: 10,
    backgroundColor: '#fff'
  },
  commentCon: {
    paddingBottom: 85
  },
  header:{
    paddingHorizontal: 10,
    flexDirection: 'row',
    paddingBottom: 10
  },
  backIcon: {
    fontSize: 20
  },
  text: {
    width: width - 40,
    textAlign: 'center',
    fontSize: 16
  },
  viewMore: {
    marginLeft: 70
  },
  viewMoreText: {
    fontWeight: '600',
    fontSize: 13
  },
  placeholder: {
    marginTop: 30
  }
})

const mapStateToProps = (state) => ({
  auth: state.auth,
  feed: state.feed,
  uiControls: state.uiControls
});
  
const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(Comments); 
