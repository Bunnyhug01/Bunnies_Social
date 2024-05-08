import { createUserWithEmailAndPassword, sendEmailVerification, signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { ref, push, child, get, set, update, onValue, remove } from "firebase/database";
import getDate from "../utils/getDate";
import deleteFile from "./deleteFile";
import { Dispatch, SetStateAction } from "react";


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
    preferences?: Preferences[],
    isPreferencesEnabled?: boolean,
    notifications?: Notifications[],
    isNotificationsEnabled?: boolean
}

export interface History {
    video?: string,
    image?: string,
    audio?: string,
    owner?: string,
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

export interface Preferences {
    tag: string,
    viewCount: number,
    date: Date,
}

export interface Notifications {
    id?: string,
    text: string,
    srcUrl: string,
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
        comments: [],
        date: getDate(),
        details: '',
        isPreferencesEnabled: false,
        isNotificationsEnabled: false
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

        // Signed in
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

export async function enablePreferences() {
    update(ref(database, `users/${auth.currentUser?.uid}/`), {isPreferencesEnabled: true})
}

export async function disablePreferences() {
    update(ref(database, `users/${auth.currentUser?.uid}/`), {isPreferencesEnabled: false})
}

export async function hasPreferences() {
    return get(child(ref(database), `users/${auth.currentUser?.uid}/isPreferencesEnabled/`)).then((snapshot) => {
        if (snapshot.exists()) {

            if (snapshot.val()) {
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

export async function addPreferences(tags: string[]) {

    if (tags) {
        get(child(ref(database), `users/${auth.currentUser?.uid}/preferences/`)).then((snapshot) => {  
            const preferences:Preferences[] = snapshot.val() ? snapshot.val() : []
            
            if (preferences.length !== 0) {
    
                tags.forEach((tag: string) => {
                    const existingPreferenceIndex = preferences.findIndex((pref: Preferences) => pref.tag === tag);
                    if (existingPreferenceIndex !== -1) {
                        // Тег уже существует, увеличиваем счетчик
                        preferences[existingPreferenceIndex].viewCount++;
                    } else {
                        // Добавляем новый тег
                        preferences.push({ tag, viewCount: 1, date: new Date()});
                    }
                });
    
            } else {
                tags.map((tag) => {
                    preferences.push({tag: tag, viewCount: 1, date: new Date()})
                })
            }
    
            update(ref(database, `users/${auth.currentUser?.uid}/`), {preferences: preferences})
        })
    }
}

export async function enableNotifications() {
    update(ref(database, `users/${auth.currentUser?.uid}/`), {isNotificationsEnabled: true})
}

export async function disableNotifications() {
    update(ref(database, `users/${auth.currentUser?.uid}/`), {isNotificationsEnabled: false})
}

export async function hasNotifications():Promise<boolean> {
    return get(child(ref(database), `users/${auth.currentUser?.uid}/isNotificationsEnabled`)).then((snapshot) => {
        if (snapshot.exists()) {
            
            if (snapshot.val()) {
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

export async function hasUserNotifications(userId: string) {
    return get(child(ref(database), `users/${userId}/isNotificationsEnabled`)).then((snapshot) => {
        if (snapshot.exists()) {

            if (snapshot.val()) {
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

export async function addNotification(userId: string, {text, srcUrl}: Notifications)  {

    const notification: Notifications = {
        text: text,
        srcUrl: srcUrl
    }
    
    const notificationId = push(ref(database, `users/${userId}/notifications/`), notification).key;
    update(ref(database, `users/${userId}/notifications/${notificationId}/`), {id: notificationId})
    
}

export async function deleteNotification(id: string) {
    remove(ref(database, `users/${auth.currentUser?.uid}/notifications/${id}`))
}

export async function getNotifications(setNotifications: Dispatch<SetStateAction<Notifications[]>>) {
    const notificationsRef = ref(database, `users/${auth.currentUser?.uid}/notifications/`)

    onValue(notificationsRef, (snapshot) => {
        if (snapshot.exists()) {
            setNotifications(Object.values(snapshot.val()))
        }
    })   
}