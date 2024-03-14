import { error } from "console";
import { auth, database } from "./firebase";
import { ref, push, get, child, remove, update } from "firebase/database";
import getDate from "../utils/getDate";
import { History } from "./user";

export interface VideoCreateRequest {
  title: string,
  details: string,
  videoUrl: string,
  logoUrl: string,
  isPrivate: boolean,
}

export interface VideoUpdateRequest {
  title?: string,
  details?: string,
  logoUrl?: string,
  videoUrl?: string,
  isPrivate?: boolean,
}

export interface Video {
  id?: string,
  title: string,
  details: string,
  videoUrl: string,
  logoUrl: string,
  uploadDate: string,
  likes: number,
  dislikes: number,
  views: number,
  owner: string,
  isPrivate: boolean,
}

export async function getAllVideos(): Promise<Video[]> {
    return get(child(ref(database), 'videos/')).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function getOneVideo(id: string): Promise<Video> {
    return get(child(ref(database), `videos/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export function createVideo({title, details, videoUrl, logoUrl, isPrivate}: VideoCreateRequest): void {
  
  const video: Video = {
    title: title,
    details: details,
    videoUrl: videoUrl,
    logoUrl: logoUrl,
    uploadDate: getDate(),
    likes: 0,
    dislikes: 0,
    views: 0,
    owner: auth.currentUser!.uid,
    isPrivate: isPrivate,

  }

  const videoId = push(ref(database, 'videos/'), video).key;
  update(ref(database, `videos/${videoId}/`), {id: videoId})

  get(child(ref(database), `users/${auth.currentUser?.uid}/videos/`)).then((snapshot) => {
    const videos:string[] = snapshot.val() ? snapshot.val() : []
    videos.push(videoId!)
    update(ref(database, `users/${auth.currentUser?.uid}/`), {videos: videos})
  })
}

export function updateVideo(id: string, {title, details, videoUrl, logoUrl, isPrivate}: VideoUpdateRequest) {
  const updates:VideoUpdateRequest = {}

  if (title !== undefined)
    updates['title'] = title
  
  if (details !== undefined)
    updates['details'] = details
  
  if (videoUrl !== undefined)
    updates['videoUrl'] = videoUrl

  if (logoUrl !== undefined)
    updates['logoUrl'] = logoUrl 
  
  if (isPrivate !== undefined) 
    updates['isPrivate'] = isPrivate 


  update(ref(database, `videos/${id}`), updates).then((snapshot) => {

  }).catch((error) => {
    console.error(error);
  })

}

export function deleteVideo(id: string): void {
  remove(ref(database, `videos/${id}`)).then((snapshot) => {
        
  }).catch((error) => {
    console.error(error);
  })
}

export function addLike(id: string): void {

  get(child(ref(database), `videos/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() + 1
      update(ref(database, `videos/${id}/`), {likes: like})
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
  get(child(ref(database), `videos/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() - 1
      update(ref(database, `videos/${id}/`), {likes: like})
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
  get(child(ref(database), `videos/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() + 1
      update(ref(database, `videos/${id}/`), {dislikes: dislike})
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
  get(child(ref(database), `videos/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() - 1
      update(ref(database, `videos/${id}/`), {dislikes: dislike})
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
  get(child(ref(database), `videos/${id}/views/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const view: number = snapshot.val() + 1
      update(ref(database, `videos/${id}/`), {views: view})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
});
}

export function addToHistory(videoId: string): void {

  get(child(ref(database), `users/${auth.currentUser?.uid}/history/`)).then((snapshot) => {
    const history:History[] = snapshot.val() ? snapshot.val() : []
    history.push({video: videoId})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {history: history})
  })

}

export function getRecommendations(currentVideoId: string): Promise<Video[]> {
  return get(child(ref(database), 'videos/')).then((snapshot) => {
    if (snapshot.exists()) {
      const videos = snapshot.val()
      delete videos[currentVideoId]

      return videos
    } else {
      return null
    }
  }).catch((error) => {
    console.error(error);
});
}