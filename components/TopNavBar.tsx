import React, { useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FriendList from "./FriendList";
import { Account } from "@/interfaces/interfaces";

const TopNavbar = ({ account }: { account: Account }) => {
  const [isFriendMenuVisible, setIsFriendMenuVisible] = useState(false);
  const slideAnimation = useRef(new Animated.Value(0)).current; // Animation state

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
    outputRange: [400, 0],
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
        className="absolute right-1 left-1 top-0 bg-gray-50 shadow-lg w-max max-w-[400px] h-screen-safe z-50  rounded-2xl"
      >
        <FriendList account={account} toggleFriendMenu={toggleFriendMenu} />
      </Animated.View>
      <TouchableOpacity
        onPress={toggleFriendMenu}
        className="border border-black px-2 py-1 rounded-2xl"
      >
        <Ionicons name="people" size={32} />
      </TouchableOpacity>
    </View>
  );
};

export default TopNavbar;
