import { useRouter } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AuthScreen from "@/components/AuthScreen";

import { useAuth } from "@/contexts/AuthContext";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

// 3D Avatar Component using the actual 3D model viewer
const Avatar3D = ({ profileName }: { profileName?: string }) => {
  const { colors } = useTheme();

  return (
    <View className="items-center mb-8">
      {/* Temporarily disabled 3D model to fix crashes */}
      <View
        className="w-48 h-64 rounded-3xl mb-4 items-center justify-center"
        style={{
          backgroundColor: colors.card,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 16,
          elevation: 10,
        }}
      >
        <MaterialCommunityIcons name="soccer" size={80} color="#16a34a" />
        <Text className="text-sm text-gray-500 mt-2 font-semibold">
          Goalkeeper Model
        </Text>
      </View>

      {/* Player Name Below Avatar */}
      <View className="items-center mb-4">
        <Text className="text-lg font-bold" style={{ color: colors.text }}>
          {profileName || "Player"}
        </Text>
        <View className="mt-2 px-3 py-1 bg-green-100 rounded-full">
          <Text className="text-green-700 text-xs font-medium">
            Goalkeeper Model
          </Text>
        </View>
      </View>

      {/* Action Buttons Below Avatar */}
      <View className="flex-row gap-4">
        <TouchableOpacity
          className="bg-green-600 px-6 py-3 rounded-2xl flex-row items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            // TODO: Navigate to avatar customization
            Alert.alert(
              "Coming Soon",
              "Avatar customization will be available soon!"
            );
          }}
        >
          <MaterialCommunityIcons name="palette" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Customize</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-600 px-6 py-3 rounded-2xl flex-row items-center"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 5,
          }}
          onPress={() => {
            // TODO: Share avatar functionality
            Alert.alert(
              "Coming Soon",
              "Avatar sharing will be available soon!"
            );
          }}
        >
          <MaterialCommunityIcons name="share" size={18} color="white" />
          <Text className="text-white font-bold ml-2">Share</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function HomeScreen() {
  const { user, account, loading, currentProfile } = useAuth();
  const router = useRouter();
  const { colors } = useTheme();

  if (loading) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  if (!account) {
    return (
      <View
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
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

  const StatCard = ({
    icon,
    value,
    label,
    iconColor = "#16a34a",
    backgroundColor = "#f0fdf4",
  }: {
    icon: string;
    value: string | number;
    label: string;
    iconColor?: string;
    backgroundColor?: string;
  }) => (
    <View
      className="flex-1 mx-1 mb-4 rounded-2xl p-4 h-24 justify-between"
      style={{
        backgroundColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
      }}
    >
      <View className="flex-row justify-between items-start">
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={iconColor}
        />
      </View>
      <View>
        <Text className="text-2xl font-bold" style={{ color: colors.text }}>
          {value}
        </Text>
        <Text className="text-sm text-gray-600 font-medium">{label}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View className="px-6 pt-6 pb-4">
          <View className="items-center mb-6">
            <Text className="text-sm text-gray-500 font-medium">
              Welcome back,
            </Text>
            <Text className="text-2xl font-bold" style={{ color: colors.text }}>
              {currentProfile?.name || "Player"}
            </Text>
            <Text className="text-base text-gray-600 mt-1">
              {currentProfile?.playing_position || "Soccer Player"}
            </Text>
          </View>
        </View>

        {/* 3D Avatar Section */}
        <Avatar3D profileName={currentProfile?.name} />

        {/* Player Level Card */}
        <View className="px-6 mb-8">
          <View
            className="rounded-3xl p-6"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text
                  className="text-lg font-bold mb-1"
                  style={{ color: colors.text }}
                >
                  Level{" "}
                  {Math.floor((currentProfile?.experience_total || 0) / 1000) +
                    1}{" "}
                  Player
                </Text>
                <View className="flex-row items-center">
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-700 text-sm font-semibold">
                      {currentProfile?.subscription_type === 1
                        ? "Free Plan"
                        : "Premium Plan"}
                    </Text>
                  </View>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm text-gray-500">XP to Next Level</Text>
                <Text className="text-xl font-bold text-green-600">
                  {1000 - ((currentProfile?.experience_total || 0) % 1000)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Statistics Grid */}
        <View className="px-6 mb-8">
          <Text
            className="text-xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Your Stats
          </Text>

          {/* First Row */}
          <View className="flex-row">
            <StatCard
              icon="flag-checkered"
              value={formatXP(currentProfile?.experience_total || 0)}
              label="Experience Points"
              iconColor="#16a34a"
              backgroundColor="#f0fdf4"
            />
            <StatCard
              icon="diamond-stone"
              value={formatUPROGold(currentProfile?.upro_gold || 0)}
              label="UPRO Gold"
              iconColor="#f59e0b"
              backgroundColor="#fffbeb"
            />
          </View>

          {/* Second Row */}
          <View className="flex-row">
            <StatCard
              icon="calendar"
              value={currentProfile?.age_group || 0}
              label="Age"
              iconColor="#3b82f6"
              backgroundColor="#eff6ff"
            />
            <StatCard
              icon="weight-kilogram"
              value={
                currentProfile?.weight ? `${currentProfile.weight} kg` : "N/A"
              }
              label="Weight"
              iconColor="#8b5cf6"
              backgroundColor="#f5f3ff"
            />
          </View>

          {/* Third Row */}
          <View className="flex-row">
            <StatCard
              icon="human-male-height"
              value={
                currentProfile?.height ? `${currentProfile.height} cm` : "N/A"
              }
              label="Height"
              iconColor="#ef4444"
              backgroundColor="#fef2f2"
            />
            <StatCard
              icon="soccer"
              value={
                (currentProfile?.dominant_foot as any) === true ||
                currentProfile?.dominant_foot === "true"
                  ? "Right"
                  : (currentProfile?.dominant_foot as any) === false ||
                      currentProfile?.dominant_foot === "false"
                    ? "Left"
                    : "N/A"
              }
              label="Dominant Foot"
              iconColor="#10b981"
              backgroundColor="#f0fdfa"
            />
          </View>
        </View>

        {/* Daily Training CTA */}
        <View className="px-6 mb-12">
          <TouchableOpacity
            className="rounded-3xl p-8 items-center"
            style={{
              backgroundColor: "#16a34a",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.2,
              shadowRadius: 16,
              elevation: 10,
            }}
            onPress={() => router.push("/pages/daily")}
          >
            <MaterialCommunityIcons name="fire" size={48} color="white" />
            <Text className="text-white text-2xl font-bold mt-4 mb-2">
              Daily Training
            </Text>
            <Text className="text-green-100 text-center text-base">
              Keep your streak going! Complete today&apos;s training session.
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
