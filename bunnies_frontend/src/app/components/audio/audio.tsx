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
        <Box className='group relative'>
            <img
                src={audio.logoUrl}
                alt=""
                className="rounded-lg object-cover lg:h-[30vh] sm:h-[12vh] lg:w-[17vw] group-hover:opacity-70"
            />
            <PlayCircleFilledWhiteIcon className='absolute w-[12vw] h-[12vh] lg:top-[9vh] lg:left-[2.5vw] invisible group-hover:visible' />
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