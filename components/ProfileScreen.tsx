import React from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";
import { useAuth } from "../contexts/AuthContext";

const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      const { error } = await signOut();
      if (error) throw error;
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  };

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-gray-600">No user data available</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 px-6 py-8">
      <View className="bg-white rounded-lg p-6 shadow-sm mb-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">Profile</Text>

        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-1">Email</Text>
          <Text className="text-gray-800 text-lg">{user.email}</Text>
        </View>

        <View className="mb-4">
          <Text className="text-gray-600 text-sm mb-1">User ID</Text>
          <Text className="text-gray-800 text-sm font-mono">{user.id}</Text>
        </View>

        <View className="mb-6">
          <Text className="text-gray-600 text-sm mb-1">Member Since</Text>
          <Text className="text-gray-800">
            {new Date(user.created_at).toLocaleDateString()}
          </Text>
        </View>

        <TouchableOpacity
          className="bg-red-600 py-4 rounded-lg"
          onPress={handleSignOut}
        >
          <Text className="text-white text-center font-semibold text-lg">
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ProfileScreen;
