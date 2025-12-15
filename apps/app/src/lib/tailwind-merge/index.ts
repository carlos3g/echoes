import { extendTailwindMerge } from 'tailwind-merge';

export const customTwMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [
        'text-heading-large',
        'text-heading-medium',
        'text-heading-small',
        'text-paragraph-large',
        'text-paragraph-medium',
        'text-paragraph-small',
        'text-paragraph-caption',
        'text-paragraph-caption-small',
      ],
      'font-family': [
        'font-poppins-thin',
        'font-poppins-thin-italic',
        'font-poppins-extra-light',
        'font-poppins-extra-light-italic',
        'font-poppins-light',
        'font-poppins-light-italic',
        'font-poppins-regular',
        'font-poppins-regular-italic',
        'font-poppins-medium',
        'font-poppins-medium-italic',
        'font-poppins-semi-bold',
        'font-poppins-semi-bold-italic',
        'font-poppins-bold',
        'font-poppins-bold-italic',
        'font-poppins-extra-bold',
        'font-poppins-extra-bold-italic',
        'font-poppins-black',
        'font-poppins-black-italic',
      ],
      shadow: ['custom'],
    },
    theme: {
      colors: ['green-primary', 'carrot-secondary', 'green-success', 'red-error', 'primary', 'gray-200'],
      spacing: ['s-4', 's-8', 's-10', 's-12', 's-14', 's-16', 's-20', 's-24', 's-32', 's-40', 's-48', 's-56'],
      borderRadius: ['s-8', 's-12', 's-16'],
    },
  },
});
