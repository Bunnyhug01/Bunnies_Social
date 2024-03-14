import { Box, IconButton, InputBase } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { useEffect, useState } from "react";
import Dictaphone from "../Dictaphone/Dictaphone";


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
  
const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)})`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
}));


interface Props {
    onChange : React.ChangeEventHandler<HTMLInputElement>,
    text?: {
      searchText?: string,
      setSearchText: React.Dispatch<React.SetStateAction<string | undefined>>
    },
    langDictionary: any
}


export default function SearchBox({onChange, text, langDictionary} : Props) {

  return (
    <Search sx={{bgcolor: 'background.additional'}}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder={langDictionary['search']}
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChange}
        value={text?.searchText}
      />
    </Search> 
  )
}