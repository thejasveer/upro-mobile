import { IconSymbol } from "@/components/ui/IconSymbol";
import { useRouter } from "expo-router";
import {
    Image,
    SafeAreaView,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function DailyTraining() {
  const router = useRouter();

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

  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-white">
        <TouchableOpacity onPress={() => router.back()}>
          <IconSymbol name="chevron.right" size={24} color="#0d9447" />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-gray-800">Daily</Text>
        <View className="w-6" />
      </View>

      <ScrollView className="flex-1">
        {/* Main Content Card */}
        <View className="m-4 bg-white rounded-lg shadow-sm">
          {/* Video Preview */}
          <View className="relative">
            <View className="w-full h-48 bg-gray-200 rounded-t-lg items-center justify-center">
              <Image
                source={require("@/assets/images/logo.png")}
                className="w-full h-full rounded-t-lg"
                resizeMode="cover"
              />
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
                  Warmup
                </Text>
                <View className="flex-row items-center">
                  <IconSymbol name="house.fill" size={16} color="#6b7280" />
                  <Text className="ml-2 text-gray-600">
                    45 mins
                  </Text>
                </View>
              </View>
              <View className="items-end">
                <Text className="text-sm text-gray-600">Total XP</Text>
                <Text className="text-xl font-bold text-green-600">
                  500
                </Text>
              </View>
            </View>

            {/* Description */}
            <Text className="text-gray-700 mb-6 leading-5">
              Football, also called association football or soccer, is a game involving two teams of 11 players who try to maneuver the ball into the other team's goal without using their hands or arms.
            </Text>

            {/* Exercise Breakdown */}
            <View className="mb-6">
              <Text className="text-lg font-semibold text-gray-800 mb-3">
                Exercises
              </Text>
              <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-800 flex-1">Push ups</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-4">15mins</Text>
                  <Text className="text-green-600 font-medium">50xp</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-800 flex-1">Pull ups</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-4">15mins</Text>
                  <Text className="text-green-600 font-medium">50xp</Text>
                </View>
              </View>
              <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                <Text className="text-gray-800 flex-1">Dribbles</Text>
                <View className="flex-row items-center">
                  <Text className="text-gray-600 mr-4">15mins</Text>
                  <Text className="text-green-600 font-medium">50xp</Text>
                </View>
              </View>
            </View>

            {/* Difficulty Indicator */}
            <View className="flex-row items-center justify-between">
              <Text className="text-gray-600">Difficulty</Text>
              <View className="flex-row space-x-2">
                {renderDifficultyBadges(2)}
              </View>
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
      </ScrollView>
    </SafeAreaView>
  );
} 