import Image from "next/image";

import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

import { Audio } from '@/app/firebase/audio';
import { AudioInfo, AudioTitle } from '../audio/audio';
import AudioInformation from "../AudioInformation/AudioInformation";


interface Props {
  audio?: Audio,
  langDictionary: any
}

const audioDefault = {
    logoUrl: '',
    title: '',
    details: '',
    audioUrl: '',
    uploadDate: '',
    likes: 0,
    dislikes: 0,
    views: 0,
    owner: '',
    isPrivate: false
}

export default function AudioContainer( { audio = audioDefault, langDictionary } : Props ) {

  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  const handleClick = () => {
    const audioPlayer:HTMLAudioElement = document.getElementById("audioPlayer") as HTMLAudioElement
    if (audioPlayer.duration > 0 && !audioPlayer.paused) {
      audioPlayer.pause()
      setIsPlaying(false)
    } else {
      audioPlayer.play()
      setIsPlaying(true)
    }
  }

  return (
    <AudioInfo audio={audio}>
      <div className="relative w-full h-full">
        
        <Box className="ml-[8vw] mr-[8vw]">

          <Box className="group relative" onClick={handleClick}>
            <img
                src={audio.logoUrl}
                alt=""
                className="min-w-[100%] w-[100%] lg:h-[51vh] md2:h-[65%] sm:h-[60%] object-fit rounded-t-md  group-hover:opacity-70"
            />
            {
              isPlaying
              ? <PauseCircleFilledIcon className='absolute w-[12vw] h-[12vh] lg:top-[20vh] lg:left-[18vw] invisible group-hover:visible' />
              : <PlayCircleFilledWhiteIcon className='absolute w-[12vw] h-[12vh] lg:top-[20vh] lg:left-[18vw] invisible group-hover:visible' />
            }
            
          </Box>

          <audio
            id="audioPlayer"
            src={audio.audioUrl}
            controls
            className="w-[100%] bg-slate-50 rounded-b-md"
          />

        </Box>

          <Box className="absolute w-full left-28 lg:w-[100%]">
            {audio.audioUrl !== ""
              ? <AudioInformation audio={audio} langDictionary={langDictionary} />
              : null
            }
          </Box>

          <div className="absolute text-sm top-0 left-32 z-10 w-full h-[60px] py-4 px-3">
                <h2 className="text-textColor font-bold" id='mainVideoName'>
                    <AudioTitle/>
                </h2>
          </div>
        
      </div>
    </AudioInfo>
  )
}