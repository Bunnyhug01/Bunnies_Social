'use client'

import Link from 'next/link'
import { useParams, notFound } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, Tab, Tabs, ThemeProvider, Typography, createTheme } from "@mui/material";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ContactsIcon from '@mui/icons-material/Contacts';

import Header from "../../../components/Header/Header";
import BottomNav from "../../../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../../../styles/designTokens";
import RecommendedList from "../../../components/video/RecommendedList/RecommendedList";

import translation from '@/app/locales/translation';
import { User, getMe, getUser } from '@/app/firebase/user';
import { Video, getOneVideo, getUserLastVideos } from '@/app/firebase/video';
import UserBanner from '@/app/components/user/UserBanner/UserBanner';
import UserInfoBlock from '@/app/components/user/UserInfoBlock/UserInfoBlock';
import { Image, getOneImage, getUserLastImages } from '@/app/firebase/image';
import { Audio, getOneAudio, getUserLastAudios } from '@/app/firebase/audio';
import AudioList from '@/app/components/audio/AudioList/AudioList';
import VideoList from '@/app/components/video/VideoList/VideoList';
import ImageList from '@/app/components/image/ImageList/ImageList';
import UserList from '@/app/components/user/UserList/UserList';
import { auth } from '@/app/firebase/firebase';
import { searchVideo, searchImage, searchAudio, searchUser } from '@/app/firebase/search';


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
  
  const videosCount:number = 6
  const imagesCount:number = 6
  const audiosCount:number = 6

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<Audio[]>([])

  const [lastVideos, setLastVideos] = useState<Video[]>([])
  const [lastImages, setLastImages] = useState<Image[]>([])
  const [lastAudios, setLastAudios] = useState<Audio[]>([])

  const [subscribers, setSubscribers] = useState<User[]>([])
  const [subscriptions, setSubscriptions] = useState<User[]>([])

  const [options, setOptions] = useState({})

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
      
      getUserLastVideos(userId, videosCount).then((lastVideosArray) => {
        setLastVideos(lastVideosArray)
      })

      getUserLastImages(userId, imagesCount).then((lastImagesArray) => {
        setLastImages(lastImagesArray)
      })

      getUserLastAudios(userId, audiosCount).then((lastAudiosArray) => {
        setLastAudios(lastAudiosArray)
      })

      getUser(userId).then((user) => {
        user.videos?.map((videoId) => {
          getOneVideo(videoId).then((video: Video) => {
            if (!video.isPrivate || (video.isPrivate && video.owner === auth.currentUser?.uid)) {
              setVideos([...videos, video])
            }
          })
        })
      })

      getUser(userId).then((user) => {
        user.images?.map((imageId) => {
          getOneImage(imageId).then((image) => {
            if (!image.isPrivate || (image.isPrivate && image.owner === auth.currentUser?.uid)) {
              setImages([...images, image])
            }
          })
        })
      })

      getUser(userId).then((user) => {
        user.audios?.map((audioId) => {
          getOneAudio(audioId).then((audio) => {
            if (!audio.isPrivate || (audio.isPrivate && audio.owner === auth.currentUser?.uid)) {
              setAudios([...audios, audio])
            }
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
        className='overflow-scroll scrollbar-none'  
      >

        <UserBanner />
        <UserInfoBlock id={userId} langDictionary={langDictionary} />
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="basic tabs"
          >
            <Tab label={langDictionary['user_mainPage']} {...a11yProps(0)} />
            <Tab label={langDictionary['videos']} {...a11yProps(1)} />
            <Tab label={langDictionary['images']} {...a11yProps(2)} />
            <Tab label={langDictionary['audios']} {...a11yProps(3)} />
            <Tab label={langDictionary['subscriptions']} {...a11yProps(4)} />
            <Tab label={langDictionary['subscribersSecond']} {...a11yProps(5)} />
          </Tabs>
        </Box>

        <CustomTabPanel value={value} index={0}>

          <Box className="flex items-center">
              <Typography className='text-[18px] font-bold my-2 px-2'>
                {langDictionary['last_videos']}
              </Typography>
              <OndemandVideoIcon />
            </Box>

            { lastVideos.length !== 0
              ?
                <Box
                  className="grid grid-cols-3 gap-4 ml-2 mr-2 pb-4"
                >
                  {lastVideos.map((video) => (
                    <Link 
                      key={video.id}
                      href={`/${lang}/video/${video.id}`}
                    >
                      <VideoList video={video} langDictionary={langDictionary} />
                    </Link>
                  ))}
                </Box>
              : <Typography className="my-2 px-2">{langDictionary['no_videos']}</Typography>
            }

          <Box className="flex items-center mt-6">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['last_images']}
            </Typography>
            <ImageIcon />
          </Box>

          {lastImages.length !== 0
            ?
            <Box
              className="grid grid-cols-4 gap-4 ml-2 mr-2 pb-4"
            >
              {lastImages.map((image) => (
                <Link 
                  key={image.id}
                  href={`/${lang}/image/${image.id}`}
                >
                  <ImageList image={image} langDictionary={langDictionary} />
                </Link>
              ))}
            </Box>
            : <Typography className="my-2 px-2">{langDictionary['no_images']}</Typography>
          }

          <Box className="flex items-center mt-6">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['last_audio']}
            </Typography>
            <MusicNoteIcon />
          </Box>

          {lastAudios.length !== 0
            ?
            <Box
              className="grid grid-cols-4 gap-4 ml-2 mr-2 pb-4"
            >
              {lastAudios.map((audio) => (
                <Link 
                  key={audio.id}
                  href={`/${lang}/audio/${audio.id}`}
                  className='max-w-[15vw]'
                >
                  <AudioList audio={audio} langDictionary={langDictionary} />
                </Link>
              ))}
            </Box>
            : <Typography className="my-2 px-2">{langDictionary['no_audios']}</Typography>
          }

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
                    href={`/${lang}/video/${video.id}`}
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
                  href={`/${lang}/image/${image.id}`}
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
                  href={`/${lang}/audio/${audio.id}`}
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

          <Box className="flex items-center mb-3">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['subscriptions']}
            </Typography>
            <SubscriptionsIcon />
          </Box>

          {subscriptions.length !== 0
              ?
              <Box>
                {subscriptions.map((subscription) => (
                  <UserList key={subscription.id} id={subscription.id} langDictionary={langDictionary} />
                ))}
              </Box>
              : <Typography className="my-2 px-2">{langDictionary['user_subscriptions']}</Typography>
          }
        </CustomTabPanel>

        <CustomTabPanel value={value} index={5}>

          <Box className="flex items-center mb-3">
            <Typography className='text-[18px] font-bold my-2 px-2'>
              {langDictionary['subscribersSecond']}
            </Typography>
            <ContactsIcon />
          </Box>

          {subscribers.length !== 0
              ?
              <Box>
                {subscribers.map((subscriber) => (
                  <UserList key={subscriber.id} id={subscriber.id} langDictionary={langDictionary} />
                ))}
              </Box>
              : <Typography className="my-2 px-2">{langDictionary['user_subscribers']}</Typography>
          }
        </CustomTabPanel>

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