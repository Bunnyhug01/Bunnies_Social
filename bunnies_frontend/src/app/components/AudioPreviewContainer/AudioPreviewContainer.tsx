import Image from "next/image";

import { useState, useEffect, useRef } from 'react';
import VideoInformation from '../VideoInformation/VideoInformation';
import { Box } from '@mui/material';
import { Audio } from '@/app/firebase/audio';
import { AudioInfo, AudioTitle } from '../audio/audio';


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

export default function AudioPreviewContainer( { audio = audioDefault, langDictionary } : Props ) {

  return (
    <AudioInfo audio={audio}>
      <div className="relative w-full h-full">

        <img
            src={audio.logoUrl}
            alt=""
            className="min-w-[50%] w-[50%] lg:h-[70%] md2:h-[65%] sm:h-[60%] object-cover rounded-lg"
        />

          <Box className="absolute w-full lg:w-[100%]">
            {/* {audio.audioUrl !== ""
              ? <VideoInformation video={video} langDictionary={langDictionary} />
              : null
            } */}
          </Box>

          {/* <div className="absolute text-sm top-0 left-0 z-10 w-full h-[60px] py-4 px-3 bg-gradient-to-b from-black to-transparent">
              <h2 className="text-textColor" id='mainVideoName'>
                <AudioTitle/>
              </h2>
          </div> */}
        
      </div>
    </AudioInfo>
  )
}