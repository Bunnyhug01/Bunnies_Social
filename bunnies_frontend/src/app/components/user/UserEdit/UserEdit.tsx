import { Box, Button, Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Typography, TextField, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';

import { useRef, useState } from "react";


import { UploadTask } from "firebase/storage";

import deleteFile from "@/app/firebase/deleteFile";
import ProgressBar from "../../ProgressBar/ProgressBar";
import UploadZone from "../../UploadZone/UploadZone";
import { UserUpdateRequest, getUser, updateUser } from "@/app/firebase/user";
import { UserDetailsVar, UserIdInfo, UserName, UserNameVar } from "../user";


interface Props {
    userId: string,
    langDictionary: any
}


export default function UserEdit({ userId, langDictionary } : Props) {
  
  const [bannerUpload, setBannerUpload] = useState<File|null>(null);
  const [logoUpload, setLogoUpload] = useState<File|null>(null);

  const [bannerRef, setBannerRef] = useState<string>("");
  const [logoRef, setLogoRef] = useState<string>("");

  const [bannerLoadProgress, setBannerLoadProgress] = useState<number>(0);
  const [logoLoadProgress, setlogoLoadProgress] = useState<number>(0);

  const [fileType, setFileType] = useState<string>("")
  
  const uploadRef = useRef<UploadTask>()
  const [uploadingCancellation, setUploadingCancellation] = useState<boolean>(false)
  
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);

    setBannerUpload(null)
    setLogoUpload(null)

  };

  const handleBannerCancel = () => {
    if (bannerRef !== "") {
        deleteFile(bannerRef)
        setBannerRef("")
    }
        
    uploadRef.current?.cancel()
  }

  const handleLogoCancel = () => {
    if (logoRef !== "") {
        deleteFile(logoRef)
        setLogoRef("")
    }
        
    uploadRef.current?.cancel()
  }


  const handleSubmit = (event: any) => {

    handleClose()

    event.preventDefault();
    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
        userName: {value: string},
        description: {value: string},
    }

    const user:UserUpdateRequest = {
        username: formElements.userName.value,
        details: formElements.description.value,
        logoUrl: logoRef,
        bannerUrl: bannerRef
    }

    updateUser(userId, user)

  }

  return (

    <UserIdInfo id={userId}>
        <Box>
                    
            <IconButton
                onClick={handleClickOpen}
            >
                <EditIcon />
            </IconButton>
            
            <Box>
                <Dialog
                    onClose={() => {
                        handleClose()
                        handleLogoCancel()
                        handleBannerCancel()
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
                            handleLogoCancel()
                            handleBannerCancel()
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

                        <Typography variant="h5">{langDictionary['details']}</Typography>
                        <Box
                            sx={{
                            marginTop: 2,
                            }}
                            className="w-full"
                        >
                            <TextField
                                id="userName"
                                name="userName"
                                label={langDictionary['user_name']}
                                fullWidth
                                autoComplete="off"
                                variant="outlined" 
                                defaultValue={UserNameVar()}
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
                                defaultValue={UserDetailsVar()}
                            />


                        </Box>
                        
                        <Box 
                            sx ={{
                                marginTop: 2,
                            }}
                        >
                            <Typography variant="h5">{langDictionary['user_logo']}</Typography>
                            <Typography>{langDictionary['select_logo']}</Typography>

                            <Box
                                sx={{
                                    marginTop: 2,
                                }}
                                className="sm:w-full w-[40%]"
                            >

                                <UploadZone
                                    setFile={setLogoUpload}
                                    acceptedfileType='no audio'
                                    type={{fileType: fileType, setFileType: setFileType}}
                                    reference={{fileRef: logoRef, setFileRef: setLogoRef}}
                                    setProgress={setlogoLoadProgress}
                                    cancel={{uploadRef: uploadRef, setUploadingCancellation: setUploadingCancellation}}
                                    langDictionary={langDictionary}
                                />
                                
                                {logoUpload && !uploadingCancellation
                                    ? <ProgressBar value={logoLoadProgress} />
                                    : null
                                }

                            </Box>
                            
                        </Box>


                        <Box 
                            sx ={{
                                marginTop: 2,
                            }}
                        >
                            <Typography variant="h5">{langDictionary['user_banner']}</Typography>
                            <Typography>{langDictionary['select_banner']}</Typography>

                            <Box
                                sx={{
                                    marginTop: 2,
                                }}
                                className="sm:w-full w-[40%]"
                            >

                                <UploadZone
                                    setFile={setBannerUpload}
                                    acceptedfileType='no audio'
                                    type={{fileType: fileType, setFileType: setFileType}}
                                    reference={{fileRef: bannerRef, setFileRef: setBannerRef}}
                                    setProgress={setBannerLoadProgress}
                                    cancel={{uploadRef: uploadRef, setUploadingCancellation: setUploadingCancellation}}
                                    langDictionary={langDictionary}
                                />
                                
                                {bannerUpload && !uploadingCancellation
                                    ? <ProgressBar value={bannerLoadProgress} />
                                    : null
                                }

                            </Box>
                            
                        </Box>


                        </DialogContent>
                        <DialogActions>
                            <Button 
                                type="submit"
                                disabled={
                                    !((logoLoadProgress > 0 && logoLoadProgress === 100)
                                    || (bannerLoadProgress > 0 && bannerLoadProgress === 100)
                                    || (bannerLoadProgress > 0 && bannerLoadProgress === 100 && logoLoadProgress > 0 && logoLoadProgress === 100)
                                )
                                }
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
    </UserIdInfo>
  )
}