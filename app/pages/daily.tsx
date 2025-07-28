import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import { useVideos } from "@/hooks/useVideos";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";

const { width } = Dimensions.get("window");

export default function DailyTraining() {
  const { colors } = useTheme();
  const { videos, loading, getFirstVideo } = useVideos();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    console.log("📱 Daily Training - videos state:", videos);
    console.log("📱 Daily Training - loading state:", loading);

    if (videos.length > 0) {
      const firstVideo = getFirstVideo();
      console.log("📱 Daily Training - setting selected video:", firstVideo);
      setSelectedVideo(firstVideo);
    }
  }, [videos, loading]);

  const extractYouTubeVideoId = (url: string) => {
    if (!url) return null;

    const regex =
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
    const match = url.match(regex);
    const videoId = match ? match[1] : null;

    console.log("🔗 Extracted YouTube video ID:", { url, videoId });
    return videoId;
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
          className={`w-8 h-8 rounded-full items-center justify-center mx-1 ${
            i <= difficulty
              ? "bg-gradient-to-r from-yellow-400 to-orange-500"
              : "bg-gray-200"
          }`}
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

  const exercises = [
    {
      name: "Dynamic Warm-up",
      duration: "10mins",
      xp: 75,
      icon: "fire",
      color: "#ef4444",
    },
    {
      name: "Ball Control Drills",
      duration: "15mins",
      xp: 125,
      icon: "soccer",
      color: "#3b82f6",
    },
    {
      name: "Agility Training",
      duration: "12mins",
      xp: 100,
      icon: "run-fast",
      color: "#10b981",
    },
    {
      name: "Shooting Practice",
      duration: "8mins",
      xp: 200,
      icon: "target",
      color: "#f59e0b",
    },
  ];

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Daily Challenge",
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
            {/* Gradient Background */}
            <View
              className="absolute inset-0 rounded-3xl"
              style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                backgroundColor: "#667eea", // Fallback for React Native
              }}
            />

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
                  <View className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 items-center justify-center">
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={64}
                      color="white"
                    />
                    <Text className="text-white font-semibold mt-2">
                      No video available
                    </Text>
                  </View>
                )}
              </View>

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
                    {selectedVideo?.name || "Daily Soccer Challenge"}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="bg-green-100 rounded-full px-3 py-1 mr-3">
                      <Text className="text-green-700 font-semibold text-sm">
                        Today
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text className="ml-1 text-gray-600 font-medium">
                        45 mins
                      </Text>
                    </View>
                  </View>
                </View>

                {/* XP Badge */}
                <View
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl px-4 py-3 items-center"
                  style={{
                    backgroundColor: "#f59e0b",
                    shadowColor: "#f59e0b",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <MaterialCommunityIcons name="star" size={20} color="white" />
                  <Text className="text-white font-bold text-lg">500</Text>
                  <Text className="text-white/80 text-xs">Total XP</Text>
                </View>
              </View>

              {/* Description */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <Text className="text-gray-700 leading-6">
                  {selectedVideo?.description ||
                    "Complete today's soccer training challenge! This session includes dynamic warm-ups, ball control drills, agility training, and shooting practice to improve your overall game."}
                </Text>
              </View>

              {/* Difficulty Indicator */}
              <View className="flex-row items-center justify-between mb-6">
                <View>
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    Difficulty Level
                  </Text>
                  <Text className="text-gray-500 text-sm">Intermediate</Text>
                </View>
                <View className="flex-row items-center">
                  {renderDifficultyBadges(2)}
                </View>
              </View>
            </View>
          </View>

          {/* Exercise Breakdown */}
          <View className="mx-4 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text
                className="text-xl font-bold"
                style={{ color: colors.text }}
              >
                Exercise Breakdown
              </Text>
              <View className="bg-blue-50 rounded-full px-3 py-1">
                <Text className="text-blue-600 font-semibold text-sm">
                  4 Exercises
                </Text>
              </View>
            </View>

            {exercises.map((exercise, index) => (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 mb-3 flex-row items-center"
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
                  style={{ backgroundColor: `${exercise.color}15` }}
                >
                  <MaterialCommunityIcons
                    name={exercise.icon as any}
                    size={24}
                    color={exercise.color}
                  />
                </View>

                {/* Exercise Info */}
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800 text-base mb-1">
                    {exercise.name}
                  </Text>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="clock-outline"
                      size={14}
                      color="#6b7280"
                    />
                    <Text className="text-gray-500 text-sm ml-1">
                      {exercise.duration}
                    </Text>
                  </View>
                </View>

                {/* XP Badge */}
                <View className="bg-green-50 rounded-xl px-3 py-2">
                  <Text className="text-green-600 font-bold text-sm">
                    +{exercise.xp}
                  </Text>
                  <Text className="text-green-500 text-xs">XP</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Progress Stats */}
          <View className="mx-4 mt-6">
            <View
              className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6"
              style={{
                backgroundColor: "#16a34a",
                shadowColor: "#16a34a",
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
                <MaterialCommunityIcons name="trophy" size={24} color="white" />
              </View>

              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-white/80 text-sm">Streak</Text>
                  <Text className="text-white text-2xl font-bold">7</Text>
                  <Text className="text-white/60 text-xs">days</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/80 text-sm">This Week</Text>
                  <Text className="text-white text-2xl font-bold">5</Text>
                  <Text className="text-white/60 text-xs">sessions</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white/80 text-sm">Total XP</Text>
                  <Text className="text-white text-2xl font-bold">2.4K</Text>
                  <Text className="text-white/60 text-xs">earned</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Start Training Button */}
          <View className="p-4 mt-6">
            <TouchableOpacity
              className="bg-gradient-to-r from-blue-500 to-purple-600 py-5 rounded-2xl items-center flex-row justify-center"
              style={{
                backgroundColor: "#3b82f6",
                shadowColor: "#3b82f6",
                shadowOffset: { width: 0, height: 8 },
                shadowOpacity: 0.3,
                shadowRadius: 16,
                elevation: 8,
              }}
              onPress={() => {
                console.log("Start daily training");
              }}
            >
              <MaterialCommunityIcons
                name="play-circle"
                size={24}
                color="white"
              />
              <Text className="text-white font-bold text-lg ml-2">
                Start Daily Challenge
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
