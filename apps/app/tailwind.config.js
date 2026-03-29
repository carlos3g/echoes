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
        secondary: {
          DEFAULT: 'var(--color-secondary)',
          foreground: 'var(--color-secondary-foreground)',
        },
        background: 'var(--color-background)',
        foreground: 'var(--color-foreground)',
        card: 'var(--color-card)',
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
        'dm-sans-regular': ['DMSans-Regular'],
        'dm-sans-italic': ['DMSans-Italic'],
        'dm-sans-medium': ['DMSans-Medium'],
        'dm-sans-medium-italic': ['DMSans-MediumItalic'],
        'dm-sans-semi-bold': ['DMSans-SemiBold'],
        'dm-sans-semi-bold-italic': ['DMSans-SemiBoldItalic'],
        'dm-sans-bold': ['DMSans-Bold'],
        'dm-sans-bold-italic': ['DMSans-BoldItalic'],
        'playfair-regular': ['PlayfairDisplay-Regular'],
        'playfair-italic': ['PlayfairDisplay-Italic'],
        'playfair-medium': ['PlayfairDisplay-Medium'],
        'playfair-medium-italic': ['PlayfairDisplay-MediumItalic'],
        'playfair-semi-bold': ['PlayfairDisplay-SemiBold'],
        'playfair-semi-bold-italic': ['PlayfairDisplay-SemiBoldItalic'],
        'playfair-bold': ['PlayfairDisplay-Bold'],
        'playfair-bold-italic': ['PlayfairDisplay-BoldItalic'],
      },
      boxShadow: {
        custom: '0 2px 8px rgba(45, 45, 40, 0.04)',
      },
      fontSize: {
        'heading-large': ['32px', { lineHeight: '38.4px' }],
        'heading-medium': ['22px', { lineHeight: '28.6px' }],
        'heading-small': ['18px', { lineHeight: '23.4px' }],
        'quote-large': ['22px', { lineHeight: '37.4px' }],
        'quote-medium': ['18px', { lineHeight: '30.6px' }],
        'paragraph-large': ['18px', { lineHeight: '27px' }],
        'paragraph-medium': ['16px', { lineHeight: '24px' }],
        'paragraph-small': ['14px', { lineHeight: '21px' }],
        'paragraph-caption': ['12px', { lineHeight: '16.8px' }],
        'paragraph-caption-small': ['10px', { lineHeight: '14px' }],
      },
      borderRadius: {
        '2xl': '16px',
      },
    },
  },
  plugins: [],
};
