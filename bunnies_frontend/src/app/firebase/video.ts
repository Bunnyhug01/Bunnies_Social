import { error } from "console";
import { auth, database } from "./firebase";
import { ref, push, get, child, remove, update, limitToLast, query, orderByChild, equalTo } from "firebase/database";
import getDate from "../utils/getDate";
import { Dislikes, History, Likes, getMe, hasPreferences } from "./user";

export interface VideoCreateRequest {
  title: string,
  details?: string,
  videoUrl: string,
  logoUrl: string,
  isPrivate: boolean,
  tags?: string[],
}

export interface VideoUpdateRequest {
  title?: string,
  details?: string,
  logoUrl?: string,
  videoUrl?: string,
  isPrivate?: boolean,
  tags?: string[],
}

export interface Video {
  id?: string,
  title: string,
  details?: string,
  videoUrl: string,
  logoUrl: string,
  uploadDate: string,
  likes: number,
  dislikes: number,
  views: number,
  owner: string,
  isPrivate: boolean,
  tags?: string[],
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

export async function getLastVideos(count: number): Promise<Video[]> {
  return get(query(ref(database, 'videos'), limitToLast(count))).then((snapshot) => {
    const videos: Video[] = []
    snapshot.forEach((childSnapshot) => {
      const video: Video = childSnapshot.val()
      if (!video.isPrivate) {
        videos.push(video)
      }
    })
    return videos
  })
}

export async function getUserLastVideos(userId: string, count: number): Promise<Video[]> {
  return get(query(ref(database, 'videos'), orderByChild('owner'), equalTo(userId), limitToLast(count))).then((snapshot) => {
    const videos: Video[] = []
    snapshot.forEach((childSnapshot) => {
      const video: Video = childSnapshot.val()
      if (!video.isPrivate || (video.isPrivate && video.owner === auth.currentUser?.uid)) {
        videos.push(video)
      }
    })
    return videos
  })
}

export function createVideo({title, details, videoUrl, logoUrl, isPrivate, tags}: VideoCreateRequest): string {
  
  const video: Video = {
    title: title,
    details: details,
    videoUrl: videoUrl,
    logoUrl: logoUrl,
    uploadDate: getDate(),
    likes: 0,
    dislikes: 0,
    views: 0,
    tags: tags,
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

  return videoId!
}

export function updateVideo(id: string, {title, details, videoUrl, logoUrl, isPrivate, tags}: VideoUpdateRequest) {
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

  if (tags !== undefined) 
    updates['tags'] = tags 


  update(ref(database, `videos/${id}`), updates).then((snapshot) => {

  }).catch((error) => {
    console.error(error);
  })

}

export function deleteVideo(id: string): void {
  remove(ref(database, `videos/${id}`))

  get(child(ref(database), `users/${auth.currentUser?.uid}/videos/`)).then((snapshot) => {
    const videos:string[] = snapshot.val()

    const index = videos.indexOf(id);
    if (index !== -1) {
      videos.splice(index, 1);
    }

    update(ref(database, `users/${auth.currentUser?.uid}/`), {videos: videos})
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
    const likes:Likes[] = snapshot.val() ? snapshot.val() : []
    likes.push({video: id})
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
    snapshot.forEach((childSnapshot) => {
        const likeData = childSnapshot.val();

        if ('video' in likeData && likeData.video === id) {
          remove(child(ref(database), `users/${auth.currentUser?.uid}/likes/${childSnapshot.key}`))
        }
          
      });
  });

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
    const dislikes:Dislikes[] = snapshot.val() ? snapshot.val() : []
    dislikes.push({video: id})
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
    snapshot.forEach((childSnapshot) => {
        const dislikeData = childSnapshot.val();

        if ('video' in dislikeData && dislikeData.video === id) {
          remove(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/${childSnapshot.key}`))
        }
          
      });
  });
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

export function addToHistory(videoId: string, owner?: string): void {

  get(child(ref(database), `users/${auth.currentUser?.uid}/history/`)).then((snapshot) => {
    const history:History[] = snapshot.val() ? snapshot.val() : []
    history.push({video: videoId, owner: owner ? owner : ''})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {history: history})
  })

}

export function getRecommendations(currentVideoId: string): Promise<Video[]> {
  return get(child(ref(database), 'videos/')).then((snapshot) => {
    if (snapshot.exists()) {
      const videos = snapshot.val()
      delete videos[currentVideoId]

      return hasPreferences().then((isPreferences) => {
        if (isPreferences) {
          const recommendedVideos:any = []

          const videosWithScore = Object.entries(videos).map(([id, video]) => ({
            video,
            score: 0
          }));
    
          return getMe().then((user) => {
            videosWithScore.map((videoWithScore: any) => {
              user.subscriptions?.map((subscription) => {
                if (subscription === videoWithScore.video.owner) {
                  videoWithScore.score += 10
                }
              })
              
              user.preferences?.map((preference) => {
                if (videoWithScore.video.tags?.includes(preference.tag)) {
                  const timeDiff = Math.abs(new Date().getTime() - new Date(preference.date).getTime());
                  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                  
                  if (diffDays === 0 || diffDays <= 7) {
                    videoWithScore.score += preference.viewCount
                  }
                  else if (diffDays > 7 && diffDays <= 30) {
                    videoWithScore.score += preference.viewCount / 2
                  }
                  else if (diffDays > 30) {
                    videoWithScore.score += 0.05
                  }
                }
              })

              user.history.map((record) => {
                if (record.video) {
                  if (videoWithScore.video.owner === record.owner) {
                    videoWithScore.score += 5
                  }
                }
              })

              videoWithScore.score += videoWithScore.video.likes

            });
    
            videosWithScore.sort((a, b) => b.score - a.score);

            videosWithScore.map((videoWithScore: any) => {
              recommendedVideos.push(videoWithScore.video)
            })
    
            return recommendedVideos
    
          })
        } else {
          return Object.values(videos)
        }
      })

    } else {
      return null
    }
  }).catch((error) => {
    console.error(error);
});
}