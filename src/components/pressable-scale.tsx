import { Pressable, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

interface Props {
  onPress: () => void;
  style?: ViewStyle | ViewStyle[];
  children: React.ReactNode;
  disabled?: boolean;
}

export function PressableScale({ onPress, style, children, disabled }: Props) {
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <Animated.View style={[animStyle, style as ViewStyle]}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() => {
          scale.value = withSpring(0.965, { damping: 20, stiffness: 400 });
        }}
        onPressOut={() => {
          scale.value = withSpring(1.0, { damping: 16, stiffness: 280 });
        }}>
        {children}
      </Pressable>
    </Animated.View>
  );
}
