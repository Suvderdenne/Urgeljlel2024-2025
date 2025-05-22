import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Linking, // Added for potential website links
  Modal, // Added for review modal
  TextInput, // Added for review input
  Alert, // Added for alerts
} from "react-native";
import React, { useState, useEffect, useCallback } from "react"; // useCallback added
import axios from "axios";
import { useLocalSearchParams, Stack, useRouter } from "expo-router"; // ✅ Stack импорт хийсэн, useRouter for back
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons, AntDesign } from "@expo/vector-icons"; // For icons
import { jwtDecode } from "jwt-decode"; // Import jwtDecode for token handling

const { width } = Dimensions.get("window");
const BASE_URL = "http://127.0.0.1:8000"; // Ensure this is correct

// Interface definitions
interface Category {
  id: number;
  name: string;
}
interface Artist {
  id: number;
  name: string;
  bio?: string; // Bio might be optional
  price?: number; // Price might be optional or null
  profile_picture?: string; // Added optional chaining, assuming it might be null/missing
  category: Category;
  website?: string; // Assuming artist might have a website
  // Add any other fields you expect from the backend /artists/{id}/ endpoint
}

// Helper functions for token management (Copy these from where they are correctly implemented)
// Ideally these would be in a separate utility file and imported.
// --- Copy the actual implementation of these token helpers from your working code ---
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

