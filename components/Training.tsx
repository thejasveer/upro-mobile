import { TrainingInterface } from "@/app/(tabs)/trainings";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useTheme } from "@react-navigation/native";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width, height } = Dimensions.get("window");

const Training = ({
  id,
  training,
  isExercise = false,
}: {
  training: TrainingInterface | null;
  id: any;
  isExercise?: boolean;
}) => {
  const [buttonState, setButtonState] = useState<"play" | "pause" | "stop">(
    "play"
  );
  const [timeRemaining, setTimeRemaining] = useState(
    training?.duration ? training.duration * 60 : 900
  ); // Convert minutes to seconds
  const [currentXP, setCurrentXP] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const { colors } = useTheme();

  const totalDuration = training?.duration ? training.duration * 60 : 900;
  const totalXP = training?.experience_reward || 500;

  const exercises = [
    { name: "Warm-up", duration: "3 min", completed: false },
    { name: "Ball Control", duration: "5 min", completed: false },
    { name: "Dribbling", duration: "4 min", completed: false },
    { name: "Shooting", duration: "3 min", completed: false },
  ];

  // Timer logic
  useEffect(() => {
    let interval: number | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((time) => {
          const newTime = time - 1;
          // Update XP based on progress
          const progress = (totalDuration - newTime) / totalDuration;
          setCurrentXP(Math.floor(totalXP * progress));
          return newTime;
        });
      }, 1000);
    } else if (timeRemaining === 0) {
      // Training completed
      setButtonState("stop");
      setIsActive(false);
      Alert.alert(
        "Training Complete! 🎉",
        `Congratulations! You've earned ${totalXP} XP`,
        [
          {
            text: "Continue",
            onPress: () => router.back(),
          },
        ]
      );
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeRemaining, totalDuration, totalXP]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getProgress = () => {
    return ((totalDuration - timeRemaining) / totalDuration) * 100;
  };

  const handlePlayPause = () => {
    if (buttonState === "play") {
      setButtonState("pause");
      setIsActive(true);
    } else if (buttonState === "pause") {
      setButtonState("play");
      setIsActive(false);
    }
  };

  const handleStop = () => {
    setButtonState("play");
    setIsActive(false);
    setTimeRemaining(totalDuration);
    setCurrentXP(0);
    Alert.alert(
      "Stop Training?",
      "Are you sure you want to stop the training session?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Stop",
          style: "destructive",
          onPress: () => router.back(),
        },
      ]
    );
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      {/* Header Stats */}
      <View className="flex-row px-6 py-4 space-x-4">
        {/* Timer Card */}
        <View
          className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-4"
          style={{
            backgroundColor: "#3b82f6",
            shadowColor: "#3b82f6",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View className="flex-row items-center mb-1">
            <MaterialCommunityIcons
              name="clock-outline"
              size={16}
              color="white"
            />
            <Text className="text-white/80 text-sm ml-1">Time Remaining</Text>
          </View>
          <Text className="text-white text-2xl font-bold">
            {formatTime(timeRemaining)}
          </Text>
        </View>

        {/* XP Card */}
        <View
          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4"
          style={{
            backgroundColor: "#16a34a",
            shadowColor: "#16a34a",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View className="flex-row items-center mb-1">
            <MaterialCommunityIcons name="star" size={16} color="white" />
            <Text className="text-white/80 text-sm ml-1">XP Earned</Text>
          </View>
          <Text className="text-white text-2xl font-bold">{currentXP}</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View className="px-6 mb-6">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-gray-600 font-medium">Training Progress</Text>
          <Text className="text-gray-600 font-medium">
            {Math.round(getProgress())}%
          </Text>
        </View>
        <View className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <View
            className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
            style={{
              width: `${getProgress()}%`,
              backgroundColor: "#16a34a",
            }}
          />
        </View>
      </View>

      {/* Main Training View */}
      <View className="flex-1 mx-6">
        <View
          className="flex-1 rounded-3xl overflow-hidden"
          style={{
            backgroundColor: colors.card,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 10,
          }}
        >
          {/* Training Header */}
          <View
            className="p-6 bg-gradient-to-r from-purple-500 to-purple-600"
            style={{ backgroundColor: "#8b5cf6" }}
          >
            <Text className="text-white text-xl font-bold mb-2">
              {training?.title || "Training Session"}
            </Text>
            <Text className="text-white/80">
              Follow along with the exercises below
            </Text>
          </View>

          {/* Exercise List */}
          <View className="flex-1 p-6">
            <Text
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              Current Exercise
            </Text>

            {exercises.map((exercise, index) => (
              <View
                key={index}
                className={`p-4 rounded-2xl mb-3 ${index === currentExercise ? "border-2" : ""}`}
                style={{
                  backgroundColor:
                    index === currentExercise ? "#f0fdf4" : colors.card,
                  borderColor:
                    index === currentExercise ? "#16a34a" : "transparent",
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 8,
                  elevation: 2,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center flex-1">
                    <View
                      className="w-10 h-10 rounded-full items-center justify-center mr-3"
                      style={{
                        backgroundColor:
                          index <= currentExercise ? "#16a34a" : "#e5e7eb",
                      }}
                    >
                      {index < currentExercise ? (
                        <MaterialCommunityIcons
                          name="check"
                          size={20}
                          color="white"
                        />
                      ) : (
                        <Text className="text-white font-bold">
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <View className="flex-1">
                      <Text
                        className="font-semibold"
                        style={{
                          color:
                            index === currentExercise ? "#16a34a" : colors.text,
                        }}
                      >
                        {exercise.name}
                      </Text>
                      <Text className="text-gray-500 text-sm">
                        {exercise.duration}
                      </Text>
                    </View>
                  </View>
                  {index === currentExercise && (
                    <View className="bg-green-100 rounded-full px-3 py-1">
                      <Text className="text-green-700 font-semibold text-xs">
                        ACTIVE
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ))}

            {/* Motivational Message */}
            <View className="bg-blue-50 rounded-2xl p-4 mt-4">
              <View className="flex-row items-center">
                <MaterialCommunityIcons
                  name="lightning-bolt"
                  size={20}
                  color="#3b82f6"
                />
                <Text className="ml-2 font-semibold text-blue-800">
                  Keep it up!
                </Text>
              </View>
              <Text className="text-blue-700 text-sm mt-1">
                You&apos;re doing great! Stay focused and maintain good form.
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Control Buttons */}
      <View className="px-6 py-4">
        <View className="flex-row space-x-4">
          {/* Play/Pause Button */}
          <TouchableOpacity
            className="flex-1 py-4 rounded-2xl items-center flex-row justify-center"
            style={{
              backgroundColor: buttonState === "play" ? "#16a34a" : "#f59e0b",
              shadowColor: buttonState === "play" ? "#16a34a" : "#f59e0b",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handlePlayPause}
          >
            <MaterialCommunityIcons
              name={buttonState === "play" ? "play" : "pause"}
              size={24}
              color="white"
            />
            <Text className="text-white font-bold text-lg ml-2">
              {buttonState === "play" ? "Start" : "Pause"}
            </Text>
          </TouchableOpacity>

          {/* Stop Button */}
          <TouchableOpacity
            className="py-4 px-6 rounded-2xl items-center"
            style={{
              backgroundColor: "#ef4444",
              shadowColor: "#ef4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
            onPress={handleStop}
          >
            <MaterialCommunityIcons name="stop" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Training;
