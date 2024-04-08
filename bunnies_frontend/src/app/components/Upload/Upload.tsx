import { Box, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Typography, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import VideoCallIcon from '@mui/icons-material/VideoCall';

import { useEffect, useRef, useState } from "react";

import UploadZone from "../UploadZone/UploadZone";
import ProgressBar from "../ProgressBar/ProgressBar";
import { UploadTask } from "firebase/storage";
import deleteFile from "../../firebase/deleteFile";
import { VideoCreateRequest, createVideo } from "@/app/firebase/video";


interface Props {
    type: string,
    langDictionary: any
}


export default function Upload({ type, langDictionary } : Props) {
  
  const [videoUpload, setVideoUpload] = useState<File|null>(null);
  const [imageUpload, setImageUpload] = useState<File|null>(null);

  const [videoRef, setVideoRef] = useState<string>("");
  const [imageRef, setImageRef] = useState<string>("");

  const [videoLoadProgress, setVideoLoadProgress] = useState<number>(0);
  const [imageLoadProgress, setImageLoadProgress] = useState<number>(0);

  const [fileType, setFileType] = useState<string>("")
  
  const uploadRef = useRef<UploadTask>()
  const [uploadingCancellation, setUploadingCancellation] = useState<boolean>(false)

  const [privacy, setPrivacy] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setPrivacy(event.target.value);
  };


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);

    setVideoUpload(null)
    setImageUpload(null)

    setIsVideoUpload(false)

  };


  const [openUpload, setOpenUpload] = useState(false);

  const handleClickUploadOpen = () => {
    setOpenUpload(true);
  };

  const handleUploadClose = () => {
    setOpenUpload(false);
    setIsVideoUpload(false)
  };

  const handleUploadCancel = () => {
    if (videoRef !== "") {
        deleteFile(videoRef)
        setVideoRef("")
    }
        
    uploadRef.current?.cancel()
  }

  const handleImageCancel = () => {
    if (imageRef !== "") {
        deleteFile(imageRef)
        setImageRef("")
    }
        
    uploadRef.current?.cancel()
  }

  const [isThumbnailUpload, setIsThumbnailUpload] = useState<boolean>(false)

  useEffect(() => {
    setIsThumbnailUpload(!isThumbnailUpload)
  }, [imageUpload])

  const [isVideoUpload, setIsVideoUpload] = useState<boolean>(false)

  useEffect(() => {
    if (videoUpload !== null) {
        setIsVideoUpload(true)
    }
  }, [videoUpload])


  const handleSubmit = (event: any) => {

    handleClose()

    event.preventDefault();
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
        title: {value: string},
        description: {value: string},
    }

    const isPrivate = privacy === 'private'
    const video: VideoCreateRequest = {
        logoUrl: imageRef,
        title: formElements.title.value,
        details: formElements.description.value,
        videoUrl: videoRef,
        isPrivate: isPrivate,
    }

    createVideo(video)
  }

 
  return (
    <Box>

        {
            type === 'button'
            ?
                <IconButton
                    size="large"
                    color="inherit"
                    onClick={handleClickUploadOpen}
                >
                    <VideoCallIcon />
                </IconButton>
            :
                <MenuItem
                    onClick={handleClickUploadOpen}
                >
                    <IconButton
                        size="large"
                        color="inherit"
                        style={{ backgroundColor: 'transparent' }}
                    >
                        <VideoCallIcon />
                    </IconButton>
                    <Typography>{langDictionary['upload']}</Typography>
                </MenuItem>
        
        }

        <Box>
            <Box>
                <Dialog
                    onClose={() => {
                        handleUploadClose()
                        handleUploadCancel()
                        setVideoUpload(null)
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={openUpload}
                    fullWidth
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        {langDictionary['file_upload']}
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            handleUploadClose()
                            handleUploadCancel()
                            setVideoUpload(null)
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                    <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <Box>
                            <UploadZone
                                setFile={setVideoUpload}
                                type={{fileType: fileType, setFileType: setFileType}}
                                reference={{fileRef: videoRef, setFileRef: setVideoRef}}
                                setProgress={setVideoLoadProgress}
                                cancel={{uploadRef: uploadRef, setUploadingCancellation: setUploadingCancellation, setIsFileUpload: setIsVideoUpload}}
                                langDictionary={langDictionary}
                            />

                            {videoUpload && !uploadingCancellation
                                ? <ProgressBar value={videoLoadProgress} />
                                : null
                            }
                        </Box>
                    </DialogContent>
                    <DialogActions>
   
                        <Button
                            disabled={!isVideoUpload} 
                            autoFocus 
                            onClick={() => {
                                handleUploadClose()
                                handleClickOpen()
                            }}
                        >
                            {langDictionary['next_button']}
                        </Button>
    
                    </DialogActions>
                </Dialog>
            </Box>

            <Box>
                <Dialog
                    onClose={() => {
                        handleClose()
                        handleImageCancel()
                        handleUploadCancel()
                    }}
                    aria-labelledby="customized-dialog-title"
                    open={open}
                    fullWidth
                >
                    <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                        {langDictionary['file_upload']}
                    </DialogTitle>
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            handleClose()
                            handleImageCancel()
                            handleUploadCancel()
                        }}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <form
                        method="post" 
                        onSubmit={(event) => {
                            handleSubmit(event)
                        }}
                    >
                        <DialogContent dividers>

                        <Typography variant="h5">{langDictionary['file_uploading_progress']}</Typography>

                        <ProgressBar value={videoLoadProgress} />

                        <Typography variant="h5">{langDictionary['details']}</Typography>
                        <Box
                            sx={{
                            marginTop: 2,
                            }}
                            className="w-full"
                        >
                            <TextField
                                required
                                id="title"
                                name="title"
                                label={langDictionary['title']}
                                fullWidth
                                autoComplete="off"
                                variant="outlined" 
                            />

                            <TextField
                                sx={{
                                    marginTop: 4,
                                }}
                                placeholder="Tell viewers about your video"
                                id="description"
                                label={langDictionary['description']}
                                multiline
                                fullWidth
                                rows={4}
                            />

                            <FormControl
                                sx={{
                                    marginTop: 4,
                                }}
                                fullWidth
                                required          
                            >
                                <InputLabel>{langDictionary['privacy']}</InputLabel>
                                <Select
                                    id="privacy"
                                    value={privacy}
                                    label={langDictionary['privacy']}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={'private'}>{langDictionary['private']}</MenuItem>
                                    <MenuItem value={'public'}>{langDictionary['public']}</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box 
                            sx ={{
                            marginTop: 2,
                            }}
                        >
                            <Typography variant="h5">{langDictionary['thumbnail']}</Typography>
                            <Typography>{langDictionary['select_thumbnail']}</Typography>

                            <Box
                                sx={{
                                    marginTop: 2,
                                }}
                                className="sm:w-full w-[40%]"
                            >
     
                                <UploadZone
                                    setFile={setImageUpload}
                                    acceptedfileType="image"
                                    type={{fileType: fileType, setFileType: setFileType}}
                                    reference={{fileRef: imageRef, setFileRef: setImageRef}}
                                    setProgress={setImageLoadProgress}
                                    cancel={{uploadRef: uploadRef, setUploadingCancellation: setUploadingCancellation, setIsFileUpload: setIsThumbnailUpload}}
                                    langDictionary={langDictionary}
                                />
                                
                                {imageUpload && !uploadingCancellation
                                    ? <ProgressBar value={imageLoadProgress} />
                                    : null
                                }

                            </Box>
                            
                        </Box>

                        </DialogContent>
                        <DialogActions>
                            <Button 
                                type="submit"
                                disabled={!(imageLoadProgress === 100 && videoLoadProgress === 100)}
                                autoFocus
                                onSubmit={(event) => handleSubmit(event)}
                            >
                                {langDictionary['save']}
                            </Button>
                        </DialogActions>
                    </form>
                    
                </Dialog>
            </Box>

        </Box>

    </Box>
  )
}
