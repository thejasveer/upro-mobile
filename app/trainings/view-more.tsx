import { Redirect, router, Stack, useLocalSearchParams } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import { TrainingInterface } from "@/app/(tabs)/trainings";
import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { ExerciseInterface, useExercises } from "@/hooks/useExercises";
import { useTrainings } from "@/hooks/useTrainings";
import { useTheme } from "@react-navigation/native";

export default function ViewMoreTrainingScreen() {
  const { user } = useAuth();
  const { moreId, type } = useLocalSearchParams();
  const { trainings, getTrainings } = useTrainings();
  const { exercises, getExercises } = useExercises();
  const { dark, colors } = useTheme();

  const isExercise = type === "exercise";

  useEffect(() => {
    if (isExercise) {
      getExercises();
    } else {
      getTrainings();
    }
  }, [type]);

  // section definitions for training sessions
  const trainingSections = [
    {
      id: "warm-up",
      title: "Warm Up",
      subtitle: "Get ready to train",
      data: trainings?.filter((t: TrainingInterface) => t.duration < 15) || [],
    },
    {
      id: "training",
      title: "15 mins",
      subtitle: "Quick sessions",
      data:
        trainings?.filter((t: TrainingInterface) => t.duration === 15) || [],
    },
    {
      id: "drill",
      title: "Drill",
      subtitle: "Intensive training",
      data: trainings?.filter((t: TrainingInterface) => t.duration > 15) || [],
    },
  ].find((section) => section.id === moreId);

  // section definitions for exercises
  const exerciseSections = [
    {
      id: "easy",
      title: "Beginner",
      subtitle: "Perfect for starting out",
      data:
        exercises?.filter((e: ExerciseInterface) => e.difficulty === "easy") ||
        [],
    },
    {
      id: "medium",
      title: "Intermediate",
      subtitle: "Build your skills",
      data:
        exercises?.filter(
          (e: ExerciseInterface) => e.difficulty === "medium"
        ) || [],
    },
    {
      id: "hard",
      title: "Advanced",
      subtitle: "Master the techniques",
      data:
        exercises?.filter((e: ExerciseInterface) => e.difficulty === "hard") ||
        [],
    },
  ].find((section) => section.id === moreId);

  const sections = isExercise ? exerciseSections : trainingSections;

  const optionColors = dark
    ? [
        "bg-green-300",
        "bg-teal-300",
        "bg-yellow-200",
        "bg-green-300",
        "bg-teal-300",
      ]
    : [
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
          headerTitle:
            sections?.title ||
            (isExercise ? "Exercise Details" : "Training Details"),
          headerBackButtonDisplayMode: "minimal",
          headerBackground: () => <View className="bg-transparent" />,
        }}
      />

      <ScrollView
        className="flex-1 p-4"
        style={{ backgroundColor: colors.background }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section Header */}
        {sections && (
          <View className="mb-6">
            <Text
              className="text-2xl font-bold mb-2"
              style={{ color: colors.text }}
            >
              {sections.title}
            </Text>
            <Text className="text-gray-500 mb-4">{sections.subtitle}</Text>
            <Text className="text-sm text-gray-400">
              {sections.data.length}{" "}
              {isExercise ? "exercise" : "training session"}
              {sections.data.length !== 1 ? "s" : ""} available
            </Text>
          </View>
        )}

        <View className="flex-1">
          {sections?.data.map(
            (item: TrainingInterface | ExerciseInterface, idx: number) => {
              const bgClass = optionColors[idx % optionColors.length];
              const isPremium =
                "subscription_type_id" in item
                  ? item.subscription_type_id === 2
                  : false;
              const difficulty = "difficulty" in item ? item.difficulty : null;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() =>
                    router.push(
                      `/trainings/single/${item.id}${isExercise ? "?type=exercise" : ""}`
                    )
                  }
                  className={`${bgClass} w-full mb-4 rounded-2xl p-4`}
                  style={{
                    minHeight: 100,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 3,
                  }}
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-1">
                      <Text
                        className="text-lg font-bold text-gray-800 mb-1"
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <Text className="text-sm text-gray-600" numberOfLines={2}>
                        {item.description}
                      </Text>
                    </View>
                    {isPremium && (
                      <View className="bg-yellow-500 rounded-full px-2 py-1 ml-2">
                        <Text className="text-white text-xs font-bold">
                          PREMIUM
                        </Text>
                      </View>
                    )}
                    {difficulty && (
                      <View className="bg-blue-500 rounded-full px-2 py-1 ml-2">
                        <Text className="text-white text-xs font-bold uppercase">
                          {difficulty}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <Text className="text-sm text-gray-700 mr-4">
                        ⏱️ {item.duration}min
                      </Text>
                      <Text className="text-sm text-gray-700">
                        ⭐ {item.experience_reward} XP
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              );
            }
          )}

          {sections?.data.length === 0 && (
            <View className="py-12 items-center">
              <Text className="text-gray-500 text-center text-lg mb-2">
                No {isExercise ? "exercises" : "training sessions"} found
              </Text>
              <Text className="text-gray-400 text-center">
                Check back later for new content!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
