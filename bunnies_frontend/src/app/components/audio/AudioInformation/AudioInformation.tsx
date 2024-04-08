import { ThumbUp, ThumbDown } from "@mui/icons-material";
import { Box, Button, IconButton, Typography } from "@mui/material";

import UserIcon from "../../user/UserIcon/UserIcon";
import MobileDescription from "../../MobileDescription/MobileDescription";
import Description from "../../Description/Description";
import { useEffect, useState } from "react";
import { addSubscribe, hasDisLike, hasLike, hasSubscribe, removeSubscribe } from "@/app/firebase/user";
import { auth } from "@/app/firebase/firebase";
import { Audio, addDisLike, addLike, removeDisLike, removeLike } from "@/app/firebase/audio";
import { useParams } from "next/navigation";


interface Props {
    audio : Audio
    langDictionary: any
}


export default function AudioInformation({ audio, langDictionary } : Props) {
  const params  = useParams();
  const user = localStorage.getItem('user')
  const lang: string = (params.lang).toString()

  const [likeView, setViewLike] = useState(audio?.likes)
  const [dislikeView, setViewDislike] = useState(audio?.dislikes)
  const [subscribeView, setSubscribeView] = useState<boolean | undefined>(undefined)

  async function handleLike() {

    if (user) {

      if (await hasDisLike(audio.id!)) {
        await removeDisLike(audio.id!)
        setViewDislike(dislikeView - 1)
      }
  
      if (await hasLike(audio.id!))
      {
        removeLike(audio.id!)
        setViewLike(likeView - 1)
      }
      else
      {
        addLike(audio.id!)
        setViewLike(likeView + 1)
      }

    }
    else {
      window.location.replace(`/${lang}/sign-in`)
    }

  }

  async function handleDislike() {

    if (user) {

      if (await hasLike(audio.id!))
      {
        await removeLike(audio.id!)
        setViewLike(likeView - 1)
      }
    
      if (await hasDisLike(audio.id!))
      {
        removeDisLike(audio.id!)
        setViewDislike(dislikeView - 1)
      }
      else
      {
        addDisLike(audio.id!)
        setViewDislike(dislikeView + 1)
      }

    }
    else {
      window.location.replace(`/${lang}/sign-in`)
    }

  }

  async function handleSubscribe() {

    if (user) {

      if (await hasSubscribe(audio.owner)) {
        await removeSubscribe(audio.owner)
        setSubscribeView(false)
      }
      else
      {
        await addSubscribe(audio.owner)
        setSubscribeView(true)
      }
      
    }
    else {
      window.location.replace(`/${lang}/sign-in`)
    }
    
  }

  useEffect(() => {
    hasSubscribe(audio.owner).then((result) => {
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
            <UserIcon userId={audio.owner} langDictionary={langDictionary} />
          </Box>
          
          <Box className="inline-block">

            <Button
              sx={{color: 'text.primary', ml:1}}
              disableElevation
              onClick={handleSubscribe}
              className="font-bold"
              disabled={audio.owner === auth.currentUser?.uid}
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
      
      <Box className='md:w-[80%] sm:w-[100%] lg:w-[80%]'>
        <Description audio={audio} langDictionary={langDictionary} />
        <MobileDescription audio={audio} langDictionary={langDictionary} />
      </Box>

    </Box>
  )
}