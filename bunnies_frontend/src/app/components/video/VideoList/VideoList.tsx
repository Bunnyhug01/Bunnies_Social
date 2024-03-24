import { Box, Typography } from '@mui/material';
import { UserIdInfo, UserInfo, UserName } from '../../user/user';
import { VideoInfo, VideoLength, VideoLogo, VideoLogoPlayer, VideoTitle, VideoViews } from '../video';
import UserIcon from '../../user/UserIcon/UserIcon';
import { Video } from '@/app/firebase/video';


interface Props {
    video: Video,
    langDictionary: any
}


export default function VideoList({ video, langDictionary } : Props) {
    return (
        <Box className="py-1">
            <VideoInfo video={video}>
            <Box>
                <Box>
                    <VideoLogoPlayer/>
                </Box>
                    <Box>
                        <Typography sx={{color: 'text.primary'}} variant='inherit' className='lg:text-[16px] sm:text-[12px]'>
                            <VideoTitle/> 
                        </Typography>
                        <UserIdInfo id={video.owner}>
                            <Typography sx={{color: 'text.primary', fontSize: 12}} className='block'>
                                <UserName/>
                            </Typography>
                        </UserIdInfo>
                    </Box>
                    <Box sx={{color: 'text.secondary'}} className='flex items-center mt-2 lg:text-[14px] md:text-[14px] sm:text-[8px]'>
                        <Typography sx={{fontWeight: 'bold'}} variant='inherit'><VideoLength/></Typography>
                        <Typography sx={{fontWeight: 'bold', ml: 1}} variant='inherit'><VideoViews/> {langDictionary['views']}</Typography>
                    </Box>
            </Box>
            </VideoInfo>
        </Box>
    )
}
