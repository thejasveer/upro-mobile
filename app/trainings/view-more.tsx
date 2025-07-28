import { Stack } from "expo-router";
import { ScrollView, View, Text } from "react-native";

import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";

export default function ViewMoreTrainingScreen() {
    const { user } = useAuth();

    if (!user) {
        return <AuthScreen />;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    headerTitle: 'Tab',
                    headerBackButtonDisplayMode: "minimal",
                }}
            />

            <ScrollView className="flex-1 p-4 bg-white">
                <View className="flex-1">
                    {/* TODO */}
                </View>
               
            </ScrollView>
        </>
    )
}