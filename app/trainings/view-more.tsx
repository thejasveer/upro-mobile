import { Stack } from "expo-router";
import { ScrollView, View } from "react-native";

import AuthScreen from "@/components/AuthScreen";
import { useAuth } from "@/contexts/AuthContext";
import { InfoText } from "@/components/Training";

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
                <View style={{ backgroundColor: '#d1d5db', padding: 20, marginBottom: 16, borderRadius: 8 }}>
                    <Prevv>Push ups</Prevv>
                </View>
                
                <View style={{ backgroundColor: '#d1d5db', padding: 20, marginBottom: 16, borderRadius: 8 }}>
                    <Prevv>Jumps</Prevv>
                </View>
                
                <View style={{ backgroundColor: '#d1d5db', padding: 20, marginBottom: 16, borderRadius: 8 }}>
                    <Prevv>Short run</Prevv>
                </View>
            </ScrollView>



        </>
    )
}