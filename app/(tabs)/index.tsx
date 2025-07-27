import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRouter } from "expo-router";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { user, account, loading, signOut, currentProfile } = useAuth();
  const router = useRouter();

  // React.useEffect(() => {
  //   signOut()
  //     .then(() => {
  //       console.log("User signed out successfully.");
  //     })
  //     .catch((error) => {
  //       console.error("Error signing out:", error);
  //     });
  // }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!account) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <Text className="text-lg">No account found. Please log in again.</Text>
      </View>
    );
  }

  // Format XP with commas for readability
  const formatXP = (xp: number) => {
    return xp.toLocaleString();
  };

  // Format UPRO Gold with 2 decimal places
  const formatUPROGold = (gold: number) => {
    return gold.toFixed(2);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Top Header Section */}
      <View className="px-6 pt-4 pb-6">
        <TouchableOpacity className="mb-4">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        
        <View className="items-center">
          <Text className="text-2xl font-bold text-gray-800 mb-1">
            {currentProfile?.name}
          </Text>
          <Text className="text-base text-gray-600">
            {currentProfile?.playing_position || "Player"}
          </Text>
        </View>
      </View>

      {/* Avatar and Action Buttons Section */}
      <View className="items-center mb-8">
        {/* Avatar Placeholder */}
        <View className="w-24 h-32 items-center mb-6">
          {/* Head */}
          <View className="w-16 h-16 bg-gray-300 rounded-full mb-2" />
          {/* Body */}
          <View className="w-12 h-12 bg-gray-300 rounded-t-full" />
        </View>

        {/* Action Buttons */}
        <View className="flex-row space-x-4">
          <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg shadow-sm">
            <Text className="text-white font-bold">edit avatar</Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg shadow-sm">
            <Text className="text-white font-bold">share</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Daily Training Button */}
      <View className="px-6 mb-6">
        <TouchableOpacity 
          className="bg-green-500 py-4 rounded-lg items-center shadow-sm"
          onPress={() => router.push("/daily")}
        >
          <Text className="text-white font-bold text-lg">Daily Training</Text>
        </TouchableOpacity>
      </View>

      {/* Statistics Cards Grid */}
      <View className="px-6">
        <View className="flex-row flex-wrap justify-between">
          {/* Card 1 - XP */}
          <View className="w-[48%] bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="flag" size={16} color="#10B981" />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              {formatXP(currentProfile?.experience_total || 0)}
            </Text>
            <Text className="text-white text-sm">Experience Points</Text>
          </View>

          {/* Card 2 - UPRO Gold */}
          <View className="w-[48%] bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="crown" size={16} color="#8B5CF6" />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              {formatUPROGold(currentProfile?.upro_gold || 0)}
            </Text>
            <Text className="text-white text-sm">UPRO Gold</Text>
          </View>

          {/* Card 3 - Age Group */}
          <View className="w-[48%] bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="clock" size={16} color="#FFFFFF" />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              {currentProfile?.age_group || 0}
            </Text>
            <Text className="text-white text-sm">Age Group</Text>
          </View>

          {/* Card 4 - Weight */}
          <View className="w-[48%] bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="circle" size={16} color="#10B981" />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              {currentProfile?.weight || 0}
            </Text>
            <Text className="text-white text-sm">Weight (kg)</Text>
          </View>

          {/* Card 5 - Height */}
          <View className="w-[48%] bg-gray-800 rounded-lg p-4 mb-4">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons name="lightning-bolt" size={16} color="#10B981" />
            </View>
            <Text className="text-white text-2xl font-bold mb-1">
              {currentProfile?.height || 0}
            </Text>
            <Text className="text-white text-sm">Height (cm)</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
