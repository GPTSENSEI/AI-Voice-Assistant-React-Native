import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';

const LoadingScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#4B5563" />
      <Text className="mt-4 text-lg text-gray-600">Loading...</Text>
    </View>
  );
};

export default LoadingScreen;
