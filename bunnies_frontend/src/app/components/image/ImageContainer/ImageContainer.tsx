import { useState, useEffect, useRef } from 'react';
import { Box } from '@mui/material';

import { Image } from '@/app/firebase/image';
import { ImageInfo, ImageTitle } from '../image';
import ImageInformation from '../ImageInformation/ImageInformation';


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
                    alt='image'
                    onClick={openFullscreen}
                    className='rounded-md max-w-[100%] max-h-[80%] object-contain hover:cursor-zoom-in'
                />

                <Box className="w-full lg:w-[100%]">
                    {image.imageUrl !== ""
                    ? <ImageInformation image={image} langDictionary={langDictionary} />
                    : null
                    }
                </Box>

                {/* <div className="absolute text-sm top-0 z-10 w-full h-[60px] py-4 px-3">
                    <h2 className="text-textColor font-bold" id='mainVideoName'>
                        <ImageTitle/>
                    </h2>
                </div> */}
                
            </Box>
        </ImageInfo>
    )
}