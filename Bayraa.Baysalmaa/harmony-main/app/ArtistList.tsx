import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ---------- Төрлийн тодорхойлолт ----------
interface Artist {
  id: string;
  name: string;
  bio: string;
  category: string;
  profilePicture: string;
  isVerified: boolean;
}

// ---------- Хиймэл Артистын Мэдээлэл ----------
const mockArtists: Artist[] = [
  {
    id: "1",
    name: "Anu",
    bio: "Anu бол алдартай поп дуучин.",
    category: "Поп",
    profilePicture: "https://i.imgur.com/0ZmCccV.png",
    isVerified: true,
  },
  {
    id: "2",
    name: "Ganaa",
    bio: "Ganaa нь хип-хоп чиглэлээр уран бүтээл туурвидаг.",
    category: "Хип Хоп",
    profilePicture: "https://i.imgur.com/Xqwl0O7.png",
    isVerified: false,
  },
];

// ---------- Гол Компонент ----------
const ArtistListScreen = () => {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);

  const renderArtist = ({ item }: { item: Artist }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedArtist(item)}
    >
      <Image source={{ uri: item.profilePicture }} style={styles.cardImage} />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>
          {item.name}{" "}
          {item.isVerified && (
            <Ionicons name="checkmark-circle" size={18} color="#2F58CD" />
          )}
        </Text>
        <Text style={styles.cardCategory}>{item.category}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Артистууд</Text>

      <FlatList
        data={mockArtists}
        keyExtractor={(item) => item.id}
        renderItem={renderArtist}
        contentContainerStyle={{ paddingBottom: 40 }}
      />

      {/* ---------- Дэлгэрэнгүй Modal ---------- */}
      <Modal
        visible={!!selectedArtist}
        animationType="slide"
        onRequestClose={() => setSelectedArtist(null)}
      >
        {selectedArtist && (
          <ScrollView style={styles.detailContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedArtist(null)}
            >
              <Ionicons name="arrow-back" size={24} color="#2F58CD" />
              <Text style={{ color: "#2F58CD", marginLeft: 8 }}>Буцах</Text>
            </TouchableOpacity>

            <Image
              source={{ uri: selectedArtist.profilePicture }}
              style={styles.detailImage}
            />
            <Text style={styles.detailName}>
              {selectedArtist.name}{" "}
              {selectedArtist.isVerified && (
                <Ionicons name="checkmark-circle" size={22} color="#2F58CD" />
              )}
            </Text>
            <Text style={styles.detailCategory}>{selectedArtist.category}</Text>
            <Text style={styles.detailBio}>{selectedArtist.bio}</Text>

            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Захиалга өгөх</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
};

// ---------- Загвар (StyleSheet) ----------
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f1f6fb",
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#2F58CD",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  cardCategory: {
    fontSize: 14,
    color: "#666",
  },
  detailContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  detailImage: {
    width: width,
    height: 280,
  },
  detailName: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 16,
    color: "#1a1a1a",
  },
  detailCategory: {
    fontSize: 18,
    textAlign: "center",
    color: "#555",
    marginVertical: 4,
  },
  detailBio: {
    fontSize: 16,
    color: "#333",
    padding: 20,
    lineHeight: 22,
  },
  orderButton: {
    backgroundColor: "#2F58CD",
    marginHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 40,
  },
  orderButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default ArtistListScreen;
