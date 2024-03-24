import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { UserIdInfo, UserName } from '../../user/user';
import { Image } from '@/app/firebase/image';
import { ImageInfo, ImageLogo, ImageTitle, ImageViews } from '../image';

interface Props {
    image: Image
    langDictionary: any
}


export default function ImageRecommendedList({ image, langDictionary } : Props) {
    return (
        <ImageInfo image={image}>
            <Box 
                className="flex items-center mb-2 cursor-pointer px-3 py-2 duration-200 ease-in-out overflow-hidden"
                sx={{'&:hover': {
                    backgroundColor: 'background.hoverColor',
                }}}
            >
                <Box className='relative w-[10vw] h-auto'>
                    <ImageLogo/>
                </Box>

                <Box className='ml-2 flex-1'>
                    <Box>
                        <Typography sx={{color: 'text.primary'}} variant='inherit' className='lg:text-[16px] sm:text-[12px]'>
                            <ImageTitle/> 
                        </Typography>
                        <UserIdInfo id={image.owner}>
                            <Typography sx={{color: 'text.primary', fontSize: 12}} className='block'>
                                <UserName/>
                            </Typography>
                        </UserIdInfo>
                    </Box>
                    <Box sx={{color: 'text.secondary', fontSize: 14}} className='flex items-center mt-2'>
                        <Typography variant='inherit' className='font-bold'><ImageViews/> {langDictionary['views']}</Typography>
                    </Box>
                </Box>
            </Box>
        </ImageInfo>
    )
}
