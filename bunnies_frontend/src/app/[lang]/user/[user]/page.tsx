'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, Tab, Tabs, ThemeProvider, Typography, createTheme } from "@mui/material";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import Header from "../../../components/Header/Header";
import BottomNav from "../../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../../styles/designTokens";
import RecommendedList from "../../../components/video/RecommendedList/RecommendedList";

import translation from '@/app/locales/translation';
import { User, getMe, getUser } from '@/app/firebase/user';
import { Video, getOneVideo } from '@/app/firebase/video';
import UserBanner from '@/app/components/user/UserBanner/UserBanner';
import UserInfoBlock from '@/app/components/user/UserInfoBlock/UserInfoBlock';
import { Image, getOneImage } from '@/app/firebase/image';
import { Audio, getOneAudio } from '@/app/firebase/audio';
import AudioList from '@/app/components/audio/AudioList/AudioList';
import VideoList from '@/app/components/video/VideoList/VideoList';
import ImageList from '@/app/components/image/ImageList/ImageList';
import UserList from '@/app/components/user/UserList/UserList';


interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export function UserPage() {

  const params  = useParams();
  const userId = (params.user).toString()
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<Audio[]>([])
  const [subscribers, setSubscribers] = useState<User[]>([])
  const [subscriptions, setSubscriptions] = useState<User[]>([])

  const [searchText, setSearchText] = useState<string|undefined>(undefined);
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])

  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };
    
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
        
      getUser(userId).then((user) => {
        user.videos?.map((videoId) => {
          getOneVideo(videoId).then((video) => {
            setVideos([...videos, video])
          })
        })
      })

      getUser(userId).then((user) => {
        user.images?.map((imageId) => {
          getOneImage(imageId).then((image) => {
            setImages([...images, image])
          })
        })
      })

      getUser(userId).then((user) => {
        user.audios?.map((audioId) => {
          getOneAudio(audioId).then((audio) => {
            setAudios([...audios, audio])
          })
        })
      })

      getUser(userId).then((user) => {
        user.subscribers?.map((subscriberId) => {
          getUser(subscriberId).then((subscriber) => {
            setSubscribers([...subscribers, subscriber])
          })
        })
      })

      getUser(userId).then((user) => {
        user.subscriptions?.map((subscriptionId) => {
          getUser(subscriptionId).then((subscription) => {
            setSubscriptions([...subscriptions, subscription])
          })
        })
      })
  
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

        <UserBanner />
        <UserInfoBlock id={userId} langDictionary={langDictionary} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label={langDictionary['user_mainPage']} {...a11yProps(0)} />
            <Tab label={langDictionary['videos']} {...a11yProps(1)} />
            <Tab label={langDictionary['images']} {...a11yProps(2)} />
            <Tab label={langDictionary['audios']} {...a11yProps(3)} />
            <Tab label="SUBS" {...a11yProps(4)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>
          Item One
        </CustomTabPanel>
        
        <CustomTabPanel value={value} index={1}>

          <Box className="flex items-center">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['videos']}
            </Typography>
            <OndemandVideoIcon />
          </Box>

          { videos.length !== 0
            ?
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
            : <Typography className="my-2 px-2">{langDictionary['no_videos']}</Typography>
          }

        </CustomTabPanel>

        <CustomTabPanel value={value} index={2}>

          <Box className="flex items-center">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['images']}
            </Typography>
            <ImageIcon />
          </Box>

          {images.length !== 0
            ?
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
            : <Typography className="my-2 px-2">{langDictionary['no_images']}</Typography>
          }

        </CustomTabPanel>

        <CustomTabPanel value={value} index={3}>

          <Box className="flex items-center">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['audios']}
            </Typography>
            <MusicNoteIcon />
          </Box>

          {audios.length !== 0
            ?
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
            : <Typography className="my-2 px-2">{langDictionary['no_audios']}</Typography>
          }
        </CustomTabPanel>

        <CustomTabPanel value={value} index={4}>
          {subscriptions.length !== 0
              ?
              <Box
              >
                {subscriptions.map((subscription) => (
                  <UserList id={subscription.id} langDictionary={langDictionary} />
                ))}
              </Box>
              : <Typography className="my-2 px-2">SHEESH</Typography>
          }
        </CustomTabPanel>

        {/* {data.length !== 0
          ? data.map((video) => (
            <Link 
              key={video.id}
              href={`/${lang}/userVideos/${video.id}`}
            >
              <RecommendedList video={video} langDictionary={langDictionary} />
            </Link>
          ))
          : <Typography className="my-2 px-2">{langDictionary['user_videos_list']}</Typography>
        } */}
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
        <UserPage />
      </ThemeProvider>
    </ColorModeContext.Provider>
    );
}