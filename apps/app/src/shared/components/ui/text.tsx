import type React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils';

type TextVariants =
  | 'headingLarge'
  | 'headingMedium'
  | 'headingSmall'
  | 'paragraphLarge'
  | 'paragraphMedium'
  | 'paragraphSmall'
  | 'paragraphCaption'
  | 'paragraphCaptionSmall';

const textVariants = cva('text-background-contrast', {
  variants: {
    variant: {
      default: 'text-paragraph-medium',
      headingLarge: 'text-heading-large',
      headingMedium: 'text-heading-medium',
      headingSmall: 'text-heading-small',

      paragraphLarge: 'text-paragraph-large',
      paragraphMedium: 'text-paragraph-medium',
      paragraphSmall: 'text-paragraph-small',
      paragraphCaption: 'text-paragraph-caption',
      paragraphCaptionSmall: 'text-paragraph-caption-small',
    },
    size: {
      default: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

export interface TextProps extends Omit<RNTextProps, 'style'>, VariantProps<typeof textVariants> {
  bold?: boolean;
  italic?: boolean;
  semiBold?: boolean;
  className?: string;
}

export const Text: React.FC<React.PropsWithChildren<TextProps>> = (props) => {
  const { children, bold, italic, semiBold, className, variant = 'paragraphMedium', size, ...textProps } = props;

  const fontFamily = getFontFamilyClass(variant as TextVariants, bold, italic, semiBold);

  return (
    <RNText className={cn(textVariants({ variant, size }), fontFamily, className)} {...textProps}>
      {children}
    </RNText>
  );
};

const getFontFamilyClass = (preset: TextVariants, bold?: boolean, italic?: boolean, semiBold?: boolean) => {
  if (preset === 'headingLarge' || preset === 'headingMedium' || preset === 'headingSmall') {
    return italic ? $fontFamily.boldItalic : $fontFamily.bold;
  }

  switch (true) {
    case bold && italic:
      return $fontFamily.boldItalic;
    case bold:
      return $fontFamily.bold;
    case italic:
      return $fontFamily.italic;
    case semiBold && italic:
      return $fontFamily.mediumItalic;
    case semiBold:
      return $fontFamily.medium;
    default:
      return $fontFamily.regular;
  }
};

export const $fontFamily = {
  black: 'font-poppins-black',
  blackItalic: 'font-poppins-black-italic',
  bold: 'font-poppins-bold',
  boldItalic: 'font-poppins-bold-italic',
  italic: 'font-poppins-regular-italic',
  light: 'font-poppins-light',
  lightItalic: 'font-poppins-light-italic',
  medium: 'font-poppins-medium',
  mediumItalic: 'font-poppins-medium-italic',
  regular: 'font-poppins-regular',
};
