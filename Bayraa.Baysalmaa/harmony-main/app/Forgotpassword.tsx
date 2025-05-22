import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios, { AxiosError } from "axios";
import { Stack, useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    setLoading(true);
    try {
      await axios.post("http://127.0.0.1:8000/api/auth/password-reset/", {
        email,
      });
      Alert.alert("Амжилттай", "Сэргээх холбоос имэйл рүү явуулсан.");
      router.push("/login");
    } catch (error: unknown) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      Alert.alert(
        "Алдаа",
        axiosError.response?.data?.detail || "Сэргээхэд алдаа гарлаа."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>
            Enter your email to recover access
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="email"
              size={20}
              color="#007960"
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

          <TouchableOpacity
            style={styles.button}
            onPress={handleReset}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Send Reset Link</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signInPrompt}>
            Remember your password?{" "}
            <Text style={styles.link} onPress={() => router.push("/login")}>
              Login
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
  button: {
    backgroundColor: "#007960",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  signInPrompt: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 14,
    color: "#555",
  },
  link: {
    color: "#007960",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
