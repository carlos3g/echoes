import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

export function usePressOpacity(target = 0.6) {
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const pressHandlers = {
    onPressIn: () => {
      opacity.value = withTiming(target, { duration: 100 });
    },
    onPressOut: () => {
      opacity.value = withTiming(1, { duration: 150 });
    },
  };

  return { animatedStyle, pressHandlers };
}
