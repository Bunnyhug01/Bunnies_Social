'use client'

import Link from 'next/link'
import { useParams, notFound, redirect } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";

import Header from "../../../components/Header/Header";
import BottomNav from "../../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../../styles/designTokens";

import translation from '@/app/locales/translation';
import { UserVideoLogo, VideoInfo, VideoLogo } from '@/app/components/video/video';
import deleteFile from '@/app/firebase/deleteFile';
import { Video, VideoUpdateRequest, deleteVideo, getOneVideo, updateVideo } from '@/app/firebase/video';

export function UserVideo() {
  const params  = useParams();
  const videoId = (params.userVideo).toString()
  const lang: string = (params.lang).toString()
  const user = localStorage.getItem('user')

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()


  const [openReplace, setOpenReplace] = React.useState(false);
  const [openDelete, setOpenDelete] = React.useState(false);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenReplace(false);
    setOpenDelete(false);
  };

  const [video, setVideo] = useState<Video>()

  const [ifNotFound, setIfNotFound] = useState<boolean>(false)
  const [ifDeleted, setIfDeleted] = useState<boolean>(false)

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])

  const [privacy, setPrivacy] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setPrivacy(event.target.value);
  };

  const handleSubmit = async (event: any) => {

    setOpenReplace(true);

    event.preventDefault();

    const form = event.currentTarget
    const formElements = form.elements as typeof form.elements & {
        title: {value: string},
        description: {value: string},
    }

    const isPrivate = privacy === 'private' ? false : true

    const replaceVideo: VideoUpdateRequest = {
      title: formElements.title.value,
      details: formElements.description.value,
      isPrivate: isPrivate,
    }

    updateVideo(videoId, replaceVideo)
  }
  
  const handleDelete = async (event: any) => {
    setOpenDelete(true);
    
    if (video !== undefined) {

      deleteFile(video.logoUrl)
      deleteFile(video.videoUrl)

      deleteVideo(video.id!)

    }

    setIfDeleted(true)

  }

  useEffect(() => {

    if (user) {
      getOneVideo(videoId).then((video) => {
        setVideo(video)
      }).catch(response => {
        if(response.status == 404)
          setIfNotFound(true)
      })
    } else {
      redirect(`/${lang}/sign-in`)
    }

  },[])

  useEffect(() => {
    if (ifNotFound)
      notFound()
  }, [ifNotFound])

  useEffect(() => {
    if (ifDeleted){
      redirect(`/${lang}/userVideos`)
    }

  }, [ifDeleted])

  return(
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      
      <Header
        searchHandler={searchHandler}
        ColorModeContext={ColorModeContext}
        text={{searchText: searchText, setSearchText: setSearchText}}
        language={{langDictionary: langDictionary, lang: lang}}
      />
      

      <Box
       sx={{ marginTop: 5 }}
       className="h-[100vh]"
      >
      
        <Box
          sx={{
              marginTop: 2,
              marginLeft: 2,
          }}
          className="grid lg:grid-cols-2 md:grid-cols-2 gap-2 sm:mr-4 sm:grid-cols-1"
        >  
            <Box
              className="lg:max-w-[48vw] lg:max-h-[60vh] overflow-hidden"
            >{video
              ?
                <VideoInfo video={video!}>
                    <UserVideoLogo />
                </VideoInfo>
              : null
              }
            </Box>

            <form
              method="post" 
              onSubmit={(event) => {
                  handleSubmit(event)
              }}
            >
              <TextField
                InputLabelProps={{ shrink: true }}
                required
                id="title"
                name="title"
                label={langDictionary['title']}
                fullWidth
                autoComplete="off"
                variant="outlined" 
                defaultValue={video?.title}
              />

              <TextField
                  sx={{
                      marginTop: 4,
                  }}
                  InputLabelProps={{ shrink: true }}
                  placeholder="Tell viewers about your video"
                  id="description"
                  label={langDictionary['description']}
                  multiline
                  fullWidth
                  rows={4}
                  defaultValue={video?.details}
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
                      defaultValue={
                        video?.isPrivate
                        ? 'public'
                        : 'private'
                      }
                      label={langDictionary['privacy']}
                      onChange={handleChange}
                  >
                      <MenuItem value={'private'}>{langDictionary['private']}</MenuItem>
                      <MenuItem value={'public'}>{langDictionary['public']}</MenuItem>
                  </Select>
              </FormControl>

              <Button 
                type="submit"
                autoFocus
                sx = {{
                  marginTop: 2,
                }}
              >
                {langDictionary['save']}
              </Button>

              <Button
                autoFocus
                sx = {{
                  marginTop: 2,
                }}
                onClick={(event) => handleDelete(event)}
              >
                {langDictionary['delete']}
              </Button>
            </form>

        </Box>

      </Box>

      <Snackbar open={openReplace} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
          {langDictionary['replace_message']}
        </Alert>
      </Snackbar>

      <Snackbar open={openDelete} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
        {langDictionary['delete_message']}
        </Alert>
      </Snackbar>
      
      <BottomNav language={{langDictionary: langDictionary, lang: lang}} />

    </Box>
  );
    
}

export default function ToggleColorMode() {
    const [mode, setMode] = React.useState<'light' | 'dark'>('dark');
    const colorMode = React.useMemo(
      () => ({
        toggleColorMode: () => {
          setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
        },
      }),
      [],
    );
  
    const theme = React.useMemo(
      () =>
        createTheme(getDesignTokens(mode)),
      [mode],
    );
  
    return (
      <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <UserVideo />
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}
