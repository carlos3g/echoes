import type React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils';

type TextVariants =
  | 'headingLarge'
  | 'headingMedium'
  | 'headingSmall'
  | 'quoteLarge'
  | 'quoteMedium'
  | 'paragraphLarge'
  | 'paragraphMedium'
  | 'paragraphSmall'
  | 'paragraphCaption'
  | 'paragraphCaptionSmall';

const textVariants = cva('text-foreground', {
  variants: {
    variant: {
      default: 'text-paragraph-medium',
      headingLarge: 'text-heading-large',
      headingMedium: 'text-heading-medium',
      headingSmall: 'text-heading-small',

      quoteLarge: 'text-quote-large',
      quoteMedium: 'text-quote-medium',

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
  // Quote variants always use Playfair Display
  if (preset === 'quoteLarge' || preset === 'quoteMedium') {
    if (bold) return $fontFamily.playfairBold;
    if (semiBold) return $fontFamily.playfairSemiBold;
    return $fontFamily.playfairItalic;
  }

  // Heading variants use DM Sans Bold
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
      return $fontFamily.semiBoldItalic;
    case semiBold:
      return $fontFamily.semiBold;
    default:
      return $fontFamily.regular;
  }
};

export const $fontFamily = {
  // DM Sans
  regular: 'font-dm-sans-regular',
  italic: 'font-dm-sans-italic',
  medium: 'font-dm-sans-medium',
  mediumItalic: 'font-dm-sans-medium-italic',
  semiBold: 'font-dm-sans-semi-bold',
  semiBoldItalic: 'font-dm-sans-semi-bold-italic',
  bold: 'font-dm-sans-bold',
  boldItalic: 'font-dm-sans-bold-italic',
  // Playfair Display
  playfairRegular: 'font-playfair-regular',
  playfairItalic: 'font-playfair-italic',
  playfairMedium: 'font-playfair-medium',
  playfairMediumItalic: 'font-playfair-medium-italic',
  playfairSemiBold: 'font-playfair-semi-bold',
  playfairSemiBoldItalic: 'font-playfair-semi-bold-italic',
  playfairBold: 'font-playfair-bold',
  playfairBoldItalic: 'font-playfair-bold-italic',
};
