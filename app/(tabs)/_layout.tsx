import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";

import AuthScreen from "@/components/AuthScreen";
import { HapticTab } from "@/components/HapticTab";
import { Profiles } from "@/components/Profiles";
import { IconSymbol } from "@/components/ui/IconSymbol";
import TabBarBackground from "@/components/ui/TabBarBackground";
import { Colors } from "@/constants/Colors";
import { useAuth } from "@/contexts/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

type IconName = React.ComponentProps<typeof IconSymbol>["name"];

const navigations: {
  name: string;
  title: string;
  icon: IconName;
}[] = [
  { name: "index", title: "Home", icon: "house.fill" },
  { name: "trainings", title: "Trainings", icon: "figure.walk" },
  // { name: "multiPlayer", title: "Multiplayer", icon: "person.3.fill" },
  // { name: "lockerRoom", title: "Locker Room", icon: "lock.fill" },
  // { name: "shop", title: "Shop", icon: "cart.fill" },
];

export default function TabLayout() {
  const { user, profiles, currentProfile } = useAuth();
  const colorScheme = useColorScheme();

  if (!user) return <AuthScreen />;
  if (!currentProfile) return <Profiles />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        tabBarStyle: Platform.select({
          ios: { position: "absolute" },
          default: {},
        }),
      }}
    >
      {navigations.map((nav) => (
        <Tabs.Screen
          key={nav.name}
          name={nav.name}
          options={{
            title: nav.title,
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name={nav.icon} color={color} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
