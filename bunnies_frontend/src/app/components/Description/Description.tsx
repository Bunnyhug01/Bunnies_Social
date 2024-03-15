import { Accordion, AccordionSummary, Box, Typography, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { VideoUploadDate } from '../video/video';
import { Video } from '@/app/firebase/video';
import { Audio } from '@/app/firebase/audio';
import { Image } from '@/app/firebase/image';
import { AudioUploadDate } from '../audio/audio';
import { ImageUploadDate } from '../image/image';


interface Props {
  video?: Video;
  audio?: Audio;
  image?: Image;
  langDictionary: any;
}


export default function Description({ video, audio, image, langDictionary } : Props) {
    
  return (
    <Accordion
      sx={{bgcolor: 'background.additional'}}
      elevation={0}
      className="lg:block md:block sm:hidden"
    >
      <AccordionSummary
        sx={{pointerEvents: ""}}
        expandIcon={
          <ExpandMoreIcon
            sx={{pointerEvents: "auto"}}
          />
        }
        aria-controls="panel2a-content"
        id="panel2a-header"
      >
        <Box className="mx-4">
          <Typography sx={{fontWeight: 'bold', fontSize: 14}}>{(video) ? (video.views) : ((audio) ? (audio.views) : (image?.views))} {langDictionary['views']}</Typography>
        </Box>

        <Box className="mx-4">
          <Typography sx={{fontWeight: 'bold', fontSize: 14}}>
            {
              (video) ? <VideoUploadDate /> : ((audio) ? <AudioUploadDate /> : <ImageUploadDate />)
            }
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {
            (video) ? (video.details) : ((audio) ? (audio.details) : (image?.details))
          }
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}
