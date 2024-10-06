import type { BoxProps } from '@/shared/components/ui/box';
import { Box } from '@/shared/components/ui/box';

type ProgressIndicatorProps = BoxProps & {
  total: number;
  currentIndex: number;
};

export const ProgressIndicator = ({ total, currentIndex, ...boxProps }: ProgressIndicatorProps) => {
  return (
    <Box flexDirection="row" alignItems="center" {...boxProps}>
      {Array.from({ length: total }).map((_, index) => (
        <Box
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          width={index === currentIndex ? 14 : 8}
          height={index === currentIndex ? 14 : 8}
          borderRadius="s12"
          mr="s12"
          backgroundColor={index === currentIndex ? 'carrotSecondary' : 'gray2'}
        />
      ))}
    </Box>
  );
};
