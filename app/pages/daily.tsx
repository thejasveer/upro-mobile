import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { WebView } from "react-native-webview";
import { Image, SafeAreaView, ScrollView, Text, TouchableOpacity, View } from "react-native";

import { useVideos } from "@/hooks/useVideos";
import { useTheme } from "@react-navigation/native";
import { IconSymbol } from "@/components/ui/IconSymbol";

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

    const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
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
        <View key={i} className={`w-8 h-8 rounded-full items-center justify-center ${i <= difficulty ? "bg-green-500" : "bg-gray-300"}`}>
          <IconSymbol name="star.fill" size={16} color="white" />
        </View>
      );
    }
    return badges;
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Daily",
          headerBackground: () => <View className="bg-transparent" />,
        }}
      />

      <SafeAreaView className="flex-1" style={{ backgroundColor: colors.background }}>
        <ScrollView className="flex-1">
          {/* Main Content Card */}
          <View className="m-4 rounded-lg shadow-sm" style={{ backgroundColor: colors.card }}>
            {/* Video Preview */}
            <View className="relative">
              <View className="w-full h-48 bg-gray-200 rounded-t-lg overflow-hidden">
                {selectedVideo && selectedVideo.url ? (
                  <WebView
                    style={{ flex: 1 }}
                    javaScriptEnabled={true}
                    domStorageEnabled={true}
                    source={{ uri: getYouTubeEmbedUrl(extractYouTubeVideoId(selectedVideo.url) || "") }}
                    allowsFullscreenVideo={true}
                    mediaPlaybackRequiresUserAction={false}
                    allowsInlineMediaPlayback={true}
                    scalesPageToFit={false}
                    scrollEnabled={false}
                    bounces={false}
                  />
                ) : (
                  <Image source={require("@/assets/images/logo.png")} className="w-full h-full rounded-t-lg" resizeMode="cover" />
                )}
              </View>
            </View>

            {/* Session Details */}
            <View className="p-4">
              <View className="flex-row items-center justify-between mb-4">
                <View className="flex-1">
                  <Text className="text-2xl font-bold text-gray-800 mb-2">{selectedVideo?.name || "Warmup"}</Text>
                  <View className="flex-row items-center">
                    <IconSymbol name="house.fill" size={16} color="#6b7280" />
                    <Text className="ml-2" style={{ color: colors.text }}>
                      45 mins
                    </Text>
                  </View>
                </View>
                <View className="items-end">
                  <Text className="text-sm" style={{ color: colors.text }}>
                    Total XP
                  </Text>
                  <Text className="text-xl font-bold" style={{ color: colors.primary }}>
                    500
                  </Text>
                </View>
              </View>

              {/* Description */}
              <Text className="mb-6 leading-5" style={{ color: colors.text }}>
                {selectedVideo?.description ||
                  "Football, also called association football or soccer, is a game involving two teams of 11 players who try to maneuver the ball into the other team's goal without using their hands or arms."}
              </Text>

              {/* Exercise Breakdown */}
              <View className="mb-6">
                <Text className="text-lg font-semibold text-gray-800 mb-3">Exercises</Text>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <Text className="flex-1" style={{ color: colors.text }}>
                    Push ups
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="mr-4" style={{ color: colors.text }}>
                      15mins
                    </Text>
                    <Text className="font-medium" style={{ color: colors.primary }}>
                      50xp
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <Text className="flex-1" style={{ color: colors.text }}>
                    Pull ups
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="mr-4" style={{ color: colors.text }}>
                      15mins
                    </Text>
                    <Text className="font-medium" style={{ color: colors.primary }}>
                      50xp
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                  <Text className="flex-1" style={{ color: colors.text }}>
                    Dribbles
                  </Text>
                  <View className="flex-row items-center">
                    <Text className="mr-4" style={{ color: colors.text }}>
                      15mins
                    </Text>
                    <Text className="font-medium" style={{ color: colors.primary }}>
                      50xp
                    </Text>
                  </View>
                </View>
              </View>

              {/* Difficulty Indicator */}
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600">Difficulty</Text>
                <View className="flex-row space-x-2">{renderDifficultyBadges(2)}</View>
              </View>
            </View>
          </View>

          {/* Start Training Button */}
          <View className="p-4">
            <TouchableOpacity
              className="bg-green-500 py-4 rounded-lg items-center"
              onPress={() => {
                console.log("Start daily training");
              }}
            >
              <Text className="text-white font-semibold text-lg">Start Training</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
