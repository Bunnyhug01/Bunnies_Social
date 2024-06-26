'use client'

import { notFound, useParams, redirect } from 'next/navigation';

import * as React from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';


import translation from '@/app/locales/translation';
import { signIn } from '@/app/firebase/user';
import { auth } from '@/app/firebase/firebase';
import { Snackbar, Alert } from '@mui/material';


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/en">
        Bunnies
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export default function SignIn() {

  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [ifRedirect, setIfRedirect] = React.useState(false)
  const [error, setError] = React.useState(false)

  const [emailVerification, setEmailVerification] = React.useState(false)

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setError(false)
    setEmailVerification(false)
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    signIn({
      email: (data.get('email'))!.toString(),
      password: (data.get('password'))!.toString(),
    })
    .then((response) => {
      auth.onAuthStateChanged((user) => {
        if (user?.emailVerified) {
          setEmailVerification(false)
          setIfRedirect(true)
        } else {
          setEmailVerification(true)
        }
      })
    })
    .catch((response) => {
      setError(true)
    })

  };

  React.useEffect(() => {
    if (ifRedirect)
      redirect(`/${lang}`)
  }, [ifRedirect])

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            {langDictionary['sign_in']}
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              error={error}
              margin="normal"
              required
              fullWidth
              id="email"
              label={langDictionary['email']}
              name="email"
              autoFocus
            />
            <TextField
              error={error}
              margin="normal"
              required
              fullWidth
              name="password"
              label={langDictionary['password']}
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <Button
              className='bg-buttonSubmit'
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {langDictionary['sign_in_button']}
            </Button>
            <Grid container>
              <Grid item>
                <Link href={`/${lang}/sign-up`} variant="body2">
                  {langDictionary['havent_account']}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>

      <Snackbar open={emailVerification} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {langDictionary['email_verified']}
          </Alert>
      </Snackbar>

      <Snackbar open={error} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {langDictionary['error_signIn']}
          </Alert>
      </Snackbar>

    </ThemeProvider>
  );
}