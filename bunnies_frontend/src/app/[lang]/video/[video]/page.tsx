'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Header from '../../../components/Header/Header';
import Comments from '../../../components/comment/Comments/Comments';
import RecommendedList from '../../../components/video/RecommendedList/RecommendedList';
import VideoContainer from '../../../components/video/VideoContainer/VideoContainer';
import BottomNav from '../../../components/BottomNav/BottomNav';

import { ColorModeContext, getDesignTokens } from '../../../styles/designTokens';

import translation from '@/app/locales/translation';
import { addToHistory, addView, getOneVideo, getRecommendations, Video } from '@/app/firebase/video';
import { auth } from '@/app/firebase/firebase';


function Video() {
  const params  = useParams();
  const videoId = (params.video).toString()
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [ifNotFound, setIfNotFound] = useState<boolean>(false)

  const [recommendation, setRecommendation] = useState<Video[]>([])

  const [video, setVideo] = useState<Video>()

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])

  useEffect(() => {
    
    auth.onAuthStateChanged((user) => {
      if (user) {
        getOneVideo(videoId).then((video) => {
          setVideo(video)
          addView(video.id!)
          addToHistory(video.id!)
        }).catch(response => {
          if(response.status == 404)
            setIfNotFound(true)
        })
      } else {
        window.location.replace(`/${lang}/sign-in`);
      }
    })

  },[])
  
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
      getRecommendations(videoId).then((videoArray) => {
        setRecommendation(Object.values(videoArray))
      })
    } else {
      // search(searchText).then((videoArray) => {
      //   setRecommendation(videoArray)
      // })
    }

  }, [searchText])
  
  useEffect(() => {
    if (ifNotFound)
      notFound()
  }, [ifNotFound])

  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
      }}>
      
      <Header
        searchHandler={searchHandler}
        ColorModeContext={ColorModeContext}
        text={{searchText: searchText, setSearchText: setSearchText}}
        language={{langDictionary: langDictionary, lang: lang}}
      />
      
      <Box 
        component="main"
        sx={{ 
          bgcolor: 'background.default',
          color: 'text.primary',
          flexGrow: 1, p: 3,
        }}>
        
        
        {/* Main Container */}
        <Box className='md:w-full h-full'>
          {/* Top Section */}
          <Box className='relative w-full h-full max-h-[700px] grid grid-cols-3 gap-2 p-2 sm:w-[107vw] sm:right-[10vw] sm3:w-[108vw] sm3:right-[9vw] lg:right-0 md:right-0 md:w-full sm2:w-full sm2:right-0'>
            
            {/* Video Container */}
            <Box className='sm:col-span-6 md:col-span-2 rounded-lg overflow-hidden items-center justify-center flex'>
              <VideoContainer video={video} langDictionary={langDictionary} />
            </Box>

            {/* Recommended list */} 
            <Box className='sm:col-span-6 md:col-span-1 overflow-y-auto
              scrollbar-thin scrollbar-thumb-gray-800 lg:max-h-[70%] md:max-h-[65%]
             '
              sx={{ 
                bgcolor: 'background.additional',
                color: 'text.primary',
              }}
              id='recommendedList'
            >
        
              <Typography className='text-[18px] font-bold my-2 px-2'>
                {langDictionary['recommendation']}
              </Typography>

              {recommendation.map((video) => (
                <Link 
                  key={video.id}
                  href={`/${lang}/video/${video.id}`}
                  onClick={() => {
                    setVideo(video)
                  }}
                >
                  <RecommendedList video={video} langDictionary={langDictionary} />
                </Link>
              ))}

            </Box>

          </Box>

          {/* Bottom Section */}
          <BottomNav language={{langDictionary: langDictionary, lang: lang}} />

        </Box>
      </Box>
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
      <Video />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}