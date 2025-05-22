// app/RegisterScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import axios, { AxiosError } from "axios";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get("window");

export default function RegisterScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    username: "",
    password: "",
    password2: "",
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (formData.password !== formData.password2) {
      Alert.alert("Алдаа", "Нууц үг хоорондоо таарахгүй байна");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/register/", formData);
      Alert.alert("Амжилттай", "Бүртгэл амжилттай боллоо");
      router.replace("/login");
    } catch (err: unknown) {
      const error = err as AxiosError<{ [key: string]: string[] }>;
      const message = error.response?.data
        ? Object.entries(error.response.data)
            .map(([k, v]) => `${k}: ${v.join(", ")}`)
            .join("\n")
        : "Бүртгэл амжилтгүй боллоо";
      Alert.alert("Алдаа", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/music.jpg")}
          style={styles.headerImage}
        />
        <Text style={styles.welcomeTitle}>Create your</Text>
        <Text style={styles.welcomeSubtitle}>Modern Music House</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Your full name"
          placeholderTextColor="#ccc"
          value={formData.full_name}
          onChangeText={(t) => setFormData({ ...formData, full_name: t })}
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="simple@mail.site"
          placeholderTextColor="#ccc"
          autoCapitalize="none"
          keyboardType="email-address"
          value={formData.email}
          onChangeText={(t) => setFormData({ ...formData, email: t })}
        />

        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Choose a username"
          placeholderTextColor="#ccc"
          value={formData.username}
          onChangeText={(t) => setFormData({ ...formData, username: t })}
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={formData.password}
          onChangeText={(t) => setFormData({ ...formData, password: t })}
        />

        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          placeholder="********"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={formData.password2}
          onChangeText={(t) => setFormData({ ...formData, password2: t })}
        />

        <TouchableOpacity
          style={styles.signUpButton}
          onPress={handleRegister}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpText}>Sign up</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text style={styles.signIn}>Already have an account? Sign in</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#1c0e10",
  },
  header: {
    width: "100%",
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 30,
  },
  headerImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "absolute",
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: "#ddd",
    marginTop: 4,
  },
  form: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 20,
  },
  label: {
    color: "#aaa",
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: "#2b1b1e",
    color: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 20,
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: "#7c2bc4",
    borderRadius: 30,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#7c2bc4",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  signUpText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  signIn: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    textDecorationLine: "underline",
  },
});
