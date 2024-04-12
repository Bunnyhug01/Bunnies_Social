import { endAt, equalTo, get, orderByChild, query, ref, startAt } from "firebase/database";
import { database } from "./firebase";
import { Video } from "./video";
import { Image } from "./image";
import { Audio } from "./audio";


export async function searchVideo(title: string): Promise<Video[]> {

    return get(query(ref(database, 'videos'), orderByChild('title'), startAt(title), endAt(title+"\uf8ff"))).then((snapshot) => {
        const videos: Video[] = []
        snapshot.forEach((childSnapshot) => {
            videos.push(childSnapshot.val())
        })
        return videos
    })

}

export async function searchImage(title: string): Promise<Image[]> {

    return get(query(ref(database, 'images'), orderByChild('title'), startAt(title), endAt(title+"\uf8ff"))).then((snapshot) => {
        const images: Image[] = []
        snapshot.forEach((childSnapshot) => {
            images.push(childSnapshot.val())
        })
        return images
    })

}

export async function searchAudio(title: string): Promise<Audio[]> {

    return get(query(ref(database, 'audios'), orderByChild('title'), startAt(title), endAt(title+"\uf8ff"))).then((snapshot) => {
        const audios: Audio[] = []
        snapshot.forEach((childSnapshot) => {
            audios.push(childSnapshot.val())
        })
        return audios
    })

}