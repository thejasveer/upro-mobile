import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useTrainings } from "@/hooks/useTrainings";
import { useTheme } from "@react-navigation/native";

export interface TrainingInterface {
  id: number;
  title: string;
  description: string;
  experience_reward: number;
  duration_minutes: number;
  subscription_type_id: number;
}

export default function TrainingsScreen() {
  const router = useRouter();
  const { trainings, getTrainings } = useTrainings();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Training" | "Exercise">(
    "Training"
  );
  const { colors, dark } = useTheme();

  useEffect(() => {
    getTrainings();
  }, [getTrainings]);

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
  ];

  // color palette for options (mix of green with teal/yellow)
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

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Trainings",
          headerBackground: () => <View className="bg-transparent" />,
        }}
      />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <View className="p-5">
          {/* Tabs */}
          <View className="flex-row mb-4">
            {["Training", "Exercise"].map((tab) => (
              <TouchableOpacity
                key={tab}
                onPress={() => setActiveTab(tab as any)}
                className="flex-1 py-2 mr-2 rounded-md items-center"
                style={{
                  backgroundColor:
                    activeTab === tab ? colors.primary : "#e5e7eb",
                }}
              >
                <Text
                  className={`${activeTab === tab ? "text-white" : "text-black"}`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search Bar */}
          <View className="mb-4">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="search"
              placeholderTextColor="brown"
              className="rounded-md px-4 py-2"
              style={{ backgroundColor: colors.card }}
            />
          </View>
        </View>

        {/* Sections - vertical scroll */}
        <ScrollView className="px-5" showsVerticalScrollIndicator={false}>
          {sections.map((section) => (
            <View key={section.title} className="mb-6">
              {/* Header */}
              <View className="flex-row justify-between items-center mb-2">
                <Text className="text-xl font-semibold">{section.title}</Text>

                {section.data.length > 0 && (
                  <TouchableOpacity
                    onPress={() => {
                      router.push(`/trainings/view-more?moreId=${section.id}`);
                    }}
                  >
                    <Text className="text-blue-500">View More</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Options - horizontal linear with colorful backgrounds */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row">
                  {section.data.filter((item) =>
                    item.title.toLowerCase().includes(searchQuery.toLowerCase())
                  ).length === 0 && (
                    <View className="py-8 px-4">
                      <Text className="text-gray-500">
                        No trainings available.
                      </Text>
                    </View>
                  )}

                  {section.data
                    .filter((item) =>
                      item.title
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase())
                    )
                    .map((item, idx) => {
                      const bgClass = optionColors[idx % optionColors.length];

                      return (
                        <TouchableOpacity
                          key={item.id}
                          onPress={() =>
                            router.push(`/trainings/single/${item.id}`)
                          }
                          className={`${bgClass} w-40 mr-4 aspect-square rounded-md items-center justify-center`}
                        >
                          <Text className="text-center px-2">{item.title}</Text>
                        </TouchableOpacity>
                      );
                    })}
                </View>
              </ScrollView>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
