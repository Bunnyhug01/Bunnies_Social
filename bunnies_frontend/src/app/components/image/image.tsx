import { Image, getOneImage } from "@/app/firebase/image";
import { Box, Chip, Stack } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import video from "video.js";
import { VideoInfo } from "../video/video";

export const ImageContext = React.createContext<Image | undefined>(undefined)

export function ImageInfo({ image, children }: { image: Image, children: React.ReactNode }) {
    return (
        <ImageContext.Provider value={image}>
            {children}
        </ImageContext.Provider>
    )
}

export function ImageIdInfo({ id, children }: { id: string, children: React.ReactNode }) {
    const [image, setImage] = useState<Image>()

    useEffect(() => {
        getOneImage(id).then((image) => {
            setImage(image)
        })
    }, [id])

    return (
        <>
        { image !== null && image !== undefined ?
        <ImageInfo image={image}>
            {children}
        </ImageInfo> : null
        }
        </>
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

export function ImageTags({}) {
    const image = useContext(ImageContext)!!
    return (
        <Stack direction="row" spacing={1}>
            {image.tags?.map((tag) => (
                <Chip key={tag} label={tag} component="a" clickable />
            ))}
        </Stack>
    )
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