import { auth, database } from "./firebase";
import { ref, push, get, child, remove, update } from "firebase/database";
import getDate from "../utils/getDate";
import { Dislikes, History, Likes } from "./user";


export interface ImageCreateRequest {
    title: string,
    details: string,
    imageUrl: string,
    isPrivate: boolean,
}

export interface ImageUpdateRequest {
    title?: string,
    details?: string,
    imageUrl?: string,
    isPrivate?: boolean,
}

export interface Image {
  id?: string,
  title: string,
  details: string,
  imageUrl: string,
  uploadDate: string,
  likes: number,
  dislikes: number,
  views: number,
  owner: string,
  isPrivate: boolean,
}

export async function getAllImages(): Promise<Image[]> {
    return get(child(ref(database), 'images/')).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function getOneImage(id: string): Promise<Image> {
    return get(child(ref(database), `images/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export function createImage({title, details, imageUrl, isPrivate}: ImageCreateRequest): void {
  
  const video: Image = {
    title: title.toLowerCase(),
    details: details,
    imageUrl: imageUrl,
    uploadDate: getDate(),
    likes: 0,
    dislikes: 0,
    views: 0,
    owner: auth.currentUser!.uid,
    isPrivate: isPrivate,

  }

  const imageId = push(ref(database, 'images/'), video).key;
  update(ref(database, `images/${imageId}/`), {id: imageId})

  get(child(ref(database), `users/${auth.currentUser?.uid}/images/`)).then((snapshot) => {
    const images:string[] = snapshot.val() ? snapshot.val() : []
    images.push(imageId!)
    update(ref(database, `users/${auth.currentUser?.uid}/`), {images: images})
  })
}

export function updateImage(id: string, {title, details, imageUrl, isPrivate}: ImageUpdateRequest) {
  const updates:ImageUpdateRequest = {}

  if (title !== undefined)
    updates['title'] = title.toLowerCase()
  
  if (details !== undefined)
    updates['details'] = details
  
  if (imageUrl !== undefined)
    updates['imageUrl'] = imageUrl
  
  if (isPrivate !== undefined) 
    updates['isPrivate'] = isPrivate 


  update(ref(database, `images/${id}`), updates).then((snapshot) => {

  }).catch((error) => {
    console.error(error);
  })

}

export function deleteImage(id: string): void {
  remove(ref(database, `images/${id}`))

  get(child(ref(database), `users/${auth.currentUser?.uid}/images/`)).then((snapshot) => {
    const images:string[] = snapshot.val()

    const index = images.indexOf(id);
    if (index !== -1) {
      images.splice(index, 1);
    }

    update(ref(database, `users/${auth.currentUser?.uid}/`), {images: images})
  })

}

export function addLike(id: string): void {

  get(child(ref(database), `images/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() + 1
      update(ref(database, `images/${id}/`), {likes: like})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);  
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
    const likes:Likes[] = snapshot.val() ? snapshot.val() : []
    likes.push({image: id})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {likes: likes})
  })
}

export function removeLike(id: string): void {
  get(child(ref(database), `images/${id}/likes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const like: number = snapshot.val() - 1
      update(ref(database, `images/${id}/`), {likes: like})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const likeData = childSnapshot.val();

        if ('image' in likeData && likeData.image === id) {
          remove(child(ref(database), `users/${auth.currentUser?.uid}/likes/${childSnapshot.key}`))
        }
          
      });
  });
}

export function addDisLike(id: string): void {
  get(child(ref(database), `images/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() + 1
      update(ref(database, `images/${id}/`), {dislikes: dislike})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
    const dislikes:Dislikes[] = snapshot.val() ? snapshot.val() : []
    dislikes.push({image: id})
    update(ref(database, `users/${auth.currentUser?.uid}/`), {dislikes: dislikes})
  })
}

export function removeDisLike(id: string): void {
  get(child(ref(database), `images/${id}/dislikes/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const dislike: number = snapshot.val() - 1
      update(ref(database, `images/${id}/`), {dislikes: dislike})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
  });

  get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
        const dislikeData = childSnapshot.val();

        if ('image' in dislikeData && dislikeData.image === id) {
          remove(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/${childSnapshot.key}`))
        }
          
      });
  });
}

export function addView(id: string): void {
  get(child(ref(database), `images/${id}/views/`)).then((snapshot) => {
    if (snapshot.exists()) {
      const view: number = snapshot.val() + 1
      update(ref(database, `images/${id}/`), {views: view})
    } else {
      console.log('NONE')
    }
  }).catch((error) => {
    console.error(error);
});
}

export function addToHistory(imageId: string): void {

    get(child(ref(database), `users/${auth.currentUser?.uid}/history/`)).then((snapshot) => {
      const history:History[] = snapshot.val() ? snapshot.val() : []
      history.push({image: imageId})
      update(ref(database, `users/${auth.currentUser?.uid}/`), {history: history})
    })
  
}

export function getRecommendations(currentVideoId: string): Promise<Image[]> {
    return get(child(ref(database), 'images/')).then((snapshot) => {
      if (snapshot.exists()) {
        const images = snapshot.val()
        delete images[currentVideoId]
  
        return images
      } else {
        return null
      }
    }).catch((error) => {
      console.error(error);
  });
}