import AuthScreen from "@/components/AuthScreen";
import DemoTraining from "@/components/DemoTraining";
import Training from "@/components/Training";
import { useAuth } from "@/contexts/AuthContext";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";

export default function TrainingScreen() {
  const { id, title } = useLocalSearchParams();
  const { user } = useAuth();
  const [start, setStart] = useState(false);

  if (!user) {
    return <AuthScreen />;
  }

  return !start ? (
    <DemoTraining start={start} setStart={setStart} />
  ) : (
    <Training id={id} title={title} />
  );
}
