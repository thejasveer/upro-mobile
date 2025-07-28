import { TrainingInterface } from "@/app/(tabs)/trainings";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image, SafeAreaView, ScrollView,
  Text,
  TouchableOpacity, View
} from "react-native";

const DemoTraining = ({
  start,
  setStart,
  training,
}: {
  training: TrainingInterface | null;
  start: boolean;
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
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

  const titleName = training?.title || "Training Session";
  const description = training?.description || "No description available.";
  const xp = training?.experience_reward || 50;
  const duration = training?.duration_minutes || 10;

  const nextT = () => {
    if (trainings && currentIndex < trainings.length - 1) {
      const nextTraining = trainings[currentIndex + 1];
      if (nextTraining) {
        router.replace(`/trainings/${nextTraining.id}`);
      }
    }
  };

  const previousT = () => {
    if (trainings && currentIndex > 0) {
      const prevTraining = trainings[currentIndex - 1];
      if (prevTraining) {
        router.replace(`/trainings/${prevTraining.id}`);
      }
    }
  };

  const renderDifficultyBadges = (difficulty: number) => {
    const badges = [];
    for (let i = 1; i <= 3; i++) {
      badges.push(
        <View
          key={i}
          className={`w-8 h-8 rounded-full items-center justify-center ${
            i <= difficulty ? 'bg-green-500' : 'bg-gray-300'
          }`}
        >
          <IconSymbol
            name="star.fill"
            size={16}
            color="white"
          />
        </View>
      );
    }
    return badges;
  };


  const extractYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    console.log("🔗 Extracted YouTube video ID:", { url, videoId });
    return videoId;
  };

  const getYouTubeThumbnail = (videoId: string) => {
    const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    console.log("🖼️ YouTube thumbnail URL:", thumbnailUrl);
    return thumbnailUrl;
  };

  return (
    training && (
    <SafeAreaView className="flex-1 bg-gray-100">
      <ScrollView className="flex-1">
        {/* Main Content Card */}
        <View className="m-4 bg-white rounded-lg shadow-sm">
          {/* Video Preview */}
          <View className="relative">
            <View className="w-full h-48 bg-gray-200 rounded-t-lg items-center justify-center">
              {selectedVideo && selectedVideo.url ? (
                <Image
                  source={{ 
                    uri: getYouTubeThumbnail(extractYouTubeVideoId(selectedVideo.url) || '') 
                  }}
                  className="w-full h-full rounded-t-lg"
                  resizeMode="cover"
                />
              ) : (
                <Image
                  source={require("@/assets/images/logo.png")}
                  className="w-full h-full rounded-t-lg"
                  resizeMode="cover"
                />
              )}
              <View className="absolute inset-0 items-center justify-center">
                <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center">
                  <IconSymbol name="paperplane.fill" size={24} color="white" />
                </View>
              </View>
            </View>
          </View>

          {/* Session Details */}
          <View className="p-4">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-800 mb-2">
                  {titleName}
                </Text>
                <View className="flex-row items-center">
                  <IconSymbol name="clock" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">
                    {duration} mins
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm text-gray-600">Total XP</Text>
                <Text className="text-xl font-bold text-green-600">
                  {xp} 
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-gray-700 mb-6 leading-5">
              {description}
            </Text>

            {/* Difficulty Indicator */}
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Difficulty</Text>
              <View className="flex-row space-x-2">
                {renderDifficultyBadges(2)}
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
            <Text className="text-white font-semibold text-lg">
              Start Training
            </Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    )
  );
};

export default DemoTraining;
