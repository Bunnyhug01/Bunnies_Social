import { TimelineLite } from 'gsap';
import { useState, useEffect, useRef } from 'react';
import { VideoInfo, VideoTitle } from '../video/video';
import VideoInformation from '../VideoInformation/VideoInformation';
import { Box } from '@mui/material';
import { Video } from '@/app/firebase/video';


interface Props {
  video?: Video,
  langDictionary: any
}


const default_logo_urls: string[] = [
  "https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/gifs%2Fpls-stand-by.gif?alt=media&token=806aa7de-98a6-4189-890e-3c1cb442b00a",
  "https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/gifs%2Fpl_stand_by_second.gif?alt=media&token=b40b4800-90aa-4499-b5cc-5ab73b1d6bdb",
  "https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/gifs%2Ffallout-please-stand-by.gif?alt=media&token=e696cca5-6c9c-4700-bf9e-a3cef20165e5",
]



function DEFAULT_VIDEO(): Video {
  const random_default_logo:string = default_logo_urls[(Math.floor(Math.random() * default_logo_urls.length))]
  
  return {
    logoUrl: random_default_logo,
    title: '',
    details: '',
    videoUrl: '',
    uploadDate: '',
    likes: 0,
    dislikes: 0,
    views: 0,
    owner: '',
    isPrivate: false
  }
}


export default function VideoContainer( { video = DEFAULT_VIDEO(), langDictionary } : Props ) {
  const [isPlaying, setPlaying] = useState<boolean>(false);
  const tl: TimelineLite = new TimelineLite({ delay: 0.3 });
  
  useEffect(() => {
    if(isPlaying) {
      tl.fromTo('#mainVideoName', { y : 0, opacity : 1 }, { y : -20, opacity : 0 });
    } else {
      tl.fromTo('#mainVideoName', { y : -20, opacity : 0 }, { y : 0, opacity : 1 });
    }
  }, [isPlaying, video])

  return (
    <VideoInfo video={video}>
      <div className="relative w-full h-full">
          <video 
              src={video.videoUrl}
              controls
              poster={ video.logoUrl }
              className="min-w-full w-full lg:h-[70%] md2:h-[65%] sm:h-[60%] object-cover"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
          ></video>

          <Box className="absolute w-full lg:w-[100%]">
            {video.videoUrl !== ""
              ? <VideoInformation video={video} langDictionary={langDictionary} />
              : null
            }
          </Box>

          <div className="absolute text-sm top-0 left-0 z-10 w-full h-[60px] py-4 px-3 bg-gradient-to-b from-black to-transparent">
              <h2 className="text-textColor" id='mainVideoName'>
                <VideoTitle/>
              </h2>
          </div>
        
      </div>
    </VideoInfo>
  )
}