import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Avatar, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { Comment, createComment, deleteComment, getComments, replyComment, updateComment, updateReply } from '@/app/firebase/comment';
import { UserIdInfo, UserLogo, UserName } from '../../user/user';
import { auth } from '@/app/firebase/firebase';
import { useParams } from "next/navigation";
import { User, addNotification, getMe, hasUserNotifications } from '@/app/firebase/user';

interface Props {
  videoId?: string,
  imageId?: string,
  audioId?: string,
  langDictionary: any
}

const CommentComponent = ({ videoId, imageId, audioId, langDictionary }: Props) => {
  const params  = useParams();
  const user = localStorage.getItem('user')
  const lang: string = (params.lang).toString()

  const [commentText, setCommentText] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyingToReplyId, setReplyingToReplyId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {

    const id: string = (videoId ? videoId : (imageId ? imageId : audioId))!

    getComments(id!).then((commentsArray) => {
      setComments(commentsArray)
    })
  }, [videoId, imageId, audioId])
  
  const handleAddComment = () => {

    if (user && auth.currentUser?.emailVerified) {
      if (commentText.trim() !== '') {

        if (videoId !== undefined) {
          createComment({text: commentText.trim(), videoId: videoId}).then((newComment) => {
            setComments([...comments, newComment]);
          })
        }
          
        if (imageId !== undefined) {
          createComment({text: commentText.trim(), imageId: imageId}).then((newComment) => {
            setComments([...comments, newComment]);
          })
        }
  
        if (audioId !== undefined) {
          createComment({text: commentText.trim(), audioId: audioId}).then((newComment) => {
            setComments([...comments, newComment]);
          })
        }
          
        setCommentText('');
      }
    } else {
      window.location.replace(`/${lang}/sign-in`)
    }

  };

  const handleEditComment = (id: string, replyId?: string) => {
    const editedComments = comments.map((comment) => {
      if (comment.id === id) {
        if (replyId) {
          updateReply(id, replyId, {text: editText})
          comment.replies.map((reply) => {
            if (reply.id === replyId) {
              reply.text = editText
            }
          })
        } else {
          updateComment(id, {text: editText})
          comment.text = editText;
        }
        
      }
      return comment;
    });
    setComments(editedComments);
    setEditingCommentId(null);
    setEditText('')
    setCommentText('');
  };

  const handleReplyComment = (id: string) => {

    if (user && auth.currentUser?.emailVerified) {
      setReplyingToCommentId(id);
    } else {
      window.location.replace(`/${lang}/sign-in`)
    }
    
  };

  const handleReplyReply = (id: string) => {
    setReplyingToReplyId(id);
  };

  const handleReplyKeyPress = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    
    if (event.key === 'Enter') {

      const updatedCommentIndex = comments.findIndex(comment => comment.id === replyingToCommentId);
      const updatedComments = [...comments];

      if (videoId !== undefined) {
        createComment({text: replyText.trim(), videoId: videoId}).then((newComment) => {
          
          if (replyingToReplyId) {
            replyComment(replyingToCommentId!, newComment, replyingToReplyId).then((comment) => {
              updatedComments[updatedCommentIndex] = { ...updatedComments[updatedCommentIndex], ...comment };
              setComments(updatedComments);
            })
          } else {
            replyComment(replyingToCommentId!, newComment).then((comment) => {
              updatedComments[updatedCommentIndex] = { ...updatedComments[updatedCommentIndex], ...comment };
              setComments(updatedComments);
            })
          }
        })
      }
        
      if (imageId !== undefined) {
        createComment({text: replyText.trim(), imageId: imageId}).then((newComment) => {
          
          if (replyingToReplyId) {
            replyComment(replyingToCommentId!, newComment, replyingToReplyId).then((comment) => {
              updatedComments[updatedCommentIndex] = { ...updatedComments[updatedCommentIndex], ...comment };
              setComments(updatedComments);
            })
          } else {
            replyComment(replyingToCommentId!, newComment).then((comment) => {
              updatedComments[updatedCommentIndex] = { ...updatedComments[updatedCommentIndex], ...comment };
              setComments(updatedComments);
            })
          }
        })
      }

      if (audioId !== undefined) {
        createComment({text: replyText.trim(), audioId: audioId}).then((newComment) => {
          
          if (replyingToReplyId) {
            replyComment(replyingToCommentId!, newComment, replyingToReplyId).then((comment) => {
              updatedComments[updatedCommentIndex] = { ...updatedComments[updatedCommentIndex], ...comment };
              setComments(updatedComments);
            })
          } else {
            replyComment(replyingToCommentId!, newComment).then((comment) => {
              updatedComments[updatedCommentIndex] = { ...updatedComments[updatedCommentIndex], ...comment };
              setComments(updatedComments);
            })
          }
        })
      }

      const replyingComment: Comment | undefined = comments.find(comment => comment.id === replyingToCommentId);
      const commentText: string = replyingComment?.text.slice(0, 10) + (replyingComment?.text.length! > 10 ? '...' : '')
      const currentUser: User = await getMe()

      hasUserNotifications(replyingComment!.owner).then((isNotifications) => {
        if (isNotifications) {
          
          if (videoId !== undefined) {
            addNotification(
              replyingComment!.owner,
              {
                text: `user "${currentUser.username}" replied_to_comment "${commentText}"`,
                srcUrl: `/${lang}/video/${videoId}`
              })
          }

          if (imageId !== undefined) {
            addNotification(
              replyingComment!.owner,
              {
                text: `user "${currentUser.username}" replied_to_comment "${commentText}"`,
                srcUrl: `/${lang}/image/${imageId}`
              })
          }

          if (audioId !== undefined) {
            addNotification(
              replyingComment!.owner,
              {
                text: `user "${currentUser.username}" replied_to_comment "${commentText}"`,
                srcUrl: `/${lang}/audio/${audioId}`
              })
          }
        }
      })
      
      setReplyingToCommentId(null);
      setReplyText('');
    }

  };

  const handleDeleteComment = (id: string, {replyId, parentReplyId, replies}: {replyId?: string , parentReplyId?: string, replies?: Comment[]}) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);

    deleteComment(id, replyId, parentReplyId, replies)
  };

  const handleToggleReplies = (commentId: string) => {
    setShowReplies({
      ...showReplies,
      [commentId]: !showReplies[commentId],
    });
  };
  

  return (
    <Box>
      <TextField
        label={langDictionary['add_comment']}
        placeholder={langDictionary['enter_comment']}
        variant="standard"
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAddComment();
          }
        }}
        fullWidth
        margin="normal"
      />
      <List>
        {comments.map((comment) => (
          <div key={comment.id} style={{ marginBottom: '16px', paddingBottom: '16px' }}>

            <ListItem alignItems="flex-start">
              <UserIdInfo id={comment.owner}>
                <UserLogo />
                <Box ml={2} flex={1}>
                  <Box display="flex" alignItems="center">
                    <Typography variant="subtitle1" fontWeight="bold">
                      <UserName />
                    </Typography>
                    <Typography sx={{marginLeft: 1}} variant="caption" color="text.secondary">
                      {comment.date}
                    </Typography>
                  </Box>
                  
                  { editText && comment.id === editingCommentId
                    ? <TextField
                        placeholder={langDictionary["edit_comment"]}
                        variant="outlined"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleEditComment(editingCommentId!);
                          }
                        }}
                        fullWidth
                        margin="normal"
                      />
                    : <ListItemText primary={comment.text} />
                  }
                  {
                    comment.replies
                    ? <>
                        <Button onClick={() => handleToggleReplies(comment.id!)}>
                          {showReplies[comment.id!] ? langDictionary["close_replies"] : langDictionary["show_replies"]}
                        </Button>
                      </>
                    : null
                  }
                </Box>
              </UserIdInfo>
              <Box ml="auto" display="flex" alignItems="center">
                
                {comment.owner === auth.currentUser?.uid
                  ? <>
                      <IconButton onClick={() => {
                        setEditingCommentId(comment.id!);
                        !editText
                          ? setEditText(comment.text)
                          : setEditText('') 
                      }}>
                        <EditIcon />
                      </IconButton>
                      <IconButton onClick={() => handleDeleteComment(comment.id!, {replies: comment.replies!})}>
                        <DeleteIcon />
                      </IconButton>
                    </>
                  : null
                }
                <IconButton onClick={() => handleReplyComment(comment.id!)}>
                  <ReplyIcon />
                </IconButton>
              </Box>
            </ListItem>


            {showReplies[comment.id!] && comment.replies.length > 0 && (
              <List sx={{ ml: 4 }}>
                {comment.replies.map((replyComment) => (
                  <div key={replyComment.id!} style={{ marginTop: '12px', borderLeft: '2px solid #ccc', paddingLeft: '12px' }}>

                      <ListItem alignItems="flex-start">
                        <UserIdInfo id={replyComment.owner}>
                          <UserLogo />
                          <Box ml={2} flex={1}>
                            <Box display="flex" alignItems="center">
                              <Typography variant="subtitle1" fontWeight="bold">
                                <UserName />
                              </Typography>
                              <Typography sx={{marginLeft: 1}} variant="caption" color="text.secondary">
                                {replyComment.date}
                              </Typography>
                            </Box>
                            { editText && replyComment.id === editingCommentId
                              ? <TextField
                                  placeholder={langDictionary["edit_comment"]}
                                  variant="outlined"
                                  value={editText}
                                  onChange={(e) => setEditText(e.target.value)}
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleEditComment(comment.id!, editingCommentId!);
                                    }
                                  }}
                                  fullWidth
                                  margin="normal"
                                />
                              : <ListItemText primary={replyComment.text} />
                            }
                            {
                              replyComment.replies
                              ? <>
                                  <Button onClick={() => handleToggleReplies(replyComment.id!)}>
                                    {showReplies[replyComment.id!] ? langDictionary["close_replies"] : langDictionary["show_replies"]}
                                  </Button>
                                </>
                              : null
                            }
                          </Box>
                        </UserIdInfo>
                        <Box ml="auto" display="flex" alignItems="center">
                          
                          {replyComment.owner === auth.currentUser?.uid
                            ? <>
                                <IconButton onClick={() => {
                                  setEditingCommentId(replyComment.id!);
                                  !editText
                                    ? setEditText(replyComment.text)
                                    : setEditText('') 
                                  }}
                                >
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteComment(comment.id!, {replyId: replyComment.id!})}>
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            : null
                          }
                          {/* <IconButton
                            onClick={() => {
                              handleReplyComment(comment.id!)
                              handleReplyReply(replyComment.id!)
                            }}
                          >
                            <ReplyIcon />
                          </IconButton> */}
                        </Box>
                      </ListItem>
                      
                      {/* {replyingToCommentId === replyComment.id && (
                        <ListItem>
                          <TextField
                            placeholder="Ответ на комментарий"
                            variant="outlined"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            onKeyPress={handleReplyKeyPress}
                            fullWidth
                            margin="normal"
                          />
                        </ListItem>
                      )} */}

                  </div>
                  
                ))}
              </List>
            )}

            {replyingToCommentId === comment.id && (
              <ListItem>
                <TextField
                  placeholder={langDictionary["comment_reply"]}
                  variant="outlined"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyPress={handleReplyKeyPress}
                  fullWidth
                  margin="normal"
                />
              </ListItem>
            )}

          </div>
        ))}
      </List>
    </Box>

  );
};

export default CommentComponent;