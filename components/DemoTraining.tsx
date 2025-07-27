import { TrainingInterface } from "@/app/(tabs)/trainings";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { SafeAreaView, View } from "react-native";
import Button from "./Button";
import IconButton from "./Icon";
import { InfoText, Preview } from "./Training";

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
  useEffect(() => {
    getTrainings();
    if (training?.id) findIndex(training.id);
  }, [training?.id]);

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

  return (
    training && (
      <SafeAreaView>
        <View className="text-black p-5 flex flex-row gap-5">
          <InfoText styles="text-[#0d9447] font-semibold  text-xl rounded-md p-5">
            Child streak : 222
          </InfoText>
        </View>

        <Preview feedback={training.title} />

        <View className="mt-2 px-5 flex flex-row justify-center w-full items-center">
          <View className="w-full flex flex-row items-center justify-around">
            <IconButton icon="chevron.left" onPress={previousT} />
            {currentProfile?.subscription_type ===
              training.subscription_type_id ||
            currentProfile?.subscription_type == 2 ? (
              <Button
                styles="bg-green-500 rounded-full w-1/2 p-5"
                text="Start"
                loading={false}
                onPress={() => setStart(!start)}
              />
            ) : (
              <Button
                styles="bg-green-500 rounded-full w-1/2 p-5"
                text="Subscribe to Start"
                loading={false}
                onPress={() => {
                  // Handle subscription logic here
                  console.log("Subscribe to start training");
                }}
              />
            )}
            <IconButton icon="chevron.right" onPress={nextT} />
          </View>
        </View>
      </SafeAreaView>
    )
  );
};

export default DemoTraining;
