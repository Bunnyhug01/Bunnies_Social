import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { auth, database } from "./firebase";
import { signInWithEmailAndPassword } from "firebase/auth/cordova";
import { ref, push, child, get, set, update } from "firebase/database";


export interface UserAuthRequest {
    id?: string,
    username?: string,
    email: string,
    password: string
}

export interface User {
    id: string,
    username: string,
    email: string,
    logoUrl?: string,
    subscribers: string[],
    subscriptions: string[],
    history: History[],
    likes: string[],
    dislikes: string[],
    videos?: string[],
    images?: string[],
    audios?: string[]
}

export interface History {
    video?: string,
    image?: string,
    audio?: string
}

export async function createUser({ id, username, email, password }: UserAuthRequest) {

    const user: User = {
        id: id!,
        username: username!,
        email: email,
        // logoUrl: '',
        subscribers: [],
        subscriptions: [],
        history: [],
        likes: [],
        dislikes: [],
        videos: [],
        images: [],
        audios: []
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
    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed up 
        const id = userCredential.user.uid;
        createUser({id, username, email, password})
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode)
        console.log(errorMessage)
  });
}

export async function signIn({ email, password }: UserAuthRequest) {
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Signed in 
        const user = userCredential.user;
        console.log('Signed!', user, user.uid)
        // ...
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
}

export async function signUserOut() {
    signOut(auth).then(() => {
        // Sign-out successful.
        console.log('SIGN OUT!')
    }).catch((error) => {
        // An error happened.
    });
}

export async function hasLike(id: string):Promise<boolean> {

    return get(child(ref(database), `users/${auth.currentUser?.uid}/likes/`)).then((snapshot) => {
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

export async function hasDisLike(id: string):Promise<boolean> {

    return get(child(ref(database), `users/${auth.currentUser?.uid}/dislikes/`)).then((snapshot) => {
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