import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

import UserIcon from "../../user/UserIcon/UserIcon";
import MobileVideoDescription from "../../MobileVideoDescription/MobileVideoDescription";
import Description from "../../Description/Description";
import { useEffect, useState } from "react";
import { Video, addDisLike, addLike, removeDisLike, removeLike } from "@/app/firebase/video";
import { addSubscribe, hasDisLike, hasLike, hasSubscribe, removeSubscribe } from "@/app/firebase/user";
import { auth } from "@/app/firebase/firebase";


interface Props {
  video : Video
  langDictionary: any
}


export default function VideoInformation({ video, langDictionary } : Props) {

  const [likeView, setViewLike] = useState(video?.likes)
  const [dislikeView, setViewDislike] = useState(video?.dislikes)
  const [subscribeView, setSubscribeView] = useState<boolean | undefined>(undefined)

  async function handleLike() {

    if (await hasDisLike(video.id!)) {
      await removeDisLike(video.id!)
      setViewDislike(dislikeView - 1)
    }

    if (await hasLike(video.id!))
    {
      removeLike(video.id!)
      setViewLike(likeView - 1)
    }
    else
    {
      addLike(video.id!)
      setViewLike(likeView + 1)
    }

  }

  async function handleDislike() {

    if (await hasLike(video.id!))
    {
      await removeLike(video.id!)
      setViewLike(likeView - 1)
    }

    if (await hasDisLike(video.id!))
    {
      removeDisLike(video.id!)
      setViewDislike(dislikeView - 1)
    }
    else
    {
      addDisLike(video.id!)
      setViewDislike(dislikeView + 1)
    }

  }

  async function handleSubscribe() {
    
    if (await hasSubscribe(video.owner)) {
      await removeSubscribe(video.owner)
      setSubscribeView(false)
    }
    else
    {
      await addSubscribe(video.owner)
      setSubscribeView(true)
    }

  }

  useEffect(() => {
    hasSubscribe(video.owner).then((result) => {
      if (result) {
        setSubscribeView(true)
      }
    })
  }, [])
  

  return (
    <Box>
      <Box className="flex items-center lg:w-[100%] md:w-[100%] sm:w-[100%] h-[80px] py-4 px-8 sm:px-4">

        <Box>
          <Box className="inline-block">
            <UserIcon userId={video.owner} langDictionary={langDictionary} />
          </Box>
          
          <Box className="inline-block">

            <Button
              sx={{color: 'text.primary', ml:1}}
              disableElevation
              onClick={handleSubscribe}
              className="font-bold"
              disabled={video.owner === auth.currentUser?.uid}
            >
              {
                subscribeView
                ? langDictionary['unsubscribe']
                : langDictionary['subscribe']
              }
            </Button>

            <IconButton
              className="lg:ml-2"
              onClick={handleLike}
            >
                <ThumbUp sx={{color: 'text.primary'}} className="lg:w-[25px] lg:h-[25px] md:w-[25px] md:h-[25px] sm:w-[20px] sm:h-[20px]" />
            </IconButton>
            <Typography sx={{color: 'text.secondary', fontSize: 14, fontWeight: 'bold', ml: 1}} className='inline-block'>{likeView}</Typography>

            <IconButton 
              sx={{ml: 1}}
              onClick={handleDislike}
            >
                <ThumbDown sx={{color: 'text.primary'}} className="lg:w-[25px] lg:h-[25px] md:w-[25px] md:h-[25px] sm:w-[20px] sm:h-[20px]" />
            </IconButton>
            <Typography sx={{color: 'text.secondary', fontSize: 14, fontWeight: 'bold', ml: 1}} className='inline-block'>{dislikeView}</Typography>
          </Box>
        </Box>
      </Box>
      
      <Box className='md:w-[100%] sm:w-[100%] lg:w-[100%]'>
        <Description video={video} langDictionary={langDictionary} />
        <MobileVideoDescription video={video} langDictionary={langDictionary} />
      </Box>

    </Box>
  )
}