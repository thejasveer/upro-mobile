import AuthScreen from "@/components/AuthScreen";
import DemoTraining from "@/components/DemoTraining";
import Training from "@/components/Training";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

export default function TrainingScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [start, setStart] = useState(false);
  const { training, getTraining } = useTrainings();

  useEffect(() => {
    getTraining(Number(id));
  }, []);

  if (!user) {
    return <AuthScreen />;
  }
  console.log(training);
  return !start ? (
    <DemoTraining start={start} training={training} setStart={setStart} />
  ) : (
    <Training id={id} training={training} />
  );
}
