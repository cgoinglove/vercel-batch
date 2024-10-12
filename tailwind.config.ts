import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/style/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    letterSpacing: {
      DEFAULT: '-3.36px',
    },
    extend: {
      keyframes: {
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
        softBlink: {
          '0%, 100%': { opacity: '1' },
          '50%': {
            opacity: '0.7',
            background: 'hsla(0,0%,18%,0.2)',
          },
        },
      },
      borderColor: {
        DEFAULT: 'hsla(0,0%,20%,1)',
      },
      borderOpacity: {
        DEFAULT: '1',
      },
      borderWidth: {
        DEFAULT: '1px',
      },
      ringColor: {
        DEFAULT: 'hsla(0,0%,20%,1)',
      },
      ringOpacity: {
        DEFAULT: '1',
      },
      ringWidth: {
        DEFAULT: '1px',
      },
      colors: {
        primary: 'rgb(150, 208, 255)',
        background: '#0a0a0a',
        ring: 'hsla(0,0%,20%,1)',
        default: 'hsla( 0,0%,63% ,1)',
        white: '#ededed',
        gray: '#1f1f1f',
        'gray-soft': 'hsla(0,0%,18%,1)',
      },
      animation: {
        blink: 'blink 1s infinite',
        'soft-blink': 'softBlink 1s infinite',
      },
    },
  },
}
export default config
