import { Box, Typography } from '@mui/material';
import { UserIdInfo, UserInfo, UserName } from '../user/user';
import { Audio } from '@/app/firebase/audio';
import { AudioInfo, AudioLength, AudioLogo, AudioTitle, AudioViews } from '../audio/audio';


interface Props {
    audio: Audio,
    langDictionary: any
}


export default function AudioList({ audio, langDictionary } : Props) {
    return (
        <Box className="py-1">
            <AudioInfo audio={audio}>
            <Box>
                <Box className='w-[15vw] h-auto'>
                    <AudioLogo/>
                </Box>
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
                    <Box sx={{color: 'text.secondary'}} className='flex items-center mt-2 lg:text-[14px] md:text-[14px] sm:text-[8px]'>
                        <Typography sx={{fontWeight: 'bold'}} variant='inherit'><AudioLength/></Typography>
                        <Typography sx={{fontWeight: 'bold', ml: 1}} variant='inherit'><AudioViews/> {langDictionary['views']}</Typography>
                    </Box>
            </Box>
            </AudioInfo>
        </Box>
    )
}
