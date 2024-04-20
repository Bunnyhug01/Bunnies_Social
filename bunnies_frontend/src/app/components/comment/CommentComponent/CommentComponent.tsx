import React, { useEffect, useState } from 'react';
import { Box, TextField, Button, List, ListItem, ListItemText, IconButton, Avatar, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import { Comment, createComment, deleteComment, getComments, replyComment, updateComment } from '@/app/firebase/comment';
import { UserIdInfo, UserName } from '../../user/user';
import { auth } from '@/app/firebase/firebase';
import { CommentContent, CommentDate, CommentIdInfo, CommentOwnerInfo, CommentText } from '../comment';

interface Props {
  videoId?: string,
  imageId?: string,
  audioId?: string,
  langDictionary: any
}

const CommentComponent = ({ videoId, imageId, audioId, langDictionary }: Props) => {
  const [commentText, setCommentText] = useState<string>('');
  const [editText, setEditText] = useState<string>('');
  const [comments, setComments] = useState<Comment[]>([]);
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [replyingToCommentId, setReplyingToCommentId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [showReplies, setShowReplies] = useState<{ [key: string]: boolean }>({});
  
  useEffect(() => {

    const id: string = (videoId ? videoId : (imageId ? imageId : audioId))!

    getComments(id!).then((commentsArray) => {
      setComments(commentsArray)
    })
  }, [videoId, imageId, audioId])
  
  const handleAddComment = () => {
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
  };

  const handleEditComment = (id: string) => {
    const editedComments = comments.map((comment) => {
      if (comment.id === id) {
        updateComment(id, {text: commentText.trim()})
        comment.text = commentText.trim();
      }
      return comment;
    });
    setComments(editedComments);
    setEditingCommentId(null);
    setCommentText('');
  };

  const handleReplyComment = (id: string) => {
    setReplyingToCommentId(id);
  };

  const handleReplyKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {

      if (videoId !== undefined) {
        createComment({text: replyText.trim(), videoId: videoId}).then((newComment) => {
          replyComment(replyingToCommentId!, {id: newComment.id!})
          setComments([...comments, newComment]);
        })
      }
        
      if (imageId !== undefined) {
        createComment({text: replyText.trim(), imageId: imageId}).then((newComment) => {
          replyComment(replyingToCommentId!, {id: newComment.id!})
          setComments([...comments, newComment]);
        })
      }

      if (audioId !== undefined) {
        createComment({text: replyText.trim(), audioId: audioId}).then((newComment) => {
          replyComment(replyingToCommentId!, {id: newComment.id!})
          setComments([...comments, newComment]);
        })
      }

      setReplyingToCommentId(null);
      setReplyText('');
    }
  };

  const handleDeleteComment = (id: string) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);
    setComments(updatedComments);
    deleteComment(id)
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
        multiline
        maxRows={4}
      />
      <List>
        {comments.map((comment) => (
          <div key={comment.id} style={{ marginBottom: '16px', paddingBottom: '16px' }}>
            { !comment.rootComment
              ?
                <ListItem alignItems="flex-start">
                  <UserIdInfo id={comment.owner}>
                    <Avatar alt="Avatar" />
                    <Box ml={2} flex={1}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" fontWeight="bold">
                          <UserName />
                        </Typography>
                        <Typography sx={{marginLeft: 1}} variant="caption" color="text.secondary">
                          {comment.date}
                        </Typography>
                      </Box>
                      
                      { editText
                        ? <TextField
                            placeholder="Редактирование"
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
                              {showReplies[comment.id!] ? 'Скрыть ответы' : 'Показать ответы'}
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
                          <IconButton onClick={() => handleDeleteComment(comment.id!)}>
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
              : null
            }

            {replyingToCommentId === comment.id && (
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
            )}

            {showReplies[comment.id!] && comment.replies.length > 0 && (
              <List sx={{ ml: 4 }}>
                {comment.replies.map((replyId) => (
                  <div key={replyId} style={{ marginTop: '12px', borderLeft: '2px solid #ccc', paddingLeft: '12px' }}>
                    <CommentIdInfo id={replyId}>
                      <ListItem alignItems="flex-start">
                        <CommentOwnerInfo>
                          <Avatar alt="Avatar" />
                          <Box ml={2} flex={1}>
                            <Box display="flex" alignItems="center">
                              <Typography variant="subtitle1" fontWeight="bold">
                                <UserName />
                              </Typography>
                              <Typography sx={{marginLeft: 1}} variant="caption" color="text.secondary">
                                <CommentDate />
                              </Typography>
                            </Box>
                            <ListItemText primary={<CommentText />} />
                            {
                              comment.replies
                              ? <>
                                  <Button onClick={() => handleToggleReplies(replyId)}>
                                    {showReplies[replyId] ? 'Скрыть ответы' : 'Показать ответы'}
                                  </Button>
                                </>
                              : null
                            }
                          </Box>
                        </CommentOwnerInfo>
                        <Box ml="auto" display="flex" alignItems="center">
                          
                          {comment.owner === auth.currentUser?.uid
                            ? <>
                                <IconButton onClick={() => {
                                  setEditingCommentId(replyId);
                                  setCommentText(CommentContent());
                                }}>
                                  <EditIcon />
                                </IconButton>
                                <IconButton onClick={() => handleDeleteComment(replyId)}>
                                  <DeleteIcon />
                                </IconButton>
                              </>
                            : null
                          }
                          <IconButton onClick={() => handleReplyComment(replyId)}>
                            <ReplyIcon />
                          </IconButton>
                        </Box>
                      </ListItem>
                    </CommentIdInfo>
                  </div>
                ))}
              </List>
            )}

          </div>
        ))}
      </List>
    </Box>

  );
};

export default CommentComponent;


// {comment.replies.length > 0 && (
//   <List>
//     {comment.replies.map((nestedReply) => (
//       <ListItem key={nestedReply.id}>
//         <Avatar src={nestedReply.userAvatar} alt={nestedReply.userName} /> {/* Avatar */}
//         <Box sx={{ marginLeft: 2 }}>
//           <Typography variant="subtitle1" fontWeight="bold">{nestedReply.userName}</Typography> {/* Username */}
//           <Typography variant="caption">{nestedReply.date}</Typography> {/* Nested reply date */}
//         </Box>
//         <ListItemText primary={nestedReply.text} /> {/* Nested reply text */}
//       </ListItem>
//     ))}
//   </List>
// )}