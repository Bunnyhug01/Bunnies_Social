'use client'

import { notFound, useParams, useRouter } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, Link, ThemeProvider, Typography, createTheme } from "@mui/material";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';

import Header from "../../components/Header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../styles/designTokens";
import VideoList from '../../components/video/VideoList/VideoList';

import translation from '../../locales/translation';
import getUsersLanguage from '../../locales/getUsersLanguage';
import { UserAuthRequest } from '../../firebase/user';
import { getAllVideos, Video } from '../../firebase/video';
import { auth } from '../../firebase/firebase';
import { searchAudio, searchImage, searchUser, searchVideo } from '../../firebase/search';


export function Videos() {
  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [data, setData] = useState<Video[]>([])
  const [options, setOptions] = useState({})

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
  
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

  }, [searchText])

  useEffect(() => {
    getAllVideos().then((videoArray: Video[]) => {
      const videos = Object.values(videoArray).filter((video: Video) => !video.isPrivate)
      setData(videos)
    })
  }, [])

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
      

      <Box sx={{ height: '100vh', width: '100vw', marginTop: 5 }}>

        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['videos']}
          </Typography>
          <OndemandVideoIcon />
        </Box>

        <Box
          className="grid grid-cols-3 gap-4 ml-2 mr-2 pb-4"
        >
          {data.length !== 0
            ? data.map((video) => (
              <Link 
                key={video.id}
                href={`/${lang}/video/${video.id}`}
                underline='none'
              >
                <VideoList video={video} langDictionary={langDictionary} />
              </Link>
            ))
            : <Typography className="my-2 px-2">{langDictionary['no_videos']}</Typography>
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
      <Videos />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}