import React from "react";

import { PaletteMode } from "@mui/material";
import { grey } from "@mui/material/colors";


export const ColorModeContext = React.createContext({ toggleColorMode: () => {} });

export const getDesignTokens = (mode: PaletteMode) => ({
    palette: {
      mode,
      primary: {
        ...(mode === 'dark'
        ? {
          main: '#b1b1b1',
        }
       : {main: '#FFA6C9'} ),
      },
      ...(mode === 'dark' ? {
        background: {
          default: '#040506',
          additional: '#100f14',
          drawer: 'rgba(4, 5, 6, 1)',
          hoverColor: 'rgba(17, 24, 39, 1)',
          paper: '#040506',
        },
      } : {
        background: {
          default: '#ffffff',
          additional: '#f6f6f6',
          hoverColor: grey[300],
        },
      }),
      text: {
        ...(mode === 'light'
          ? {
              primary: grey[900],
              secondary: grey[800],
            }
          : {
              primary: '#b1b1b1',
              secondary: grey[500],
              additional: grey[600],
            }),
      },
    },
});