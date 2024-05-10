'use client'

import Link from 'next/link'
import { notFound, useParams, useRouter } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../styles/designTokens";
import VideoList from '../components/video/VideoList/VideoList';

import translation from '../locales/translation';
import getUsersLanguage from '../locales/getUsersLanguage';
import { Video, getLastVideos } from '../firebase/video';
import { searchAudio, searchImage, searchUser, searchVideo } from '../firebase/search';
import { Audio, getLastAudios } from '../firebase/audio';
import { Image, getLastImages } from '../firebase/image';
import AudioList from '../components/audio/AudioList/AudioList';
import ImageList from '../components/image/ImageList/ImageList';


export function Home() {
  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<Audio[]>([])

  const [options, setOptions] = useState({})

  const [searchText, setSearchText] = useState<string|undefined>('');
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
  
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
      getLastVideos(3).then((videoArray:any) => {
        setVideos(Object.values(videoArray))
      })

      getLastAudios(4).then((audioArray:any) => {
        setAudios(Object.values(audioArray))
      })

      getLastImages(4).then((imageArray:any) => {
        setImages(Object.values(imageArray))
      })

    } else {

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

  }, [searchText])


  const router = useRouter();

  useEffect(() => {
    const isRedirected = localStorage.getItem('redirected');
    
    if (!isRedirected) {
      const usersLang = getUsersLanguage()
      router.push(`/${usersLang}`);
      localStorage.setItem('redirected', 'true');
    }
  }, []);

  return(
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        msOverflowY: 'auto'
      }}
      className="h-[160vh]"
    >
      
      <Header
        searchHandler={searchHandler}
        ColorModeContext={ColorModeContext}
        text={{searchText: searchText, setSearchText: setSearchText, options: options}}
        language={{langDictionary: langDictionary, lang: lang}}
      />
      

      <Box sx={{ marginTop: 5 }}>
        
        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['last_videos']}
          </Typography>
          <OndemandVideoIcon />
        </Box>

        <Box
          className="grid grid-cols-3 gap-4 ml-2 mr-2 pb-4"
        >
          {videos.map((video) => (
            <Link 
              key={video.id}
              href={`${lang}/video/${video.id}`}
            >
              <VideoList video={video} langDictionary={langDictionary} />
            </Link>
          ))}
        </Box>


        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['last_images']}
          </Typography>
          <ImageIcon />
        </Box>

        <Box
          className="grid grid-cols-4 gap-4 ml-2 mr-2 pb-4"
        >
          {images.map((image) => (
            <Link 
              key={image.id}
              href={`${lang}/image/${image.id}`}
            >
              <ImageList image={image} langDictionary={langDictionary} />
            </Link>
          ))}
        </Box>



        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['last_audio']}
          </Typography>
          <MusicNoteIcon />
        </Box>

        <Box
          className="grid grid-cols-4 gap-4 ml-2 mr-2 pb-4"
        >
          {audios.map((audio) => (
            <Link 
              key={audio.id}
              href={`${lang}/audio/${audio.id}`}
              className='max-w-[15vw]'
            >
              <AudioList audio={audio} langDictionary={langDictionary} />
            </Link>
          ))}
        </Box>



      </Box>
      
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
      <Home />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}