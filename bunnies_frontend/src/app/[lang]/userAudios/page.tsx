'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';

import Header from "../../components/Header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../styles/designTokens";

import translation from '@/app/locales/translation';
import { getMe } from '@/app/firebase/user';
import { Audio, getOneAudio } from '@/app/firebase/audio';
import AudioRecommendedList from '@/app/components/audio/AudioRecommendedList/AudioRecommendedList';

export function UserAudios() {

  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [data, setData] = useState<Audio[]>([])


  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
    
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
        
      getMe().then((user) => 
        user.audios!.map((audioId) =>
            {
              if (audioId) {
                  getOneAudio(audioId)
                  .then((audio) => {
                    setData((prev)=>[...prev, audio])
                  }
                )
              }
            }
        )
      )
  
    } else {
      // searchInOwner(searchText).then((videoArray) => {
      //   setData(videoArray)
      // })
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
        className='overflow-scroll scrollbar-thin scrollbar-thumb-gray-800'  
      >

            <Box className="flex items-center">
                <Typography className='text-[18px] font-bold my-2 px-2'>
                  {langDictionary['user_audios']}
                </Typography>
                <LibraryMusicIcon />
            </Box>

            {data.length !== 0
              ? data.map((audio) => (
                <Link 
                  key={audio.id}
                  href={`/${lang}/userAudios/${audio.id}`}
                >
                  <AudioRecommendedList audio={audio} langDictionary={langDictionary} />
                </Link>
              ))
              : <Typography className="my-2 px-2">{langDictionary['user_audios_list']}</Typography>
            }
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
        <UserAudios />
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}
