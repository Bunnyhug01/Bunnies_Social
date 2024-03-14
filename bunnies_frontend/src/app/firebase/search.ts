import { endBefore, equalTo, get, orderByChild, query, ref, startAfter, startAt } from "firebase/database";
import { database } from "./firebase";
import { Video } from "./video";


export async function search(title: string):Promise<Video[]> {
    return get(query(ref(database, 'videos'), orderByChild("title"), startAt(title)))
    .then((snapshot) => {
        console.log('AAAAAA', snapshot.val())
        return snapshot.val()
    })
}