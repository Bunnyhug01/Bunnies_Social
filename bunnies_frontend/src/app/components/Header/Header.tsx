import { useParams } from 'next/navigation';

import * as React from 'react';

import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer/SwipeableTemporaryDrawer';
import { LightMode, DarkMode } from '@mui/icons-material';
import Logo from '../Logo/Logo';
import Upload from '../Upload/Upload';
import SearchBox from '../SearchBox/SearchBox';
import { Link, Typography } from '@mui/material';
import Dictaphone from '../Dictaphone/Dictaphone';
import LanguageMenu from '../LanguageMenu/LanguageMenu';

import { MyLogo, UserIdInfo, UserMeInfo } from '../user/user';
import { signUserOut } from '@/app/firebase/user';


interface Props {
    searchHandler: React.ChangeEventHandler<HTMLInputElement>
    ColorModeContext: React.Context<{
        toggleColorMode: () => void;
    }>
    text?: {
        searchText?: string,
        setSearchText: React.Dispatch<React.SetStateAction<string | undefined>>
    },
    language: {
        langDictionary: Record<string, string>,
        lang: string
    }
}


export default function Header({searchHandler, ColorModeContext, text, language} : Props) {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const theme = useTheme();
    const colorMode = React.useContext(ColorModeContext);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSignOut = () => {
        signUserOut()
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <Link href={`/${language.lang}/sign-in`} style={{ textDecoration: 'none' }}>
                <MenuItem
                    onClick={() => {
                        handleMenuClose()
                        handleSignOut()
                    }}
                >
                    {language.langDictionary['sign_out']}
                </MenuItem>
            </Link>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}
        >

            <Upload type='menu' langDictionary={language.langDictionary} />

            <LanguageMenu type='menu' language={{langDictionary: language.langDictionary, lang: language.lang}} />

            <MenuItem onClick={colorMode.toggleColorMode}>
                <IconButton
                    color="inherit"
                    size="large"
                    style={{ backgroundColor: 'transparent' }}
                >
                    {theme.palette.mode === 'dark'
                        ? <LightMode className="text-yellow-400"/>
                        : <DarkMode className="text-darkThemeIconColor"/>
                    }
                </IconButton>
                <Typography>{language.langDictionary['theme']}</Typography>
            </MenuItem>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                    style={{ backgroundColor: 'transparent' }}
                >
                    <UserMeInfo>
                        <MyLogo />
                    </UserMeInfo>
                </IconButton>
                <Typography>{language.langDictionary['profile']}</Typography>
            </MenuItem>
        </Menu>
    );

    return (
        <Box sx={{ flexGrow: 1, height: 50 }}>
            <AppBar sx={{ bgcolor: 'background.default' }} elevation={0} style={{position: 'fixed'}}>
                <Toolbar sx={{ bgcolor: 'background.default' }}>
                    <SwipeableTemporaryDrawer language={{langDictionary: language.langDictionary, lang: language.lang}} />
                    <Logo />

                    <SearchBox onChange={searchHandler} text={text} langDictionary={language.langDictionary} />
                    <Dictaphone setDictaphoneInput={text?.setSearchText} lang={language.lang} />

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        <Upload type='button' langDictionary={language.langDictionary} />

                        <IconButton
                            onClick={colorMode.toggleColorMode}
                            color="inherit"
                            size="large"
                        >
                                {theme.palette.mode === 'dark'
                                ? <LightMode className="hover:text-yellow-400"/>
                                : <DarkMode className="hover:text-darkThemeIconColor"/>
                                }
                        </IconButton>

                        <LanguageMenu type='button' language={{langDictionary: language.langDictionary, lang: language.lang}} />
                        
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <UserMeInfo>
                                <MyLogo />
                            </UserMeInfo>
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMobileMenu}
            {renderMenu}
        </Box>
    );
}