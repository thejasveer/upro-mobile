import { View } from "react-native";
import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";

import Training from "@/components/Training";
import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";
import DemoTraining from "@/components/DemoTraining";

export default function SingleTrainingScreen() {
  const { user } = useAuth();
  const { id } = useLocalSearchParams();
  const [start, setStart] = useState(false);
  const { training, getTraining } = useTrainings();

  useEffect(() => {
    getTraining(Number(id));
  }, []);

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: "minimal",
          headerTitle: training?.title || "Training",
          headerBackground: () => <View className="bg-transparent" />,
        }}
      />

      {!start ? (
        <DemoTraining start={start} training={training} setStart={setStart} />
      ) : (
        <Training id={id} training={training} />
      )}
    </>
  );
}
