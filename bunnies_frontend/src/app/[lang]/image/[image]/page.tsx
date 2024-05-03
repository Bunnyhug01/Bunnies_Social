'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation'

import * as React from 'react';
import { useCallback, useEffect, useState } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import Header from '../../../components/Header/Header';
import BottomNav from '../../../components/BottomNav/BottomNav';

import { ColorModeContext, getDesignTokens } from '../../../styles/designTokens';

import translation from '@/app/locales/translation';
import { auth } from '@/app/firebase/firebase';
import { Image, addToHistory, addView, getOneImage, getRecommendations } from '@/app/firebase/image';
import ImageContainer from '@/app/components/image/ImageContainer/ImageContainer';
import ImageRecommendedList from '@/app/components/image/ImageRecommendedList/ImageRecommendedList';
import { addPreferences, hasPreferences } from '@/app/firebase/user';


function ImagePage() {
  const params  = useParams();
  const imageId = (params.image).toString()
  const lang: string = (params.lang).toString()
  const user = localStorage.getItem('user')

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [ifNotFound, setIfNotFound] = useState<boolean>(false)

  const [recommendation, setRecommendation] = useState<Image[]>([])

  const [image, setImage] = useState<Image>()

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])

  useEffect(() => {
    
    getOneImage(imageId).then((image) => {
      setImage(image)
      addView(image.id!)

      if (user && auth.currentUser?.emailVerified) {
        addToHistory(image.id!)

        hasPreferences().then((isPreferences) => {
          if (isPreferences) {
            addPreferences(image.tags!)
          }
        })
      }

    }).catch(response => {
      if(response.status == 404)
        setIfNotFound(true)
    })

  },[])
  
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
      getRecommendations(imageId).then((imageArray) => {
        setRecommendation(Object.values(imageArray))
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
          <Box className='relative w-full h-full max-h-[100%] grid grid-cols-3 gap-2 p-2 sm:w-[107vw] sm:right-[10vw] sm3:w-[108vw] sm3:right-[9vw] lg:right-0 md:right-0 md:w-full sm2:w-full sm2:right-0'>
            
            {/* Image Container */}
            <Box className='sm:col-span-6 md:col-span-2 overflow-x-hidden scrollbar-none items-center justify-center flex'>
              <ImageContainer image={image} langDictionary={langDictionary} />
            </Box>
            
            {/* Recommended list */} 
            <Box className='sm:col-span-6 md:col-span-1 overflow-y-auto
              scrollbar-thin scrollbar-thumb-gray-800 max-h-[82%]
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

              {recommendation.map((image) => (
                <Link 
                  key={image.id}
                  href={`/${lang}/image/${image.id}`}
                  onClick={() => {
                    setImage(image)
                  }}
                >
                  <ImageRecommendedList image={image} langDictionary={langDictionary} />
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
      <ImagePage />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}