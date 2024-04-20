import { ref, push, update, get, child, remove } from "firebase/database";
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

export interface CommentReplyRequest {
    id: string;
}

export interface Comment {
    id?: string;
    text: string;
    replies: string[];
    rootComment?: string;
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
  
export function updateComment(id: string, {text}: CommentUpdateRequest) {
    const updates:CommentUpdateRequest = {
        text: text
    }
    
    update(ref(database, `comments/${id}`), updates).then((snapshot) => {
  
    }).catch((error) => {
      console.error(error);
    })
  
}

export function replyComment(commentId: string, {id}: CommentReplyRequest) {
    
    get(child(ref(database), `comments/${commentId}/replies/`)).then((snapshot) => {
        const replies:string[] = snapshot.val() ? snapshot.val() : []
        replies.push(id)
        update(ref(database, `comments/${commentId}/`), {replies: replies})
    })

    update(ref(database, `comments/${id}/rootComment/`), {rootComment: commentId})
}
  
export function deleteComment(id: string): void {
    
    get(child(ref(database), `users/${auth.currentUser?.uid}/comments/`)).then((snapshot) => {
      const comments:string[] = snapshot.val()
  
      const index = comments.indexOf(id);
      if (index !== -1) {
        comments.splice(index, 1);
      }
  
      update(ref(database, `users/${auth.currentUser?.uid}/`), {comments: comments})
    })

    get(child(ref(database), `comments/${id}/replies/`)).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {

            remove(child(ref(database), `comments/${id}/replies/${childSnapshot.key}`))
              
        });
    });

    get(child(ref(database), `comments/${id}/`)).then((snapshot) => {
        const rootCommentId = snapshot.val().rootComment

        get(child(ref(database), `comments/${rootCommentId}/replies`)).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const replyComment = childSnapshot.val();
        
                if (replyComment === id) {
                  remove(child(ref(database), `comments/${rootCommentId}/replies/${replyComment}`))
                }
                  
            });
        })
    });

    remove(ref(database, `comments/${id}`)) 
}