import { useEffect } from "react";
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";

import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";

export default function ViewMoreTrainingScreen() {
  const { user } = useAuth();
  const { moreId } = useLocalSearchParams();
  const { trainings, getTrainings } = useTrainings();

  useEffect(() => {
    getTrainings();
  }, []);

  // section definitions
  const sections = [
    {
      id: "warm-up",
      title: "Warm Up",
      data: trainings?.filter((t) => t.duration_minutes < 15) || [],
    },
    {
      id: "training",
      title: "15 mins",
      data: trainings?.filter((t) => t.duration_minutes === 15) || [],
    },
    {
      id: "drill",
      title: "Drill",
      data: trainings?.filter((t) => t.duration_minutes > 15) || [],
    },
  ].find(section => section.id === moreId);

  const optionColors = [
    "bg-green-200",
    "bg-teal-200",
    "bg-yellow-200",
    "bg-green-300",
    "bg-teal-300",
  ];

  if (!moreId) {
    return <Redirect href="/trainings" />;
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerTitle: sections?.title || "Training Details",
          headerBackButtonDisplayMode: "minimal",
          headerBackground: () => <View className="bg-transparent" />,
        }}
      />

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        <View className="flex-1">
          {sections?.data.map((item, idx) => {
            const bgClass = optionColors[idx % optionColors.length];

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() =>
                  router.push(`/trainings/single/${item.id}`)
                }
                className={`${bgClass} w-full mb-4 min-h-20 rounded-md items-center justify-center`}
              >
                <Text className="text-center px-2">{item.title}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </>
  );
}
