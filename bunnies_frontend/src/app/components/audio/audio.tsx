import { Audio } from "@/app/firebase/audio";
import { Box } from "@mui/material";
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import React, { useContext, useEffect, useState } from "react";

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

export function AudioUploadDate({}) {
    const audio = useContext(AudioContext)!!
    return (<>{audio.uploadDate}</>)
}

export function AudioLogo({}) {
    const audio = useContext(AudioContext)!!
    return (
        <Box className='group relative inline-block text-center'>
            <img
                src={audio.logoUrl}
                alt=""
                className="rounded-md max-w-full h-auto block group-hover:brightness-75"
            />
            <PlayCircleFilledWhiteIcon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[5vw] h-[5vw] invisible group-hover:visible' />
        </Box>
    )
}

export function UserAudioLogo({}) {
    const audio = useContext(AudioContext)!!
    return (
        <Box className="relative">
            <img
                src={audio.logoUrl}
                alt={audio.title}
                className="rounded-lg object-cover"
            />
            <audio
                src={audio.audioUrl}
                controls
                className="absolute rounded-b-lg bottom-0 w-full max-w-full opacity-70"
            />
        </Box>
    )
}

export function AudioLength({}) {
    const [time, setTime] = useState("");

    const audio = useContext(AudioContext)!!

    useEffect(() => {
        const tempAudioPlayer:HTMLAudioElement = document.createElement('audio')
        tempAudioPlayer.setAttribute("type", "hidden")
        tempAudioPlayer.src = audio.audioUrl
        tempAudioPlayer.preload = 'metadata'
    
        tempAudioPlayer.onloadedmetadata = function () {
    
            window.URL.revokeObjectURL(tempAudioPlayer.src);
            const duration = Math.floor(tempAudioPlayer.duration)

            const time = (duration / 60) >= 60
            ? new Date(duration * 1000).toISOString().slice(11, 19)
            : new Date(duration * 1000).toISOString().slice(14, 19)

            setTime(time)
        };
    
        tempAudioPlayer.remove()

    }, [audio])

    
    return (<>{time}</>)
}