const getValidAccessToken = async (): Promise<string | null> => {
  let token = await AsyncStorage.getItem("jwt_token");
  if (token) {
    const expiryTime = getTokenExpiry(token);
    if (expiryTime === null || isTokenExpired(expiryTime)) {
      console.log("Access token is expired or invalid, attempting refresh.");
      try {
        const token = await refreshToken(); // Ensure refreshToken is defined/imported
        return token;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Consider redirecting to login here if token refresh fails permanently
        // router.replace('/login');
        return null;
      }
    }
  } else {
    console.log(
      "No access token found, attempting refresh (first time or after logout)."
    );
    try {
      const token = await refreshToken();
    } catch (error) {
      console.error(
        "Failed to refresh token (no initial access token):",
        error
      );
      // router.replace('/login'); // Uncomment if critical auth failure should redirect
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
      // router.replace('/login'); // Uncomment if critical auth failure should redirect
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
    // router.replace('/login'); // Uncomment if critical auth failure should redirect
    throw new Error("Refresh token invalid or expired. Please log in again.");
  }
};
// --- End Copy ---

const ArtistDetailScreen = () => {
  const [artist, setArtist] = useState<Artist | null>(null);
  const [loading, setLoading] = useState<boolean>(true); // Set true initially to load data on mount
  const [error, setError] = useState<string | null>(null);
  const { artistId } = useLocalSearchParams<{ artistId?: string }>(); // Specify type for params
  const router = useRouter(); // For back navigation

  // States for review modal and rating
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // 0 means no rating yet

  // Fetch artist data on component mount or when artistId changes
  useEffect(() => {
    // artistId will be string | string[] | undefined from useLocalSearchParams
    const idToFetch = Array.isArray(artistId) ? artistId[0] : artistId;

    if (idToFetch) {
      console.log("Artist ID received:", idToFetch);
      fetchArtistDetail(idToFetch); // Pass the string ID
    } else {
      console.error("No artist ID provided in route params.");
      setError("Уран бүтээлчийн ID олдсонгүй.");
      setLoading(false); // Stop loading if no ID
    }
  }, [artistId]); // Depend on artistId

  const fetchArtistDetail = async (id: string) => {
    // Expecting a string ID
    setLoading(true);
    setError(null);

    try {
      // Use the helper function to get a valid token
      const token = await getValidAccessToken();

      if (!token) {
        setError("Нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү.");
        // Potentially redirect to login: router.replace('/login');
        setLoading(false);
        return;
      }

      // Make API call to fetch artist details using id
      // Assuming your API endpoint for a single artist is /artists/{id}/
      const response = await axios.get(`${BASE_URL}/artists/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        setArtist(response.data);
      } else {
        // Handle cases like 404 Not Found specifically if the API returns other statuses for not found
        // A 404 would typically be caught in the catch block by axios
        setError(`Уран бүтээлч олдсонгүй.`); // More user-friendly for not found
      }
    } catch (err: any) {
      // Catch any errors during the fetch
      console.error("Error fetching artist detail:", err);
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Artist fetch response error data:", err.response.data);
          console.error(
            "Artist fetch response error status:",
            err.response.status
          );

          if (err.response.status === 401) {
            setError("Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.");
            // router.replace('/login'); // Redirect on auth failure
          } else if (err.response.status === 404) {
            setError("Уран бүтээлч олдсонгүй."); // Specific message for 404
          } else {
            // Attempt to show a more specific error from backend data if available
            const backendError =
              err.response.data?.detail || JSON.stringify(err.response.data);
            setError(
              `Уран бүтээлч татахад алдаа гарлаа: ${err.response.status} - ${backendError}`
            );
          }
        } else if (err.request) {
          setError(
            "Сервертэй холбогдоход алдаа гарлаа. Интернэт холболтоо шалгана уу."
          );
        } else {
          setError(`Хүсэлт илгээхэд алдаа гарлаа: ${err.message}`);
        }
      } else {
        setError(`Үл мэдэгдэх алдаа гарлаа: ${err}`);
      }
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  // --- Functions for review modal and rating ---
  const handleRating = (newRating: number) => {
    setRating(newRating);
    // TODO: You might want to provide visual feedback here immediately
    console.log(`Artist ${artist?.id} rated with ${newRating} stars.`);
  };

  const handleSubmitReview = async () => {
    if (!artist?.id) {
      Alert.alert("Алдаа", "Уран бүтээлчийн ID олдсонгүй.");
      return;
    }
    if (!review.trim()) {
      Alert.alert("Алдаа", "Сэтгэгдэл хоосон байна.");
      return;
    }
    if (rating === 0) {
      Alert.alert("Анхааруулга", "Үнэлгээгээ өгнө үү.");
      return;
    }

    console.log(
      "Review submitted:",
      review,
      "for artist:",
      artist.id,
      "Rating:",
      rating
    );

    // TODO: Send review and rating to your backend API for this artistId
    // Example API call (adjust endpoint and payload as per your backend)
    // Assuming an endpoint like POST /artists/{id}/reviews/
    setLoading(true); // Show loading while submitting review
    try {
      const token = await getValidAccessToken();
      if (!token) {
        Alert.alert(
          "Нэвтрэх алдаа",
          "Сэтгэгдэл үлдээхэд нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү."
        );
        // router.replace('/login'); // Redirect on auth failure
        return;
      }

      const reviewPayload = {
        comment: review.trim(),
        rating: rating, // Assuming rating is sent as a number
        // Include artist ID in the URL or payload depending on backend API design
        // artist_id: artist.id // If backend expects it in payload
      };

      const response = await axios.post(
        `${BASE_URL}/artists/${artist.id}/reviews/`,
        reviewPayload,
        {
          // Adjust endpoint
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        // Assuming 201 Created on success
        Alert.alert("Амжилттай", "Сэтгэгдэл амжилттай илгээгдлээ.");
        // Optional: Refresh artist details to show new review if implemented
        // fetchArtistDetail(artist.id.toString());
      } else {
        Alert.alert(
          "Алдаа",
          `Сэтгэгдэл илгээхэд алдаа гарлаа (Статус: ${response.status}).`
        );
      }
    } catch (err: any) {
      console.error("Error submitting review:", err);
      let errorMessage = "Сэтгэгдэл илгээхэд алдаа гарлаа. Дахин оролдоно уу.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Review submit response data:", err.response.data);
          console.error("Review submit response status:", err.response.status);
          if (err.response.status === 401)
            errorMessage = "Нэвтрэх эрх хүчингүй. Дахин нэвтэрнэ үү.";
          else if (err.response.status === 400) {
            // Handle bad request errors from backend validation
            const backendErrors =
              err.response.data?.detail || JSON.stringify(err.response.data);
            errorMessage = `Мэдээлэл буруу байна: ${backendErrors}`;
          } else errorMessage = `Серверийн алдаа: ${err.response.status}`;
        } else if (err.request) {
          errorMessage = "Сэтгэгдэл илгээхэд сүлжээний алдаа гарлаа.";
        } else {
          errorMessage = `Сэтгэгдэл илгээхэд алдаа гарлаа: ${err.message}`;
        }
      } else {
        errorMessage = `Үл мэдэгдэх алдаа: ${err}`;
      }
      Alert.alert("Алдаа", errorMessage);
    } finally {
      setLoading(false); // Stop loading
      setModalVisible(false); // Close modal regardless of success/failure
      setReview(""); // Clear review input
      setRating(0); // Reset rating
    }
  };

  // --- UI Rendering ---

  // Show loading state
  if (loading && !artist && !error) {
    // Only show full loading if no data yet
    return (
      <>
        <Stack.Screen
          options={{ headerShown: true, title: "Уншиж байна..." }}
        />
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1ea5b0" />
          <Text style={styles.messageText}>Мэдээлэл ачааллаж байна...</Text>
        </View>
      </>
    );
  }

  // Show error state
  if (error && !artist) {
    // Only show full error if no data was loaded
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: "Алдаа" }} />
        <View style={styles.centered}>
          <Text style={styles.loadingErrorText}>{error}</Text>
          {/* Retry button */}
          {artistId && (
            <TouchableOpacity
              style={styles.retryButton}
              // Call fetchArtistDetail with the id on retry
              onPress={() =>
                fetchArtistDetail(
                  Array.isArray(artistId) ? artistId[0] : artistId!
                )
              } // Ensure artistId is string for function
            >
              <Text style={styles.retryButtonText}>Дахин оролдох</Text>
            </TouchableOpacity>
          )}

          {/* Go back button */}
          <TouchableOpacity
            style={[
              styles.retryButton,
              { marginTop: 10, backgroundColor: "#ccc" },
            ]}
            onPress={() => router.back()}
          >
            <Text style={[styles.retryButtonText, { color: "#333" }]}>
              Буцах
            </Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // Show data not found state
  if (!artist && !loading && !error) {
    // If not loading, no error, but no artist data
    return (
      <>
        <Stack.Screen options={{ headerShown: true, title: "Олдсонгүй" }} />
        <View style={styles.centered}>
          <Text style={styles.loadingErrorText}>
            Уран бүтээлчийн мэдээлэл олдсонгүй.
          </Text>
          {/* Go back button */}
          <TouchableOpacity
            style={styles.retryButton} // Reuse retry button style
            onPress={() => router.back()}
          >
            <Text style={styles.retryButtonText}>Буцах</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  // --- Render Artist Data (if artist data is available) ---
  // Use optional chaining (?.) extensively here as artist might be null during transitions
  // although the checks above should prevent rendering this block if artist is null
  return (
    <>
      {/* Configure the header using Stack.Screen options */}
      <Stack.Screen
        options={{
          headerShown: true, // Show header
          title: artist?.name || "Artist Detail", // Set header title to artist name (use optional chaining)
          headerBackVisible: false, // Hide default back button
          headerLeft: () => (
            // Custom back button
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <AntDesign name="left" size={24} color="#2F58CD" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            // Add review icon to header right
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={{ marginRight: 15 }}
            >
              <Ionicons name="chatbubble-outline" size={24} color="#2F58CD" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#F5F7FA", // Match background
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18, // Adjust font size if needed
          },
          headerTitleAlign: "center", // Center the title
        }}
      />

      <ScrollView style={styles.container}>
        {/* Artist Profile Picture */}
        {/* Use stricter conditional rendering for image */}
        {artist?.profile_picture &&
        typeof artist.profile_picture === "string" &&
        artist.profile_picture.length > 0 ? (
          <Image
            source={{ uri: `${BASE_URL}${artist.profile_picture}` }}
            style={styles.artistImage}
          />
        ) : (
          // Placeholder if no image
          <View style={styles.imagePlaceholder}>
            <Ionicons name="person-circle-outline" size={80} color="#ccc" />
            <Text style={styles.imagePlaceholderText}>Зураггүй</Text>
          </View>
        )}
        {/* Artist Name and Icons */}
        <View style={styles.nameIconContainer}>
          {" "}
          {/* New container for name and icons */}
          <Text style={styles.artistName}>{artist?.name}</Text>{" "}
          {/* Use optional chaining */}
          {/* Review icon near name - Alternative location if not in header */}
          {/* <TouchableOpacity onPress={() => setModalVisible(true)} style={{ marginLeft: 10 }}>
                   <Ionicons name="chatbubble-outline" size={25} color="#2F58CD" />
             </TouchableOpacity> */}
        </View>
        {/* Artist Category */}
        <Text style={styles.artistCategory}>{artist?.category?.name}</Text>{" "}
        {/* Use optional chaining */}
        {/* Artist Website (if exists) */}
        {artist?.website &&
          typeof artist.website === "string" &&
          artist.website.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                Linking.openURL(artist.website!).catch((err) =>
                  console.error("Failed to open URL:", err)
                );
              }}
            >
              {" "}
              {/* Use non-null assertion ! if sure it's a string here */}
              <Text style={styles.artistWebsite}>🌐 {artist.website}</Text>
            </TouchableOpacity>
          )}
        {/* Artist Bio */}
        <Text style={styles.artistBioLabel}>Намтар:</Text>
        <Text style={styles.artistBio}>
          {artist?.bio || "Намтар оруулаагүй байна."}{" "}
          {/* Use optional chaining */}
        </Text>
        {artist?.price !== undefined && artist.price !== null && (
          <>
            <Text style={styles.artistPriceLabel}>Үнэ:</Text>{" "}
            {/* "Үнэ:" гэсэн label текст */}
            <Text style={styles.artistPrice}>
              {" "}
              {/* Үнийн утгыг харуулах текст */}
              {artist.price.toLocaleString()} ₮
            </Text>
          </>
        )}
        {/* --- Actions Section --- */}
        <View style={styles.actionsSection}>
          {/* Захиалга өгөх Button */}
          <TouchableOpacity
            style={styles.bookingButton} // Use a dedicated style for booking button
            // TODO: Define navigation target or modal for booking
            onPress={() => {
              if (artist?.id !== undefined && artist.id !== null) {
                router.push({
                  pathname: "/BookingScreen", // Adjust the path to your booking screen
                  params: { artistId: artist.id.toString() }, // Pass artist ID
                });
              } else {
                console.warn(
                  "Cannot navigate to Booking: Artist ID is missing."
                );
                // Alert.alert("Error", "Artist ID is missing to book.");
              }
            }}
            disabled={!artist?.id} // Disable if artist or id is missing
          >
            <Text style={styles.bookingButtonText}>Захиалга өгөх</Text>
          </TouchableOpacity>
        </View>
        {/* --- Review Modal (Similar to EventDetail) --- */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>
                Сэтгэгдэл үлдээж, үнэлгээ өгөх
              </Text>{" "}
              {/* Updated title */}
              {/* Rating selection inside modal */}
              <View style={styles.modalRatingContainer}>
                <Text>Үнэлгээ: </Text>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => handleRating(i)}>
                    <Ionicons
                      name={i <= rating ? "star" : "star-outline"}
                      size={20}
                      color="#ffd700"
                    />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput
                style={styles.input} // Reuse input style
                placeholder="Сэтгэгдлээ бичнэ үү..."
                value={review}
                onChangeText={setReview}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton} // Reuse modal button style
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.buttonText}>Илгээх</Text>{" "}
                  {/* Reuse buttonText style */}
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]} // Reuse modal button style + cancel style
                  onPress={() => {
                    setModalVisible(false);
                    setReview(""); // Clear on cancel
                    setRating(0); // Reset rating on cancel
                  }}
                >
                  <Text style={[styles.buttonText, { color: "#333" }]}>
                    Болих
                  </Text>{" "}
                  {/* Reuse buttonText style */}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Consistent background
    // Remove default padding from container, apply to inner elements
    // paddingTop: 20, // Use padding here if not using Stack.Screen header
  },
  centered: {
    // Style for full screen loading/error/not found
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20, // Add padding
  },
  loadingErrorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F", // Error color
    marginBottom: 20,
    fontFamily: "Poppins_400Regular",
    lineHeight: 22, // Add line height for readability
  },
  retryButton: {
    // Style for retry/go back button in error/not found states
    backgroundColor: "#1ea5b0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10, // Match EventDetail button style
    shadowColor: "#000", // Add shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    // Style for retry/go back button text
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold", // Match button text style
    fontFamily: "Poppins_600SemiBold", // Match button text style
  },
  messageText: {
    // Style for loading/not found messages
    marginTop: 10,
    fontFamily: "Poppins_400Regular",
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22, // Add line height
  },

  // --- Artist Details Styles ---
  artistImage: {
    width: "100%",
    height: width * 0.8, // Responsive height
    borderBottomLeftRadius: 16, // Match EventDetail image style
    borderBottomRightRadius: 16, // Match EventDetail image style
    marginBottom: 20, // Space below image
    backgroundColor: "#e0e0e0", // Placeholder color
    resizeMode: "cover", // Ensure image covers the area
  },
  imagePlaceholder: {
    width: "100%",
    height: width * 0.8,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderBottomLeftRadius: 16, // Match image style
    borderBottomRightRadius: 16, // Match image style
    marginBottom: 20, // Space below
  },
  imagePlaceholderText: {
    marginTop: 10,
    color: "#aaa",
    fontFamily: "Poppins_400Regular",
  },
  nameIconContainer: {
    // Container for artist name and review icon
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20, // Match EventDetail padding
    marginBottom: 8, // Space below name/icons - Keep it tight
  },
  artistName: {
    fontSize: 26, // Slightly adjusted size, match EventDetail title
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
    flex: 1, // Allow name to take available space
    marginRight: 10, // Space between name and icon
    lineHeight: 30, // Add line height
  },
  artistCategory: {
    fontSize: 15, // Slightly larger category text, match EventDetail detail text size
    fontFamily: "Poppins_400Regular",
    color: "#555", // Match EventDetail detail text color
    marginTop: 4, // Match EventDetail detail text top margin
    marginBottom: 15, // Space below category
    paddingHorizontal: 20, // Match EventDetail padding
  },
  artistWebsite: {
    fontSize: 15, // Match detail text size
    color: "#007aff", // Link color
    textDecorationLine: "underline",
    marginTop: -10, // Adjust top margin to align closer to category
    marginBottom: 20, // Space below website
    paddingHorizontal: 20, // Match padding
    fontFamily: "Poppins_400Regular",
  },
  artistBioLabel: {
    fontSize: 18, // Match EventDetail section title
    fontFamily: "Poppins_600SemiBold",
    color: "#2b2b2b", // Match EventDetail section title color
    marginTop: 15, // Space above
    marginBottom: 10, // Space below, match EventDetail section title
    paddingHorizontal: 20, // Match padding
  },
  artistBio: {
    fontSize: 16, // Match EventDetail description text size
    fontFamily: "Poppins_400Regular",
    lineHeight: 24, // Improved readability
    marginBottom: 20, // Space below bio
    color: "#555", // Match EventDetail description color
    paddingHorizontal: 20, // Match padding
    backgroundColor: "#fff", // Add background like EventDetail description
    borderRadius: 16, // Match EventDetail description radius
    marginHorizontal: 20, // Match EventDetail description horizontal margin
    padding: 16, // Match EventDetail description padding
    shadowColor: "#000", // Match EventDetail description shadow
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  artistPriceLabel: {
    fontSize: 18, // Match EventDetail section title
    fontFamily: "Poppins_600SemiBold",
    color: "#2b2b2b", // Match EventDetail section title color
    marginTop: 15, // Space above price
    marginBottom: 10, // Space below price, match EventDetail section title
    paddingHorizontal: 20, // Match padding
  },
  artistPrice: {
    fontSize: 16, // Match EventDetail detail text size
    fontFamily: "Poppins_400Regular",
    color: "#1ea5b0", // Match EventDetail price color
    paddingHorizontal: 20, // Match padding
    marginBottom: 20, // Space below price
  },

  // --- Actions Section Styles ---
  actionsSection: {
    paddingHorizontal: 20, // Match general padding
    marginTop: 20, // Space above the section
    marginBottom: 30, // Space below the section
    alignItems: "center", // Center the button horizontally
  },
  bookingButton: {
    // Style for the "Захиалга өгөх" button - Match EventDetail button
    backgroundColor: "#2F58CD", // Primary button color
    borderRadius: 10, // Rounded corners - Match EventDetail button
    paddingVertical: 14, // Vertical padding - Match EventDetail button
    paddingHorizontal: 25, // Horizontal padding - Adjusted for text fit
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
    minHeight: 50, // Minimum height
    width: "100%", // Take full width within padding
    maxWidth: 300, // Max width for larger screens - Added for consistency
    shadowColor: "#000", // Shadow for depth - Match EventDetail button
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  bookingButtonText: {
    // Style for the booking button text - Match EventDetail button text
    color: "#fff", // White text color
    fontSize: 18, // Font size
    fontWeight: "bold", // Bold font weight
    fontFamily: "Poppins_600SemiBold", // Font family
  },

  // --- Modal Styles (Copied from EventDetail) ---
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 20,
    width: "85%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "Poppins_600SemiBold",
    color: "#333", // Match EventDetail modal title color
  },
  modalRatingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    gap: 5, // Space between stars
  },
  input: {
    // Style for review input - Match EventDetail input
    height: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
    fontSize: 15,
    fontFamily: "Poppins_400Regular",
    color: "#333", // Match EventDetail input text color
    backgroundColor: "#fff", // Match EventDetail input background
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    // Style for modal buttons (Send, Cancel) - Match EventDetail modal button
    flex: 1,
    backgroundColor: "#2F58CD", // Primary button color
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center", // Center vertically
  },
  buttonText: {
    // Reused buttonText style for modal buttons - Match EventDetail modal button text
    color: "#fff",
    fontSize: 16, // Match EventDetail modal button text size
    fontWeight: "bold",
    fontFamily: "Poppins_600SemiBold",
  },
  // Specific style for Cancel modal button text if needed
  cancelButtonText: {
    color: "#333", // Match EventDetail cancel button text color
  },
});
export default ArtistDetailScreen;
