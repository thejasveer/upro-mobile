import { TrainingInterface } from "@/app/(tabs)/trainings";
import { useState } from "react";
import { SafeAreaView, Text, View } from "react-native";
import Button from "./Button";

const Training = ({
  id,
  training,
}: {
  training: TrainingInterface | null;
  id: any;
}) => {
  const [buttonState, setButtonState] = useState<String>("play");
  return (
    <SafeAreaView>
      <View className="text-black p-5  flex flex-row gap-5">
        <InfoText styles={"bg-green-500 rounded-md p-5"}>15 Min Timer</InfoText>
        <InfoText styles={"bg-red-500 rounded-md p-5"}>
          Live xp collected
        </InfoText>
      </View>

      <Preview feedback={training?.title ?? null} />
      
      <View className="mt-2 px-5 flex flex-row justify-center w-full items-center ">
        <View className="w-1/2    ">
          <Button
            styles={" bg-green-500 rounded-full p-5"}
            text={buttonState}
            loading={false}
            onPress={() => {}}
          ></Button>
        </View>
      </View>
    </SafeAreaView>
  );
};
export const InfoText = ({
  children,
  styles,
}: {
  styles: string;
  children: React.ReactNode;
}) => {
  return <Text className={styles}>{children}</Text>;
};
export const Preview = ({ feedback }: { feedback: string | null }) => {
  return (
    <View className="h-2/3 bg-blue-300 w-full relative rounded-lg ">
      <Text className="absolute top-2 left-5 bg-yellow-200 p-2 rounded-md">
        {feedback}
      </Text>
    </View>
  );
};

export default Training;
