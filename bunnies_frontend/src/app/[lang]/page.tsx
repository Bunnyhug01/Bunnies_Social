'use client'

import Link from 'next/link'
import { notFound, useParams, useRouter } from 'next/navigation';

import React, { useCallback, useEffect, useState } from "react";

import { Box, ThemeProvider, Typography, createTheme } from "@mui/material";
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

import Header from "../components/Header/Header";
import BottomNav from "../components/BottomNav/BottomNav";
import { ColorModeContext, getDesignTokens } from "../styles/designTokens";
import VideoList from '../components/video/VideoList/VideoList';

import translation from '../locales/translation';
import getUsersLanguage from '../locales/getUsersLanguage';
import { UserAuthRequest, hasLike } from '../firebase/user';
import { VideoUpdateRequest, VideoCreateRequest, getAllVideos, createVideo, addView, Video } from '../firebase/video';
import { auth } from '../firebase/firebase';
import { searchAudio, searchImage, searchVideo } from '../firebase/search';
import { Audio, AudioCreateRequest, createAudio, getAllAudios } from '../firebase/audio';
import { Image, ImageCreateRequest, createImage, getAllImages } from '../firebase/image';
import AudioList from '../components/audio/AudioList/AudioList';
import ImageList from '../components/image/ImageList/ImageList';


export function Home() {
  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [videos, setVideos] = useState<Video[]>([])
  const [images, setImages] = useState<Image[]>([])
  const [audios, setAudios] = useState<Audio[]>([])

  const [searchText, setSearchText] = useState<string|undefined>('');
  const searchHandler = useCallback((e: React.FormEvent<HTMLInputElement>) => {
    setSearchText(e.currentTarget.value);
  }, [])
  
  useEffect(() => {
    if (searchText === undefined || searchText === '') {
      getAllVideos().then((videoArray:any) => {
        setVideos(Object.values(videoArray))
      })

      getAllAudios().then((audioArray:any) => {
        setAudios(Object.values(audioArray))
      })

      getAllImages().then((imageArray:any) => {
        setImages(Object.values(imageArray))
      })

    } else {
      searchVideo(searchText).then((videoArray: Video[]) => {
        setVideos(videoArray)
      })

      searchImage(searchText).then((imageArray: Image[]) => {
        setImages(imageArray)
      })

      searchAudio(searchText).then((audioArray: Audio[]) => {
        setAudios(audioArray)
      })
    }

  }, [searchText])


  const router = useRouter();

  useEffect(() => {
    const isRedirected = localStorage.getItem('redirected');
    
    if (!isRedirected) {
      const usersLang = getUsersLanguage()
      router.push(`/${usersLang}`);
      localStorage.setItem('redirected', 'true');
    }
  }, []);

  useEffect(() => {

    const video: VideoCreateRequest = {
      title: 'TestVid',
      details: '1',
      videoUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/videos%2FKen%20Ashcorp%20The%20Bunny%20Song%20VeggieTales%20cover.mp4?alt=media&token=51dbc3c8-27c3-47a9-8762-a5ba46acf210',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/images%2FKen%20Ashcorp.png?alt=media&token=88962fca-3b2f-4a8f-b9ce-a1cbdde976bb',
      isPrivate: false,
    }

    const updVideo: VideoUpdateRequest = {
      title: "Fourth",
      isPrivate: false
    }

    const authUser: UserAuthRequest = {
      email: 'test@test.com',
      password: '123jhgjgh4gjghjhgjfdhfggfj'
    }


    const audio: AudioCreateRequest = {
      title: 'PvP',
      details: 'Ken Ashcorp',
      audioUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/audio%2FKen%20Ashcorp%20-PvP.mp3?alt=media&token=d7c13391-4e4c-40e5-9dfc-6aa5de1917f5',
      logoUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/images%2Fpvp.jpg?alt=media&token=eb5c1bea-8ba5-4f87-9067-3fb86b056bd6',
      isPrivate: false,
    }

    const image: ImageCreateRequest = {
      title: 'Zone-Tan',
      details: 'Zone-Tan holding a mug',
      imageUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/images%2Flinker_zone-tan-holding-a-mug.jpg?alt=media&token=13ba22a0-f8a9-4b35-bbec-30cbe35dd864',
      // imageUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/images%2Flinkerluis_uno.jpg?alt=media&token=a766bca3-f409-4265-ad58-5588c3cd45aa',
      // imageUrl: 'https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/images%2Flinker_zone-tan-animator.gif?alt=media&token=f6b9075c-86e9-4ea7-bcd9-88d486d8dddc',
      isPrivate: false,
    }

    // createImage(image)
    // getAllAudios().then((result:any) => {console.log(Object.values(result))})
    // createAudio(audio)
    // getAllVideos().then((result:any) => {console.log(Object.values(result))})
    // getOneVideo('-NoX1H0RbN_FYz-YMenW').then((result) => {console.log(result)})
    // deleteVideo('--NocMy6zBiWvwI1a7Njr-YMenW')
    // updateVideo('-NocNS3F_YGacJHFeir5', updVideo)
    // addLike('-NocNS3F_YGacJHFeir5')
    // createVideo(video)
    // addView('-NqJDXK0wFAZvWLb6RNK')
    // signUp(authUser)
    // signIn(authUser)
    // signUserOut()
    // hasLike('-Nrq86OD9cNtMx-MWBKi')
    
  }, [])

  return(
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        msOverflowY: 'auto'
      }}
      className="h-[160vh]"
    >
      
      <Header
        searchHandler={searchHandler}
        ColorModeContext={ColorModeContext}
        text={{searchText: searchText, setSearchText: setSearchText}}
        language={{langDictionary: langDictionary, lang: lang}}
      />
      

      <Box sx={{ marginTop: 5 }}>
        
        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['last_videos']}
          </Typography>
          <OndemandVideoIcon />
        </Box>

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



        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['last_images']}
          </Typography>
          <ImageIcon />
        </Box>

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



        <Box className="flex items-center">
          <Typography className='text-[18px] font-bold my-2 px-2'>
            {langDictionary['last_audio']}
          </Typography>
          <MusicNoteIcon />
        </Box>

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
      <Home />
    </ThemeProvider>
  </ColorModeContext.Provider>
  );
}