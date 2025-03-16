/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'green-primary': {
          DEFAULT: 'var(--color-green-primary)',
          light: 'var(--color-green-primary-light)',
        },
        'carrot-secondary': {
          DEFAULT: 'var(--color-carrot-secondary)',
          light: 'var(--color-carrot-secondary-light)',
        },
        'green-success': {
          DEFAULT: 'var(--color-green-success)',
          light: 'var(--color-green-success-light)',
        },
        'red-error': {
          DEFAULT: 'var(--color-red-error)',
          light: 'var(--color-red-error-light)',
        },

        'gray-black': '#000000',
        'black-60': 'rgba(0,0,0,0.6)',
        gray: {
          100: 'var(--color-gray-1)',
          200: 'var(--color-gray-2)',
          300: 'var(--color-gray-3)',
          400: 'var(--color-gray-4)',
          500: 'var(--color-gray-5)',
        },
        'gray-white': '#FFFFFF',
        'white-70': 'rgba(255,255,255,0.7)',

        primary: 'var(--theme-primary)',
        'primary-contrast': 'var(--theme-primary-contrast)',

        'button-primary': 'var(--theme-button-primary)',

        background: 'var(--theme-background)',
        'background-contrast': 'var(--theme-background-contrast)',

        error: 'var(--theme-error)',
        'error-light': 'var(--theme-error-light)',

        success: 'var(--theme-success)',
        'success-light': 'var(--theme-success-light)',

        market: 'var(--theme-market)',
        paragraph: 'var(--theme-paragraph)',
        'paragraph-secondary': 'var(--theme-paragraph-secondary)',

        'icon-color': 'var(--theme-icon-color)',
        'icon-fill-color': 'var(--theme-icon-fill-color)',

        'on-background-gray-1': 'var(--theme-on-background-gray-1)',
        'on-background-gray-2': 'var(--theme-on-background-gray-2)',
      },
      spacing: {
        's-4': '4px',
        's-8': '8px',
        's-10': '10px',
        's-12': '12px',
        's-14': '14px',
        's-16': '16px',
        's-20': '20px',
        's-24': '24px',
        's-32': '32px',
        's-40': '40px',
        's-48': '48px',
        's-56': '56px',
      },
      fontFamily: {
        'poppins-thin': ['Poppins-Thin'],
        'poppins-thin-italic': ['Poppins-ThinItalic'],
        'poppins-extra-light': ['Poppins-ExtraLight'],
        'poppins-extra-light-italic': ['Poppins-ExtraLightItalic'],
        'poppins-light': ['Poppins-Light'],
        'poppins-light-italic': ['Poppins-LightItalic'],
        'poppins-regular': ['Poppins-Regular'],
        'poppins-regular-italic': ['Poppins-RegularItalic'],
        'poppins-medium': ['Poppins-Medium'],
        'poppins-medium-italic': ['Poppins-MediumItalic'],
        'poppins-semi-bold': ['Poppins-SemiBold'],
        'poppins-semi-bold-italic': ['Poppins-SemiBoldItalic'],
        'poppins-bold': ['Poppins-Bold'],
        'poppins-bold-italic': ['Poppins-BoldItalic'],
        'poppins-extra-bold': ['Poppins-ExtraBold'],
        'poppins-extra-bold-italic': ['Poppins-ExtraBoldItalic'],
        'poppins-black': ['Poppins-Black'],
        'poppins-black-italic': ['Poppins-BlackItalic'],
      },
      borderRadius: {
        's-8': '8px',
        's-12': '12px',
        's-16': '16px',
      },
      boxShadow: {
        custom: '0 -3px 12px rgba(0, 0, 0, 0.05)',
      },
      fontSize: {
        'heading-large': ['32px', { lineHeight: '38.4px' }],
        'heading-medium': ['22px', { lineHeight: '26.4px' }],
        'heading-small': ['18px', { lineHeight: '23.4px' }],
        'paragraph-large': ['18px', { lineHeight: '25.2px' }],
        'paragraph-medium': ['16px', { lineHeight: '22.4px' }],
        'paragraph-small': ['14px', { lineHeight: '19.6px' }],
        'paragraph-caption': ['12px', { lineHeight: '16.8px' }],
        'paragraph-caption-small': ['10px', { lineHeight: '14px' }],
      },
    },
  },
  plugins: [],
};
