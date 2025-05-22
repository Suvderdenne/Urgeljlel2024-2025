import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  useColorScheme,
  Image,
  Dimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { AntDesign } from "@expo/vector-icons"; // AntDesign икон импорт хийх

const { width } = Dimensions.get("window");

interface Category {
  id: number;
  name: string;
}

export default function RegisterArtistScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [artistType, setArtistType] = useState(""); // Артистын төрлийг хадгалах
  const [categories, setCategories] = useState<Category[]>([]); // Төрлийн жагсаалт
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Категорийн жагсаалтыг серверээс татах
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/categories/");
        setCategories(response.data);
      } catch (error) {
        console.error("Category fetch error:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleRegister = async () => {
    if (!name || !email || !password || !artistType) {
      Alert.alert("Анхаар", "Бүх талбарыг бөглөнө үү.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://127.0.0.1:8000/register/", {
        name,
        email,
        password,
        is_artist: true,
        artist_type: artistType, // Артистын төрлийг илгээж байна
      });

      Alert.alert("Амжилттай", "Та амжилттай бүртгэгдлээ!");
      router.replace("/login");
    } catch (error) {
      console.error("Register error:", error);
      Alert.alert("Алдаа", "Бүртгэх үед алдаа гарлаа.");
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (itemValue: string) => {
    setArtistType(itemValue);
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? "#000" : "#fff" },
      ]}
    >
      <View style={styles.header}>
        <Image
          source={require("../assets/images/music.jpg")}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.overlay} />
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Артист бүртгүүлэх</Text>
        </View>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          placeholder="Нэр"
          placeholderTextColor="#999"
          value={name}
          onChangeText={setName}
          style={[
            styles.input,
            {
              borderColor: isDark ? "#444" : "#ccc",
              color: isDark ? "#fff" : "#000",
            },
          ]}
        />
        <TextInput
          placeholder="Имэйл"
          placeholderTextColor="#999"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={[
            styles.input,
            {
              borderColor: isDark ? "#444" : "#ccc",
              color: isDark ? "#fff" : "#000",
            },
          ]}
        />
        <TextInput
          placeholder="Нууц үг"
          placeholderTextColor="#999"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          style={[
            styles.input,
            {
              borderColor: isDark ? "#444" : "#ccc",
              color: isDark ? "#fff" : "#000",
            },
          ]}
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Артистын төрөл</Text>
          <Picker
            selectedValue={artistType || ""}
            onValueChange={handleValueChange}
            style={[styles.picker, { color: isDark ? "#fff" : "#000" }]}
          >
            <Picker.Item label="Төрлийг сонгоно уу" value="" />
            {categories.map((cat) => (
              <Picker.Item
                key={cat.id}
                label={cat.name}
                value={String(cat.id)}
              />
            ))}
          </Picker>
          {/* AntDesign icon зөв байрлах хэсэг */}
          <TouchableOpacity style={styles.addCategoryButton}>
            <AntDesign name="down" size={20} color={isDark ? "#fff" : "#000"} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          style={[styles.button, { backgroundColor: "#4C6EF5" }]}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  header: {
    height: 350,
    width: "100%",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "black",
    opacity: 0.3,
  },
  headerTextContainer: {
    position: "absolute",
    bottom: 20,
    left: "50%",
    transform: [{ translateX: -width / 2 }],
  },
  headerTitle: {
    color: "white",
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginLeft: 50,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
    marginTop: 30,
  },
  input: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
  },
  label: {
    marginBottom: 10,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  pickerContainer: {
    marginBottom: 15,
  },
  picker: {
    height: 50,
    borderRadius: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    marginBottom: 15,
  },
  addCategoryButton: {
    position: "absolute",
    right: 10,
    top: "50%",
  },
  button: {
    paddingVertical: 15,
    borderRadius: 15,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
