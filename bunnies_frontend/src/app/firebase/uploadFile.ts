import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { storage } from "../firebase/firebase";
import { ref, getDownloadURL, uploadBytesResumable, deleteObject, UploadTask } from "firebase/storage";
import deleteFile from "./deleteFile";


interface Props {
    file: File | null
    setFileRef: Dispatch<SetStateAction<string>>
    directory: string,
    setProgress?: Dispatch<SetStateAction<number>>,
    uploadRef: MutableRefObject<UploadTask | undefined>,
}


const uploadFile = ({file, setFileRef, directory, setProgress, uploadRef}: Props) => {

    if (file == null) return;
    const storageRef = ref(storage, `${directory}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadRef.current = uploadTask
    
    uploadTask.on('state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Progress', progress)
            if (setProgress !== undefined) {
                setProgress(progress)
            }            
        },
        (error) => {

        },
        () => {

            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {

                setFileRef(downloadURL.toString())
            })
        }
    )
};

export default uploadFile