'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Header from '../../../components/Header/Header';
import RecommendedList from '../../../components/video/RecommendedList/RecommendedList';
import BottomNav from '../../../components/BottomNav/BottomNav';

import { ColorModeContext, getDesignTokens } from '../../../styles/designTokens';

import translation from '@/app/locales/translation';
import { auth } from '@/app/firebase/firebase';
import { Audio, addToHistory, addView, getOneAudio, getRecommendations } from '@/app/firebase/audio';
import AudioContainer from '@/app/components/audio/AudioContainer/AudioContainer';
import AudioRecommendedList from '@/app/components/audio/AudioRecommendedList/AudioRecommendedList';


function AudioPage() {
  const params  = useParams();
  const audioId = (params.audio).toString()
  const lang: string = (params.lang).toString()
  const user = localStorage.getItem('user')

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [ifNotFound, setIfNotFound] = useState<boolean>(false)

  const [recommendation, setRecommendation] = useState<Audio[]>([])

  const [audio, setAudio] = useState<Audio>()

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])

  useEffect(() => {
    

    getOneAudio(audioId).then((audio) => {
      setAudio(audio)
      addView(audio.id!)

      if (user && auth.currentUser?.emailVerified) {
        addToHistory(audio.id!)
      }

    }).catch(response => {
      if(response.status == 404)
        setIfNotFound(true)
    })


  },[])
  
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
      getRecommendations(audioId).then((audioArray) => {
        setRecommendation(Object.values(audioArray))
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
        }}
        className='overflow-y-auto overflow-x-hidden h-full w-full'
        >
        
        
        {/* Main Container */}
        <Box className='md:w-full h-full'>
          {/* Top Section */}
          <Box className='relative w-full h-full max-h-full grid grid-cols-3 gap-2 p-2 sm:w-[107vw] sm:right-[10vw] sm3:w-[108vw] sm3:right-[9vw] lg:right-0 md:right-0 md:w-full sm2:w-full sm2:right-0'>
            
            {/* Video Container */}
            <Box className='sm:col-span-6 md:col-span-2 items-center justify-center flex lg:ml-[10vw]'>
              <AudioContainer audio={audio} langDictionary={langDictionary} />
            </Box>

            {/* Recommended list */} 
            <Box className='sm:col-span-6 md:col-span-1 overflow-y-auto
              scrollbar-thin scrollbar-thumb-gray-800
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

              {recommendation.map((audio) => (
                <Link 
                  key={audio.id}
                  href={`/${lang}/audio/${audio.id}`}
                  onClick={() => {
                    setAudio(audio)
                  }}
                >
                  <AudioRecommendedList audio={audio} langDictionary={langDictionary} />
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
      <AudioPage />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}