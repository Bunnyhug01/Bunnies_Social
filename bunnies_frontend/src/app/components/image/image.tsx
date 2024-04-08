import { Image } from "@/app/firebase/image";
import { Box } from "@mui/material";
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

export function ImageDetails({}) {
    const image = useContext(ImageContext)!!
    return (<>{image.details}</>)
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

export function ImageLogo({}) {
    const image = useContext(ImageContext)!!
    return (
        <Box className='gallery-item'>
            <img
                src={image.imageUrl}
                alt={image.title}
            />
            <Box className="overlay"></Box>
        </Box>
    )
}

export function UserImageLogo({}) {
    const image = useContext(ImageContext)!!
    return (
        <img
            src={image.imageUrl}
            alt={image.title}
            className="rounded-lg object-cover"
        />
    )
}