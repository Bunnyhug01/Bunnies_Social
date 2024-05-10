import { endAt, equalTo, get, orderByChild, query, ref, startAt } from "firebase/database";
import { database } from "./firebase";
import { Video } from "./video";
import { Image } from "./image";
import { Audio } from "./audio";
import { User } from "./user";


export async function searchVideo(title: string): Promise<Video[]> {
    const lowerCaseTitle = title.toLowerCase();

    return get(query(ref(database, 'videos'), orderByChild('title')))
        .then((snapshot) => {
            const videos: Video[] = [];
            snapshot.forEach((childSnapshot) => {
                const video: Video = childSnapshot.val();
                const lowerCaseVideoTitle = video.title.toLowerCase();
                if (lowerCaseVideoTitle.startsWith(lowerCaseTitle)) {
                    videos.push(video);
                }
            });
            return videos;
        }
    );
}

export async function searchImage(title: string): Promise<Image[]> {

    const lowerCaseTitle = title.toLowerCase();

    return get(query(ref(database, 'images'), orderByChild('title')))
        .then((snapshot) => {
            const images: Image[] = [];
            snapshot.forEach((childSnapshot) => {
                const image: Image = childSnapshot.val();
                const lowerCaseImageTitle = image.title.toLowerCase();
                if (lowerCaseImageTitle.startsWith(lowerCaseTitle)) {
                    images.push(image);
                }
            });
            return images;
        }
    );

}

export async function searchAudio(title: string): Promise<Audio[]> {

    const lowerCaseTitle = title.toLowerCase();

    return get(query(ref(database, 'audios'), orderByChild('title')))
        .then((snapshot) => {
            const audios: Audio[] = [];
            snapshot.forEach((childSnapshot) => {
                const audio: Audio = childSnapshot.val();
                const lowerCaseAudioTitle = audio.title.toLowerCase();
                if (lowerCaseAudioTitle.startsWith(lowerCaseTitle)) {
                    audios.push(audio);
                }
            });
            return audios;
        }
    );

}

export async function searchUser(username: string): Promise<User[]> {

    const lowerCaseUsername = username.toLowerCase();

    return get(query(ref(database, 'users'), orderByChild('username')))
        .then((snapshot) => {
            const users: User[] = [];
            snapshot.forEach((childSnapshot) => {
                const user: User = childSnapshot.val();
                const lowerCaseUserUsername = user.username.toLowerCase();
                if (lowerCaseUserUsername.startsWith(lowerCaseUsername)) {
                    users.push(user);
                }
            });
            return users;
        }
    );

}