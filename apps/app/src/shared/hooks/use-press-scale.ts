import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export function usePressScale(target = 0.96) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const pressHandlers = {
    onPressIn: () => {
      // eslint-disable-next-line react-hooks/immutability
      scale.value = withSpring(target, { duration: 100 });
    },
    onPressOut: () => {
      // eslint-disable-next-line react-hooks/immutability
      scale.value = withSpring(1, { duration: 200 });
    },
  };

  return { animatedStyle, pressHandlers };
}
