import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import axios from "axios";

const BASE_URL = "http://127.0.0.1:8000";

const ReviewScreen = () => {
  const { eventId } = useLocalSearchParams(); // event ID-г авна
  const [review, setReview] = useState("");

  const handleSubmitReview = async () => {
    if (!review) {
      Alert.alert("Анхааруулга", "Сэтгэгдэл бичих шаардлагатай");
      return;
    }

    try {
      // Сэтгэгдлийг сервер рүү илгээх
      await axios.post(`${BASE_URL}/api/reviews/`, {
        event: eventId,
        review,
      });
      Alert.alert("Амжилттай", "Сэтгэгдэл амжилттай илгээгдлээ");
      setReview(""); // Сэтгэгдэл бичсэн талбарыг цэвэрлэнэ
    } catch (error) {
      Alert.alert("Алдаа", "Сэтгэгдлийг илгээх үед алдаа гарлаа");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Сэтгэгдэл үлдээх</Text>
      <TextInput
        style={styles.input}
        placeholder="Сэтгэгдлээ бичнэ үү..."
        value={review}
        onChangeText={setReview}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmitReview}>
        <Text style={styles.buttonText}>Илгээх</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ReviewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },
  input: {
    height: 150,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#9b5de5",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
