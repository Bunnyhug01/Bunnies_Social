import { Box, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Typography, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import FileUploadIcon from '@mui/icons-material/FileUpload';

import { useEffect, useRef, useState } from "react";

import UploadZone from "../UploadZone/UploadZone";
import ProgressBar from "../ProgressBar/ProgressBar";
import { UploadTask } from "firebase/storage";
import deleteFile from "../../firebase/deleteFile";
import { VideoCreateRequest, createVideo } from "@/app/firebase/video";
import { AudioCreateRequest, createAudio } from "@/app/firebase/audio";
import { ImageCreateRequest, createImage } from "@/app/firebase/image";
import TagsInput from "../TagsInput/TagsInput";
import { User, addNotification, getMe, hasUserNotifications } from "@/app/firebase/user";
import { useParams } from "next/navigation";


interface Props {
    type: string,
    langDictionary: any
}


export default function Upload({ type, langDictionary } : Props) {
  const params  = useParams();
  const lang: string = (params.lang).toString()
  
  const [mediaFileUpload, setMediaFileUpload] = useState<File|null>(null);
  const [thumbnailUpload, setThumbnailUpload] = useState<File|null>(null);

  const [mediaFileRef, setMediaFileRef] = useState<string>("");
  const [thumbnailRef, setThumbnailRef] = useState<string>("");

  const [isThumbnail, setIsThumbnail] = useState<boolean>(false);

  const [mediaFileLoadProgress, setMediaFileLoadProgress] = useState<number>(0);
  const [thumbnailLoadProgress, setThumbnailLoadProgress] = useState<number>(0);

  const [fileType, setFileType] = useState<string>("")
  
  const uploadRef = useRef<UploadTask>()
  const [uploadingCancellation, setUploadingCancellation] = useState<boolean>(false)

  const [privacy, setPrivacy] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  
  const [selected, setSelected] = useState<string[]>([]);

  const handleChange = (event: SelectChangeEvent) => {
    setPrivacy(event.target.value);
  };


  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);

    setMediaFileUpload(null)
    setThumbnailUpload(null)

    setIsVideoUpload(false)

  };


  const [openUpload, setOpenUpload] = useState(false);

  const handleClickUploadOpen = () => {
    setOpenUpload(true);
  };

  const handleUploadClose = () => {
    setOpenUpload(false)
    setIsVideoUpload(false)
  };

  const handleUploadCancel = () => {
    if (mediaFileRef !== "") {
        deleteFile(mediaFileRef)
        setMediaFileRef("")
    }
        
    uploadRef.current?.cancel()
  }

  const handleImageCancel = () => {
    if (thumbnailRef !== "") {
        deleteFile(thumbnailRef)
        setThumbnailRef("")
    }
        
    uploadRef.current?.cancel()
  }

  const [isThumbnailUpload, setIsThumbnailUpload] = useState<boolean>(false)

  useEffect(() => {
    setIsThumbnailUpload(!isThumbnailUpload)
  }, [thumbnailUpload])

  const [isVideoUpload, setIsVideoUpload] = useState<boolean>(false)

  useEffect(() => {
    if (mediaFileUpload !== null) {
        setIsVideoUpload(true)
    }
  }, [mediaFileUpload])


  const handleSubmit = (event: any) => {

    handleClose()

    setIsThumbnail(false)

    event.preventDefault();
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
        title: {value: string},
        description: {value: string},
    }

    const isPrivate = privacy === 'private'

    let id:string = ''
    let type:string = ''

    if (fileType === 'video') {
        
        const video: VideoCreateRequest = {
            logoUrl: thumbnailRef,
            title: formElements.title.value,
            details: formElements.description.value,
            videoUrl: mediaFileRef,
            isPrivate: isPrivate,
            tags: tags,
        }
        
        id = createVideo(video)
        type = langDictionary['video']
    }
    else if (fileType === 'image') {

        const image: ImageCreateRequest = {
            title: formElements.title.value,
            details: formElements.description.value,
            imageUrl: mediaFileRef,
            isPrivate: isPrivate,
            tags: tags,
        }

        id = createImage(image)
        type = langDictionary['image']

    }
    else if (fileType === 'audio') {

        const audio: AudioCreateRequest = {
            logoUrl: thumbnailRef,
            title: formElements.title.value,
            details: formElements.description.value,
            audioUrl: mediaFileRef,
            isPrivate: isPrivate,
            tags: tags,
        }

        id = createAudio(audio)
        type = langDictionary['audio']
    }

    getMe().then((user: User) => {
        user.subscribers?.map((subscriber: string) => {
            hasUserNotifications(subscriber).then((isNotifications) => {
                if (isNotifications) {
                    addNotification(
                        subscriber,
                        {
                            text: `${langDictionary['user']} "${user.username}" ${langDictionary['uploaded']} ${type} "${formElements.title.value}"`,
                            srcUrl: `/${lang}/${fileType}/${id}`
                        }
                    )
                }
            })
        })
    })

    setMediaFileUpload(null)
    setThumbnailUpload(null)
    
    setMediaFileRef("")
    setThumbnailRef("")
    
    setIsThumbnail(false)
    
    setMediaFileLoadProgress(0)
    setThumbnailLoadProgress(0)
    
    setFileType("")
    
    setUploadingCancellation(false)
    
    setPrivacy('')
    setTags([])

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
                    <FileUploadIcon />
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
                        <FileUploadIcon />
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
                        setMediaFileUpload(null)
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
                            setMediaFileUpload(null)
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
                                setFile={setMediaFileUpload}
                                type={{fileType: fileType, setFileType: setFileType, isThumbnail: isThumbnail}}
                                reference={{fileRef: mediaFileRef, setFileRef: setMediaFileRef}}
                                setProgress={setMediaFileLoadProgress}
                                cancel={{uploadRef: uploadRef, setUploadingCancellation: setUploadingCancellation, setIsFileUpload: setIsVideoUpload}}
                                langDictionary={langDictionary}
                            />

                            {mediaFileUpload && !uploadingCancellation
                                ? <ProgressBar value={mediaFileLoadProgress} />
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
                                setIsThumbnail(true)
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

                        <ProgressBar value={mediaFileLoadProgress} />

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
                            
                            <TagsInput tags={tags} setTags={setTags} langDictionary={langDictionary} />

                        </Box>
                        
                        {
                            fileType != 'image'
                            ? 
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
                                        setFile={setThumbnailUpload}
                                        acceptedfileType="image"
                                        type={{fileType: fileType, setFileType: setFileType, isThumbnail: isThumbnail}}
                                        reference={{fileRef: thumbnailRef, setFileRef: setThumbnailRef}}
                                        setProgress={setThumbnailLoadProgress}
                                        cancel={{uploadRef: uploadRef, setUploadingCancellation: setUploadingCancellation, setIsFileUpload: setIsThumbnailUpload}}
                                        langDictionary={langDictionary}
                                    />
                                    
                                    {thumbnailUpload && !uploadingCancellation
                                        ? <ProgressBar value={thumbnailLoadProgress} />
                                        : null
                                    }

                                </Box>
                                
                            </Box>
                            : null
                        }

                        </DialogContent>
                        <DialogActions>
                            <Button 
                                type="submit"
                                disabled={!((thumbnailLoadProgress === 100 || fileType === 'image') && mediaFileLoadProgress === 100)}
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
