import { Tabs } from "expo-router";
import React from "react";
import { Platform } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { HapticTab } from "@/components/HapticTab";
import { IconSymbol } from "@/components/ui/IconSymbol";
import { useColorScheme } from "@/hooks/useColorScheme";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#ff5a47", // Coral Orange - тод, анхаарал татам
        tabBarInactiveTintColor: "#fbecec",
        tabBarButton: HapticTab,
        tabBarBackground: () => (
          <BlurView
            intensity={90}
            tint={colorScheme}
            style={{
              flex: 1,
              borderTopLeftRadius: 50,
              borderTopRightRadius: 50,
              overflow: "hidden",
              backgroundColor: "#1ea5b0",
            }}
          />
        ),
        tabBarStyle: {
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0, // доошоо тулгасан
          height: 80,
          borderTopWidth: 0,
          backgroundColor: "transparent",
        },
        tabBarItemStyle: {
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: Platform.OS === "ios" ? 6 : 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ color }) => (
            <IconSymbol name="house.fill" color={color} size={30} />
          ),
        }}
      />

      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" color={color} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="nemeh"
        options={{
          tabBarIcon: ({ color }) => (
            <FontAwesome name="plus-square-o" color={color} size={30} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" color={color} size={30} />
          ),
        }}
      />
    </Tabs>
  );
}
