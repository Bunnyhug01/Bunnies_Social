import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { ref, push, child, get, set, update } from "firebase/database";
import getDate from "../utils/getDate";
import deleteFile from "./deleteFile";


export interface UserAuthRequest {
    id?: string,
    username?: string,
    email: string,
    password: string
}

export interface UserUpdateRequest {
    username?: string,
    logoUrl?: string,
    bannerUrl?: string,
    details?: string,
}

export interface User {
    id: string,
    username: string,
    email: string,
    logoUrl?: string,
    bannerUrl?: string,
    subscribers: string[],
    subscriptions: string[],
    history: History[],
    likes: Likes[],
    dislikes: Dislikes[],
    videos?: string[],
    images?: string[],
    audios?: string[],
    comments?: string[],
    date: string,
    details?: string,
}

export interface History {
    video?: string,
    image?: string,
    audio?: string
}

export interface Likes {
    video?: string,
    image?: string,
    audio?: string
}

export interface Dislikes {
    video?: string,
    image?: string,
    audio?: string
}

export async function createUser({ id, username, email, password }: UserAuthRequest) {

    const user: User = {
        id: id!,
        username: username!,
        email: email,
        subscribers: [],
        subscriptions: [],
        history: [],
        likes: [],
        dislikes: [],
        videos: [],
        images: [],
        audios: [],
        date: getDate(),
    }
    
    update(ref(database, `users/`), {[id!]: user});
}

export async function getMe(): Promise<User> {
    return get(child(ref(database), `users/${auth.currentUser?.uid}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function getUser(id:string): Promise<User> {
    return get(child(ref(database), `users/${id}`)).then((snapshot) => {
        if (snapshot.exists()) {
          return snapshot.val()
        } else {
          return null
        }
      }).catch((error) => {
        console.error(error);
    });
}

export async function signUp({ username, email, password }: UserAuthRequest) {
    
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)

        // Signed up
        const user = userCredential.user
        const id = user.uid;
        createUser({id, username, email, password})
        
        sendEmailVerification(user)

        return user
    } catch(error: any) {
        throw error.code
    }
}

export async function signIn({ email, password }: UserAuthRequest) {

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)

        // Signed up
        const user = userCredential.user;
        localStorage.setItem('user', JSON.stringify(user))

        return user
    } catch(error: any) {
        throw error.code
    }
}

export async function signUserOut() {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('SIGN OUT!')
        localStorage.removeItem("user")
    }).catch((error) => {
        // An error happened.
    });
}

export async function hasLike(id: string):Promise<boolean> {

    return get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
        if (snapshot.exists()) {

            return snapshot.forEach((childSnapshot) => {

                const likeData = childSnapshot.val();
                
                if ('video' in likeData) {
                    if (likeData.video === id) {
                        return true
                    }
                    else {
                        return false
                    }
                }
        
                else if ('image' in likeData) {
                    if (likeData.image === id) {
                        return true
                    }
                    else {
                        return false
                    }
                }

                else if ('audio' in likeData) {
                    if (likeData.audio === id) {
                        return true
                    }
                    else {
                        return false
                    }
                }
                
                else {
                    return false
                }

            })

        } else {
            return false
        }
    });

}

export async function hasDisLike(id: string):Promise<boolean> {

    return get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
        if (snapshot.exists()) {

            return snapshot.forEach((childSnapshot) => {

                const dislikeData = childSnapshot.val();
                
                if ('video' in dislikeData) {
                    if (dislikeData.video === id) {
                        return true
                    }
                    else {
                        return false
                    }
                }
        
                else if ('image' in dislikeData) {
                    if (dislikeData.image === id) {
                        return true
                    }
                    else {
                        return false
                    }
                }

                else if ('audio' in dislikeData) {
                    if (dislikeData.audio === id) {
                        return true
                    }
                    else {
                        return false
                    }
                }
                
                else {
                    return false
                }

            })

        } else {
            return false
        }
    });
}


export async function addSubscribe(id: string) {

    get(child(ref(database), `users/${auth.currentUser?.uid}/subscriptions/`)).then((snapshot) => {  
        const subscriptions:string[] = snapshot.val() ? snapshot.val() : []
        subscriptions.push(id)

        update(ref(database, `users/${auth.currentUser?.uid}/`), {subscriptions: subscriptions})
    })

    get(child(ref(database), `users/${id}/subscribers/`)).then((snapshot) => {  
        const subscribers:string[] = snapshot.val() ? snapshot.val() : []
        subscribers.push(auth.currentUser!.uid)

        update(ref(database, `users/${id}/`), {subscribers: subscribers})
    })
}

export async function removeSubscribe(id: string) {

    get(child(ref(database), `users/${auth.currentUser?.uid}/subscriptions/`)).then((snapshot) => {  
        const subscriptions:string[] = snapshot.val()

        const index = subscriptions.indexOf(id);
        if (index !== -1) {
            subscriptions.splice(index, 1);
        }

        update(ref(database, `users/${auth.currentUser?.uid}/`), {subscriptions: subscriptions})
    })

    get(child(ref(database), `users/${id}/subscribers/`)).then((snapshot) => {  
        const subscribers:string[] = snapshot.val()

        const index = subscribers.indexOf(auth.currentUser!.uid);
        if (index !== -1) {
            subscribers.splice(index, 1);
        }

        update(ref(database, `users/${id}/`), {subscribers: subscribers})
    })
}

export async function hasSubscribe(id: string) {

    return get(child(ref(database), `users/${auth.currentUser?.uid}/subscriptions/`)).then((snapshot) => {
        if (snapshot.exists()) {

            if ((snapshot.val()).includes(id)) {
                return true
            }
            else {
                return false
            }

        } else {
            return false
        }
    })
}

export function updateUser(id: string, {username, details, logoUrl, bannerUrl}: UserUpdateRequest) {
    const updates:UserUpdateRequest = {}
  
    if (username !== undefined)
      updates['username'] = username
    
    if (details !== undefined)
      updates['details'] = details
    
    if (logoUrl !== undefined)
      updates['logoUrl'] = logoUrl
  
    if (bannerUrl !== undefined) 
      updates['bannerUrl'] = bannerUrl 
    
    getUser(id).then((user) => {

        if (user.logoUrl !== undefined && logoUrl !== undefined)
            deleteFile(user.logoUrl)

        if (user.bannerUrl !== undefined && bannerUrl !== undefined)
            deleteFile(user.bannerUrl)
    })
  
    update(ref(database, `users/${id}`), updates).then((snapshot) => {
  
    }).catch((error) => {
      console.error(error);
    })
  
}