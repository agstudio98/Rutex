import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const AnimatedFadeSlide = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'up',
  distance = 24,
  style,
  ...props
}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translate = useRef(new Animated.Value(distance)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration,
          useNativeDriver: true,
        }),
        Animated.timing(translate, {
          toValue: 0,
          duration,
          useNativeDriver: true,
        }),
      ]).start();
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, duration, distance]);

  const transformStyle = () => {
    switch (direction) {
      case 'up':
        return [{ translateY: translate }];
      case 'down':
        return [
          {
            translateY: translate.interpolate({
              inputRange: [0, distance],
              outputRange: [0, -distance],
            }),
          },
        ];
      case 'left':
        return [{ translateX: translate }];
      case 'right':
        return [
          {
            translateX: translate.interpolate({
              inputRange: [0, distance],
              outputRange: [0, -distance],
            }),
          },
        ];
      default:
        return [{ translateY: translate }];
    }
  };

  return (
    <Animated.View
      style={[
        style,
        {
          opacity,
          transform: transformStyle(),
        },
      ]}
      {...props}
    >
      {children}
    </Animated.View>
  );
};

export default AnimatedFadeSlide;
