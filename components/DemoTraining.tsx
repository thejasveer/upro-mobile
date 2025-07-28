import { TrainingInterface } from "@/app/(tabs)/trainings";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const DemoTraining = ({
  start,
  setStart,
  training,
  isExercise = false,
}: {
  training: TrainingInterface | null;
  start: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  isExercise?: boolean;
}) => {
  const router = useRouter();
  const { count, getTrainings, trainings, findIndex, currentIndex } =
    useTrainings();
  const { currentProfile } = useAuth();
  const [selectedVideo, setSelectedVideo] = useState<any>(null);

  useEffect(() => {
    getTrainings();
    if (training?.id) findIndex(training.id);
  }, [training?.id]);

  const { colors } = useTheme();

  const titleName = training?.title || "Training Session";
  const description = training?.description || "No description available.";
  const xp = training?.experience_reward || 50;
  const duration = training?.duration || 10; // Fixed field name
  const isPremium = training?.subscription_type_id === 2;
  const isPremiumUser = currentProfile?.subscription_type === 2;

  const nextT = () => {
    if (trainings && currentIndex < trainings.length - 1) {
      const nextTraining = trainings[currentIndex + 1];
      if (nextTraining) {
        router.replace(`/trainings/single/${nextTraining.id}`);
      }
    }
  };

  const previousT = () => {
    if (trainings && currentIndex > 0) {
      const prevTraining = trainings[currentIndex - 1];
      if (prevTraining) {
        router.replace(`/trainings/single/${prevTraining.id}`);
      }
    }
  };

  const renderDifficultyBadges = (difficulty: number) => {
    const badges = [];
    for (let i = 1; i <= 3; i++) {
      badges.push(
        <View
          key={i}
          className={`w-8 h-8 rounded-full items-center justify-center mx-1`}
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

  const extractYouTubeVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = match && match[2].length === 11 ? match[2] : null;
    console.log("🔗 Extracted YouTube video ID:", { url, videoId });
    return videoId;
  };

  const getYouTubeThumbnail = (videoId: string) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    console.log("🖼️ YouTube thumbnail URL:", thumbnailUrl);
    return thumbnailUrl;
  };

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
    setStart(true);
  };

  return (
    training && (
      <SafeAreaView
        className="flex-1"
        style={{ backgroundColor: colors.background }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Navigation Header */}
          <View className="flex-row items-center justify-between px-4 py-2">
            <TouchableOpacity
              onPress={previousT}
              disabled={currentIndex === 0}
              className={`p-3 rounded-2xl ${currentIndex === 0 ? "opacity-50" : ""}`}
              style={{ backgroundColor: colors.card }}
            >
              <MaterialCommunityIcons
                name="chevron-left"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>

            <View className="flex-1 mx-4">
              <Text className="text-center text-sm text-gray-500">
                {currentIndex + 1} of {count}
              </Text>
            </View>

            <TouchableOpacity
              onPress={nextT}
              disabled={currentIndex === count - 1}
              className={`p-3 rounded-2xl ${currentIndex === count - 1 ? "opacity-50" : ""}`}
              style={{ backgroundColor: colors.card }}
            >
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={colors.text}
              />
            </TouchableOpacity>
          </View>

          {/* Hero Section */}
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
            {/* Video Preview */}
            <View className="relative">
              <View className="w-full h-56 rounded-t-3xl overflow-hidden">
                {selectedVideo && selectedVideo.url ? (
                  <Image
                    source={{
                      uri: getYouTubeThumbnail(
                        extractYouTubeVideoId(selectedVideo.url) || ""
                      ),
                    }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    className="w-full h-full items-center justify-center"
                    style={{
                      backgroundColor: "#667eea",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="play-circle"
                      size={64}
                      color="white"
                    />
                    <Text className="text-white font-semibold mt-2">
                      Training Preview
                    </Text>
                  </View>
                )}
              </View>

              {/* Play Button Overlay */}
              <TouchableOpacity
                className="absolute inset-0 items-center justify-center"
                onPress={() => {
                  /* Handle video preview */
                }}
              >
                <View
                  className="w-16 h-16 rounded-full items-center justify-center"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.6)",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <MaterialCommunityIcons name="play" size={28} color="white" />
                </View>
              </TouchableOpacity>

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
            </View>

            {/* Session Details */}
            <View className="p-6" style={{ backgroundColor: colors.card }}>
              {/* Header Info */}
              <View className="flex-row items-start justify-between mb-4">
                <View className="flex-1 mr-4">
                  <Text
                    className="text-2xl font-bold mb-2"
                    style={{ color: colors.text }}
                  >
                    {titleName}
                  </Text>
                  <View className="flex-row items-center">
                    <View className="bg-blue-100 rounded-full px-3 py-1 mr-3">
                      <Text className="text-blue-700 font-semibold text-sm">
                        Training
                      </Text>
                    </View>
                    <View className="flex-row items-center">
                      <MaterialCommunityIcons
                        name="clock-outline"
                        size={16}
                        color="#6b7280"
                      />
                      <Text className="ml-1 text-gray-600 font-medium">
                        {duration} mins
                      </Text>
                    </View>
                  </View>
                </View>

                {/* XP Badge */}
                <View
                  className="bg-gradient-to-r from-green-400 to-green-600 rounded-2xl px-4 py-3 items-center"
                  style={{
                    backgroundColor: "#16a34a",
                    shadowColor: "#16a34a",
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 6,
                  }}
                >
                  <MaterialCommunityIcons name="star" size={20} color="white" />
                  <Text className="text-white font-bold text-lg">{xp}</Text>
                  <Text className="text-white/80 text-xs">XP</Text>
                </View>
              </View>

              {/* Description */}
              <View className="bg-gray-50 rounded-2xl p-4 mb-6">
                <Text className="text-gray-700 leading-6">{description}</Text>
              </View>

              {/* Difficulty & Stats */}
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

              {/* Training Stats */}
              <View className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4">
                <Text className="font-semibold text-gray-800 mb-3">
                  What You&apos;ll Learn
                </Text>
                <View className="space-y-2">
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color="#16a34a"
                    />
                    <Text className="ml-2 text-gray-600">
                      Improve ball control and technique
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color="#16a34a"
                    />
                    <Text className="ml-2 text-gray-600">
                      Build muscle memory and coordination
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    <MaterialCommunityIcons
                      name="check-circle"
                      size={16}
                      color="#16a34a"
                    />
                    <Text className="ml-2 text-gray-600">
                      Enhance tactical awareness
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Premium Access Notice */}
          {isPremium && !isPremiumUser && (
            <View className="mx-4 mt-4 bg-yellow-50 rounded-2xl p-4 border border-yellow-200">
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

          {/* Start Training Button */}
          <View className="p-4 mt-6">
            <TouchableOpacity
              className="py-5 rounded-2xl items-center flex-row justify-center"
              style={{
                backgroundColor:
                  isPremium && !isPremiumUser ? "#f59e0b" : "#16a34a",
                shadowColor:
                  isPremium && !isPremiumUser ? "#f59e0b" : "#16a34a",
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
                  : "Start Training"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Bottom Spacing */}
          <View className="h-8" />
        </ScrollView>
      </SafeAreaView>
    )
  );
};

export default DemoTraining;
