import { ref, push, update, get, child, remove, endAt, orderByChild, query, startAt, equalTo } from "firebase/database";
import { database, auth } from "./firebase";
import getDate from "../utils/getDate";

export interface CommentCreateRequest {
    text: string;
    videoId?: string;
    imageId?: string;
    audioId?: string;
}

export interface CommentUpdateRequest {
    text: string;
}

export interface Comment {
    id?: string;
    text: string;
    replies: Comment[];
    video?: string;
    image?: string;
    audio?: string;
    owner: string;
    date: string;
}

export async function getComments(id: string): Promise<Comment[]> {
    return get(child(ref(database), 'comments/')).then((snapshot) => {
        const comments:Comment[] = []

        snapshot.forEach((childSnapshot) => {
            const comment = childSnapshot.val()

            if (comment.video === id && id !== undefined) {
                comments.push(comment)
            }

            if (comment.image === id && id !== undefined) {
                comments.push(comment)
            }

            if (comment.audio === id && id !== undefined) {
                comments.push(comment)
            }
        })

        return comments
    });
}

export async function getOneComment(id: string): Promise<Comment> {
    return get(child(ref(database), `comments/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function getReplies(id: string): Promise<Comment[] | null> {
    return get(child(ref(database), `comments/${id}/replies`)).then((snapshot) => {
        if (snapshot.exists()) {
          const replies:Comment[] = []
          snapshot.val().forEach((replyId:string) => {
            getOneComment(replyId).then((reply) => {
                replies.push(reply)
            })
          })
          return replies
        } else {
          return null
        }
    })
}

export async function getOneReply(rootCommentId: string, id: string): Promise<Comment> {

    return get(query(ref(database, `comments/${rootCommentId}/replies/`), orderByChild('id'), equalTo(id))).then((snapshot) => {
        if (snapshot.exists()) {
            return snapshot.val()
        } else {
            return null
        }
    }).catch((error) => {
        console.error(error);
    })
}

export function createComment({text, videoId, imageId, audioId}: CommentCreateRequest): Promise<Comment> {
  
    const comment: Comment = {
      text: text,
      replies: [],
      owner: auth.currentUser!.uid,
      date: getDate()
    }

    if (videoId !== undefined)
        comment['video'] = videoId

    if (imageId !== undefined)
        comment['image'] = imageId

    if (audioId !== undefined)
        comment['audio'] = audioId
  
    const commentId = push(ref(database, 'comments/'), comment).key;
    update(ref(database, `comments/${commentId}/`), {id: commentId})
  
    get(child(ref(database), `users/${auth.currentUser?.uid}/comments/`)).then((snapshot) => {
      const comments:string[] = snapshot.val() ? snapshot.val() : []
      comments.push(commentId!)
      update(ref(database, `users/${auth.currentUser?.uid}/`), {comments: comments})
    })

    return get(child(ref(database), `comments/${commentId}/`)).then((snapshot) => {
        return snapshot.val()
    })
}
  
export async function updateComment(id: string, {text}: CommentUpdateRequest) {
    const updates:CommentUpdateRequest = {
      text: text
    }
    
    update(ref(database, `comments/${id}`), updates).then((snapshot) => {
  
    }).catch((error) => {
      console.error(error);
    })
  
}

export async function updateReply(commentId: string, replyId: string, {text}: CommentUpdateRequest) {

  const commentReplies = (await get(child(ref(database), `comments/${commentId}/replies`))).val();
  
  commentReplies.map((reply: Comment) => {
    if (reply.id === replyId) {
      reply.text = text
    }
  })


  update(ref(database, `comments/${commentId}/`), {replies: commentReplies}).then((snapshot) => {

  }).catch((error) => {
    console.error(error);
  })

}

export async function replyComment(commentId: string, newReply: Comment, replyId?: string): Promise<Comment> {
    const commentSnapshot = await get(child(ref(database), `comments/${commentId}`));
    const comment = commentSnapshot.val();
  
    const findAndAddReply = (replies: Comment[], targetReplyId?: string): boolean => {
      for (const reply of replies) {

        if (reply.id === targetReplyId) {
          if (!reply.replies) {
            reply.replies = [];
          }

          reply.replies.push(newReply);
          return true;
        } else if (reply.replies) {
          if (findAndAddReply(reply.replies, targetReplyId)) {
            return true;
          }
        }
      }
      return false;
    };
    

    if (comment) {
      if (replyId) {
        if (findAndAddReply(comment.replies || [], replyId)) {
          await update(ref(database, `comments/${commentId}/`), { replies: comment.replies });
        } else {
          console.error('No reply');
        }
      } else {
        if (!comment.replies) {
          comment.replies = [];
        }
        comment.replies.push(newReply);
        await update(ref(database, `comments/${commentId}/`), { replies: comment.replies });
      }
    } else {
      console.error('No comment');
    }

    remove(ref(database, `comments/${newReply.id}`)) 

    return comment
};

export async function deleteComment(commentId: string, replyId?: string, parentReplyId?: string, replies?: Comment[]) {

    const userCommentsRef = ref(database, `users/${auth.currentUser?.uid}/comments`);
    const snapshot = await get(userCommentsRef);
    if (snapshot.exists()) {
      const comments = snapshot.val();

      const updatedComments = replyId ? Object.values(comments).filter((id) => id !== replyId) : Object.values(comments).filter((id) => id !== commentId);
      
      await update(ref(database, `users/${auth.currentUser?.uid}/`), {comments: updatedComments});
    }
  
  // Рекурсивное удаление ответов
  const deleteReplies = async (replies: Comment[]) => {
    if (!replies || replies.length === 0) return;

    for (const reply of replies) {
      // Удаление ответа из списка комментариев пользователя
      const replyRef = ref(database, `users/${auth.currentUser?.uid}/comments`);
      const replySnapshot = await get(replyRef);
      if (replySnapshot.exists()) {
        const replyComments = replySnapshot.val();
        const updatedReplyComments = Object.values(replyComments).filter((id) => id !== reply.id);
        await update(ref(database, `users/${auth.currentUser?.uid}/`), {comments: updatedReplyComments});
      }

      // Рекурсивный вызов для ответов на текущий ответ
      await deleteReplies(reply.replies);
    }
  };

    await deleteReplies(replies!);

    const commentSnapshot = await get(child(ref(database), `comments/${commentId}`));
    const comment = commentSnapshot.val();
  
    const deleteRecursiveReply = (replies: Comment[], replyId: string, parentReplyId?: string): boolean => {
      for (let i = 0; i < replies.length; i++) {
        const reply = replies[i];
        if (reply.id === replyId) {
          replies.splice(i, 1);
          return true;
        } else if (reply.replies) {
          if (deleteRecursiveReply(reply.replies, replyId, parentReplyId)) {
            return true;
          }
        }
      }
      return false;
    };
  
    if (comment) {
      if (replyId && parentReplyId) {
        const parentReply = comment.replies?.find((reply: { id: string; }) => reply.id === parentReplyId);
        if (parentReply) {
          if (deleteRecursiveReply(parentReply.replies || [], replyId, parentReplyId)) {
            await update(ref(database, `comments/${commentId}/`), { replies: comment.replies });
          } else {
            console.error('No reply');
          }
        } else {
          console.error('No parent reply');
        }
      } else if (replyId) {
        if (deleteRecursiveReply(comment.replies || [], replyId)) {
          await update(ref(database, `comments/${commentId}/`), { replies: comment.replies });
        } else {
          console.error('No reply');
        }
      } else {
        // Удаление самого комментария
        await remove(ref(database, `comments/${commentId}`));
      }
    } else {
      console.error('No comment');
    }
};