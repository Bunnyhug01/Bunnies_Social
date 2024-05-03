import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

import { Image } from '@/app/firebase/image';
import { ImageInfo, ImageTitle } from '../image';
import ImageInformation from '../ImageInformation/ImageInformation';
import CommentComponent from '../../comment/CommentComponent/CommentComponent';
import MobileCommentComponent from '../../comment/MobileCommentComponent/MobileCommentComponent';


interface Props {
  image?: Image,
  langDictionary: any
}

const imageDefault = {
    title: '',
    details: '',
    imageUrl: '',
    uploadDate: '',
    likes: 0,
    dislikes: 0,
    views: 0,
    owner: '',
    isPrivate: false
}

export default function ImageContainer( { image = imageDefault, langDictionary } : Props ) {

    function openFullscreen() {
       
        const fullscreenImg = document.createElement('img');
        fullscreenImg.src = image.imageUrl;
        fullscreenImg.classList.add('fullscreen-image');
        
        fullscreenImg.onclick = () => {
          document.body.removeChild(fullscreenImg);
        };
      
        document.body.appendChild(fullscreenImg);
      }

    return (
        <ImageInfo image={image}>
            <Box className="h-full w-full flex flex-col items-center justify-center">
                
                <img
                    src={image.imageUrl}
                    alt={image.title}
                    onClick={openFullscreen}
                    className='rounded-md max-w-[100%] max-h-[80%] object-contain sm:mr-1 hover:cursor-zoom-in'
                />

                <Box className='absolute top-0 left-0 p-4 text-textColor font-bold'><ImageTitle/></Box>

                <Box className="w-full lg:w-[100%]">
                    {image.imageUrl !== ""
                        ? <ImageInformation image={image} langDictionary={langDictionary} />
                        : null
                    }
                    <Box className='md:w-[100%] sm:w-[100%] lg:w-[100%]'>
                        <Box className="lg:block md:block sm:hidden">
                            <CommentComponent imageId={image.id!} langDictionary={langDictionary} />
                        </Box>
                        <Box className="mt-1">
                            <MobileCommentComponent imageId={image.id!} langDictionary={langDictionary} />
                        </Box>
                    </Box>
                </Box>
                
            </Box>
        </ImageInfo>
    )
}