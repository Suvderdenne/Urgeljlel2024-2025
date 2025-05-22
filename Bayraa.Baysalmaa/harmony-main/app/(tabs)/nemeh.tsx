import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import React from "react"; // React-г импортлосон
import { useRouter } from "expo-router"; // useRouter-г импортлосон

// Энэ бол Event болон Artist үүсгэх хуудас руу шилжих сонголт хийх хуудас (nemeh.tsx)
export default function CreateSelectionScreen() {
  // Хуудасны нэрийг илүү тодорхой болгож болно
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Үүсгэх сонголт</Text> {/* Хуудасны гарчиг */}
      {/* Event үүсгэх хуудас руу шилжих товч */}
      <TouchableOpacity
        style={styles.selectionButton}
        onPress={() => router.push("/CreateEventScreen")} // <-- CreateEventScreen.tsx руу шилжинэ
      >
        <Text style={styles.buttonText}>Шинэ Эвэнт Үүсгэх</Text>
      </TouchableOpacity>
      {/* Artist үүсгэх хуудас руу шилжих товч (танд одоо байгаа шиг) */}
      <TouchableOpacity
        style={[styles.selectionButton, styles.secondaryButton]}
        onPress={() => router.push("/CreateArtistScreen")} // <-- CreateArtistScreen.tsx руу шилжинэ
      >
        <Text style={styles.buttonText}>Шинэ Уран бүтээлч Үүсгэх</Text>
      </TouchableOpacity>
      {/* Буцах товч (хэрэв хэрэгтэй бол) */}
      {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>Буцах</Text>
        </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center", // Төвлүүлэх
    alignItems: "center", // Төвлүүлэх
    backgroundColor: "#f7fdfd",
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 40, // Товчлууруудаас зай авах
    textAlign: "center",
  },
  selectionButton: {
    backgroundColor: "#1ea5b0", // Үндсэн өнгө
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 25, // Хажуу зай нэмсэн
    alignItems: "center",
    justifyContent: "center",
    width: "80%", // Дэлгэцийн 80% өргөнтэй
    marginBottom: 20, // Товчлууруудын хоорондох зай
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  secondaryButton: {
    backgroundColor: "#2F58CD", // Өөр өнгө
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  // Хэрэв буцах товч нэмбэл
  // backButton: {
  //     marginTop: 30,
  //     padding: 10,
  // },
  // backButtonText: {
  //     fontSize: 16,
  //     color: '#555',
  //     textDecorationLine: 'underline',
  // }
});
