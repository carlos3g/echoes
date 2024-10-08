import type React from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { useAppTheme } from '@/shared/hooks/use-app-theme';
import { Box, type BoxProps } from '@/shared/components/ui/box';
import { ScreenHeader } from '@/shared/components/ui/screen/screen-header';
import { ScrollViewContainer, ViewContainer } from '@/shared/components/ui/screen/screen-container';

export interface ScreenProps extends BoxProps {
  children: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  canGoBack?: boolean;
  scrollable?: boolean;
  title?: string;
  noPaddingHorizontal?: boolean;
}

export const Screen = ({
  children,
  canGoBack = false,
  scrollable = false,
  noPaddingHorizontal = false,
  style,
  title,
  HeaderComponent,
  ...boxProps
}: ScreenProps) => {
  const { bottom, top } = useAppSafeArea();
  const { colors } = useAppTheme();

  const Container = scrollable ? ScrollViewContainer : ViewContainer;

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Container backgroundColor={colors.background}>
        <Box
          paddingHorizontal={noPaddingHorizontal ? undefined : 's24'}
          style={[{ paddingTop: top, paddingBottom: bottom }, style]}
          {...boxProps}
        >
          <ScreenHeader
            paddingHorizontal={noPaddingHorizontal ? 's24' : undefined}
            HeaderComponent={HeaderComponent}
            canGoBack={canGoBack}
            title={title}
          />
          {children}
        </Box>
      </Container>
    </KeyboardAvoidingView>
  );
};
