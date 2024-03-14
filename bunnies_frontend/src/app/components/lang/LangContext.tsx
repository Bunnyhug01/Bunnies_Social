import translation from "@/app/locales/translation";
import { notFound, useParams } from "next/navigation";
import React, { useContext } from "react";


const LangContext = React.createContext<string>("en")

export function LangInfo({ children }: { children: React.ReactNode }) {
    const params  = useParams();
    const lang: string = (params.lang).toString()
    return (
        <LangContext.Provider value={lang}>
            {children}
        </LangContext.Provider>
    )
}

export function Text({ token }: { token: string }) {
    const text = useLang(token)
    return (
        <>
            {text}
        </>
    )
}

export function useLang(token: string): string {
    const lang = useContext(LangContext)

    if (translation[lang] === undefined)
        notFound()

    return translation[lang][token]
}