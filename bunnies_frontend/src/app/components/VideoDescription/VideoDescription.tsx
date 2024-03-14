import { Accordion, AccordionSummary, Box, Typography, AccordionDetails } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { VideoUploadDate } from '../video/video';
import { Video } from '@/app/firebase/video';


interface Props {
  video: Video;
  langDictionary: any;
}


export default function VideoDescription({ video, langDictionary } : Props) {
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
          <Typography sx={{fontWeight: 'bold', fontSize: 14}}>{video?.views} {langDictionary['views']}</Typography>
        </Box>

        <Box className="mx-4">
          <Typography sx={{fontWeight: 'bold', fontSize: 14}}>
            <VideoUploadDate />
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          {video.details}
        </Typography>
      </AccordionDetails>
    </Accordion>
  )
}
