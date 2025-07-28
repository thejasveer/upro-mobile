import { Stack, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useAuth } from "@/contexts/AuthContext";
import { ExerciseInterface, useExercises } from "@/hooks/useExercises";
import { useTrainings } from "@/hooks/useTrainings";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

export interface TrainingInterface {
  id: number;
  title: string;
  description: string;
  experience_reward: number;
  duration: number;
  subscription_type_id: number;
  created_at?: string;
}

export default function TrainingsScreen() {
  const router = useRouter();
  const { trainings, getTrainings } = useTrainings();
  const { exercises, getExercises } = useExercises();
  const { currentProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"Training" | "Exercise">(
    "Training" // Default to Training tab
  );
  const [isLoading, setIsLoading] = useState(true);
  const { colors } = useTheme();

  const isPremiumUser = currentProfile?.subscription_type === 2;

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([getTrainings(), getExercises()]);
      setIsLoading(false);
    };
    loadData();
  }, []); // Empty dependency array - only run once on mount

  // Get exercises (actual exercises grouped by difficulty)
  const getExerciseContent = () => {
    const sections = [
      {
        id: "easy",
        title: "Beginner",
        subtitle: "Perfect for starting out",
        icon: "leaf",
        iconColor: "#16a34a",
        gradientColors: ["#f0fdf4", "#16a34a"],
        data:
          exercises?.filter(
            (e: ExerciseInterface) => e.difficulty === "easy"
          ) || [],
      },
      {
        id: "medium",
        title: "Intermediate",
        subtitle: "Build your skills",
        icon: "fire",
        iconColor: "#f59e0b",
        gradientColors: ["#fef3c7", "#f59e0b"],
        data:
          exercises?.filter(
            (e: ExerciseInterface) => e.difficulty === "medium"
          ) || [],
      },
      {
        id: "hard",
        title: "Advanced",
        subtitle: "Master the techniques",
        icon: "lightning-bolt",
        iconColor: "#ef4444",
        gradientColors: ["#fee2e2", "#ef4444"],
        data:
          exercises?.filter(
            (e: ExerciseInterface) => e.difficulty === "hard"
          ) || [],
      },
    ];
    return sections;
  };

  // Get training content for timeline (ordered by date)
  const getTrainingTimelineData = () => {
    const sortedTrainings = [...(trainings || [])].sort((a, b) => {
      const dateA = new Date(a.created_at || 0).getTime();
      const dateB = new Date(b.created_at || 0).getTime();
      return dateB - dateA; // Most recent first
    });

    return sortedTrainings.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Format date for timeline
  const formatTimelineDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    if (diffDays <= 7) return `${diffDays - 1} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
  };

  // Modern card colors with gradients
  const cardStyles = [
    {
      backgroundColor: "#f0fdf4",
      borderColor: "#16a34a",
      textColor: "#15803d",
      iconColor: "#16a34a",
    },
    {
      backgroundColor: "#f0fdfa",
      borderColor: "#10b981",
      textColor: "#059669",
      iconColor: "#10b981",
    },
    {
      backgroundColor: "#eff6ff",
      borderColor: "#3b82f6",
      textColor: "#1d4ed8",
      iconColor: "#3b82f6",
    },
    {
      backgroundColor: "#fef3c7",
      borderColor: "#f59e0b",
      textColor: "#d97706",
      iconColor: "#f59e0b",
    },
    {
      backgroundColor: "#f5f3ff",
      borderColor: "#8b5cf6",
      textColor: "#7c3aed",
      iconColor: "#8b5cf6",
    },
  ];

  const TabButton = ({
    tab,
    isActive,
    onPress,
  }: {
    tab: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-1 py-3 px-6 rounded-2xl mx-1 ${
        isActive ? "bg-green-600" : ""
      }`}
      style={{
        backgroundColor: isActive ? "#16a34a" : colors.card,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: isActive ? 4 : 2 },
        shadowOpacity: isActive ? 0.2 : 0.1,
        shadowRadius: isActive ? 8 : 4,
        elevation: isActive ? 6 : 3,
      }}
    >
      <Text
        className={`text-center font-semibold ${isActive ? "text-white" : ""}`}
        style={{ color: isActive ? "white" : colors.text }}
      >
        {tab}
      </Text>
    </TouchableOpacity>
  );

  // Horizontal Exercise Card Component (for individual exercises)
  const ExerciseCard = ({
    item,
    style,
  }: {
    item: ExerciseInterface;
    style: any;
  }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trainings/single/${item.id}?type=exercise`)}
      className="w-48 mr-4 rounded-3xl p-6"
      style={{
        backgroundColor: style.backgroundColor,
        borderWidth: 2,
        borderColor: style.borderColor,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 8,
        minHeight: 180,
      }}
    >
      <View className="flex-row justify-between items-start mb-4">
        <MaterialCommunityIcons
          name="dumbbell"
          size={24}
          color={style.iconColor}
        />
        <View className="bg-white/70 px-2 py-1 rounded-full">
          <Text
            className="text-xs font-medium"
            style={{ color: style.textColor }}
          >
            {item.duration}min
          </Text>
        </View>
      </View>

      <Text
        className="text-lg font-bold mb-2 leading-tight"
        style={{ color: style.textColor }}
        numberOfLines={2}
      >
        {item.title}
      </Text>

      <Text
        className="text-sm opacity-80 mb-3"
        style={{ color: style.textColor }}
        numberOfLines={2}
      >
        {item.description}
      </Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <MaterialCommunityIcons
            name="star"
            size={16}
            color={style.iconColor}
          />
          <Text
            className="text-sm font-semibold ml-1"
            style={{ color: style.textColor }}
          >
            {item.experience_reward} XP
          </Text>
        </View>

        {/* Difficulty Badge */}
        <View
          className="px-2 py-1 rounded-full"
          style={{ backgroundColor: `${style.iconColor}20` }}
        >
          <Text
            className="text-xs font-bold uppercase"
            style={{ color: style.iconColor }}
          >
            {item.difficulty}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Timeline Training Card Component (for training sessions)
  const TimelineTrainingCard = ({
    item,
    index,
    isLast,
  }: {
    item: TrainingInterface;
    index: number;
    isLast: boolean;
  }) => {
    const handlePress = () => {
      if (!isPremiumUser) {
        Alert.alert(
          "Premium Required",
          "Upgrade to premium to access training sessions!",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Upgrade",
              onPress: () => {
                Alert.alert(
                  "Coming Soon",
                  "Premium upgrade will be available soon!"
                );
              },
            },
          ]
        );
        return;
      }
      router.push(`/trainings/single/${item.id}`);
    };

    const isPremiumRequired = item.subscription_type_id === 2;

    return (
      <View className="flex-row mb-6">
        {/* Timeline Line */}
        <View className="items-center mr-4">
          {/* Date Circle */}
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${
              isPremiumRequired ? "bg-yellow-100" : "bg-green-100"
            }`}
            style={{
              borderWidth: 3,
              borderColor: isPremiumRequired ? "#f59e0b" : "#16a34a",
            }}
          >
            <MaterialCommunityIcons
              name={isPremiumRequired ? "crown" : "play-circle"}
              size={20}
              color={isPremiumRequired ? "#f59e0b" : "#16a34a"}
            />
          </View>

          {/* Connecting Line */}
          {!isLast && (
            <View
              className="w-0.5 flex-1 mt-2"
              style={{
                backgroundColor: "#e5e7eb",
                minHeight: 40,
              }}
            />
          )}
        </View>

        {/* Content */}
        <View className="flex-1">
          {/* Date Header */}
          <Text className="text-sm text-gray-500 font-medium mb-2">
            {item.created_at
              ? formatTimelineDate(item.created_at)
              : "Unknown date"}
          </Text>

          {/* Training Card */}
          <TouchableOpacity
            onPress={handlePress}
            className="rounded-2xl p-4 mb-2"
            style={{
              backgroundColor: colors.card,
              borderWidth: 1,
              borderColor: isPremiumRequired ? "#f59e0b" : "#e5e7eb",
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
              opacity: !isPremiumUser && isPremiumRequired ? 0.6 : 1,
            }}
          >
            <View className="flex-row items-start justify-between mb-3">
              <View className="flex-1 mr-3">
                <Text
                  className="text-lg font-bold mb-1"
                  style={{ color: colors.text }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text className="text-sm text-gray-600" numberOfLines={3}>
                  {item.description}
                </Text>
              </View>

              {/* Premium Lock */}
              {!isPremiumUser && isPremiumRequired && (
                <View className="bg-yellow-500 rounded-full p-2">
                  <MaterialCommunityIcons name="lock" size={16} color="white" />
                </View>
              )}
            </View>

            {/* Bottom Row */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={16}
                  color="#6b7280"
                />
                <Text className="text-sm text-gray-500 ml-1 mr-4">
                  {item.duration}min
                </Text>

                <MaterialCommunityIcons name="star" size={16} color="#f59e0b" />
                <Text className="text-sm text-gray-500 ml-1">
                  {item.experience_reward} XP
                </Text>
              </View>

              {isPremiumRequired && (
                <View className="flex-row items-center">
                  <MaterialCommunityIcons
                    name="crown"
                    size={14}
                    color="#f59e0b"
                  />
                  <Text className="text-xs text-yellow-600 ml-1 font-medium">
                    Premium
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const SectionHeader = ({ section }: { section: any }) => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center flex-1">
          <View
            className="w-12 h-12 rounded-2xl items-center justify-center mr-3"
            style={{
              backgroundColor: section.gradientColors[0],
            }}
          >
            <MaterialCommunityIcons
              name={section.icon as any}
              size={24}
              color={section.iconColor}
            />
          </View>
          <View className="flex-1">
            <Text className="text-xl font-bold" style={{ color: colors.text }}>
              {section.title}
            </Text>
            <Text className="text-sm text-gray-500 font-medium">
              {section.subtitle}
            </Text>
          </View>
        </View>

        {section.data.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              router.push(
                `/trainings/view-more?moreId=${section.id}&type=exercise`
              );
            }}
            className="flex-row items-center bg-blue-50 px-3 py-2 rounded-xl"
          >
            <Text className="text-blue-600 font-semibold text-sm mr-1">
              View More
            </Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={16}
              color="#2563eb"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <ActivityIndicator size="large" color="#16a34a" />
        <Text className="mt-4 text-gray-600">Loading content...</Text>
      </SafeAreaView>
    );
  }

  const exerciseSections = getExerciseContent();
  const timelineData = getTrainingTimelineData();

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle:
            activeTab === "Exercise" ? "Exercises" : "Training Sessions",
          headerBackground: () => <View className="bg-transparent" />,
          headerTitleStyle: {
            fontSize: 24,
            fontWeight: "bold",
          },
        }}
      />
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        {/* Header Section */}
        <View className="px-6 pt-4 pb-2">
          <Text
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            {activeTab === "Exercise"
              ? "Exercise Library"
              : "Training Timeline"}
          </Text>
          <Text className="text-gray-500 text-base mb-6">
            {activeTab === "Exercise"
              ? "Individual exercises to perfect your skills"
              : "Track your training journey through time"}
          </Text>

          {/* Premium User Status */}
          {activeTab === "Training" && (
            <View
              className={`mb-4 p-3 rounded-2xl ${isPremiumUser ? "bg-green-50" : "bg-yellow-50"}`}
            >
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name={isPremiumUser ? "crown" : "lock"}
                  size={20}
                  color={isPremiumUser ? "#16a34a" : "#f59e0b"}
                />
                <Text
                  className={`ml-2 font-semibold ${
                    isPremiumUser ? "text-green-700" : "text-yellow-700"
                  }`}
                >
                  {isPremiumUser ? "Premium Member" : "Upgrade to Premium"}
                </Text>
              </View>
              {!isPremiumUser && (
                <Text className="text-yellow-600 text-sm mt-1">
                  Unlock all training sessions with premium access
                </Text>
              )}
            </View>
          )}

          {/* Tabs */}
          <View className="flex-row mb-6">
            <TabButton
              tab="Training"
              isActive={activeTab === "Training"}
              onPress={() => setActiveTab("Training")}
            />
            <TabButton
              tab="Exercise"
              isActive={activeTab === "Exercise"}
              onPress={() => setActiveTab("Exercise")}
            />
          </View>

          {/* Search Bar */}
          <View className="relative mb-4">
            <View
              className="flex-row items-center rounded-2xl px-4 py-3"
              style={{
                backgroundColor: colors.card,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <MaterialCommunityIcons
                name="magnify"
                size={20}
                color="#9ca3af"
                style={{ marginRight: 12 }}
              />
              <TextInput
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholder={`Search ${activeTab.toLowerCase()}s...`}
                placeholderTextColor="#9ca3af"
                className="flex-1 text-base"
                style={{ color: colors.text }}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <MaterialCommunityIcons
                    name="close-circle"
                    size={20}
                    color="#9ca3af"
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>

        {/* Content */}
        <ScrollView className="px-6" showsVerticalScrollIndicator={false}>
          {activeTab === "Exercise" ? (
            // Exercise Tab - Horizontal Card Sections (Individual Exercises)
            exerciseSections.map((section) => {
              const filteredData = section.data.filter(
                (item: ExerciseInterface) =>
                  item.title.toLowerCase().includes(searchQuery.toLowerCase())
              );

              return (
                <View key={section.title} className="mb-8">
                  <SectionHeader section={section} />

                  {filteredData.length === 0 ? (
                    <View
                      className="py-12 px-6 rounded-3xl items-center"
                      style={{
                        backgroundColor: colors.card,
                        borderWidth: 2,
                        borderColor: "#e5e7eb",
                        borderStyle: "dashed",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="emoticon-sad-outline"
                        size={48}
                        color="#9ca3af"
                      />
                      <Text className="text-gray-500 text-center mt-3 text-base">
                        No exercises found.
                      </Text>
                      <Text className="text-gray-400 text-center text-sm mt-1">
                        Try adjusting your search terms.
                      </Text>
                    </View>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      <View className="flex-row">
                        {filteredData.map(
                          (item: ExerciseInterface, idx: number) => {
                            const cardStyle =
                              cardStyles[idx % cardStyles.length];
                            return (
                              <ExerciseCard
                                key={item.id}
                                item={item}
                                style={cardStyle}
                              />
                            );
                          }
                        )}
                      </View>
                    </ScrollView>
                  )}
                </View>
              );
            })
          ) : (
            // Training Tab - Vertical Timeline (Training Sessions)
            <View className="mb-8">
              {timelineData.length === 0 ? (
                <View
                  className="py-12 px-6 rounded-3xl items-center"
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 2,
                    borderColor: "#e5e7eb",
                    borderStyle: "dashed",
                  }}
                >
                  <MaterialCommunityIcons
                    name="timeline-clock-outline"
                    size={48}
                    color="#9ca3af"
                  />
                  <Text className="text-gray-500 text-center mt-3 text-base">
                    No training sessions found.
                  </Text>
                  <Text className="text-gray-400 text-center text-sm mt-1">
                    {searchQuery
                      ? "Try adjusting your search terms."
                      : "Training sessions will appear here."}
                  </Text>
                </View>
              ) : (
                timelineData.map((item, index) => (
                  <TimelineTrainingCard
                    key={item.id}
                    item={item}
                    index={index}
                    isLast={index === timelineData.length - 1}
                  />
                ))
              )}
            </View>
          )}

          {/* Bottom padding for better scrolling */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
