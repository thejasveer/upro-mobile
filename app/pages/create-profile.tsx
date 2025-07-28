import { useTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AddUserForm from "@/components/AddUserForm";
import { useAuth } from "@/contexts/AuthContext";

export default function CreateProfileScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { refreshProfiles } = useAuth();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
  };

  const handleProfileCreated = async () => {
    // Refresh the profiles list to show the newly created profile
    await refreshProfiles();

    // Clear navigation history and go to home after successful creation
    router.dismissAll();
    router.replace("/(tabs)");
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          presentation: "modal",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitle: "Create New Profile",
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} className="p-2">
              <Text className="text-green-600 text-lg font-medium">Cancel</Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: true,
        }}
      />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <AddUserForm
          onProfileCreated={handleProfileCreated}
          onBack={handleBackPress}
          hideHeader={true}
        />
      </SafeAreaView>
    </>
  );
}
