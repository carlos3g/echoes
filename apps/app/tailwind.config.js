/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--color-primary)',
          foreground: 'var(--color-primary-foreground)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        muted: {
          DEFAULT: 'var(--color-muted)',
          foreground: 'var(--color-muted-foreground)',
        },
        border: 'var(--color-border)',
        input: 'var(--color-input)',
        destructive: {
          DEFAULT: 'var(--color-destructive)',
          foreground: 'var(--color-destructive-foreground)',
        },
        success: {
          DEFAULT: 'var(--color-success)',
          foreground: 'var(--color-success-foreground)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          foreground: 'var(--color-accent-foreground)',
        },
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
