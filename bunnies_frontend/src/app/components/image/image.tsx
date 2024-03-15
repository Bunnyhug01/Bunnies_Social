import { Image } from "@/app/firebase/image";
import React, { useContext } from "react";

export const ImageContext = React.createContext<Image | undefined>(undefined)

export function ImageInfo({ image, children }: { image: Image, children: React.ReactNode }) {
    return (
        <ImageContext.Provider value={image}>
            {children}
        </ImageContext.Provider>
    )
}

export function ImageTitle({}) {
    const image = useContext(ImageContext)!!
    return (<>{image.title}</>)
}

export function ImageLikes({}) {
    const image = useContext(ImageContext)!!
    return (<>{image.likes}</>)
}

export function ImageDisLikes({}) {
    const image = useContext(ImageContext)!!
    return (<>{image.dislikes}</>)
}

export function ImageViews({}) {
    const image = useContext(ImageContext)!!
    return (<>{image.views}</>)
}

export function ImageUploadDate({}) {
    const image = useContext(ImageContext)!!
    return (<>{image.uploadDate}</>)
}