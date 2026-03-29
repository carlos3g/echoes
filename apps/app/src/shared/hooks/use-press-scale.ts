import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function usePressScale(target = 0.96) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pressHandlers = {
    onPressIn: () => {
      scale.value = withSpring(target, { duration: 100 });
    },
    onPressOut: () => {
      scale.value = withSpring(1, { duration: 200 });
    },
  };

  return { animatedStyle, pressHandlers };
}
