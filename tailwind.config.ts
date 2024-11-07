import type { Config } from 'tailwindcss';

const { fontFamily } = require('tailwindcss/defaultTheme');

const config: Config = {
    darkMode: ['class'],
    content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
  	extend: {
  		backgroundImage: {
  			'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
  			'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))'
  		},
  		colors: {
  			'wm-orange': {
  				'50': '#fff6ed',
  				'100': '#feead6',
  				'200': '#fdd0ab',
  				'300': '#fbaf76',
  				'400': '#f9833e',
  				'500': '#f66219',
  				'600': '#ea480f',
  				'700': '#c0330e',
  				'800': '#982a14',
  				'900': '#7b2513',
  				'950': '#420f08',
  				DEFAULT: '#ea480f'
  			},
  			'wm-white': {
  				'50': '#f5f5f5',
  				'100': '#efefef',
  				'200': '#dcdcdc',
  				'300': '#bdbdbd',
  				'400': '#989898',
  				'500': '#7c7c7c',
  				'600': '#656565',
  				'700': '#525252',
  				'800': '#464646',
  				'900': '#3d3d3d',
  				'950': '#292929',
  				DEFAULT: 'f5f5f5'
  			}
  		},
  		fontFamily: {
  			poppins: ['Poppins', ...fontFamily.sans]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
