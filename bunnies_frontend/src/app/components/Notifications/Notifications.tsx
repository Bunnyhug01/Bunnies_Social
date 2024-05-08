import { Box, IconButton, Link, Typography } from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Notifications as Notification, User, deleteNotification, getMe, getNotifications, hasNotifications } from '@/app/firebase/user';
import { useEffect, useState } from 'react';
import { auth } from '@/app/firebase/firebase';
import DeleteIcon from '@mui/icons-material/Delete';

interface Props {
  type: string,
  langDictionary: any,
}

export default function Notifications({ type, langDictionary }: Props) {

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = (id: string) => {
    setNotifications(current =>
      current.filter(notification => notification.id !== id))
    deleteNotification(id)
  };

  const [notifications, setNotifications] = useState<Notification[]>([])
  useEffect(() => {

    hasNotifications().then((isNotifications) => {
      if (isNotifications) {
        getNotifications(setNotifications)
      }
    })

  }, [auth.currentUser?.uid]);
  

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
            <Badge badgeContent={notifications.length} color="error">
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
                <Badge badgeContent={notifications.length} color="error">
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
        {notifications.length !== 0
          ?
          (
            notifications?.map((notification: Notification) => (
            <MenuItem
              key={notification.id}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                <Link
                  href={notification.srcUrl}
                  style={{ textDecoration: 'none' }}
                >
                  <Box onClick={handleClose}>{notification.text}</Box>
                </Link>
                <IconButton
                  color="error"
                  sx={{borderRadius: 0}}
                  onClick={() => handleDelete(notification.id!)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </MenuItem>
          )))
          : <MenuItem disabled>{langDictionary['no_notifications']}</MenuItem>}
      </Menu>
    </Box>
  );
}
