import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'logo-1': 'url(/img/background-1.jpg)'
      },
      colors: {
        'primary': '#f58c1b',
        'success': '#1ed760',
        'error': '#f44563',
        'darkgray': '#121212'
      },
      opacity: {
        '5': '.5',
      }
    },
  },
  plugins: [],
}
export default config
