import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { s as tw } from 'react-native-wind';


const SplashScreen = () => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(50);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 1000, easing: Easing.inOut(Easing.ease) });
    translateY.value = withTiming(0, { duration: 1000, easing: Easing.inOut(Easing.ease) });
  }, []);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={tw`flex-1 justify-center items-center bg-white`}>
      <Animated.View style={[tw`justify-center items-center`, animatedStyle]}>
        <Image source={require('../assets/logo/logo.png')} style={tw`w-36 h-36 resize-contain`} />
      </Animated.View>
    </View>
  );
};



export default SplashScreen;
