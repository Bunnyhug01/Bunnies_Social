import { error } from "console";
import { auth, database } from "./firebase";
import { ref, push, get, child, remove, update, equalTo, limitToLast, orderByChild, query } from "firebase/database";
import getDate from "../utils/getDate";
import { Dislikes, History, Likes, getMe, hasPreferences } from "./user";

export interface AudioCreateRequest {
  title: string,
  details?: string,
  audioUrl: string,
  logoUrl: string,
  isPrivate: boolean,
  tags?: string[],
}

export interface AudioUpdateRequest {
  title?: string,
  details?: string,
  logoUrl?: string,
  audioUrl?: string,
  isPrivate?: boolean,
  tags?: string[],
}

export interface Audio {
  id?: string,
  title: string,
  details?: string,
  audioUrl: string,
  logoUrl: string,
  uploadDate: string,
  likes: number,
  dislikes: number,
  views: number,
  owner: string,
  isPrivate: boolean,
  tags?: string[],
}

export async function getAllAudios(): Promise<Audio[]> {
    return get(child(ref(database), 'audios/')).then((snapshot) => {
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
    return get(child(ref(database), `audios/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function getUserLastAudios(userId: string, count: number): Promise<Audio[]> {
  return get(query(ref(database, 'audios'), orderByChild('owner'), equalTo(userId), limitToLast(count))).then((snapshot) => {
    const audios: Audio[] = []
    snapshot.forEach((childSnapshot) => {
      audios.push(childSnapshot.val())
    })
    return audios
  })
}

export function createAudio({title, details, audioUrl, logoUrl, isPrivate, tags}: AudioCreateRequest): void {
  
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
    tags: tags,
  }

  const audioId = push(ref(database, 'audios/'), audio).key;
  update(ref(database, `audios/${audioId}/`), {id: audioId})

  get(child(ref(database), `users/${auth.currentUser?.uid}/audios/`)).then((snapshot) => {
    const audio:string[] = snapshot.val() ? snapshot.val() : []
    audio.push(audioId!)
    update(ref(database, `users/${auth.currentUser?.uid}/`), {audios: audio})
  })
}

export function updateAudio(id: string, {title, details, audioUrl, logoUrl, isPrivate, tags}: AudioUpdateRequest) {
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

  if (tags !== undefined) 
    updates['tags'] = tags 


  update(ref(database, `audios/${id}`), updates).then((snapshot) => {

  }).catch((error) => {
    console.error(error);
  })

}

export function deleteAudio(id: string): void {
  remove(ref(database, `audios/${id}`))

  get(child(ref(database), `users/${auth.currentUser?.uid}/audios/`)).then((snapshot) => {
    const audios:string[] = snapshot.val()

    const index = audios.indexOf(id);
    if (index !== -1) {
      audios.splice(index, 1);
    }

    update(ref(database, `users/${auth.currentUser?.uid}/`), {audios: audios})
  })

}

export function addLike(id: string): void {

  get(child(ref(database), `audios/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() + 1
      update(ref(database, `audios/${id}/`), {likes: like})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);  
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
    const likes:Likes[] = snapshot.val() ? snapshot.val() : []
    likes.push({audio: id})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {likes: likes})
  })
}

export function removeLike(id: string): void {
  get(child(ref(database), `audios/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() - 1
      update(ref(database, `audios/${id}/`), {likes: like})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const likeData = childSnapshot.val();

        if ('audio' in likeData && likeData.audio === id) {
          remove(child(ref(database), `users/${auth.currentUser?.uid}/likes/${childSnapshot.key}`))
        }
          
      });
  });
}

export function addDisLike(id: string): void {
  get(child(ref(database), `audios/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() + 1
      update(ref(database, `audios/${id}/`), {dislikes: dislike})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
    const dislikes:Dislikes[] = snapshot.val() ? snapshot.val() : []
    dislikes.push({audio: id})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {dislikes: dislikes})
  })
}

export function removeDisLike(id: string): void {
  get(child(ref(database), `audios/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() - 1
      update(ref(database, `audios/${id}/`), {dislikes: dislike})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const dislikeData = childSnapshot.val();

        if ('audio' in dislikeData && dislikeData.audio === id) {
          remove(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/${childSnapshot.key}`))
        }
          
      });
  });
}

export function addView(id: string): void {
  get(child(ref(database), `audios/${id}/views/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const view: number = snapshot.val() + 1
      update(ref(database, `audios/${id}/`), {views: view})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
});
}

export function addToHistory(audioId: string, owner?: string): void {

  get(child(ref(database), `users/${auth.currentUser?.uid}/history/`)).then((snapshot) => {
    const history:History[] = snapshot.val() ? snapshot.val() : []
    history.push({audio: audioId, owner: owner ? owner : ''})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {history: history})
  })

}

export function getRecommendations(currentAudioId: string): Promise<Audio[]> {
  return get(child(ref(database), 'audios/')).then((snapshot) => {
    if (snapshot.exists()) {
      const audios = snapshot.val()
      delete audios[currentAudioId]

      return hasPreferences().then((isPreferences) => {
        if (isPreferences) {
          const recommendedAudios:any = []

          const audiosWithScore = Object.entries(audios).map(([id, audio]) => ({
            audio,
            score: 0
          }));
    
          return getMe().then((user) => {
            audiosWithScore.map((audioWithScore: any) => {
              user.subscriptions?.map((subscription) => {
                if (subscription === audioWithScore.audio.owner) {
                  audioWithScore.score += 10
                }
              })
              
              user.preferences?.map((preference) => {
                if (audioWithScore.audio.tags?.includes(preference.tag)) {
                  const timeDiff = Math.abs(new Date().getTime() - new Date(preference.date).getTime());
                  const diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24)); 
                  
                  if (diffDays === 0 || diffDays <= 7) {
                    audioWithScore.score += preference.viewCount
                  }
                  else if (diffDays > 7 && diffDays <= 30) {
                    audioWithScore.score += preference.viewCount / 2
                  }
                  else if (diffDays > 30) {
                    audioWithScore.score += 0.05
                  }
                }
              })

              user.history.map((record) => {
                if (record.audio) {
                  if (audioWithScore.audio.owner === record.owner) {
                    audioWithScore.score += 5
                  }
                }
              })

              audioWithScore.score += audioWithScore.audio.likes

            });
    
            audiosWithScore.sort((a, b) => b.score - a.score);

            audiosWithScore.map((audioWithScore: any) => {
              recommendedAudios.push(audioWithScore.audio)
            })
    
            return recommendedAudios
    
          })
        } else {
          return Object.values(audios)
        }
      })

    } else {
      return null
    }
  }).catch((error) => {
    console.error(error);
});
}