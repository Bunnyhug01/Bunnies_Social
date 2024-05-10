'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import HistoryIcon from '@mui/icons-material/History';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import Header from "../../components/Header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../styles/designTokens";
import RecommendedList from "../../components/video/RecommendedList/RecommendedList";


import translation from '@/app/locales/translation';
import { Video, getOneVideo } from '@/app/firebase/video';
import { getMe } from '@/app/firebase/user';
import { Image, getOneImage } from '@/app/firebase/image';
import { Audio, getOneAudio } from '@/app/firebase/audio';
import AudioRecommendedList from '@/app/components/audio/AudioRecommendedList/AudioRecommendedList';
import ImageRecommendedList from '@/app/components/image/ImageRecommendedList/ImageRecommendedList';
import { searchVideo, searchImage, searchAudio, searchUser } from '@/app/firebase/search';

export function History() {

  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<Audio[]>([])

  const [options, setOptions] = useState({})

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
    
  useEffect(() => {
    if (searchText === undefined || searchText === '') {

      getMe().then((user) => 
        user.history.map((history) => history.video)
      ).then((videoIdArray) => {
        for (const videoId of videoIdArray) {
          if (videoId) {
            getOneVideo(videoId!).then((video) => {
              setVideos((prev)=>[...prev, video])
            })
          }
        }
      })
      
      getMe().then((user) => 
      user.history.map((history) => history.image) 
    ).then((imageIdArray) => {
      for (const imageId of imageIdArray) {
        if (imageId) {
          getOneImage(imageId!).then((image) => {
            setImages((prev)=>[...prev, image])
          })
        }
      }
    })

    getMe().then((user) => 
    user.history.map((history) => history.audio) 
    ).then((audioIdArray) => {
      for (const audioId of audioIdArray) {
        if (audioId) {
          getOneAudio(audioId!).then((audio) => {
            setAudios((prev)=>[...prev, audio])
          })
        }
      }
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
        text={{searchText: searchText, setSearchText: setSearchText, options: options}}
        language={{langDictionary: langDictionary, lang: lang}}
      />
            
      <Box 
        component="main"
        sx={{ 
          bgcolor: 'background.default',
          color: 'text.primary',
          flexGrow: 1, p: 3,
        }}
        className='overflow-scroll scrollbar-thin scrollbar-thumb-gray-800'
      >

            <Box className="flex items-center">
                <Typography className='text-[18px] font-bold my-2 px-2'>
                  {langDictionary['history']}
                </Typography>
                <HistoryIcon />
            </Box>

            <Box className="flex items-center">
              <Typography className='text-[18px] font-bold my-2 px-2'>
                {langDictionary['videos']}
              </Typography>
              <OndemandVideoIcon />
            </Box>

            <Box
              className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 ml-2 mr-2 pb-4"
            >
              {videos.length !== 0
                ? videos.map((video) => (
                  <Link
                    key={video.id}
                    href={`/${lang}/video/${video.id}`}
                  >
                    <RecommendedList video={video} langDictionary={langDictionary} />
                  </Link>
                ))
                : <Typography className="my-2 px-2">{langDictionary['historyVideo_list']}</Typography>
              }
            </Box>

            <Box className="flex items-center">
              <Typography className='text-[18px] font-bold my-2 px-2'>
                {langDictionary['images']}
              </Typography>
              <ImageIcon />
            </Box>

            <Box
              className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 ml-2 mr-2 pb-4"
            >
              {images.length !== 0  
                ? images.map((image) => (
                  <Link 
                    key={image.id}
                    href={`/${lang}/image/${image.id}`}
                  >
                    <ImageRecommendedList image={image} langDictionary={langDictionary} />
                  </Link>
                ))
                : <Typography className="my-2 px-2">{langDictionary['historyImage_list']}</Typography>
              }
            </Box>



            <Box className="flex items-center">
              <Typography className='text-[18px] font-bold my-2 px-2'>
                {langDictionary['audios']}
              </Typography>
              <MusicNoteIcon />
            </Box>

            <Box
              className="grid lg:grid-cols-3 sm:grid-cols-1 gap-4 ml-2 mr-2 pb-4"
            >
              {audios.length !== 0    
                ? audios.map((audio) => (
                  <Link 
                    key={audio.id}
                    href={`/${lang}/audio/${audio.id}`}
                  >
                    <AudioRecommendedList audio={audio} langDictionary={langDictionary} />
                  </Link>
                ))
                : <Typography className="my-2 px-2">{langDictionary['historyAudio_list']}</Typography>
              }
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
        <History />
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}
