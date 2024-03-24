import { Box, Typography } from '@mui/material';
import { UserIdInfo, UserInfo, UserName } from '../../user/user';
import { Image } from '@/app/firebase/image';
import { ImageDetails, ImageInfo, ImageLogo, ImageTitle, ImageViews } from '../image';


interface Props {
    image: Image,
    langDictionary: any
}


export default function ImageList({ image, langDictionary } : Props) {
    return (
        <Box>
            <ImageInfo image={image}>
            <Box>
                <ImageLogo/>
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
                <Box sx={{color: 'text.secondary'}} className='flex items-center mt-2 lg:text-[14px] md:text-[14px] sm:text-[8px]'>
                    <Typography sx={{fontWeight: 'bold'}} variant='inherit'><ImageViews/> {langDictionary['views']}</Typography>
                </Box>
            </Box>
            </ImageInfo>
        </Box>
    )
}
