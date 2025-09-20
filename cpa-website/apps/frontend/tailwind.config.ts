import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#1D4ED8',
          primaryDark: '#1E3A8A',
          accent: '#7C3AED',
          accentDark: '#5B21B6',
          slate: '#0F172A',
          light: '#F8FAFC'
        }
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif']
      },
      backgroundImage: {
        'brand-hero': 'linear-gradient(135deg, rgba(29, 78, 216, 0.12) 0%, rgba(124, 58, 237, 0.12) 100%)'
      },
      boxShadow: {
        brand: '0 20px 45px -20px rgba(29, 78, 216, 0.35)'
      }
    }
  },
  plugins: []
};

export default config;
