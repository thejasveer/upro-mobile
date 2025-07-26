import { SafeAreaView, View } from "react-native";
import Button from "./Button";
import IconButton from "./Icon";
import { InfoText, Preview } from "./Training";
import { router } from "expo-router";

const DemoTraining = ({
  start,
  setStart,
}: {
  start: Boolean;
  setStart: any;
}) => {
  return (
    <SafeAreaView>
      <View className="text-black p-5  flex flex-row gap-5">
        <InfoText styles={"bg-green-500 rounded-md p-5"}>
          Child streak count : 222
        </InfoText>
      </View>
      <Preview feedback={"Workout Name"} />
      <View className="mt-2 px-5 flex flex-row justify-center w-full items-center ">
        <View className="w-full flex flex-row items-center justify-around  ">
          <IconButton
            icon={"chevron.left"}
            onPress={() => {
              router.push("");
            }}
          ></IconButton>
          <Button
            styles={" bg-green-500 rounded-full w-1/2  p-5"}
            text={"Start"}
            loading={false}
            onPress={() => {
              setStart(!start);
            }}
          ></Button>
          <IconButton icon={"chevron.right"} onPress={() => {}}></IconButton>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default DemoTraining;
