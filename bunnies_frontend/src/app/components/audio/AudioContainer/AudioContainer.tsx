import Image from "next/image";

import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';
import PlayCircleFilledWhiteIcon from '@mui/icons-material/PlayCircleFilledWhite';
import PauseCircleFilledIcon from '@mui/icons-material/PauseCircleFilled';

import { Audio } from '@/app/firebase/audio';
import { AudioInfo, AudioTitle } from '../audio';
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
      <div className="relative w-auto h-full">
        
        <Box>

          <Box className="group relative inline-block text-center" onClick={handleClick}>
            <img
                src={audio.logoUrl}
                alt=""
                className="object-fill lg:h-[67vh] lg:w-[43vw] group-hover:opacity-70"
            />
            {
              isPlaying
              ? <PauseCircleFilledIcon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[12vw] h-[12vh] invisible group-hover:visible' />
              : <PlayCircleFilledWhiteIcon className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[12vw] h-[12vh] invisible group-hover:visible' />
            }
            
          </Box>

          <audio
            id="audioPlayer"
            src={audio.audioUrl}
            controls
            className="lg:w-[43vw] sm:w-full mt-[-5.8px]"
          />

        </Box>

          <Box className="w-full">
            {audio.audioUrl !== ""
              ? <AudioInformation audio={audio} langDictionary={langDictionary} />
              : null
            }
          </Box>

          <div className="absolute text-sm top-0 z-10 w-full h-[60px] py-4 px-3">
                <h2 className="text-textColor font-bold">
                    <AudioTitle/>
                </h2>
          </div>
        
      </div>
    </AudioInfo>
  )
}