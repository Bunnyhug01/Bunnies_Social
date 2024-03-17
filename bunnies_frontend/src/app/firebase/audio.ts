import { error } from "console";
import { auth, database } from "./firebase";
import { ref, push, get, child, remove, update } from "firebase/database";
import getDate from "../utils/getDate";
import { History } from "./user";

export interface AudioCreateRequest {
  title: string,
  details: string,
  audioUrl: string,
  logoUrl: string,
  isPrivate: boolean,
}

export interface AudioUpdateRequest {
  title?: string,
  details?: string,
  logoUrl?: string,
  audioUrl?: string,
  isPrivate?: boolean,
}

export interface Audio {
  id?: string,
  title: string,
  details: string,
  audioUrl: string,
  logoUrl: string,
  uploadDate: string,
  likes: number,
  dislikes: number,
  views: number,
  owner: string,
  isPrivate: boolean,
}

export async function getAllAudios(): Promise<Audio[]> {
    return get(child(ref(database), 'audio/')).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function getOneAudio(id: string): Promise<Audio> {
    return get(child(ref(database), `audio/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export function createAudio({title, details, audioUrl, logoUrl, isPrivate}: AudioCreateRequest): void {
  
  const audio: Audio = {
    title: title,
    details: details,
    audioUrl: audioUrl,
    logoUrl: logoUrl,
    uploadDate: getDate(),
    likes: 0,
    dislikes: 0,
    views: 0,
    owner: auth.currentUser!.uid,
    isPrivate: isPrivate,
  }

  const audioId = push(ref(database, 'audio/'), audio).key;
  update(ref(database, `audio/${audioId}/`), {id: audioId})

  get(child(ref(database), `users/${auth.currentUser?.uid}/audio/`)).then((snapshot) => {
    const audio:string[] = snapshot.val() ? snapshot.val() : []
    audio.push(audioId!)
    update(ref(database, `users/${auth.currentUser?.uid}/`), {audio: audio})
  })
}

export function updateAudio(id: string, {title, details, audioUrl, logoUrl, isPrivate}: AudioUpdateRequest) {
  const updates:AudioUpdateRequest = {}

  if (title !== undefined)
    updates['title'] = title
  
  if (details !== undefined)
    updates['details'] = details
  
  if (audioUrl !== undefined)
    updates['audioUrl'] = audioUrl

  if (logoUrl !== undefined)
    updates['logoUrl'] = logoUrl 
  
  if (isPrivate !== undefined) 
    updates['isPrivate'] = isPrivate 


  update(ref(database, `audio/${id}`), updates).then((snapshot) => {

  }).catch((error) => {
    console.error(error);
  })

}

export function deleteAudio(id: string): void {
  remove(ref(database, `audio/${id}`)).then((snapshot) => {
        
  }).catch((error) => {
    console.error(error);
  })
}

export function addLike(id: string): void {

  get(child(ref(database), `audio/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() + 1
      update(ref(database, `audio/${id}/`), {likes: like})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);  
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
    const likes:string[] = snapshot.val() ? snapshot.val() : []
    likes.push(id)
    update(ref(database, `users/${auth.currentUser?.uid}/`), {likes: likes})
  })
}

export function removeLike(id: string): void {
  get(child(ref(database), `audio/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() - 1
      update(ref(database, `audio/${id}/`), {likes: like})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
    const likes:string[] = snapshot.val()

    const index = likes.indexOf(id);
    if (index !== -1) {
      likes.splice(index, 1);
    }

    update(ref(database, `users/${auth.currentUser?.uid}/`), {likes: likes})
  })
}

export function addDisLike(id: string): void {
  get(child(ref(database), `audio/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() + 1
      update(ref(database, `audio/${id}/`), {dislikes: dislike})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
    const dislikes:string[] = snapshot.val() ? snapshot.val() : []
    dislikes.push(id)
    update(ref(database, `users/${auth.currentUser?.uid}/`), {dislikes: dislikes})
  })
}

export function removeDisLike(id: string): void {
  get(child(ref(database), `audio/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() - 1
      update(ref(database, `audio/${id}/`), {dislikes: dislike})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
    const dislikes:string[] = snapshot.val()

    const index = dislikes.indexOf(id);
    if (index !== -1) {
      dislikes.splice(index, 1);
    }

    update(ref(database, `users/${auth.currentUser?.uid}/`), {dislikes: dislikes})
  })
}

export function addView(id: string): void {
  get(child(ref(database), `audio/${id}/views/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const view: number = snapshot.val() + 1
      update(ref(database, `audio/${id}/`), {views: view})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
});
}

export function addToHistory(audioId: string): void {

  get(child(ref(database), `users/${auth.currentUser?.uid}/history/`)).then((snapshot) => {
    const history:History[] = snapshot.val() ? snapshot.val() : []
    history.push({audio: audioId})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {history: history})
  })

}

export function getRecommendations(currentVideoId: string): Promise<Audio[]> {
  return get(child(ref(database), 'audio/')).then((snapshot) => {
    if (snapshot.exists()) {
      const audio = snapshot.val()
      delete audio[currentVideoId]

      return audio
    } else {
      return null
    }
  }).catch((error) => {
    console.error(error);
});
}