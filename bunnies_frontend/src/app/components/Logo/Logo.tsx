import Image from 'next/image';
import Link from 'next/link';

import { IconButton, Typography } from '@mui/material';


interface Props {
    drawer?:boolean;
    lang: string;
}


export default function Logo({drawer = false, lang}: Props) : JSX.Element {
    const display = drawer ? {md: 'flex'} : {xs: 'none', md: 'flex'};

    return (
        <>
            <Link href={`/${lang}`}>
                <IconButton
                    disableRipple
                    sx={{'&:hover': {
                        backgroundColor: 'transparent',
                    }}}
                    aria-label="bunnyIcon"
                >
                    <Image
                        src='https://firebasestorage.googleapis.com/v0/b/bunnies-social.appspot.com/o/default%2Frabbit.png?alt=media&token=85265de4-c5e9-4a15-9c85-805ef41015d7'
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
