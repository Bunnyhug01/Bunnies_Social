import * as React from 'react';
import { Global } from '@emotion/react';
import { styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { grey } from '@mui/material/colors';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import { Divider } from '@mui/material';
import CommentComponent from '../CommentComponent/CommentComponent';


const drawerBleeding = 56;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window?: () => Window;
  videoId?: string,
  imageId?: string,
  audioId?: string,
  langDictionary: any;
}

const Root = styled('div')(({ theme }) => ({
  height: '100%',
  backgroundColor:
    theme.palette.mode === 'light' ? grey[100] : theme.palette.background.default,
}));

const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'light' ? '#fff' : grey[800],
}));

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === 'light' ? grey[300] : grey[900],
  borderRadius: 3,
  position: 'absolute',
  top: 8,
  left: 'calc(50% - 15px)',
}));

export default function MobileCommentComponent(props: Props) {
  const { window, videoId, imageId, audioId, langDictionary } = props;
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(true);

  const [height, setHeight] = React.useState(`100%`)

  function toggleDrawer(newOpen: boolean) {
    setOpen(newOpen);
    setHidden(!hidden);
  };

  // This is used only for the example
  const container = window !== undefined ? () => window().document.body : undefined;

  const SwipeableDrawerStyled = styled(SwipeableDrawer)({
    "& .MuiDrawer-paper": {
      height: height,
      overflow: 'visible',
    },
  });

  return (
    <Root
      className="sm:flex md:hidden lg:hidden"
    >
      <CssBaseline />
      <Box
        sx={{bgcolor: 'background.additional'}}
        className="w-full"
      >
        <Button
          className="w-full"
          onClick={() => {
            setHeight(`calc(50% - ${drawerBleeding}px)`)
            toggleDrawer(true)
          }}
        >
          <Box className="mx-4">
            <Typography sx={{fontWeight: 'bold', fontSize: 14}}>{langDictionary['comments']}</Typography>
          </Box>

          <ExpandMoreIcon
            sx={{pointerEvents: "auto"}}
          />
        </Button>
      </Box>
      <SwipeableDrawerStyled
        container={container}
        anchor="bottom"
        open={open}
        onClose={() => {
          setHeight(`100%`)
          toggleDrawer(false)
        }}
        onOpen={() => toggleDrawer(true)}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
        hidden={hidden}
      >
        <StyledBox
          sx={{
            position: 'absolute',
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: 'visible',
            right: 0,
            left: 0,
          }}
        >
          <Puller />
          <Typography sx={{ p: 2, color: 'text.secondary' }}>{langDictionary['comments']}</Typography>
        </StyledBox>
        <Divider />
        <StyledBox
          sx={{
            px: 2,
            py: 2,
            pb: 2,
            height: '100%',
            overflow: 'auto',
          }}
          className='scrollbar-none'
        >
          <CommentComponent videoId={videoId} langDictionary={langDictionary} />

        </StyledBox>
      </SwipeableDrawerStyled>
    </Root>
  );
}