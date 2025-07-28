import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { Stack, useRouter } from "expo-router";
import { TouchableOpacity } from "react-native";

import { TrainingInterface } from "@/app/(tabs)/trainings";
import Training from "@/components/Training";

export default function DailyTrainingScreen() {
  const router = useRouter();
  const { colors } = useTheme();

  // Create a daily training object that matches the TrainingInterface
  const dailyTraining: TrainingInterface = {
    id: 999, // Special ID for daily challenge
    title: "Daily Soccer Challenge",
    description:
      "Complete today's soccer training challenge! This session includes dynamic warm-ups, ball control drills, agility training, and shooting practice to improve your overall game.",
    duration: 45, // 45 minutes
    experience_reward: 500,
    subscription_type_id: 1, // Free content
    created_at: new Date().toISOString(),
  };

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
          headerTitle: "Daily Challenge",
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTitleStyle: {
            color: colors.text,
            fontSize: 18,
            fontWeight: "bold",
          },
          headerLeft: () => (
            <TouchableOpacity onPress={handleBackPress} className="p-2">
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          ),
          headerShadowVisible: true,
        }}
      />
      <Training id={999} training={dailyTraining} isExercise={false} />
    </>
  );
}
