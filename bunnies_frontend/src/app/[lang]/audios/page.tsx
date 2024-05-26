'use client'

import { notFound, useParams, useRouter } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, Link, ThemeProvider, Typography, createTheme } from "@mui/material";
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import Header from "../../components/Header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../styles/designTokens";

import translation from '../../locales/translation';
import getUsersLanguage from '../../locales/getUsersLanguage';
import { UserAuthRequest } from '../../firebase/user';
import { auth } from '../../firebase/firebase';
import { searchAudio, searchImage, searchUser, searchVideo } from '../../firebase/search';
import { Audio, getAllAudios } from '@/app/firebase/audio';
import AudioList from '@/app/components/audio/AudioList/AudioList';


export function Audios() {
  const params  = useParams();
  const lang: string = (params.lang).toString()
  
  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [data, setData] = useState<Audio[]>([])
  const [options, setOptions] = useState({})

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
  
  useEffect(() => {

    if (searchText === undefined || searchText === '') {
        getAllAudios().then((audioArray: Audio[]) => {
          const audios = Object.values(audioArray).filter((audio: Audio) => !audio.isPrivate)
          setData(audios)
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
      

      <Box sx={{ height: '100vh', width: '100vw', marginTop: 5 }}>

        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['audios']}
          </Typography>
          <MusicNoteIcon />
        </Box>

        <Box
          className="grid grid-cols-3 gap-4 ml-2 mr-2 pb-4"
        >
          {data.length !== 0
            ? data.map((audio) => (
              <Link 
                key={audio.id}
                href={`/${lang}/audio/${audio.id}`}
                underline='none'
                className='max-w-[15vw]'
              >
                <AudioList audio={audio} langDictionary={langDictionary} />
              </Link>
            ))
            : <Typography className="my-2 px-2">{langDictionary['no_audios']}</Typography>
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
      <Audios />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}