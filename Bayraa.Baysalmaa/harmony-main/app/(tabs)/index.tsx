import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  RefreshControl,
  ActivityIndicator, // Added for loading states
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import {
  useFonts,
  Poppins_600SemiBold,
  Poppins_400Regular,
} from "@expo-google-fonts/poppins";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Category {
  id: number;
  name: string;
  icon_base64?: string;
  icon: string;
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
const BASE_URL = "http://127.0.0.1:8000"; // Ensure this is your correct backend URL

const getTokenExpiry = (token: string): number | null => {
  try {
    const decoded: any = jwtDecode(token);
    if (decoded && typeof decoded.exp === "number") {
      return decoded.exp * 1000; // converting to milliseconds
    }
    console.warn("Decoded token is invalid or missing 'exp' claim.");
    return null;
  } catch (error) {
    console.error("Error decoding token in getTokenExpiry:", error);
    return null;
  }
};

const isTokenExpired = (expiryTime: number | null): boolean => {
  if (expiryTime === null) {
    return true; // Treat as expired if expiry couldn't be determined
  }
  return Date.now() >= expiryTime;
};

const ArtistScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // For initial load
  const [dataError, setDataError] = useState<string | null>(null);

  const bannerFlatListRef = useRef<FlatList<Event>>(null); // Typed useRef
  const router = useRouter();

  const [fontsLoaded, fontError] = useFonts({
    Poppins_600SemiBold,
    Poppins_400Regular,
  });

  const getValidAccessToken = async (): Promise<string | null> => {
    let token = await AsyncStorage.getItem("jwt_token");
    if (token) {
      const expiryTime = getTokenExpiry(token);
      if (expiryTime === null || isTokenExpired(expiryTime)) {
        console.log("Access token is expired or invalid, attempting refresh.");
        try {
          token = await refreshToken();
        } catch (error) {
          console.error("Failed to refresh token:", error);
          // router.replace('/login'); // Navigate to login on critical auth failure
          return null;
        }
      }
    } else {
      console.log(
        "No access token found, attempting refresh (first time or after logout)."
      );
      try {
        token = await refreshToken();
      } catch (error) {
        console.error(
          "Failed to refresh token (no initial access token):",
          error
        );
        // router.replace('/login');
        return null;
      }
    }
    return token;
  };

  const refreshToken = async (): Promise<string | null> => {
    try {
      const refresh = await AsyncStorage.getItem("refreshToken");
      if (!refresh) {
        console.warn("Refresh token missing from AsyncStorage.");
        // router.replace('/login'); // Definitely navigate to login
        throw new Error("Refresh token missing");
      }
      const response = await axios.post(`${BASE_URL}/api/token/refresh/`, {
        refresh,
      });
      const newAccessToken = response.data.access;
      await AsyncStorage.setItem("jwt_token", newAccessToken);
      console.log("Token refreshed successfully.");
      return newAccessToken;
    } catch (error) {
      console.error("Error refreshing token:", error);
      await AsyncStorage.multiRemove(["jwt_token", "refreshToken"]); // Clear tokens on failure
      // router.replace('/login'); // Navigate to login on refresh failure
      throw new Error("Refresh token invalid or expired. Please log in again.");
    }
  };

  const fetchData = async (isRefresh = false) => {
    if (!isRefresh) setIsLoading(true);
    setDataError(null);
    try {
      const token = await getValidAccessToken();
      if (!token) {
        setDataError("Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү.");
        // router.replace('/login'); // Redirect to login
        setIsLoading(false);
        return;
      }

      const [categoriesRes, artistsRes, eventsRes] = await Promise.all([
        axios.get(`${BASE_URL}/categories/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/artists/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${BASE_URL}/events/`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCategories(categoriesRes.data);
      setArtists(artistsRes.data);
      setEvents(eventsRes.data);
    } catch (error: any) {
      console.error("Error fetching data:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setDataError("Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.");
        // router.replace('/login'); // Redirect to login
      } else {
        setDataError(
          "Мэдээлэл татахад алдаа гарлаа. Интернет холболтоо шалгана уу."
        );
      }
    } finally {
      if (!isRefresh) setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData(true);
    setRefreshing(false);
  };

  const handleLogoutPress = async () => {
    Alert.alert("Системээс гарах", "Та системээс гарахдаа итгэлтэй байна уу?", [
      { text: "Үгүй", style: "cancel" },
      {
        text: "Тийм",
        onPress: async () => {
          console.log("Logging out...");
          await AsyncStorage.removeItem("jwt_token");
          await AsyncStorage.removeItem("refreshToken");
          // Add any other user data to remove from storage
          console.log("Logged out and tokens cleared.");
          router.replace("/login"); // Navigate to login screen after logout
        },
        style: "destructive",
      },
    ]);
  };

  const onSearchChange = (text: string) => {
    setSearchQuery(text);
  };

  const filteredArtists = artists.filter((artist) => {
    const matchesCategory =
      selectedCategory === "All" ||
      (artist.category && artist.category.name === selectedCategory);
    const artistNameLower = artist.name ? artist.name.toLowerCase() : "";
    const artistBioLower = artist.bio ? artist.bio.toLowerCase() : "";
    const queryLower = searchQuery.toLowerCase();
    const matchesSearch =
      artistNameLower.includes(queryLower) ||
      artistBioLower.includes(queryLower);
    return matchesCategory && matchesSearch;
  });

  if (!fontsLoaded && !fontError) {
    return (
      // Or a proper loading skeleton
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ea5b0" />
      </View>
    );
  }
  if (fontError) {
    console.error("Font loading error:", fontError);
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Фонт ачааллахад алдаа гарлаа.</Text>
      </View>
    ); // Fallback if fonts fail
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1ea5b0" />
        <Text style={styles.loadingText}>Уншиж байна...</Text>
      </View>
    );
  }

  if (dataError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{dataError}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchData()}
        >
          <Text style={styles.retryButtonText}>Дахин оролдох</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#1ea5b0"]}
        />
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollViewContent}
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Harmony</Text>
        <View style={styles.iconContainer}>
          {/* Example Heart Icon - uncomment and implement if needed
          <TouchableOpacity
            onPress={() => router.push("/LikeScreen")} // Example navigation
            style={styles.headerIcon}
          >
            <Ionicons name="heart-outline" size={28} color="#000" />
          </TouchableOpacity> */}
          <TouchableOpacity
            onPress={handleLogoutPress}
            style={styles.headerIcon} // Combined style for icons
          >
            <Ionicons name="log-out-outline" size={28} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBox}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIconElement}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Хайлтын үгээ оруулна уу..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={onSearchChange}
            autoCapitalize="none"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery("")}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#888" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Section */}
      {categories.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ангилал</Text>
            {/* <TouchableOpacity onPress={() => router.push("/AllCategoriesScreen")}>
                <Text style={styles.seeAll}>Бүгдийг харах</Text>
                </TouchableOpacity> */}
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.categoryScroll}
            contentContainerStyle={styles.categoryScrollContent}
          >
            <TouchableOpacity
              style={[
                styles.categoryCard,
                selectedCategory === "All" && styles.activeCategory,
              ]}
              onPress={() => setSelectedCategory("All")}
            >
              <Text
                style={[
                  styles.categoryLabel,
                  selectedCategory === "All" && styles.activeCategoryText,
                ]}
              >
                Бүгд
              </Text>
            </TouchableOpacity>
            {categories.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === item.name && styles.activeCategory,
                ]}
                onPress={() => setSelectedCategory(item.name)}
              >
                {/* {item.icon_base64 ? (
                    <Image source={{ uri: `data:image/png;base64,${item.icon_base64}` }} style={styles.categoryIcon} />
                    ) : item.icon ? (
                    <Ionicons name={item.icon as any} size={20} color={selectedCategory === item.name ? "#fff" : "#000"} />
                    ) : null} */}
                <Text
                  style={[
                    styles.categoryLabel,
                    selectedCategory === item.name && styles.activeCategoryText,
                  ]}
                >
                  {item.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Banner Section - Events */}
      {events.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Онцлох Эвэнт</Text>
            {/* <TouchableOpacity onPress={() => router.push("/EventsList", { title: "Онцлох Эвэнт" })}>
                    <Text style={styles.seeAll}>Бүгдийг харах</Text>
                </TouchableOpacity> */}
          </View>
          <FlatList
            ref={bannerFlatListRef}
            data={events}
            keyExtractor={(item) => item.id.toString()}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            style={styles.bannerFlatList}
            contentContainerStyle={styles.bannerFlatListContent}
            getItemLayout={(_, index) => ({
              length: screenWidth - 40, // card width
              offset: (screenWidth - 40 + 15) * index, // card width + margin
              index,
            })}
            renderItem={({ item }) => (
              <View style={styles.bannerCard}>
                <Image
                  source={{ uri: `${BASE_URL}${item.image}` }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />
                <View style={styles.bannerOverlay}>
                  <TouchableOpacity
                    style={styles.bannerButton}
                    onPress={() =>
                      router.push({
                        pathname: "/EventDetail", // Ensure this screen exists
                        params: { eventId: item.id.toString() }, // Pass eventId
                      })
                    }
                  >
                    <Text style={styles.bannerButtonText}>
                      {item.button_text || "Дэлгэрэнгүй"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </>
      )}

      {/* Top Artists Section */}
      {filteredArtists.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Топ Уран бүтээлчид</Text>
            <TouchableOpacity
              onPress={() => {
                // This should ideally navigate to a screen listing ALL artists,
                // not a detail screen, unless it's for a *specific* featured artist.
                console.log(
                  "See All Top Artists pressed - implement navigation to an artist list screen"
                );
                // router.push("/ArtistListScreen"); // Example
              }}
            >
              <Text style={styles.seeAll}>Бүгдийг харах</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.artistScroll}
            contentContainerStyle={styles.artistScrollContent}
          >
            {filteredArtists.map((artist) => (
              <TouchableOpacity
                key={artist.id}
                style={styles.artistCard}
                onPress={() =>
                  router.push({
                    pathname: "/ArtistDetail", // Ensure this matches your file system route
                    params: { artistId: artist.id.toString() },
                  })
                }
              >
                <Image
                  source={{ uri: `${BASE_URL}${artist.profile_picture}` }}
                  style={styles.artistImage}
                  resizeMode="cover"
                />
                <Text style={styles.artistName} numberOfLines={1}>
                  {artist.name}
                </Text>
                <Text style={styles.artistCategory} numberOfLines={1}>
                  {artist.category?.name || "N/A"}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </>
      )}

      {/* Featured Events Section (if different from banner or additional) */}
      {events.length > 0 && (
        <>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Бусад Эвэнтүүд</Text>
            <TouchableOpacity onPress={() => router.push("/EventsList")}>
              <Text style={styles.seeAll}>Бүгдийг харах</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.featuredEventsScroll}
            contentContainerStyle={styles.featuredEventsScrollContent}
          >
            {events.slice(0, 5).map(
              (
                event // Show first 5, for example
              ) => (
                <TouchableOpacity
                  key={event.id}
                  style={styles.featuredCard}
                  onPress={() =>
                    router.push({
                      pathname: "/EventDetail", // Ensure this screen exists
                      params: { eventId: event.id.toString() }, // Pass eventId
                    })
                  }
                >
                  <Image
                    source={{ uri: `${BASE_URL}${event.image}` }}
                    style={styles.featuredImage}
                    resizeMode="cover"
                  />
                  <Text style={styles.featuredTitle} numberOfLines={2}></Text>
                </TouchableOpacity>
              )
            )}
          </ScrollView>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fdfd",
  },
  scrollViewContent: {
    paddingBottom: 30, // Space at the bottom
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fdfd",
  },
  loadingText: {
    marginTop: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fdfd",
    padding: 20,
  },
  errorText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#D32F2F",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#1ea5b0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  retryButtonText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
    fontSize: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50, // Adjust for status bar, or use SafeAreaView
    paddingBottom: 15,
    backgroundColor: "#f7fdfd", // Can be transparent if container has color
  },
  greeting: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 26,
    color: "#222",
  },
  iconContainer: {
    flexDirection: "row",
  },
  headerIcon: {
    marginLeft: 15, // Space between icons if multiple
    padding: 5, // Easier touch target
  },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: 5,
    marginBottom: 20,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIconElement: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40, // Ensure consistent height
    fontSize: 15,
    color: "#333",
    fontFamily: "Poppins_400Regular",
  },
  clearButton: {
    padding: 5, // Easier touch target
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  seeAll: {
    color: "#1ea5b0",
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
  },
  categoryScroll: {
    // No specific style needed if contentContainerStyle handles padding
  },
  categoryScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  categoryCard: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#fff", // Default background
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  activeCategory: {
    backgroundColor: "#1ea5b0",
    borderColor: "#1ea5b0",
  },
  categoryLabel: {
    fontSize: 14,
    fontFamily: "Poppins_400Regular",
    color: "#333", // Default text color
  },
  activeCategoryText: {
    color: "#fff",
    fontFamily: "Poppins_600SemiBold",
  },
  categoryIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  bannerFlatList: {
    // If you want visible portion of next/prev items, you might need to adjust
  },
  bannerFlatListContent: {
    paddingHorizontal: 20, // So first item starts with padding
  },
  bannerCard: {
    width: screenWidth - 40, // Full width within padding
    height: 200,
    borderRadius: 12,
    marginRight: 15, // Space between banner cards
    overflow: "hidden",
    backgroundColor: "#e0e0e0", // Placeholder
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    backgroundColor: "rgba(0,0,0,0.3)", // Darker overlay for text contrast
  },
  bannerButton: {
    alignSelf: "flex-start", // Or 'center', 'flex-end'
    backgroundColor: "#fff",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  bannerButtonText: {
    color: "#1ea5b0",
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
  },
  artistScroll: {},
  artistScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  artistCard: {
    width: 100, // Slightly wider
    marginRight: 12,
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  artistImage: {
    width: 80,
    height: 80,
    borderRadius: 40, // Make it circular
    marginBottom: 8,
    backgroundColor: "#e0e0e0",
  },
  artistName: {
    fontSize: 13,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    textAlign: "center",
  },
  artistCategory: {
    fontSize: 11,
    color: "#777",
    fontFamily: "Poppins_400Regular",
    textAlign: "center",
  },
  featuredEventsScroll: {},
  featuredEventsScrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  featuredCard: {
    marginRight: 12,
    width: 220,
    height: 200,
    borderRadius: 12,
    backgroundColor: "#fff",
    overflow: "hidden", // Important for image border radius
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  featuredImage: {
    width: "100%",
    height: 130,
    backgroundColor: "#e0e0e0",
  },
  featuredTitle: {
    fontSize: 14,
    fontFamily: "Poppins_600SemiBold",
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: "#333",
  },
});

export default ArtistScreen;
