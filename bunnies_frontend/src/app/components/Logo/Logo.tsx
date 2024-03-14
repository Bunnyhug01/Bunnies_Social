import Image from 'next/image';
import Link from 'next/link';

import { IconButton, Typography } from '@mui/material';


interface Props {
    drawer?:boolean;
}


export default function Logo({drawer = false}: Props) : JSX.Element {
    const display = drawer ? {md: 'flex'} : {xs: 'none', md: 'flex'};

    return (
        <>
            <Link href='/'>
                <IconButton
                    disableRipple
                    sx={{'&:hover': {
                        backgroundColor: 'transparent',
                    }}}
                    aria-label="bunnyIcon"
                >
                    <Image
                        src='https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/images%2Frabbit.png?alt=media&token=4a2d79b6-933d-43db-8287-d5eed0360d04'
                        width={45}
                        height={45}
                        alt="Bunnies logo"
                        className='flex mr-4 ml-4'
                    />
                </IconButton>
            </Link>

            <Typography
                variant="h6"
                noWrap
                component="div"
                sx={{ 
                    display: display,
                    fontFamily: 'monospace',
                    fontWeight: 700,
                    letterSpacing: '.3rem',
                    color: 'inherit',
                    textDecoration: 'none',
                }}
            >
                Bunnies
            </Typography>
        </>
    )
}
