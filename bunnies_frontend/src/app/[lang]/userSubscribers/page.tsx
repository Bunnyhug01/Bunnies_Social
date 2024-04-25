'use client'

import { useParams, notFound } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import ContactsIcon from '@mui/icons-material/Contacts';

import Header from "../../components/Header/Header";
import BottomNav from "../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../styles/designTokens";

import translation from '@/app/locales/translation';
import { User, getMe, getUser } from '@/app/firebase/user';
import UserList from '@/app/components/user/UserList/UserList';

export function UserSubscribers() {

  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [data, setData] = useState<User[]>([])


  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
    
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
        
      getMe().then((user) => 
        user.subscribers!.map((subscriberId) =>
        {
            if (subscriberId) {
              getUser(subscriberId)
                .then((subscriber) => {
                  setData((prev)=>[...prev, subscriber])
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
        <Box className="flex items-center mb-3">
            <Typography className='text-[18px] font-bold my-2 px-2'>
                {langDictionary['subscribersSecond']}
            </Typography>
            <ContactsIcon />
        </Box>

        {data.length !== 0
            ?
            <Box>
                {data.map((subscriber) => (
                    <UserList key={subscriber.id} id={subscriber.id} langDictionary={langDictionary} />
                ))}
            </Box>
            : <Typography className="my-2 px-2">{langDictionary['user_subscribers']}</Typography>
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
        <UserSubscribers />
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}