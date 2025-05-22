import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker";

type Category = {
  id: number;
  name: string;
  icon: string;
  icon_base64: string;
};

export default function CreateArtistScreen() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [image, setImage] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      alert("Permission required to access gallery!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleCreateArtist = async () => {
    if (!name || !categoryId || !image) {
      alert("Please fill all fields and upload an image.");
      return;
    }

    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const profile_picture_base64 = `data:image/jpeg;base64,${base64}`;

      const requestBody = {
        name,
        bio,
        category: categoryId,
        profile_picture_base64,
      };

      console.log("Request Body:", requestBody); // Log the request body

      const response = await axios.post(
        "http://127.0.0.1:8000/artists/create/",
        requestBody,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      alert("Artist created successfully!");
      router.back();
    } catch (error) {
      console.error("Artist creation failed:", error);
      alert("Artist creation failed!");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Create Artist</Text>

      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <TextInput
        placeholder="Bio"
        value={bio}
        onChangeText={setBio}
        style={[styles.input, { height: 80 }]}
        multiline
      />

      <Picker
        selectedValue={categoryId || ""}
        onValueChange={(itemValue) => setCategoryId(Number(itemValue))}
        style={styles.input}
      >
        <Picker.Item label="Select Category" value="" />
        {categories.map((cat) => (
          <Picker.Item key={cat.id} label={cat.name} value={String(cat.id)} />
        ))}
      </Picker>

      <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <AntDesign name="pluscircleo" size={40} color="#aaa" />
            <Text style={styles.placeholderText}>Upload Profile Picture</Text>
          </View>
        )}
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCreateArtist}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  placeholder: { alignItems: "center" },
  placeholderText: { marginTop: 8, color: "#888", fontSize: 16 },
  button: {
    backgroundColor: "#3897f0",
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
