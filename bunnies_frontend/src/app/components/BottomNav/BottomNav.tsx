import React from 'react'

import Link from 'next/link';

import { Paper, BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HistoryIcon from '@mui/icons-material/History';


interface Props {
    language: {
        langDictionary: any,
        lang: string
    }
}


export default function BottomNav({ language }: Props) {
    const [value, setValue] = React.useState(0);
  
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, display: { lg: 'none', md: 'none' } }} elevation={3}>
            <BottomNavigation
                showLabels
                value={value}
                onChange={(event, newValue) => {
                    setValue(newValue);
                }}
            >   

                <BottomNavigationAction label={language.langDictionary['home']} icon={<HomeIcon />} LinkComponent={Link} href={`/${language.lang}/`} />
                <BottomNavigationAction label={language.langDictionary['favorites']} icon={<FavoriteIcon />} LinkComponent={Link} href={`/${language.lang}/favorites`} />                
                <BottomNavigationAction label={language.langDictionary['history']} icon={<HistoryIcon />} LinkComponent={Link} href={`/${language.lang}/history`} />
                
            </BottomNavigation>
        </Paper>
    )
}