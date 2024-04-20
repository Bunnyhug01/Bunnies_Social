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
                    src={image ? image?.imageUrl : 'https://img.freepik.com/premium-vector/draw-banner-cute-bunny-easter-spring_45130-1604.jpg'}
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
