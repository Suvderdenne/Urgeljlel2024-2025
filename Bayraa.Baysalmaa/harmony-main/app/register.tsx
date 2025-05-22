import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import axios, { AxiosError } from "axios";
import { useRouter, Stack } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.password2
    ) {
      Alert.alert("Алдаа", "Бүх талбаруудыг бөглөнө үү");
      return;
    }

    if (!validateEmail(formData.email)) {
      Alert.alert("Алдаа", "Бүртгэлийн имэйл зөв биш байна");
      return;
    }

    if (formData.password !== formData.password2) {
      Alert.alert("Алдаа", "Нууц үг хоорондоо таарахгүй байна");
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert("Алдаа", "Нууц үг хамгийн багадаа 6 тэмдэгттэй байх ёстой");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/register/", formData);
      Alert.alert("Амжилттай", "Бүртгэл амжилттай боллоо");
      router.replace("/login");
    } catch (err: unknown) {
      const error = err as AxiosError<{ [key: string]: string[] | string }>;
      const message = error.response?.data
        ? Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
            .join("\n")
        : "Бүртгэл амжилтгүй боллоо";
      Alert.alert("Алдаа", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <Image
            source={require("../assets/images/music.jpg")}
            style={styles.image}
            resizeMode="cover"
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join the music community</Text>
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
              value={formData.email}
              onChangeText={(t) => setFormData({ ...formData, email: t })}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="person"
              size={20}
              color="#0da4b0"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor="#999"
              value={formData.username}
              onChangeText={(t) => setFormData({ ...formData, username: t })}
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
              value={formData.password}
              onChangeText={(t) => setFormData({ ...formData, password: t })}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <MaterialIcons
                name={showPassword ? "visibility" : "visibility-off"}
                size={20}
                color="#0da4b0"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputWrapper}>
            <MaterialIcons
              name="lock"
              size={20}
              color="##0da4b0"
              style={styles.icon}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword2}
              value={formData.password2}
              onChangeText={(t) => setFormData({ ...formData, password2: t })}
            />
            <TouchableOpacity onPress={() => setShowPassword2(!showPassword2)}>
              <MaterialIcons
                name={showPassword2 ? "visibility" : "visibility-off"}
                size={20}
                color="##0da4b0"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.button}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Register</Text>
            )}
          </TouchableOpacity>

          <Text style={styles.signInPrompt}>
            Already have an account?{" "}
            <Text style={styles.link} onPress={() => router.push("/login")}>
              Sign In
            </Text>
          </Text>
        </View>
      </KeyboardAvoidingView>
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
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
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
    backgroundColor: "#0da4b0",
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
    color: "#0da4b0",
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
});
