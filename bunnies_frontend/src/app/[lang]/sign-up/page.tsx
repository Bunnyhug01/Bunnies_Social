'use client'

import { notFound, redirect, useParams } from 'next/navigation'

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
import { signIn, signUp } from '@/app/firebase/user';
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


export default function SignUp() {

  const params  = useParams();
  const lang: string = (params.lang).toString()

  const langDictionary = translation[lang]
  if (langDictionary === undefined)
    notFound()

  const [ifRedirect, setIfRedirect] = React.useState(false)
  const [passwordError, setPasswordError] = React.useState(false)
  const [passwordWeak, setPasswordWeak] = React.useState(false)


  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setPasswordWeak(false);
    setPasswordError(false)
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    if (data.get('confrimPassword') === data.get('password')) {

      const username = (data.get('username'))!.toString()
      const email = (data.get('email'))!.toString()
      const password = (data.get('password'))!.toString()

      signUp({
        username: username,
        email: email,
        password: password,
      })
      .then((response) => {
        setPasswordWeak(false)
        setIfRedirect(true)
      })
      .catch((response) => {
        if (response === 'auth/weak-password') {
          setPasswordWeak(true)
        }
      })

      setPasswordError(false)

    } else {
      setPasswordError(true)
    }

  };

  React.useEffect(() => {
    if (ifRedirect)
      redirect(`/${lang}/sign-in`)
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
              {langDictionary['sign_up']}
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
              <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="username"
                    required
                    fullWidth
                    id="username"
                    label={langDictionary['user_name']}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="email"
                    required
                    fullWidth
                    id="email"
                    label={langDictionary['email']}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    error={passwordWeak}
                    required
                    fullWidth
                    name="password"
                    label={langDictionary['password']}
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                      error={passwordError}
                      required
                      fullWidth
                      name="confrimPassword"
                      label={langDictionary['confirm_password']}
                      type="password"
                      id="confirmPassword"
                    />
                </Grid>
              </Grid>
              <Button
                className='bg-buttonSubmit'
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                {langDictionary['sign_up_button']}
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href={`/${lang}/sign-in`} variant="body2">
                    {langDictionary['have_accout']}
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright sx={{ mt: 5 }} />
        </Container>


        <Snackbar open={passwordWeak} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {langDictionary['weak_password']}
          </Alert>
        </Snackbar>

        <Snackbar open={passwordError} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
            {langDictionary['error_password']}
          </Alert>
        </Snackbar>

    </ThemeProvider>
  );
}