import { User, getMe, getUser } from "@/app/firebase/user";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import React, { useContext, useEffect, useState } from "react";

export const UserContext = React.createContext<User | undefined>(undefined)

export function UserInfo({ user, children }: { user: User, children: React.ReactNode }) {
    return (
        <UserContext.Provider value={user}>
            {children}
        </UserContext.Provider>
    )
}
export function UserIdInfo({ id, children }: { id: string, children: React.ReactNode }) {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        getUser(id).then((user) => {
            setUser(user!)
        })
    }, [id])

    return (
        <>
        {
            user !== null && user !== undefined ?
            <UserInfo user={user}>
                {children}
            </UserInfo>
            : null
        }
        </>
    )
}

export function UserMeInfo({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>()

    useEffect(() => {
        getMe().then((user) => {
            setUser(user)
        })
    }, [])

    return (
        <>
        {
            user !== null && user !== undefined ?
            <UserInfo user={user}>
                {children}
            </UserInfo>
            : null
        }
        </>
    )
}

export function UserName({}) {
    const user = useContext(UserContext)!!
    return (<>{user.username}</>)
}

export function UserDetails({}) {
    const user = useContext(UserContext)!!
    return (<>{user.details}</>)
}

export function UserDate({}) {
    const user = useContext(UserContext)!!
    return (<>{user.date}</>)
}

export function UserNameVar() {
    const user = useContext(UserContext)!!
    return user.username
}

export function UserDetailsVar() {
    const user = useContext(UserContext)!!
    return user.details
}

export function UserHasPreferencesVar() {
    const user = useContext(UserContext)!!
    return user.isPreferencesEnabled
}

export function UserSubscribers({}) {
    const user = useContext(UserContext)!!
    return (
        <>
            {
                user.subscribers
                ? user.subscribers.length
                : 0
            }
        </>
    )
}

export function UserLogo({}) {
    const user = useContext(UserContext)!!
    return (
        <Avatar
            sx={{ bgcolor: deepPurple[500]}}
            alt="Remy Sharp"
            src={user.logoUrl}
            className="
                lg:w-[40px] lg:h-[40px]
                md:w-[40px] md:h-[40px]
                sm:w-[30px] sm:h-[30px]
                rounded-full object-cover
                lg:min-w-[40px]
                md:min-w-[40px]
                sm:min-w-[30px]
            "
        >
            {user.username[0]}
        </Avatar>
    )
}

export function MyLogo({}) {
    const user = useContext(UserContext)!!
    return (
        <Avatar
            sx={{ bgcolor: deepPurple[500]}}
            alt={user.username[0]}
            src={user.logoUrl}
            className="
                lg:max-w-[24px] lg:max-h-[24px]
                md:max-w-[24px] md:max-h-[24px]
                sm:max-w-[24px] sm:max-h-[24px]
                rounded-full object-cover
                lg:min-w-[24px]
                md:min-w-[24px]
                sm:min-w-[24px]
            "
        >
            {user.username[0]}
        </Avatar>
    )
}

export function UserLogoChannel({}) {
    const user = useContext(UserContext)!!
    return (
        <Avatar
            sx={{
                bgcolor: deepPurple[500],
                width: {
                    xs: '100px',
                    sm: '130px',
                    md: '150px',
                  },
                height: {
                    xs: '100px',
                    sm: '130px',
                    md: '150px',
                },
                fontSize: {
                    xs: '40px',
                    sm: '45px',
                    md: '50px',
                },
                marginRight: '20px',
            }}
            alt={user.username}
            src={user.logoUrl ? user.logoUrl : ''}
        >
            {user.username[0]}
        </Avatar>
    )
}