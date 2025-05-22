import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import axios from "axios";

const RegisterScreen = () => {
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState<"user" | "artist">("user"); // 🎭 сонголт

  const handleRegister = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/register/", {
        username,

        email,
        phone_number: phoneNumber,
        password,
        user_type: userType, // 🧩 server руу илгээнэ
      });

      Alert.alert("Амжилттай", response.data.message);
    } catch (error: any) {
      console.error(error.response?.data || error.message);
      Alert.alert("Алдаа", "Бүртгэл амжилтгүй боллоо");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Бүртгүүлэх</Text>

      <TextInput
        style={styles.input}
        placeholder="Нэвтрэх нэр"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="И-мэйл"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Утасны дугаар"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Нууц үг"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* 🎭 Хэрэглэгчийн төрөл сонгох товч */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          onPress={() => setUserType("user")}
          style={[styles.typeButton, userType === "user" && styles.selected]}
        >
          <Text style={styles.typeText}>Хэрэглэгч</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUserType("artist")}
          style={[styles.typeButton, userType === "artist" && styles.selected]}
        >
          <Text style={styles.typeText}>Артист</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Бүртгүүлэх</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 12,
  },
  typeButton: {
    borderWidth: 1,
    borderColor: "#1e90ff",
    padding: 10,
    borderRadius: 6,
    marginHorizontal: 6,
  },
  selected: {
    backgroundColor: "#1e90ff",
  },
  typeText: {
    color: "#fff",
  },
});
