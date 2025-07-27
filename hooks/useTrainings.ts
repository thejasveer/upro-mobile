import { TrainingInterface } from "@/app/(tabs)/trainings";
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export const useTrainings = () => {
  const [trainings, setTrainings] = useState<TrainingInterface[] | null>([]);
  const [training, setTraining] = useState<TrainingInterface | null>(null);
  const [count, setcount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getTrainings = async () => {
    let { data: training_sessions, error } = await supabase
      .from("training_sessions")
      .select("*");
    training_sessions && setcount(training_sessions?.length);

    setTrainings((prev) => training_sessions);
  };
  const findIndex = (id: number) => {
    const i: any = trainings?.findIndex((training) => training.id === id);
    setCurrentIndex(i);
  };
  const getTraining = async (id: number) => {
    let { data: training_session, error } = await supabase
      .from("training_sessions")
      .select("*")
      .eq("id", id);

    setTraining(training_session && training_session[0]);
  };
  return {
    trainings,
    getTraining,
    getTrainings,
    training,
    count,
    findIndex,
    currentIndex,
  };
};
