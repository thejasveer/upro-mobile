import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { getNameIntial } from "@/components/TopNavBar";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsScreen() {
  const { user, currentProfile, signOut } = useAuth();
  const { colors } = useTheme();
  const router = useRouter();

  const handleSwitchProfile = () => {
    router.push("/pages/profiles");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut();
          } catch (error: any) {
            Alert.alert("Error", error.message);
          }
        },
      },
    ]);
  };

  const SettingsItem = ({
    icon,
    title,
    subtitle,
    onPress,
    showArrow = true,
    textColor,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    textColor?: string;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="p-4 border-b"
      style={{
        backgroundColor: colors.card,
        borderBottomColor: colors.border || "#e5e7eb",
      }}
    >
      <View className="flex-row items-center">
        <MaterialCommunityIcons
          name={icon as any}
          size={24}
          color={textColor || colors.text}
        />
        <View className="flex-1 ml-4">
          <Text
            className="text-base font-medium"
            style={{ color: textColor || colors.text }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-sm text-gray-500 mt-1">{subtitle}</Text>
          )}
        </View>
        {showArrow && (
          <MaterialCommunityIcons
            name="chevron-right"
            size={20}
            color="#9ca3af"
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="p-6">
          <Text
            className="text-2xl font-bold text-center"
            style={{ color: colors.text }}
          >
            Settings
          </Text>
        </View>

        {/* Profile Section */}
        <View className="mb-6">
          <View className="p-6">
            <Text
              className="text-lg font-semibold mb-4"
              style={{ color: colors.text }}
            >
              Profile
            </Text>

            {/* Current Profile Card */}
            <View
              className="p-4 rounded-2xl flex-row items-center"
              style={{
                backgroundColor: colors.card,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
            >
              <View className="h-16 w-16 rounded-full bg-green-500 mr-4 flex justify-center items-center">
                <Text className="text-white text-xl font-bold">
                  {currentProfile?.name
                    ? getNameIntial(currentProfile.name)
                    : "?"}
                </Text>
              </View>
              <View className="flex-1">
                <Text
                  className="text-lg font-semibold"
                  style={{ color: colors.text }}
                >
                  {currentProfile?.name || "Unknown User"}
                </Text>
                <Text className="text-sm text-gray-500">
                  {currentProfile?.playing_position || "Player"} •{" "}
                  {currentProfile?.subscription_type === 1
                    ? "Free Plan"
                    : currentProfile?.subscription_type === 2
                      ? "Premium Plan"
                      : "Unknown Plan"}
                </Text>
                <Text className="text-xs text-gray-400 mt-1">
                  {user?.email}
                </Text>
              </View>
            </View>
          </View>

          {/* Profile Actions */}
          <View
            className="mx-6 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <SettingsItem
              icon="account-switch"
              title="Switch Profile"
              subtitle="Change to a different profile"
              onPress={handleSwitchProfile}
            />
            <SettingsItem
              icon="account-edit"
              title="Edit Profile"
              subtitle="Update your profile information"
              onPress={() => {
                // TODO: Navigate to edit profile
                Alert.alert(
                  "Coming Soon",
                  "Profile editing will be available soon!"
                );
              }}
            />
          </View>
        </View>

        {/* App Settings */}
        <View className="mb-6">
          <View className="px-6 mb-4">
            <Text
              className="text-lg font-semibold"
              style={{ color: colors.text }}
            >
              App Settings
            </Text>
          </View>

          <View
            className="mx-6 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <SettingsItem
              icon="bell"
              title="Notifications"
              subtitle="Manage your notification preferences"
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Notification settings will be available soon!"
                );
              }}
            />
            <SettingsItem
              icon="shield-check"
              title="Privacy & Security"
              subtitle="Manage your privacy settings"
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Privacy settings will be available soon!"
                );
              }}
            />
            <SettingsItem
              icon="help-circle"
              title="Help & Support"
              subtitle="Get help and contact support"
              onPress={() => {
                Alert.alert(
                  "Coming Soon",
                  "Help & support will be available soon!"
                );
              }}
            />
          </View>
        </View>

        {/* Account Actions */}
        <View className="mb-20">
          <View
            className="mx-6 rounded-2xl overflow-hidden"
            style={{
              backgroundColor: colors.card,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <SettingsItem
              icon="logout"
              title="Logout"
              subtitle="Sign out of your account"
              onPress={handleLogout}
              showArrow={false}
              textColor="#ef4444"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
