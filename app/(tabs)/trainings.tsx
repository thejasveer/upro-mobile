import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const trainings = [
  { id: "1", title: "Leg Day Workout" },
  { id: "2", title: "Cardio Blast" },
  { id: "3", title: "Strength Training" },
];

interface Training {
  id: number;
  title: string;
  description: string;
  experience_reward: number;
  duration_minutes: number;
}
export default function Trainings() {
  const [trainings, setTrainings] = useState<Training[] | null>([]);
  const router = useRouter();
  useEffect(() => {
    getTraings();
  }, []);
  const getTraings = async () => {
    let { data: training_sessions, error } = await supabase
      .from("training_sessions")
      .select("*");

    setTrainings((prev) => training_sessions);
  };
  console.log(trainings);

  return (
    <SafeAreaView>
      <View className="p-5">
        <Text className="text-3xl ">Trainings</Text>
        <FlatList
          data={trainings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`../trainings/${item.id}`)}
              style={{
                padding: 16,
                borderBottomWidth: 1,
                borderBottomColor: "#ddd",
              }}
            >
              <Text>{item.title}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
}
