import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useExercises } from "@/hooks/useExercises";
import { useTrainings } from "@/hooks/useTrainings";
import { useVideos } from "@/hooks/useVideos";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function SingleTrainingScreen() {
  const { user, currentProfile } = useAuth();
  const { id, type } = useLocalSearchParams();
  const { training, getTraining, trainingExercises, getTrainingExercises } =
    useTrainings();
  const { exercise, getExercise } = useExercises();
  const { videos, getFirstVideo } = useVideos();
  const { colors } = useTheme();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  const isExercise = type === "exercise";
  const content = isExercise ? exercise : training;
  const isPremiumUser = currentProfile?.subscription_type === 2;

  useEffect(() => {
    if (isExercise) {
      getExercise(Number(id));
    } else {
      getTraining(Number(id));
      getTrainingExercises(Number(id)); // Fetch related exercises for training sessions
    }
  }, [id, type]);

  useEffect(() => {
    if (videos.length > 0) {
      const firstVideo = getFirstVideo();
      setSelectedVideo(firstVideo);
    }
  }, [videos]);

  if (!user) {
    return <AuthScreen />;
  }

  const extractYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  };

  const getYouTubeEmbedUrl = (videoId: string) => {
    return `https://www.youtube.com/embed/${videoId}?controls=1&modestbranding=1&rel=0&showinfo=0&autohide=1&playsinline=1&iv_load_policy=3&disablekb=1&color=white&theme=dark`;
  };

  const renderDifficultyBadges = (difficulty: number) => {
    const badges = [];
    for (let i = 1; i <= 3; i++) {
      badges.push(
        <View
          key={i}
          className="w-8 h-8 rounded-full items-center justify-center mx-1"
          style={{
            backgroundColor: i <= difficulty ? "#f59e0b" : "#e5e7eb",
            shadowColor: i <= difficulty ? "#f59e0b" : "transparent",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 4,
            elevation: i <= difficulty ? 4 : 0,
          }}
        >
          <MaterialCommunityIcons
            name={i <= difficulty ? "star" : "star-outline"}
            size={16}
            color={i <= difficulty ? "white" : "#9ca3af"}
          />
        </View>
      );
    }
    return badges;
  };

  // Generate content based on type
  const getContentBreakdown = () => {
    if (isExercise) {
      // For individual exercises, show simple session structure
      return [
        {
          name: "Warm-up",
          duration: "3min",
          xp: Math.floor((content?.experience_reward || 50) * 0.1),
          icon: "fire",
          color: "#ef4444",
          difficulty: undefined,
        },
        {
          name: content?.title || "Main Exercise",
          duration: `${content?.duration || 15}min`,
          xp: Math.floor((content?.experience_reward || 50) * 0.8),
          icon: "dumbbell",
          color: "#3b82f6",
          difficulty: undefined,
        },
        {
          name: "Cool Down",
          duration: "2min",
          xp: Math.floor((content?.experience_reward || 50) * 0.1),
          icon: "leaf",
          color: "#10b981",
          difficulty: undefined,
        },
      ];
    } else {
      // For training sessions, use actual exercises from the database
      if (trainingExercises && trainingExercises.length > 0) {
        return trainingExercises.map((exercise, index) => {
          const colors = [
            "#ef4444",
            "#3b82f6",
            "#10b981",
            "#f59e0b",
            "#8b5cf6",
          ];
          const icons = [
            "soccer",
            "target",
            "run-fast",
            "dumbbell",
            "strategy",
          ];

          return {
            name: exercise.title,
            duration: `${exercise.duration}min`,
            xp: exercise.experience_reward,
            icon: icons[index % icons.length],
            color: colors[index % colors.length],
            difficulty: exercise.difficulty,
          };
        });
      }

      // Fallback if no exercises loaded yet
      return [
        {
          name: "Loading exercises...",
          duration: "0min",
          xp: 0,
          icon: "loading",
          color: "#6b7280",
          difficulty: undefined,
        },
      ];
    }
  };

  const exercises = getContentBreakdown();
  const isPremium = !isExercise && training?.subscription_type_id === 2;

  const handleStartTraining = () => {
    if (isPremium && !isPremiumUser) {
      Alert.alert(
        "Premium Required",
        "This is a premium training session. Upgrade to access exclusive content!",
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

    // Navigate to actual training screen
    Alert.alert(
      "Start Training",
      `Ready to begin ${isExercise ? "this exercise" : "this training session"}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Let's Go!",
          onPress: () => {
            console.log(
              `Starting ${isExercise ? "exercise" : "training"}: ${content?.title}`
            );
            // Here you could navigate to an actual training interface
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: content?.title || (isExercise ? "Exercise" : "Training"),
          headerBackground: () => <View className="bg-transparent" />,
          headerTitleStyle: {
            fontSize: 20,
            fontWeight: "bold",
          },
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Hero Section with Gradient */}
          <View
            className="mx-4 mt-4 rounded-3xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.15,
              shadowRadius: 20,
              elevation: 10,
            }}
          >
            {/* Video Section */}
            <View className="relative">
              <View className="w-full h-56 rounded-t-3xl overflow-hidden">
                {selectedVideo && selectedVideo.url ? (
                  <WebView
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{
                      uri: getYouTubeEmbedUrl(
                        extractYouTubeVideoId(selectedVideo.url) || ""
                      ),
                    }}
                    allowsFullscreenVideo={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    scalesPageToFit={false}
                    scrollEnabled={false}
                    bounces={false}
                  />
                ) : (
                  <View
                    className="w-full h-full items-center justify-center"
                    style={{
                      backgroundColor: isExercise ? "#3b82f6" : "#667eea",
                    }}
                  >
                    <MaterialCommunityIcons
                      name={isExercise ? "dumbbell" : "play-circle"}
                      size={64}
                      color="white"
                    />
                    <Text className="text-white font-semibold mt-2">
                      {isExercise ? "Exercise Preview" : "Training Preview"}
                    </Text>
                  </View>
                )}
              </View>

              {/* Premium Badge */}
              {isPremium && (
                <View className="absolute top-4 right-4 bg-yellow-500 rounded-full px-3 py-1">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="crown"
                      size={16}
                      color="white"
                    />
                    <Text className="text-white font-bold text-xs ml-1">
                      PREMIUM
                    </Text>
                  </View>
                </View>
              )}

              {/* Floating Play Button Overlay */}
              <TouchableOpacity
                className="absolute bottom-4 right-4 bg-white/90 rounded-full p-3"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                }}
                onPress={() => console.log("Play video preview")}
              >
                <MaterialCommunityIcons name="play" size={20} color="#16a34a" />
              </TouchableOpacity>
            </View>

            {/* Session Info Card */}
            <View className="p-6" style={{ backgroundColor: colors.card }}>
              {/* Header Info */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1">
                  <Text
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.text }}
                  >
                    {content?.title ||
                      (isExercise ? "Exercise Session" : "Training Session")}
                  </Text>
                  <View className="flex-row items-center">
                    <View
                      className="rounded-full px-3 py-1 mr-3"
                      style={{
                        backgroundColor: isExercise ? "#dbeafe" : "#f0fdf4",
                      }}
                    >
                      <Text
                        className="font-semibold text-sm"
                        style={{
                          color: isExercise ? "#1d4ed8" : "#15803d",
                        }}
                      >
                        {isExercise ? "Exercise" : "Training"}
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text className="ml-1 text-gray-600 font-medium">
                        {content?.duration || 30} mins
                      </Text>
                    </View>
                  </View>
                </View>

                {/* XP Badge */}
                <View
                  className="rounded-2xl px-4 py-3 items-center"
                  style={{
                    backgroundColor: isPremium ? "#f59e0b" : "#16a34a",
                    shadowColor: isPremium ? "#f59e0b" : "#16a34a",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <MaterialCommunityIcons
                    name={isPremium ? "crown" : "star"}
                    size={20}
                    color="white"
                  />
                  <Text className="text-white font-bold text-lg">
                    {content?.experience_reward || 100}
                  </Text>
                  <Text className="text-white/80 text-xs">Total XP</Text>
                </View>
              </View>

              {/* Description */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <Text className="text-gray-700 leading-6">
                  {content?.description ||
                    `Complete this ${isExercise ? "exercise" : "training session"} to improve your soccer skills and earn valuable experience points.`}
                </Text>
              </View>

              {/* Difficulty Indicator */}
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    Difficulty Level
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {isExercise
                      ? exercise?.difficulty === "easy"
                        ? "Beginner"
                        : exercise?.difficulty === "medium"
                          ? "Intermediate"
                          : "Advanced"
                      : "Intermediate"}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  {renderDifficultyBadges(
                    isExercise
                      ? exercise?.difficulty === "easy"
                        ? 1
                        : exercise?.difficulty === "medium"
                          ? 2
                          : 3
                      : 2
                  )}
                </View>
              </View>
            </View>
          </View>

          {!isExercise && (
            <View className="mx-4 mt-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text
                  className="text-xl font-bold"
                  style={{ color: colors.text }}
                >
                  Training Exercises
                </Text>
                <View className="bg-blue-50 rounded-full px-3 py-1">
                  <Text className="text-blue-600 font-semibold text-sm">
                    {exercises.length} {"Exercises"}
                  </Text>
                </View>
              </View>

              {exercises.map((exerciseItem, index) => (
                <View
                  key={index}
                  className="rounded-2xl p-4 mb-3 flex-row items-center"
                  style={{
                    backgroundColor: colors.card,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.05,
                    shadowRadius: 10,
                    elevation: 3,
                  }}
                >
                  {/* Exercise Icon */}
                  <View
                    className="w-12 h-12 rounded-2xl items-center justify-center mr-4"
                    style={{ backgroundColor: `${exerciseItem.color}15` }}
                  >
                    <MaterialCommunityIcons
                      name={exerciseItem.icon as any}
                      size={24}
                      color={exerciseItem.color}
                    />
                  </View>

                  {/* Exercise Info */}
                  <View className="flex-1">
                    <Text className="font-semibold text-gray-800 text-base mb-1">
                      {exerciseItem.name}
                    </Text>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={14}
                        color="#6b7280"
                      />
                      <Text className="text-gray-500 text-sm ml-1">
                        {exerciseItem.duration}
                      </Text>

                      {/* Show difficulty for training session exercises */}
                      {!isExercise && exerciseItem.difficulty && (
                        <>
                          <View className="w-1 h-1 bg-gray-400 rounded-full mx-2" />
                          <Text className="text-gray-500 text-sm capitalize">
                            {exerciseItem.difficulty}
                          </Text>
                        </>
                      )}
                    </View>
                  </View>

                  {/* XP Badge */}
                  <View className="bg-green-50 rounded-xl px-3 py-2">
                    <Text className="text-green-600 font-bold text-sm">
                      +{exerciseItem.xp}
                    </Text>
                    <Text className="text-green-500 text-xs">XP</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Premium Access Notice */}
          {isPremium && !isPremiumUser && (
            <View className="mx-4 mt-6 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
              <View className="flex-row items-center mb-2">
                <MaterialCommunityIcons name="lock" size={20} color="#f59e0b" />
                <Text className="ml-2 font-semibold text-yellow-800">
                  Premium Content
                </Text>
              </View>
              <Text className="text-yellow-700 text-sm">
                This training session requires a premium subscription to access.
              </Text>
            </View>
          )}

          {/* Progress Stats */}
          <View className="mx-4 mt-6">
            <View
              className="rounded-2xl p-6"
              style={{
                backgroundColor: isExercise ? "#3b82f6" : "#16a34a",
                shadowColor: isExercise ? "#3b82f6" : "#16a34a",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
            >
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-white text-lg font-bold">
                  Your Progress
                </Text>
                <MaterialCommunityIcons
                  name={isExercise ? "dumbbell" : "trophy"}
                  size={24}
                  color="white"
                />
              </View>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-white/80 text-sm">Streak</Text>
                  <Text className="text-white text-2xl font-bold">
                    {currentProfile?.experience_total
                      ? Math.floor(currentProfile.experience_total / 100)
                      : 7}
                  </Text>
                  <Text className="text-white/60 text-xs">sessions</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/80 text-sm">This Week</Text>
                  <Text className="text-white text-2xl font-bold">5</Text>
                  <Text className="text-white/60 text-xs">completed</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/80 text-sm">Total XP</Text>
                  <Text className="text-white text-2xl font-bold">
                    {currentProfile?.experience_total
                      ? `${(currentProfile.experience_total / 1000).toFixed(1)}K`
                      : "2.4K"}
                  </Text>
                  <Text className="text-white/60 text-xs">earned</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start Training Button */}
          <View className="p-4 mt-6">
            <TouchableOpacity
              className="py-5 rounded-2xl items-center flex-row justify-center"
              style={{
                backgroundColor:
                  isPremium && !isPremiumUser
                    ? "#f59e0b"
                    : isExercise
                      ? "#3b82f6"
                      : "#16a34a",
                shadowColor:
                  isPremium && !isPremiumUser
                    ? "#f59e0b"
                    : isExercise
                      ? "#3b82f6"
                      : "#16a34a",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
              onPress={handleStartTraining}
            >
              <MaterialCommunityIcons
                name={isPremium && !isPremiumUser ? "crown" : "play-circle"}
                size={24}
                color="white"
              />
              <Text className="text-white font-bold text-lg ml-2">
                {isPremium && !isPremiumUser
                  ? "Upgrade to Start"
                  : isExercise
                    ? "Start Exercise"
                    : "Start Training"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
