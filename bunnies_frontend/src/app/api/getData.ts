import { useEffect, useState } from "react";

import { getDownloadURL, listAll, ref } from "firebase/storage";
import { storage } from "../firebase/firebase";

export function getVideos() {
    
    const [videosList, setVideosList] = useState<any>([]);
    const videosListRef = ref(storage, "videos/");
    
    useEffect(() => {
        listAll(videosListRef).then((responce) => {
            responce.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setVideosList((prev:any) => [...prev, url, item]);
                });
            });
        });
    }, []);

    return videosList;
}


export function getImages() {
    
    const [imagesList, setImagesList] = useState<any>([]);
    const imagesListRef = ref(storage, "images/");
    
    useEffect(() => {
        listAll(imagesListRef).then((responce) => {
            responce.items.forEach((item) => {
                getDownloadURL(item).then((url) => {
                    setImagesList((prev:any) => [...prev, url]);
                });
            });
        });
    }, []);

    return imagesList;
}