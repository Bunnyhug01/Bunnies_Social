
import { getOne, Comment } from "@/app/api/comment";
import React, { useContext, useEffect, useState } from "react";
import { UserIdInfo } from "../user/user";
import { VideoIdInfo } from "../video/video";

export const CommentContext = React.createContext<Comment | undefined>(undefined)

export function CommentInfo({ comment, children }: { comment: Comment, children: React.ReactNode }) {
    return (
        <CommentContext.Provider value={comment}>
            {children}
        </CommentContext.Provider>
    )
}
export function CommentIdInfo({ id, children }: { id: number, children: React.ReactNode }) {
    const [comment, setComment] = useState<Comment>()

    useEffect(() => {
        getOne(id).then((comment) => {
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

export function CommentAuthorInfo({children}: {children: React.ReactNode}) {
    const comment = useContext(CommentContext)!!
    return (
        <UserIdInfo id={comment.author}>
            {children}
        </UserIdInfo>
    )
}

export function CommentVideoInfo({children}: {children: React.ReactNode}) {
    const comment = useContext(CommentContext)!!
    return (
        <VideoIdInfo id={comment.video}>
            {children}
        </VideoIdInfo>
    )
}