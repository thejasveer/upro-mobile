import { Tabs } from "expo-router";
import React, { useEffect } from "react";
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

interface NavItem {
  name: string;
  title: string;
  icon: IconName;
}

const navigations: NavItem[] = [
  {
    name: "index",
    title: "Home",
    icon: "house.fill",
  },
  {
    name: "daily",
    title: "Daily",
    icon: "paperplane.fill",
  },
  {
    name: "trainings",
    title: "Trainings",
    icon: "figure.walk",
  },
  {
    name: "multiPlayer",
    title: "Multiplayer",
    icon: "person.3.fill",
  },
  {
    name: "lockerRoom",
    title: "Locker Room",
    icon: "lock.fill",
  },
  {
    name: "shop",
    title: "Shop",
    icon: "cart.fill",
  },
];

export default function TabLayout() {
  const { user } = useAuth();
  const colorScheme = useColorScheme();
  const { profiles, currentProfile, setCurrentProfile } = useAuth();
  useEffect(() => {
    // setCurrentProfile(null);
  }, [profiles, currentProfile]);

  if (!user) {
    return <AuthScreen />;
  }
  return profiles.length > 0 && currentProfile == null ? (
    <Profiles />
  ) : (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: "absolute",
          },
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
