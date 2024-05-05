import * as React from 'react';

import { Box, IconButton, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';


interface Props {
  type: string,
  langDictionary: any,
}

export default function Notifications({ type, langDictionary }: Props) {

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
            <Badge badgeContent={17} color="error">
                <NotificationsIcon />
            </Badge>
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
                <Badge badgeContent={17} color="error">
                    <NotificationsIcon />
                </Badge>
            </IconButton>
            <Typography>{langDictionary['notifications']}</Typography>
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
        {/* <Link href={`/en${pathname}`}>
          <MenuItem onClick={handleClose}>{language.langDictionary['english']}</MenuItem>
        </Link>
        <Link href={`/ru${pathname}`}>
          <MenuItem onClick={handleClose}>{language.langDictionary['russian']}</MenuItem>
        </Link> */}
      </Menu>
    </Box>
  );
}
