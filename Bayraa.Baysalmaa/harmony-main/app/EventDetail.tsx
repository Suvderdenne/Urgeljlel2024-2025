import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Linking,
  Modal,
  TextInput,
  ActivityIndicator, // Added for loading
  Alert,
  // GestureResponderEvent, // Not typically needed here, likely copied by mistake
} from "react-native";
import React, { useState, useEffect, useCallback } from "react"; // useCallback added
import axios from "axios";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

const { width } = Dimensions.get("window");
const BASE_URL = "http://127.0.0.1:8000"; // Ensure this is correct

// Interface definitions (keep them as they were)
interface Organizer {
  name: string;
  logo?: string;
  website?: string;
}

interface TicketType {
  name: string;
}

interface TicketDetail {
  ticket_type: TicketType;
  price: number;
  description?: string;
}

interface EventData {
  id: number; // Changed to number based on common API practice and the artist screen passing item.id.toString() - assuming API expects number
  title: string;
  image?: string; // This is the backend image path/URL (expecting a string like "/media/...")
  description?: string;
  location: string;
  date: string; // Assuming date comes as a string
  organizers?: Organizer[];
  details?: TicketDetail[]; // Assuming 'details' holds ticket info
}

// Helper functions for token management (copied from ArtistScreen for completeness)
// !!! MAKE SURE THESE ARE CORRECTLY IMPLEMENTED AND ACCESSIBLE IN YOUR PROJECT !!!
// (Copy these functions exactly from where they work in your ArtistScreen or other auth logic files)
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

