'use client'

import Link from 'next/link'
import { useParams, notFound, redirect } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Alert, Box, Button, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Snackbar, TextField, ThemeProvider, Typography, createTheme } from "@mui/material";

import Header from "../../../components/Header/Header";
import BottomNav from "../../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../../styles/designTokens";

import translation from '@/app/locales/translation';

import deleteFile from '@/app/firebase/deleteFile';

import { Image, ImageUpdateRequest, deleteImage, getOneImage, updateImage } from '@/app/firebase/image';
import { ImageInfo, UserImageLogo } from '@/app/components/image/image';
import { auth } from '@/app/firebase/firebase';
import { searchVideo, searchImage, searchAudio, searchUser } from '@/app/firebase/search';

export function UserImage() {
  const params  = useParams();
  const imageId = (params.userImage).toString()
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

  const [image, setImage] = useState<Image>()
  const [options, setOptions] = useState({})

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

    const replaceImage: ImageUpdateRequest = {
      title: formElements.title.value,
      details: formElements.description.value,
      isPrivate: isPrivate,
    }

    updateImage(imageId, replaceImage)
  }
  
  const handleDelete = async (event: any) => {
    setOpenDelete(true);
    
    if (image !== undefined) {

      deleteFile(image.imageUrl)

      deleteImage(image.id!)
    }

    setIfDeleted(true)

  }

  useEffect(() => {
    if (searchText !== undefined && searchText !== '') {

      Promise.all([
        searchVideo(searchText),
        searchImage(searchText),
        searchAudio(searchText),
        searchUser(searchText)
      ]).then(([videos, images, audios, users]: any) => {
        const options = {
          videos: videos,
          images: images,
          audios: audios,
          users: users
        }
        setOptions(options)
      })
    }

  },[])

  useEffect(() => {
    if (user && auth.currentUser?.emailVerified) {
      getOneImage(imageId).then((image) => {
        setImage(image)
      }).catch(response => {
        if(response.status == 404)
          setIfNotFound(true)
      })
    } else {
      redirect(`/${lang}/sign-in`)
    }
  }, [])

  useEffect(() => {
    if (ifNotFound)
      notFound()
  }, [ifNotFound])

  useEffect(() => {
    if (ifDeleted){
      redirect(`/${lang}/userImages`)
    }

  }, [ifDeleted])

  return(
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        overflowY: 'auto'
      }}
      className="h-[100vh] md2:h-[180vh] sm3:h-[110vh] sm:h-[150vh]"
    >
      
      <Header
        searchHandler={searchHandler}
        ColorModeContext={ColorModeContext}
        text={{searchText: searchText, setSearchText: setSearchText, options: options}}
        language={{langDictionary: langDictionary, lang: lang}}
      />
      

      <Box
        sx={{ marginTop: 5 }}
      >
      
        <Box
          sx={{
              marginTop: 2,
              marginLeft: 2,
          }}
          className="grid lg:grid-cols-2 md:grid-cols-2 gap-2 sm:mr-4 sm:grid-cols-1"
        >   
            <Box
            >{image
              ?
                <ImageInfo image={image!}>
                    <UserImageLogo />
                </ImageInfo>
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
                defaultValue={image?.title}
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
                  defaultValue={image?.details}
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
                        image?.isPrivate
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
                  marginTop: 2
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
        <UserImage />
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}
