import React from 'react';
import type { PressableProps } from 'react-native';
import { Pressable, View } from 'react-native';
import type { AnimatedProps } from 'react-native-reanimated';
import Animated, {
  interpolate,
  SlideInDown,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
} from 'react-native-reanimated';
import { Ionicons } from '@/lib/nativewind/components';

const AnimatedPressable = Animated.createAnimatedComponent(
  React.forwardRef((props: PressableProps, ref: React.LegacyRef<View>) => <Pressable ref={ref} {...props} />)
);

export interface FabProps extends Omit<AnimatedProps<PressableProps>, 'onPress'> {
  onPress?: PressableProps['onPress'];
  testID?: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name'];
}

export const Fab: React.FC<FabProps> = (props) => {
  const { onPress, testID = 'fab-button', iconName = 'add-sharp', ...rest } = props;

  const progress = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(progress.value, [0, 1], [1, 1.1]) }],
  }));

  return (
    <AnimatedPressable
      testID={testID}
      onPress={(e) => {
        // eslint-disable-next-line react-hooks/immutability
        progress.value = withSequence(withSpring(1, { duration: 300 }), withSpring(0, { duration: 200 }));
        onPress?.(e);
      }}
      entering={SlideInDown.delay(200).duration(1000)}
      className="absolute bottom-8 right-6"
      {...rest}
      style={animatedStyle}
    >
      <View
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary"
        style={{
          shadowColor: '#B5845A',
          shadowOpacity: 0.3,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 4 },
          elevation: 8,
        }}
      >
        <Ionicons name={iconName} className="text-primary-foreground" size={24} />
      </View>
    </AnimatedPressable>
  );
};
