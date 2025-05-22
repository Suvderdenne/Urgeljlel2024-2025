import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Dimensions, Animated } from "react-native";
import { useRouter, Stack } from "expo-router"; // ✅ Stack-ийг эндээс авна

const { width, height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const router = useRouter();
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }).start(() => {
        router.push("/login");
      });
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />{" "}
      {/* ✅ Энэ хэсэг ажиллана */}
      <View style={styles.container}>
        <Animated.Image
          source={require("../assets/images/music.jpg")}
          style={[styles.image, { opacity: fadeAnim }]}
          resizeMode="cover"
        />
        <View style={styles.contentContainer}>
          {/* Text, logo гэх мэт fade хийж болох хэсэг */}
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FCFF",
  },
  image: {
    width: width,
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
  },
  contentContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
});
