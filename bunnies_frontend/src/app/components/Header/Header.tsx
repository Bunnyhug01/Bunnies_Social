import { useParams } from 'next/navigation';

import * as React from 'react';

import { styled, alpha, useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import MoreIcon from '@mui/icons-material/MoreVert';
import SwipeableTemporaryDrawer from '../SwipeableTemporaryDrawer/SwipeableTemporaryDrawer';
import { LightMode, DarkMode } from '@mui/icons-material';
import Logo from '../Logo/Logo';
import Upload from '../Upload/Upload';
import SearchBox from '../SearchBox/SearchBox';
import { Link, Typography } from '@mui/material';
import Dictaphone from '../Dictaphone/Dictaphone';
import LanguageMenu from '../LanguageMenu/LanguageMenu';

import { MyLogo, UserHasPreferencesVar, UserIdInfo, UserMeInfo } from '../user/user';
import { User, disableNotifications, disablePreferences, enableNotifications, enablePreferences, hasNotifications, hasPreferences, signUserOut } from '@/app/firebase/user';
import { auth } from '@/app/firebase/firebase';
import Notifications from '../Notifications/Notifications';
import { Video } from '@/app/firebase/video';
import { Image } from '@/app/firebase/image';
import { Audio } from '@/app/firebase/audio';


interface Props {
    searchHandler: React.ChangeEventHandler<HTMLInputElement>
    ColorModeContext: React.Context<{
        toggleColorMode: () => void;
    }>
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


export default function Header({searchHandler, ColorModeContext, text, language} : Props) {

    const user = localStorage.getItem('user')

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] =
    React.useState<null | HTMLElement>(null);

    const [isPreferences, setIsPreferences] = React.useState<boolean>(false);
    const [isNotifications, setIsNotifications] = React.useState<boolean>(false);

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

    const handlePreferences = () => {
        if (isPreferences) {
            disablePreferences()
            setIsPreferences(false)
        } else {
            enablePreferences()
            setIsPreferences(true)
        }
    }

    const handleNotifications = () => {
        if (isNotifications) {
            disableNotifications()
            setIsNotifications(false)
        } else {
            enableNotifications()
            setIsNotifications(true)
        }
    }

    React.useEffect(() => {
        
        hasPreferences().then((isPreferences) => {
            if (isPreferences) {
                setIsPreferences(true)
            } else {
                setIsPreferences(false)
            }
        })

        hasNotifications().then((isNotifications) => {
            if (isNotifications) {
                setIsNotifications(true)
            } else {
                setIsNotifications(false)
            }
        })

    }, [auth.currentUser?.uid])

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
            {
                user && auth.currentUser?.emailVerified
                ?   
                    <Box>
                        <Link href={`/${language.lang}/user/${auth.currentUser.uid}`} style={{ textDecoration: 'none' }}>
                            <MenuItem
                                onClick={() => {
                                    handleMenuClose()
                                }}
                            >
                                {language.langDictionary['channel']}
                            </MenuItem>
                        </Link>

                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                                handlePreferences()
                            }}
                        >
                            {
                                isPreferences
                                ? language.langDictionary['disable_recommendations']
                                : language.langDictionary['enable_recommendations']
                            }
                        </MenuItem>

                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                                handleNotifications()
                            }}
                        >
                            {
                                isNotifications
                                ? language.langDictionary['disable_notifications']
                                : language.langDictionary['enable_notifications']
                            }
                        </MenuItem>

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
                    </Box>
                :
                <Box>
                    <Link href={`/${language.lang}/sign-in`} style={{ textDecoration: 'none' }}>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                            }}
                        >
                            {language.langDictionary['sign_in']}
                        </MenuItem>
                    </Link>

                    <Link href={`/${language.lang}/sign-up`} style={{ textDecoration: 'none' }}>
                        <MenuItem
                            onClick={() => {
                                handleMenuClose()
                            }}
                        >
                            {language.langDictionary['sign_up']}
                        </MenuItem>
                    </Link>
                </Box>
            }
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

            {
                user && auth.currentUser?.emailVerified
                ? <Upload type='menu' langDictionary={language.langDictionary} />
                : null
            }

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
            
            {
                user && auth.currentUser?.emailVerified
                ? <Notifications type='menu' langDictionary={language.langDictionary} />
                : null
            }

            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton
                    size="large"
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                    style={{ backgroundColor: 'transparent' }}
                >
                    {
                        user && auth.currentUser?.emailVerified
                        ?   <UserMeInfo>
                                <MyLogo />
                            </UserMeInfo>
                        :   <AccountCircle />

                    }
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
                    <Logo lang={language.lang} />

                    <SearchBox
                        onChange={searchHandler}
                        text={text}
                        language={{langDictionary: language.langDictionary, lang: language.lang}}
                    />
                    
                    <Dictaphone setDictaphoneInput={text?.setSearchText} lang={language.lang} />

                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {   
                            user && auth.currentUser?.emailVerified
                            ? <Upload type='button' langDictionary={language.langDictionary} />
                            : null
                        }

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
                        
                        {
                            user && auth.currentUser?.emailVerified
                            ? <Notifications type='button' langDictionary={language.langDictionary} />
                            : null
                        }

                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            {
                                user && auth.currentUser?.emailVerified
                                ?   <UserMeInfo>
                                        <MyLogo />
                                    </UserMeInfo>
                                :   <AccountCircle />

                            }
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