import React from "react";

import Link from 'next/link';

import { Box, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, SwipeableDrawer, Toolbar, useTheme } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import ContactsIcon from '@mui/icons-material/Contacts';

import Logo from "../Logo/Logo";


interface Props {
  language: {
    langDictionary: any,
    lang: string
  }
}


type Anchor = 'top' | 'left' | 'bottom' | 'right';


export default function SwipeableTemporaryDrawer({ language }: Props) {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }

      setState({ ...state, [anchor]: open });
    };

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <Toolbar>
        <Logo drawer={true} lang={language.lang} />
      </Toolbar>

      <Divider />
      <List>
        
        <Link href={`/${language.lang}/`}>
          <ListItem key={'Home'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['home']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Divider />

        <Link href={`/${language.lang}/videos`}>
          <ListItem key={'Videos'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <OndemandVideoIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['videos']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link href={`/${language.lang}/images`}>
          <ListItem key={'Images'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ImageIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['images']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link href={`/${language.lang}/audios`}>
          <ListItem key={'Audios'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <MusicNoteIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['audios']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Divider />

        <Link href={`/${language.lang}/favorites`}>
          <ListItem key={'Favorites'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <FavoriteIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['favorites']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link href={`/${language.lang}/history`}>
          <ListItem key={'History'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <HistoryIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['history']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Divider />

        <Link href={`/${language.lang}/userVideos`}>
          <ListItem key={'User videos'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <VideoLibraryIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['user_videos']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link href={`/${language.lang}/userImages`}>
          <ListItem key={'User images'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <PhotoLibraryIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['user_images']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link href={`/${language.lang}/userAudios`}>
          <ListItem key={'User audios'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <LibraryMusicIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['user_audios']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Divider />

        <Link href={`/${language.lang}/userSubscriptions`}>
          <ListItem key={'User Subscriptions'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <SubscriptionsIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['subscriptions']} />
            </ListItemButton>
          </ListItem>
        </Link>

        <Link href={`/${language.lang}/userSubscribers`}>
          <ListItem key={'User subscribers'} disablePadding>
            <ListItemButton>
              <ListItemIcon>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary={language.langDictionary['subscribersSecond']} />
            </ListItemButton>
          </ListItem>
        </Link>

      </List>

      <Divider />

    </Box>
  );

  return (
    <div>
    {(['left'] as const).map((anchor) => (
      <React.Fragment key={anchor}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawer(anchor, true)}
            edge="start"
            sx={{color:'#b1b1b1'}}
          >
            <MenuIcon />
          </IconButton>
          <SwipeableDrawer
            PaperProps={{
              sx: {
                backgroundColor: "background.default",
              },
            }}
            anchor={anchor}
            open={state[anchor]}
            onClose={toggleDrawer(anchor, false)}
            onOpen={toggleDrawer(anchor, true)}
          >
            {list(anchor)}
          </SwipeableDrawer>
        </React.Fragment>
      ))}
    </div>
  );
}