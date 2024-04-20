import React, { useContext, useEffect, useState } from "react";
import { UserIdInfo } from "../user/user";
import { VideoIdInfo } from "../video/video";
import { Comment, getOneComment, getReplies } from "@/app/firebase/comment";
import { ImageIdInfo } from "../image/image";
import { AudioIdInfo } from "../audio/audio";

export const CommentContext = React.createContext<Comment | undefined>(undefined)

export function CommentInfo({ comment, children }: { comment: Comment, children: React.ReactNode }) {
    return (
        <CommentContext.Provider value={comment}>
            {children}
        </CommentContext.Provider>
    )
}
export function CommentIdInfo({ id, children }: { id: string, children: React.ReactNode }) {
    const [comment, setComment] = useState<Comment>()

    useEffect(() => {
        getOneComment(id).then((comment) => {
            setComment(comment)
        })
    }, [id])

    return (
        <>
        {
            comment !== null && comment !== undefined ?
            <CommentInfo comment={comment}>
                {children}
            </CommentInfo>
            : null
        }
        </>
    )
}

export function CommentText({}) {
    const comment = useContext(CommentContext)!!
    return (<>{comment.text}</>)
}

export function CommentContent() {
    const comment = useContext(CommentContext)!!
    return comment.text
}

export function CommentDate({}) {
    const comment = useContext(CommentContext)!!
    return (<>{comment.date}</>)
}

export function CommentOwnerInfo({children}: {children: React.ReactNode}) {
    const comment = useContext(CommentContext)!!
    return (
        <UserIdInfo id={comment.owner}>
            {children}
        </UserIdInfo>
    )
}

export function CommentVideoInfo({children}: {children: React.ReactNode}) {
    const comment = useContext(CommentContext)!!
    return (
        <VideoIdInfo id={comment.video!}>
            {children}
        </VideoIdInfo>
    )
}

export function CommentImageInfo({children}: {children: React.ReactNode}) {
    const comment = useContext(CommentContext)!!
    return (
        <ImageIdInfo id={comment.image!}>
            {children}
        </ImageIdInfo>
    )
}

export function CommentAudioInfo({children}: {children: React.ReactNode}) {
    const comment = useContext(CommentContext)!!
    return (
        <AudioIdInfo id={comment.audio!}>
            {children}
        </AudioIdInfo>
    )
}