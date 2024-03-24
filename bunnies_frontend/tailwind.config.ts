import { url } from 'inspector'
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        mainBg: '#040506',
        searchBg: '#100f14',
        textColor: '#b1b1b1',
        buttonSubmit: '#1565c0',
        collectionBg: 'rgba(0,0,0,0.6)',
        darkThemeIconColor: 'rgb(93,95,239)',
        fullScreenImg: 'rgba(0, 0, 0, .9)'
      },
      screens: {
        'sm': '320px',
        'sm2': '540px',
        'sm3': '414px',
        'md': '768px',
        'md2': '470px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
export default config
