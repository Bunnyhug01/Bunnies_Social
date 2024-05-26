import { Box, Button, Link } from '@mui/material'
import React, { useEffect } from 'react'
import { UserDate, UserDetails, UserIdInfo, UserLogoChannel, UserName, UserSubscribers } from '../user'
import { auth } from '@/app/firebase/firebase'
import { hasSubscribe, removeSubscribe, addSubscribe } from '@/app/firebase/user'
import { useParams } from 'next/navigation'
import UserEdit from '../UserEdit/UserEdit';

interface Props {
    id: string,
    langDictionary: any,
}

export default function UserList({ id, langDictionary }: Props) {
  const params  = useParams();
  const user = localStorage.getItem('user')
  const lang: string = (params.lang).toString()

  const [subscribeView, setSubscribeView] = React.useState<boolean | undefined>(undefined)

  async function handleSubscribe() {
    
    if (user && auth.currentUser?.emailVerified) {

      if (await hasSubscribe(id)) {
        await removeSubscribe(id)
        setSubscribeView(false)
      }
      else
      {
        await addSubscribe(id)
        setSubscribeView(true)
      }
      
    }
    else {
      window.location.replace(`/${lang}/sign-in`)
    }

  }

  useEffect(() => {
    hasSubscribe(id).then((result) => {
      if (result) {
        setSubscribeView(true)
      }
    })
  }, [])

  return (
    <UserIdInfo id={id}>
      <Box
        sx={{ 
            bgcolor: 'background.additional',
            color: 'text.primary',
        }}
        className="flex items-center p-[20px] mb-3"
      >
            <Link 
                key={id}
                href={`/${lang}/user/${id}`}
                underline='none'
            >
                <UserLogoChannel />
            </Link>
          

            <Box className='flex-grow overflow-x-hidden'>
                <h1 className='m-0 lg:text-[24px] md:text-[24px] sm:text-[15px]'><UserName /></h1>
                <p className='m-0 lg:text-[18px] md:text-[18px] sm:text-[10px]'>{langDictionary['subscribers']}: <UserSubscribers /></p>
                <p className='m-0 lg:text-[18px] md:text-[18px] sm:text-[10px]'>{langDictionary['joined']}: <UserDate /></p>
                <p className='m-0 lg:text-[18px] md:text-[18px] sm:text-[10px]'><UserDetails /></p>
            </Box>

            <Button
                sx={{color: 'text.primary'}}
                disableElevation
                onClick={handleSubscribe}
                className="font-bold"
                disabled={id === auth.currentUser?.uid}
            >
                {
                    subscribeView
                    ? langDictionary['unsubscribe']
                    : langDictionary['subscribe']
                }
            </Button>

      </Box>
    </UserIdInfo>
  )
}
