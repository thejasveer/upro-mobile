import { useAuth } from "@/contexts/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

const TopNavbar = () => {
  const [isFriendMenuVisible, setIsFriendMenuVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current; // Animation state
  const { currentProfile, setCurrentProfile, profiles, switchProfile } =
    useAuth();

  const toggleFriendMenu = () => {
    Animated.timing(slideAnimation, {
      toValue: isFriendMenuVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
    setIsFriendMenuVisible(!isFriendMenuVisible);
  };

  const slideInterpolation = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <View className="flex-row justify-between items-center px-6 py-2 ">
      <TouchableOpacity
        className=" border border-black px-2 py-1 rounded-2xl"
        onPress={() => {
          /* Handle Settings */
        }}
      >
        <Ionicons name="menu" size={32} />
      </TouchableOpacity>

      {/* expandable friend menu view */}
      <Animated.View
        style={[{ transform: [{ translateX: slideInterpolation }] }]}
        className="absolute right-7 top-14 bg-green-500 w- h-max px-5 py-2 z-50 justify-center items-center rounded-2xl"
      >
        {profiles.map((profile) => (
          <View key={profile.id} className="w-full">
            <TouchableOpacity
              key={profile.id}
              onPress={() => {
                switchProfile(profile.id);
                toggleFriendMenu();
              }}
              className="  w-45 flex items-center justify-start "
            >
              <Text className="text-white text-left  font-semibold text-xl">
                {profile.name}
              </Text>
            </TouchableOpacity>
            <View className="h- w-full bg-white my-2"></View>
          </View>
        ))}
        <TouchableOpacity
          onPress={() => {
            setCurrentProfile(null);
          }}
          className="bg-white p-2 rounded-full"
        >
          <Text className="text-green-500 font-semibold">Add new profile</Text>
        </TouchableOpacity>
      </Animated.View>
      <TouchableOpacity
        onPress={toggleFriendMenu}
        className="bg-green-500   rounded-full size-12 flex items-center justify-center align-middle"
      >
        {/* <Ionicons name="people" size={32} /> */}
        <Text className="text-black-500">
          {currentProfile && getNameIntial(currentProfile.name)}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export function getNameIntial(name: string): string {
  return name
    ? `${name.charAt(0).toUpperCase()} ${name.split(" ")[1].charAt(0).toUpperCase()}`
    : "";
}

export default TopNavbar;
