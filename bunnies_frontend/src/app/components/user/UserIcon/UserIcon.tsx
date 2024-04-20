import { Box, Typography } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { deepPurple } from '@mui/material/colors';
import { useState, useEffect } from 'react';
import { UserIdInfo, UserInfo, UserLogo, UserName, UserSubscribers } from '../user';


interface Props {
    userId: string,
    langDictionary: any
}


export default function UserIcon({ userId, langDictionary } : Props) {
    return (
        <Box className="flex items-center">
            <UserIdInfo id={userId}>
                <UserLogo/>
                
                <Box sx={{ flexDirection: 'column' }}>
                    <Typography sx={{color: 'text.primary', fontSize: 16, marginLeft: '8px', fontWeight: 'bold'}} className="lg:text-[16px] md:text-[16px] sm:text-[13px]">
                        <UserName/>
                    </Typography>
                    <Typography sx={{color: 'text.secondary', fontSize: 12, marginLeft: '8px', fontWeight: 'bold'}} className="block">
                        <UserSubscribers /> {langDictionary['subs']}
                    </Typography>
                </Box>
            </UserIdInfo>
        </Box>
    )
}