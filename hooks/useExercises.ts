import { supabase } from "@/lib/supabase";
import { useState } from "react";

export interface ExerciseInterface {
  id: number;
  title: string;
  description: string;
  experience_reward: number;
  difficulty: "easy" | "medium" | "hard";
  duration: number;
}

export const useExercises = () => {
  const [exercises, setExercises] = useState<ExerciseInterface[] | null>([]);
  const [exercise, setExercise] = useState<ExerciseInterface | null>(null);
  const [count, setCount] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const getExercises = async () => {
    let { data: exerciseData, error } = await supabase
      .from("exercises")
      .select("*")
      .order("id", { ascending: false }); // Order by id instead of created_at

    if (exerciseData) {
      setCount(exerciseData.length);
      setExercises(exerciseData);
    }

    if (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const findIndex = (id: number) => {
    const i: any = exercises?.findIndex((exercise) => exercise.id === id);
    setCurrentIndex(i);
  };

  const getExercise = async (id: number) => {
    let { data: exerciseData, error } = await supabase
      .from("exercises")
      .select("*")
      .eq("id", id)
      .single();

    if (exerciseData) {
      setExercise(exerciseData);
    }

    if (error) {
      console.error("Error fetching exercise:", error);
    }
  };

  const getExercisesByDifficulty = (difficulty: "easy" | "medium" | "hard") => {
    return (
      exercises?.filter((exercise) => exercise.difficulty === difficulty) || []
    );
  };

  const getExercisesByDuration = (minDuration: number, maxDuration: number) => {
    return (
      exercises?.filter(
        (exercise) =>
          exercise.duration >= minDuration && exercise.duration <= maxDuration
      ) || []
    );
  };

  return {
    exercises,
    getExercise,
    getExercises,
    exercise,
    count,
    findIndex,
    currentIndex,
    getExercisesByDifficulty,
    getExercisesByDuration,
  };
};
