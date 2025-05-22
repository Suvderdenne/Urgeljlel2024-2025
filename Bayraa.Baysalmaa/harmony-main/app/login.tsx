import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter, Stack } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 нууц үг toggle
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/token/", {
        email,
        password,
      });

      if (res.data && res.data.access && res.data.refresh) {
        await AsyncStorage.setItem("userToken", res.data.access);
        await AsyncStorage.setItem("refreshToken", res.data.refresh);
        router.replace("/(tabs)");
      } else {
        alert("Login failed. No tokens received.");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.error(
          "Login error:",
          err.response ? err.response.data : err.message
        );
      } else {
        console.error("An unexpected error occurred:", err);
      }
      alert("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../assets/images/music.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>
        </View>
        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="email"
              size={20}
              color="#0da4b0"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="lock"
              size={20}
              color="#0da4b0"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#0da4b0"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signUpPrompt}>
            Don't have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/register")}>
              Sign Up
            </Text>
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#A3E4DB" },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 80,
  },
  image: {
    width: width,
    height: height * 0.5,
    borderRadius: 20,
    marginBottom: 20,
  },
  title: { fontSize: 32, fontWeight: "bold", color: "#014D40" },
  subtitle: { fontSize: 16, color: "#014D40", marginTop: 8 },
  form: {
    flex: 2,
    backgroundColor: "#F7FDFD",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // 👈 нүдний icon зайлуулж тохируулсан
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingHorizontal: 16,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  icon: { marginRight: 8 },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: "#333",
  },
  forgot: {
    textAlign: "right",
    marginVertical: 10,
    color: "#555",
    textDecorationLine: "underline",
  },
  button: {
    backgroundColor: "#0da4b0",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  signUpPrompt: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#0da4b0",
  },
  link: {
    color: "#0da4b0",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
