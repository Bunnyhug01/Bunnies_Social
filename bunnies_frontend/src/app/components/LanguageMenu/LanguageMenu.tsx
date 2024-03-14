import Link from 'next/link';
import { usePathname } from 'next/navigation'

import * as React from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';


interface Props {
  type: string,
  language: {
    langDictionary: any,
    lang: string
  }
}

export default function LanguageMenu({ type, language }: Props) {

  const fullPathname = usePathname()
  const pathname = fullPathname.replace('/' + language.lang, '')

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box>

      {
        type === 'button'
        ?
          <IconButton
            id="basic-button"
            color="inherit"
            size="large"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <LanguageIcon />
          </IconButton>
        :
          <MenuItem
            onClick={handleClick}
          >
            <IconButton
              id="basic-button"
              color="inherit"
              size="large"
              aria-controls={open ? 'basic-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
              style={{ backgroundColor: 'transparent' }}
            >
                <LanguageIcon />
            </IconButton>
            <Typography>{language.langDictionary['language']}</Typography>
          </MenuItem>
      }

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <Link href={`/en${pathname}`}>
          <MenuItem onClick={handleClose}>{language.langDictionary['english']}</MenuItem>
        </Link>
        <Link href={`/ru${pathname}`}>
          <MenuItem onClick={handleClose}>{language.langDictionary['russian']}</MenuItem>
        </Link>
      </Menu>
    </Box>
  );
}
