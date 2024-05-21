export default function getUsersLanguage() {
    const userLocale:string =
    navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language;

    const lang:string = 
    userLocale === 'en'
      ? 'en'
      : (userLocale === 'ru'
        ? 'ru'
        : userLocale
      )

    return lang
}