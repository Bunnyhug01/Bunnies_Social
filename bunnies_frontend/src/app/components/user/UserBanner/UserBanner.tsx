import { Image } from '@/app/firebase/image'
import { Video } from '@/app/firebase/video'
import { Box } from '@mui/material'
import React from 'react'

interface Props {
    image?: Image,
    video?: Video,
}

export default function UserBanner({ image, video }: Props) {
  return (
    <Box className='w-full h-[40%]'>
        {   !video
            ?
                <img
                    src={image ? image?.imageUrl : 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/default%2Fdraw-banner-cute-bunny-easter-spring.jpg?alt=media&token=54c1577c-dd0a-4f4d-8727-b848dbb29cb3'}
                    alt={image?.title}
                    className='w-full h-full object-cover'
                />
            :
                <video
                    src={video.videoUrl}
                    autoPlay
                    loop
                    muted
                    controls
                    className='w-full h-full object-cover'
                ></video>
        }
    </Box>
  )
}
