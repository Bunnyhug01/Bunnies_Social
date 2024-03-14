import { deleteObject, ref } from "firebase/storage";
import { storage } from "./firebase";


export default function deleteFile(fileUrl:string) {
    const httpsReference = ref(storage, fileUrl); 
    const fileRef = ref(storage, httpsReference.fullPath)

    deleteObject(fileRef).then(() => {
        
    }).catch((error) => {

    })
}