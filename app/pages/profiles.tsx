import { useTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Profiles } from "@/components/Profiles";

export default function ProfilesScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    }
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
          headerTitle: "Switch Profile",
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
        <Profiles showBackButton={false} />
      </SafeAreaView>
    </>
  );
}
