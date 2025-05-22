// app/ArtistScreen.tsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";

interface Category {
  id: number;
  name: string;
}
interface Artist {
  id: number;
  name: string;
  bio: string;
  profile_picture: string;
  category: Category;
}
interface Event {
  id: number;
  image: string;
  button_text: string;
  location: string;
  price: string;
  date: string;
}

const screenWidth = Dimensions.get("window").width;
const BASE_URL = "http://127.0.0.1:8000";

export default function ArtistScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery] = useState<string>("");
  const router = useRouter();
  const [fontsLoaded] = useFonts({ Poppins_600SemiBold, Poppins_400Regular });

  useEffect(() => {
    fetchCategories();
    fetchArtists();
    fetchEvents();
  }, []);
  const fetchCategories = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/categories/`);
      setCategories([{ id: 0, name: "All" }, ...res.data]);
    } catch {}
  }, []);
  const fetchArtists = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/artists/`);
      setArtists(res.data);
    } catch {}
  }, []);
  const fetchEvents = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/events/`);
      setEvents(res.data);
    } catch {}
  }, []);

  if (!fontsLoaded) return null;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Harmony</Text>
        <Ionicons
          name="heart-outline"
          size={28}
          onPress={() => router.push("/LikeScreen")}
        />
      </View>

      {/* Events Banner */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Events</Text>
        <TouchableOpacity onPress={() => router.push("/EventsList")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        horizontal
        pagingEnabled
        keyExtractor={(i) => i.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <View style={styles.bannerCard}>
            <Image
              source={{ uri: `${BASE_URL}${item.image}` }}
              style={styles.bannerImage}
            />
            <TouchableOpacity
              style={styles.bannerButton}
              onPress={() =>
                router.push({
                  pathname: "/EventDetail",
                  params: { event: JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.bannerButtonText}>
                Ticket {item.button_text}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{ paddingLeft: 20 }}
      />

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ангилал</Text>
        <TouchableOpacity onPress={() => router.push("/")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 20 }}
      >
        {categories.map((c) => (
          <TouchableOpacity
            key={c.id}
            style={[
              styles.categoryCard,
              selectedCategory === c.name && styles.activeCategory,
            ]}
            onPress={() => setSelectedCategory(c.name)}
          >
            <Text
              style={[
                styles.categoryLabel,
                selectedCategory === c.name && styles.activeCategoryText,
              ]}
            >
              {c.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Events */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Онцлох эвэнт</Text>
        <TouchableOpacity onPress={() => router.push("/EventsList")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 20 }}
      >
        {events.map((e) => (
          <TouchableOpacity
            key={e.id}
            style={styles.featuredCard}
            onPress={() =>
              router.push({
                pathname: "/EventDetail",
                params: { event: JSON.stringify(e) },
              })
            }
          >
            <Image
              source={{ uri: `${BASE_URL}${e.image}` }}
              style={styles.featuredImage}
            />
            <Text style={styles.featuredTitle}>{e.button_text}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Top Artists */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Top Artists</Text>
        <TouchableOpacity onPress={() => router.push("/ArtistScreen")}>
          <Text style={styles.seeAll}>See All</Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ paddingLeft: 20, paddingBottom: 30 }}
      >
        {artists.map((a) => (
          <TouchableOpacity
            key={a.id}
            style={styles.artistCard}
            onPress={() =>
              router.push({
                pathname: "/ArtistDetail",
                params: { artist: JSON.stringify(a) },
              })
            }
          >
            <Image
              source={{ uri: `${BASE_URL}${a.profile_picture}` }}
              style={styles.artistImage}
            />
            <Text style={styles.artistName}>{a.name}</Text>
            <Text style={styles.artistCategory}>{a.category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 50 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  greeting: { fontFamily: "Poppins_600SemiBold", fontSize: 24 },
  section: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { fontSize: 14, color: "#555" },
  bannerCard: {
    width: screenWidth - 60,
    height: 200,
    marginRight: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  bannerImage: { width: "100%", height: "100%" },
  bannerButton: {
    position: "absolute",
    bottom: 10,
    right: 10,
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  bannerButtonText: { fontSize: 12 },
  categoryCard: {
    backgroundColor: "#ddd",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 10,
  },
  categoryLabel: { fontSize: 14 },
  activeCategory: { backgroundColor: "#9b5de5" },
  activeCategoryText: { color: "#fff", fontWeight: "bold" },
  featuredCard: {
    backgroundColor: "#eee",
    width: 140,
    height: 150,
    borderRadius: 20,
    marginRight: 15,
    alignItems: "center",
  },
  featuredImage: { width: 120, height: 120, borderRadius: 15, marginTop: 10 },
  featuredTitle: {
    fontFamily: "Poppins_600SemiBold",
    marginTop: 8,
    textAlign: "center",
  },
  artistCard: {
    backgroundColor: "#eee",
    width: 140,
    borderRadius: 20,
    marginRight: 15,
    alignItems: "center",
    padding: 10,
  },
  artistImage: { width: 120, height: 120, borderRadius: 15 },
  artistName: { fontFamily: "Poppins_600SemiBold", marginTop: 10 },
  artistCategory: { color: "#555", fontSize: 12 },
});
