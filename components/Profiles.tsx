import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useTheme } from "@react-navigation/native";
import { getNameIntial } from "./TopNavBar";

export const Profiles = ({
  showBackButton = false,
}: {
  showBackButton?: boolean;
}) => {
  const { profiles, currentProfile, setCurrentProfile } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleProfileSelect = (profile: any) => {
    setCurrentProfile(profile);
    // Clear navigation history and go to home after profile selection
    router.dismissAll();
    router.replace("/(tabs)");
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleCreateProfile = () => {
    router.push("/pages/create-profile");
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1">
        <View className="p-6 pb-20">
          {/* Header with optional back button - only show when not using navigation header */}
          {showBackButton && (
            <View className="flex-row items-center justify-between mb-8">
              <TouchableOpacity onPress={handleBackPress} className="p-2 -ml-2">
                <Text className="text-green-600 text-lg font-medium">
                  ← Back
                </Text>
              </TouchableOpacity>
              <Text
                className="text-3xl font-bold text-center flex-1"
                style={{ color: colors.text }}
              >
                Switch Profile
              </Text>
              <View className="w-16" />
            </View>
          )}

          {/* Show title only when no navigation header */}
          {!showBackButton && (
            <Text
              className="text-3xl font-bold mb-8 text-center"
              style={{ color: colors.text }}
            >
              Select Profile
            </Text>
          )}

          <View className="flex-col gap-6">
            {profiles.length > 0 &&
              profiles.map((profile) => (
                <TouchableOpacity
                  key={profile.id}
                  onPress={() => handleProfileSelect(profile)}
                  className={`p-6 rounded-2xl flex-row items-center ${
                    currentProfile?.id === profile.id ? "bg-green-100" : ""
                  }`}
                  style={{
                    backgroundColor:
                      currentProfile?.id === profile.id
                        ? "#dcfce7"
                        : colors.card,
                    borderWidth: currentProfile?.id === profile.id ? 2 : 1,
                    borderColor:
                      currentProfile?.id === profile.id
                        ? "#16a34a"
                        : colors.border || "#e5e7eb",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View
                    className={`h-16 w-16 rounded-full mr-4 flex justify-center items-center ${
                      currentProfile?.id === profile.id
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  >
                    <Text className="text-white text-xl font-bold">
                      {getNameIntial(profile.name)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text
                      className="text-lg font-semibold"
                      style={{ color: colors.text }}
                    >
                      {profile.name}
                    </Text>
                    <Text className="text-sm text-gray-500">
                      {profile.subscription_type === 1
                        ? "Free Plan"
                        : profile.subscription_type === 2
                          ? "Premium Plan"
                          : "Unknown Plan"}
                    </Text>
                  </View>
                  {currentProfile?.id === profile.id && (
                    <View className="h-6 w-6 rounded-full bg-green-500 flex justify-center items-center">
                      <Text className="text-white text-xs">✓</Text>
                    </View>
                  )}
                </TouchableOpacity>
              ))}

            <TouchableOpacity
              onPress={handleCreateProfile}
              className="p-6 rounded-2xl border-2 border-dashed border-gray-300 flex-row items-center justify-center"
              style={{
                backgroundColor: colors.card,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <View className="h-16 w-16 rounded-full bg-gray-200 mr-4 flex justify-center items-center">
                <Text className="text-gray-600 text-2xl">+</Text>
              </View>
              <Text
                className="text-lg font-medium"
                style={{ color: colors.text }}
              >
                Create New Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
