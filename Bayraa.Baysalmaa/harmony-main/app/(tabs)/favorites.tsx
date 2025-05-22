import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";

// Static image imports
const likedEvents = [
  {
    id: "1",
    title: "KACETA",
    date: "2025.05.24",
    location: "Төв цэнгэлдэх хүрээлэн",
    image: { uri: "https://i.imgur.com/Xqwl0O7.png" }, // Гадаад зураг
  },
  {
    id: "2",
    title: "Camerton 30",
    date: "2025.06.01",
    location: "SocialPay Park",
    image: { uri: "https://i.imgur.com/0ZmCccV.png" }, // Гадаад зураг
  },
  {
    id: "3",
    title: "Харанга хамтлаг",
    date: "2025.07.10",
    location: "UB Palace",
    image: { uri: "https://i.imgur.com/0ZmCccV.png" }, // Гадаад зураг
  },
  {
    id: "4",
    title: "GUYS Reunion",
    date: "2025.07.20",
    location: "Steppe Arena",
    image: { uri: "https://i.imgur.com/0ZmCccV.png" }, // Гадаад зураг
  },
];

export default function LikeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Таалагдсан эвентүүд</Text>
      <FlatList
        data={likedEvents}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.image} style={styles.image} />
            <View style={styles.overlay}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.date}>{item.date}</Text>
              <Text style={styles.location}>{item.location}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 80 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
    marginTop: 40,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 6,
  },
  image: {
    width: "100%",
    height: 150, // Багасгасан хэмжээ
    borderRadius: 12, // Зургуудын булан
  },
  overlay: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 12,
    borderRadius: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
  },
  date: {
    fontSize: 14,
    color: "#fff",
    marginTop: 4,
  },
  location: {
    fontSize: 13,
    color: "#fff",
    marginTop: 6,
  },
});