// Define fetchEventDetails outside the component to be callable by useEffect and the retry button
// This function takes necessary parameters including state setters and token getter
const fetchEventDetails = async (
  eventId: string | undefined | string[],
  setEventData: React.Dispatch<React.SetStateAction<EventData | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  getValidAccessToken: () => Promise<string | null> // Pass token getter function
) => {
  if (!eventId) {
    setError("Event ID is missing.");
    setLoading(false);
    return;
  }
  // Handle case where eventId might be an array from useLocalSearchParams
  const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;
  if (!eventIdString) {
    setError("Invalid Event ID format.");
    setLoading(false);
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const token = await getValidAccessToken(); // Use the passed token getter
    if (!token) {
      setError("Нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү.");
      setLoading(false);
      return;
    }
    // Use eventIdString for the API call
    const response = await axios.get(`${BASE_URL}/events/${eventIdString}/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setEventData(response.data); // Update event data state
  } catch (err: any) {
    console.error("Error fetching event details:", err);
    if (axios.isAxiosError(err)) {
      if (err.response?.status === 401)
        setError("Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.");
      else if (err.response?.status === 404)
        setError("Энэхүү эвэнт олдсонгүй.");
      else setError("Мэдээлэл татахад алдаа гарлаа.");
    } else {
      setError("Мэдээлэл татахад алдаа гарлаа.");
    }
  } finally {
    setLoading(false); // Always stop loading
  }
};

const EventDetail = () => {
  const router = useRouter();
  // Get eventId from params. It can be string, string[], or undefined.
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  const [eventData, setEventData] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true); // Loading state for fetch
  const [error, setError] = useState<string | null>(null); // Error state for fetch

  // States for like, modal, review, rating (not directly related to fetch error)
  const [liked, setLiked] = useState(false); // You might want to fetch initial like status
  const [modalVisible, setModalVisible] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0); // You might want to fetch initial rating

  // Use useCallback for the fetch function if you plan to include it in useEffect dependencies
  // If fetchEventDetails is defined outside and passed state setters, useCallback for fetchEventDetails might not be needed
  // as much as making getValidAccessToken stable if it were defined inside.
  // Given fetchEventDetails is outside and takes state setters, let's make it a useCallback for clarity if we need it in dependencies.
  // However, since we are passing state setters and getValidAccessToken into fetchEventDetails,
  // the simplest approach for useEffect dependency is just [eventId] and the outside fetch function reference if it doesn't change.
  // A better pattern for useCallback is if the function is defined INSIDE the component.
  // Let's keep fetchEventDetails outside and pass needed variables to it.

  // Fetch event data on component mount or when eventId changes
  useEffect(() => {
    // Call the outside fetch function, passing the necessary states and params
    fetchEventDetails(
      eventId,
      setEventData,
      setLoading,
      setError,
      getValidAccessToken
    );
    // Dependencies: eventId changes, or the fetchEventDetails function itself changes (it's outside, so its reference is stable unless redefined)
    // Including state setters and getValidAccessToken in dependencies is a stricter approach if they could change,
    // but they are from useState/const, so their references are stable.
    // Let's include them for strictness, though [eventId] might suffice if fetchEventDetails is guaranteed stable.
  }, [eventId, setEventData, setLoading, setError, getValidAccessToken]);

  // Helper to format date (assuming it's a valid date string)
  const formatDate = (dateString: string | undefined | null) => {
    // Added undefined/null check
    if (!dateString) return "Invalid Date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date"; // Check if date is valid
      // Use toLocaleString with options for better control and potential localization
      return date.toLocaleString("mn-MN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Invalid Date";
    }
  };

  // --- Functions for like, modal, review, rating ---
  const handleRating = (newRating: number) => {
    setRating(newRating);
    // TODO: Send rating to your backend API if needed
    console.log(`Rated event ${eventId} with ${newRating} stars.`);
  };

  const toggleLike = () => {
    const newState = !liked;
    setLiked(newState);
    // TODO: Send like/unlike status to your backend API
    console.log(`${newState ? "Like" : "Unlike"} event ${eventId}`);
  };

  const handleSubmitReview = () => {
    if (!review.trim()) {
      Alert.alert("Алдаа", "Сэтгэгдэл хоосон байна.");
      return;
    }
    console.log(
      "Review submitted:",
      review,
      "for event:",
      eventData?.id, // Use optional chaining
      "Rating:",
      rating
    );
    // TODO: Send review and rating to backend here for this eventId
    setModalVisible(false);
    setReview(""); // Clear review input after submission
    setRating(0); // Reset rating after submission
  };

  // --- Loading State UI ---
  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ea5b0" />
        <Text style={styles.loadingErrorText}>Ачааллаж байна...</Text>
      </View>
    );
  }

  // --- Error State UI ---
  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingErrorText}>{error}</Text>
        {/* Retry button calls the outside fetchEventDetails function */}
        {/* Pass current eventId and state setters */}
        {eventId && ( // Only show retry if we have an eventId
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() =>
              fetchEventDetails(
                eventId,
                setEventData,
                setLoading,
                setError,
                getValidAccessToken
              )
            }
          >
            <Text style={styles.retryButtonText}>Дахин оролдох</Text>
          </TouchableOpacity>
        )}
        {/* Optional: Go back button in error state */}
        <TouchableOpacity
          style={[
            styles.retryButton,
            { marginTop: 10, backgroundColor: "#ccc" },
          ]} // Add spacing and different color
          onPress={() => router.back()}
        >
          <Text style={[styles.retryButtonText, { color: "#333" }]}>Буцах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Data Not Found State UI (e.g., 404 from API or eventData is null after successful fetch) ---
  if (!eventData) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingErrorText}>
          Эвэнтийн мэдээлэл олдсонгүй.
        </Text>
        {/* Go back button */}
        <TouchableOpacity
          style={styles.retryButton} // Reuse retry button style
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Буцах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // --- Debugging Logs ---
  console.log("--- Rendering Event Detail ---");
  console.log("Event Data:", eventData); // Бүх eventData object-ийг харах
  console.log("Event Image Value:", eventData.image); // image талбарын утгыг харах (null, string, undefined?)

  // --- Render Event Data (if not loading and no error, and eventData exists) ---
  return (
    <>
      {/* Configure the header using Stack.Screen options */}
      <Stack.Screen
        options={{
          headerShown: true, // Show header
          title: eventData.title, // Set header title to event title
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

      {/* ScrollView starts below the header */}
      <ScrollView style={styles.scrollViewContent}>
        {/* Image Section */}
        {/* Conditional rendering-ийг илүү тодорхой болгосон */}
        {/* Only render Image component if eventData.image is a non-empty string */}
        {
          eventData.image &&
          typeof eventData.image === "string" &&
          eventData.image.length > 0 ? (
            <View style={{ position: "relative" }}>
              {/* Ensure eventData.image is a valid string path relative to BASE_URL */}
              {/* Example: source={{ uri: 'http://127.0.0.1:8000/media/events/my_image.jpg' }} */}
              <Image
                source={{ uri: `${BASE_URL}${eventData.image}` }}
                style={styles.image}
              />
              {/* Rating container on the image (Commented out in user's code) */}
              {/* <View style={styles.ratingContainer}>
              {[1, 2, 3, 4, 5].map((i) => (
                <TouchableOpacity key={i} onPress={() => handleRating(i)}>
                  <Ionicons
                    name={i <= rating ? "star" : "star-outline"}
                    size={20}
                    color="#ffd700"
                  />
                </TouchableOpacity>
              ))}
            </View> */}
            </View>
          ) : // Optional: Show a placeholder or nothing if no image is available
          // <View style={styles.noImagePlaceholder}><Text>Зураг байхгүй</Text></View>
          null // Render nothing if no valid image
        }

        {/* Title and Icons */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{eventData.title}</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={toggleLike}>
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={30}
                color={liked ? "red" : "#ccc"}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons name="chatbubble" size={25} color="#9b5de5" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Event Details */}
        <Text style={styles.detail}>📍 {eventData.location}</Text>
        {/* Use optional chaining for eventData.date and handle potential null/undefined in formatDate */}
        <Text style={styles.detail}>🗓️ {formatDate(eventData.date)}</Text>

        {/* Description */}
        {eventData.description &&
          typeof eventData.description === "string" &&
          eventData.description.length > 0 && ( // Stricter check for description
            <Text style={styles.description}>{eventData.description}</Text>
          )}

        {/* Organizers Section */}
        {/* Use optional chaining for eventData.organizers and check if it's an array with elements */}
        {eventData.organizers &&
          Array.isArray(eventData.organizers) &&
          eventData.organizers.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Зохион байгуулагч</Text>
              {eventData.organizers.map((org, index) => (
                <View key={index} style={styles.organizerBox}>
                  {org.logo &&
                    typeof org.logo === "string" &&
                    org.logo.length > 0 && ( // Stricter check for organizer logo
                      <Image
                        source={{ uri: `${BASE_URL}${org.logo}` }} // Assuming organizer logo is also a path relative to BASE_URL
                        style={styles.organizerLogo}
                      />
                    )}
                  <View style={{ flex: 1 }}>
                    <Text style={styles.organizerName}>{org.name}</Text>
                    {org.website &&
                      typeof org.website === "string" &&
                      org.website.length > 0 && ( // Stricter check for website
                        // --- Fix applied here ---
                        <Text
                          style={styles.organizerWebsite}
                          onPress={() => {
                            // Wrapped in an explicit arrow function body
                            if (
                              org.website &&
                              typeof org.website === "string"
                            ) {
                              // Check before opening URL
                              Linking.openURL(org.website).catch((err) =>
                                console.error("Failed to open URL:", err)
                              ); // Add error handling for Linking
                            } else {
                              console.warn(
                                "Attempted to open invalid URL:",
                                org.website
                              );
                            }
                          }}
                        >
                          {org.website}
                        </Text>
                        // --- End Fix ---
                      )}
                  </View>
                </View>
              ))}
            </View>
          )}

        {/* Ticket Types Section (if details are ticket types) */}
        {/* Use optional chaining for eventData.details and check if it's an array with elements */}
        {eventData.details &&
          Array.isArray(eventData.details) &&
          eventData.details.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Тасалбарын мэдээлэл</Text>
              {eventData.details.map((ticket, index) => (
                <View key={index} style={styles.ticketInfoBox}>
                  {/* Use optional chaining (?.) for ticket_type in case it's null or undefined */}
                  <Text style={styles.ticketTypeName}>
                    {ticket.ticket_type?.name || "Standard"}
                  </Text>
                  <Text style={styles.ticketPrice}>{ticket.price} ₮</Text>
                  {ticket.description &&
                    typeof ticket.description === "string" &&
                    ticket.description.length > 0 && ( // Stricter check for ticket description
                      <Text style={styles.ticketDescription}>
                        {ticket.description}
                      </Text>
                    )}
                </View>
              ))}
            </View>
          )}

        {/* Ticket Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (eventData?.id !== undefined && eventData.id !== null) {
              router.push({
                pathname: "/Ticket", // </-- ЭНД "/Ticket" зам руу шилжиж байна
                params: { eventId: eventData.id.toString() }, // <-- Event ID-г дамжуулж байна
              });
            } else {
              console.warn(
                "Cannot navigate to Ticket page: Event ID is missing."
              );
            }
          }}
          disabled={!eventData?.id}
        >
          <Text style={styles.buttonText}>Тасалбар авах</Text>
        </TouchableOpacity>

        {/* Review Modal (Keep as is - uses review, setReview, modalVisible, setModalVisible, handleSubmitReview) */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Сэтгэгдэл үлдээх</Text>
              {/* Rating selection inside modal could be useful */}
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
                style={styles.input}
                placeholder="Сэтгэгдлээ бичнэ үү..."
                value={review}
                onChangeText={setReview}
                multiline
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={styles.modalButton}
                  onPress={handleSubmitReview}
                >
                  <Text style={styles.buttonText}>Илгээх</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: "#ccc" }]} // Style for cancel button
                  onPress={() => {
                    setModalVisible(false);
                    setReview(""); // Clear on cancel
                    setRating(0); // Reset rating on cancel
                  }}
                >
                  <Text style={[styles.buttonText, { color: "#333" }]}>
                    Болих
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

export default EventDetail; // Export the component

const styles = StyleSheet.create({
  // Adjusted container and added scrollViewContent
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
    // Removed marginTop here, using Stack.Screen header instead
  },
  scrollViewContent: {
    flexGrow: 1, // Allows content to grow and enable scrolling
    backgroundColor: "#F5F7FA",
    paddingBottom: 20, // Add some padding at the bottom
  },
  centered: {
    // Style for loading/error states
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FA",
    padding: 20,
  },
  loadingErrorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F", // Error color
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
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: width,
    height: 260,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  // Removed absolute backButtonContainer as Stack.Screen header is used
  ratingContainer: {
    position: "absolute",
    bottom: 15,
    right: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    flex: 1,
    marginRight: 10, // Space between title and icons
  },
  iconContainer: {
    flexDirection: "row",
    gap: 12,
    // Removed marginLeft as flex:1 on title handles spacing
  },
  detail: {
    fontSize: 16,
    color: "#4a4a4a",
    marginTop: 4,
    paddingHorizontal: 16,
  },
  description: {
    fontSize: 16,
    color: "#555",
    lineHeight: 24,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    margin: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  section: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2b2b2b",
    marginBottom: 10,
  },
  organizerBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  organizerLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: "#eee", // Placeholder background
  },
  organizerName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  organizerWebsite: {
    fontSize: 14,
    color: "#007aff",
    marginTop: 4,
    textDecorationLine: "underline",
  },
  ticketInfoBox: {
    // Added style for ticket details
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  ticketTypeName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
  },
  ticketPrice: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1ea5b0", // Theme color for price
  },
  ticketDescription: {
    fontSize: 13,
    color: "#555",
    marginTop: 4,
  },
  button: {
    backgroundColor: "#2F58CD",
    margin: 20,
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
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
  },
  modalRatingContainer: {
    // Style for rating inside modal
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    gap: 5, // Space between stars
  },
  input: {
    height: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    textAlignVertical: "top",
    marginBottom: 15,
    fontSize: 15,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#2F58CD",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
});
