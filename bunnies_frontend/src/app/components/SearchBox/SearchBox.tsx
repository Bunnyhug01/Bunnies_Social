import { Autocomplete, Box, Link, TextField } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { Video } from "@/app/firebase/video";
import { Image } from "@/app/firebase/image";
import { Audio } from "@/app/firebase/audio";
import { User } from "@/app/firebase/user";
import { UserIdInfo, UserLogo } from "../user/user";

import OndemandVideoIcon from '@mui/icons-material/OndemandVideo';
import ImageIcon from '@mui/icons-material/Image';
import MusicNoteIcon from '@mui/icons-material/MusicNote';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.common.white, 0.15)
      : alpha(theme.palette.common.black, 0.15),
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' 
      ? alpha(theme.palette.common.white, 0.25)
      : alpha(theme.palette.common.black, 0.1),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  }));
  
const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));
  
const StyledAutocomplete = styled(Autocomplete)(({ theme }) => ({
    color: 'inherit',
    border: 'none',"& fieldset": { border: 'none' },
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      height: '5px',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));


interface Props {
    onChange : React.ChangeEventHandler<HTMLInputElement>,
    text?: {
      searchText?: string,
      setSearchText: React.Dispatch<React.SetStateAction<string | undefined>>,
      options: {
        videos?: Video[],
        images?: Image[],
        audios?: Audio[],
        users?:  User[]
      }
    },
    language: {
      langDictionary: Record<string, string>,
      lang: string
  }
}


export default function SearchBox({onChange, text, language} : Props) {

  const allOptions = (text!.options && Object.keys(text!.options).length > 0) ? [
    ...text!.options.videos!.map((video: Video, index: number) => ({ ...video, type: 'video', key: `video_${index}` })),
    ...text!.options.images!.map((image: Image, index: number) => ({ ...image, type: 'image', key: `image_${index}` })),
    ...text!.options.audios!.map((audio: Audio, index: number) => ({ ...audio, type: 'audio', key: `audio_${index}` })),
    ...text!.options.users!.map((user: User, index: number) => ({ ...user, type: 'user', key: `user_${index}` })),
  ] : [];


  function getOptionLabel(option: any): string {
    if (option.type === 'video') return option.title;
    if (option.type === 'image') return option.title;
    if (option.type === 'audio') return option.title;
    if (option.type === 'user') return option.username;
    return '';
  }
  
  console.log(allOptions)

  return (
    <Search sx={{bgcolor: 'background.additional'}}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledAutocomplete
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        options={allOptions}
        getOptionLabel={(option: any) => {
          if (option.type === 'video') return option.title;
          if (option.type === 'image') return option.title;
          if (option.type === 'audio') return option.title;
          if (option.type === 'user') return option.username;
          return ''
        }}
        renderOption={(props, option: any) => {
          return (
            <Link key={option.key} href={`/${language.lang}/${option.type}/${option.id}`} style={{ textDecoration: 'none' }}>
              { option.type === 'user'
                ?
                  <li {...props} key={option.key}>
                    <UserIdInfo id={String(option.id)}>
                      <UserLogo />
                      <Box className="ml-3">{getOptionLabel(option)}</Box>
                    </UserIdInfo>
                  </li>
                :
                  (
                    <li {...props} key={option.key}>
                      {option.type === 'video'
                      ? <OndemandVideoIcon className="mr-3" />
                      : (option.type === 'image'
                        ? <ImageIcon className="mr-3" />
                        : <MusicNoteIcon className="mr-3" />
                      )}
                      {getOptionLabel(option)}
                    </li>
                  )
              }
            </Link>
          )
        }}
        sx={{width: {lg: '268px', md: '268px', sm: '268px', xs: '160px'}}}
        renderInput={(params) => (
            <TextField
              {...params}
              placeholder={language.langDictionary['search']}
              InputProps={{ ...params.InputProps, type: 'search', 'aria-label': 'search' }}
              sx={{paddingLeft: '45px'}}
              onChange={onChange}
              value={text?.searchText}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const selectedItem = allOptions.find(option => getOptionLabel(option) === text?.searchText);
                  if (selectedItem) {
                    window.location.href = `/${language.lang}/${selectedItem.type}/${selectedItem.id}`;
                  }
                }
              }}
            />
        )}
      />
    </Search>
  )
}