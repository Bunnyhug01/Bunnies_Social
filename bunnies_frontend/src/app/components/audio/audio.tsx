import { Audio } from "@/app/firebase/audio";
import React, { useContext, useEffect, useMemo, useState } from "react";

export const AudioContext = React.createContext<Audio | undefined>(undefined)

export function AudioInfo({ audio, children }: { audio: Audio, children: React.ReactNode }) {
    return (
        <AudioContext.Provider value={audio}>
            {children}
        </AudioContext.Provider>
    )
}

export function AudioTitle({}) {
    const audio = useContext(AudioContext)!!
    return (<>{audio.title}</>)
}

export function AudioLikes({}) {
    const audio = useContext(AudioContext)!!
    return (<>{audio.likes}</>)
}

export function AudioDisLikes({}) {
    const audio = useContext(AudioContext)!!
    return (<>{audio.dislikes}</>)
}

export function AudioViews({}) {
    const audio = useContext(AudioContext)!!
    return (<>{audio.views}</>)
}
