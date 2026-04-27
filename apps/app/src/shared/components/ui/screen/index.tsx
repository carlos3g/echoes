import type React from 'react';
import { useMemo } from 'react';
import type { ViewProps } from 'react-native';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { ScrollViewContainer, ViewContainer } from '@/shared/components/ui/screen/screen-container';
import { ScreenHeader } from '@/shared/components/ui/screen/screen-header';
import { useAppSafeArea } from '@/shared/hooks/use-app-safe-area';
import { cn } from '@/shared/utils';

export interface ScreenProps extends Omit<ViewProps, 'style'> {
  children: React.ReactNode;
  HeaderComponent?: React.ReactNode;
  canGoBack?: boolean;
  scrollable?: boolean;
  title?: string;
  noPaddingHorizontal?: boolean;
  className?: string;
}

export const Screen: React.FC<ScreenProps> = (props) => {
  const {
    children,
    canGoBack = false,
    scrollable = false,
    noPaddingHorizontal = false,
    className,
    title,
    HeaderComponent,
    ...viewProps
  } = props;

  const { bottom, top } = useAppSafeArea();

  const Container = scrollable ? ScrollViewContainer : ViewContainer;

  const safeAreaInsetsStyle = useMemo(() => ({ paddingTop: top, paddingBottom: bottom }), [top, bottom]);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Container>
        <View
          className={cn(noPaddingHorizontal ? 'px-0' : 'px-6', className)}
          style={safeAreaInsetsStyle}
          {...viewProps}
        >
          <ScreenHeader
            className={cn(noPaddingHorizontal ? 'px-6' : 'px-0')}
            HeaderComponent={HeaderComponent}
            canGoBack={canGoBack}
            title={title}
          />
          {children}
        </View>
      </Container>
    </KeyboardAvoidingView>
  );
};
