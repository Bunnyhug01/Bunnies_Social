import Image from 'next/image';

import { Box, Typography } from '@mui/material';
import { useState } from 'react';
import { UserIdInfo, UserName } from '../user/user';
import { Audio } from '@/app/firebase/audio';
import { AudioInfo, AudioLength, AudioLogo, AudioTitle, AudioViews } from '../audio/audio';

interface Props {
    audio: Audio
    langDictionary: any
}


export default function AudioRecommendedList({ audio, langDictionary } : Props) {
    return (
        <AudioInfo audio={audio}>
            <Box 
                className="flex items-center mb-2 cursor-pointer px-3 py-2 duration-200 ease-in-out overflow-hidden"
                sx={{'&:hover': {
                    backgroundColor: 'background.hoverColor',
                }}}
            >
                <Box className='relative w-[10vw] h-auto'>
                    <AudioLogo/>
                </Box>

                <Box className='ml-2 flex-1'>
                    <Box>
                        <Typography sx={{color: 'text.primary'}} variant='inherit' className='lg:text-[16px] sm:text-[12px]'>
                            <AudioTitle/> 
                        </Typography>
                        <UserIdInfo id={audio.owner}>
                            <Typography sx={{color: 'text.primary', fontSize: 12}} className='block'>
                                <UserName/>
                            </Typography>
                        </UserIdInfo>
                    </Box>
                    <Box sx={{color: 'text.secondary', fontSize: 14}} className='flex items-center mt-2'>
                        <Typography variant='inherit' className='font-bold'><AudioLength/></Typography>
                        <Typography variant='inherit' className='font-bold ml-6'><AudioViews/> {langDictionary['views']}</Typography>
                    </Box>
                </Box>
            </Box>
        </AudioInfo>
    )
}
