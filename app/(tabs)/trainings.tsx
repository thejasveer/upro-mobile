import { IconSymbol } from "@/components/ui/IconSymbol";
import { useAuth } from "@/contexts/AuthContext";
import { useTrainings } from "@/hooks/useTrainings";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  FlatList,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
export interface TrainingInterface {
  id: number;
  title: string;
  description: string;
  experience_reward: number;
  duration_minutes: number;
  subscription_type_id: number;
}

export default function Trainings() {
  const { trainings, getTrainings } = useTrainings();
  const router = useRouter();
  const { currentProfile } = useAuth();
  useEffect(() => {
    getTrainings();
  }, []);

  const routeToTraining = (id: number) => {
    router.push(`/trainings/${id}`);
  };

  return (
    <SafeAreaView>
      <View className="p-5">
        <Text className="text-3xl text-[#0d9447] ">Trainings</Text>
        <FlatList
          className="mb-28"
          data={trainings || []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) =>
            currentProfile?.subscription_type === 2 ? (
              subscribedTraining(item)
            ) : item.subscription_type_id == 1 ? (
              subscribedTraining(item)
            ) : (
              <PremiumTrainings
                onPress={() => routeToTraining(item.id)}
                item={item}
              />
            )
          }
        />
      </View>
    </SafeAreaView>
  );

  function subscribedTraining(item: TrainingInterface) {
    return (
      <TouchableOpacity
        onPress={() => routeToTraining(item.id)}
        className="p-5 px-10  bg-green-50 rounded-md mb-2"
      >
        <Text>{item.title}</Text>
      </TouchableOpacity>
    );
  }
}

const PremiumTrainings = ({
  onPress,
  item,
}: {
  onPress: () => any;
  item: TrainingInterface;
}) => {
  return (
    <View className="relative">
      <IconSymbol
        name={"star"}
        style={{
          position: "absolute",
          top: -5,
          left: -1,

          zIndex: 1,

          borderRadius: 50,
        }}
        size={20}
        color={"green"}
      ></IconSymbol>
      <TouchableOpacity
        onPress={onPress}
        className="p-5 px-10  bg-gray-200 rounded-md mb-2"
      >
        <Text>{item.title}</Text>
      </TouchableOpacity>
    </View>
  );
};
