// app/BookingScreen.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput, // Keep TextInput
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  // Platform, // No longer needed if not using platform-specific pickers
} from "react-native";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocalSearchParams, Stack, useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons"; // For back button

import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

// Assuming token helper functions are defined or imported
// --- Copy the actual implementation of these token helpers from your working code ---
// IDEALLY, IMPORT THESE FROM A SEPARATE UTILITY FILE (e.g., import { getValidAccessToken } from '../../utils/auth';)
// Paste the actual implementations here or import them if they are in a utility file
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

const BASE_URL = "http://127.0.0.1:8000"; // Ensure this is correct

const BookingScreen = () => {
  const router = useRouter();
  // Get artistId from params
  const { artistId } = useLocalSearchParams<{ artistId?: string }>();

  // States for booking form inputs (using TextInput for all)
  const [bookingDate, setBookingDate] = useState(""); // e.g., YYYY-MM-DD
  const [bookingTime, setBookingTime] = useState(""); // e.g., HH:MM
  const [location, setLocation] = useState(""); // Booking location/address
  const [duration, setDuration] = useState(""); // e.g., number of hours (as string input)
  const [notes, setNotes] = useState(""); // Additional notes/requirements

  const [loading, setLoading] = useState(false); // Loading state for booking submission
  const [error, setError] = useState<string | null>(null); // Error state for submission

  useEffect(() => {
    if (!artistId) {
      Alert.alert("Алдаа", "Захиалга хийх уран бүтээлчийн ID олдсонгүй.");
      setError("Artist ID missing for booking.");
    }
  }, [artistId]); // Depend on artistId

  const handleSubmitBooking = async () => {
    // Basic validation (reverted to checking text input values)
    if (!artistId) {
      Alert.alert("Алдаа", "Уран бүтээлчийн ID байхгүй байна.");
      return;
    }
    const idToBook = Array.isArray(artistId) ? artistId[0] : artistId;
    if (!idToBook) {
      Alert.alert("Алдаа", "Уран бүтээлчийн ID буруу байна.");
      return;
    }

    if (
      !bookingDate.trim() ||
      !bookingTime.trim() ||
      !location.trim() ||
      !duration.trim()
    ) {
      Alert.alert(
        "Анхааруулга",
        "Захиалгын огноо, цаг, байршил, үргэлжлэх хугацааг заавал бөглөнө үү."
      );
      return;
    }

    // Basic date format validation (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (bookingDate.trim() && !dateRegex.test(bookingDate.trim())) {
      Alert.alert("Анхааруулга", "Огноог YYYY-MM-DD форматаар оруулна уу.");
      return;
    }

    // Basic time format validation (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (bookingTime.trim() && !timeRegex.test(bookingTime.trim())) {
      Alert.alert("Анхааруулга", "Цагийг HH:MM форматаар оруулна уу.");
      return;
    }

    // Basic duration validation (numeric)
    const durationValue = parseInt(duration.trim(), 10);
    if (isNaN(durationValue) || durationValue <= 0) {
      Alert.alert("Анхааруулга", "Үргэлжлэх хугацааг зөв оруулна уу (тоо).");
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors

    try {
      const token = await getValidAccessToken(); // Get valid token

      if (!token) {
        Alert.alert(
          "Нэвтрэх алдаа",
          "Захиалга үүсгэхэд нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү."
        );
        // router.replace('/login'); // Redirect to login on auth failure
        setLoading(false);
        return;
      }

      // Prepare payload for the booking request
      const payload = {
        artist: idToBook, // Pass artist ID - Match your backend BookingSerializer field name if it's 'artist'
        booking_date: bookingDate.trim(), // Use the date input
        booking_time: bookingTime.trim(), // Use the time input
        location: location.trim(), // Use the location input
        duration_hours: durationValue, // Use the validated duration (number)
        notes: notes.trim(), // Use the notes input
        // Add other fields required by your backend booking API
        // e.g., user_id (often handled by backend from token), status (handled by backend)
      };

      // Make POST request to backend booking endpoint
      // Assuming an endpoint like /bookings/
      const response = await axios.post(`${BASE_URL}/bookings/`, payload, {
        // Adjust endpoint if needed
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        // Assuming 201 Created on success
        Alert.alert("Амжилттай", "Захиалга амжилттай үүслээ.");
        // Optional: Navigate to a success page or back to artist detail
        router.back(); // Go back to previous screen (Artist Detail)
        // router.replace('/booking-success'); // Navigate to a dedicated success page
      } else {
        // Handle other potential success status codes if necessary
        Alert.alert(
          "Алдаа",
          `Захиалга үүсгэхэд алдаа гарлаа (Статус: ${response.status}).`
        );
      }
    } catch (err: any) {
      console.error("Booking submission failed:", err);
      let errorMessage = "Захиалга үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          console.error("Booking submit response data:", err.response.data);
          console.error("Booking submit response status:", err.response.status);
          // Handle specific backend errors
          if (err.response.status === 401) {
            errorMessage = "Нэвтрэх эрх хүчингүй байна. Дахин нэвтэрнэ үү.";
            // router.replace('/login'); // Redirect
          } else if (err.response.status === 400) {
            // Handle validation errors from backend
            const backendErrors =
              err.response.data?.detail || JSON.stringify(err.response.data);
            errorMessage = `Мэдээлэл дутуу эсвэл буруу байна: ${backendErrors}`;
          } else if (err.response.status === 403) {
            errorMessage = "Захиалга үүсгэх зөвшөөрөл байхгүй байна.";
          } else {
            errorMessage = `Серверийн алдаа: ${err.response.status}`;
          }
        } else if (err.request) {
          errorMessage =
            "Сервертэй холбогдоход алдаа гарлаа. Интернэт холболтоо шалгана уу.";
        } else {
          errorMessage = `Хүсэлт илгээхэд алдаа гарлаа: ${err.message}`;
        }
      } else {
        errorMessage = `Үл мэдэгдэх алдаа гарлаа: ${err}`;
      }

      Alert.alert("Алдаа", errorMessage);
    } finally {
      setLoading(false); // Always stop loading
    }
  };

  // --- UI Rendering ---

  // Show full screen error if no artistId was passed initially
  if (error && !loading && !artistId) {
    // Only show full error if no artistId was passed
    return (
      <>
        <Stack.Screen
          options={{ headerShown: true, title: "Захиалгын Алдаа" }}
        />
        <View style={styles.centered}>
          <Text style={styles.loadingErrorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => router.back()} // Go back as we can't book without ID
          >
            <Text style={styles.retryButtonText}>Буцах</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }

  return (
    <>
      {/* Configure the header */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Захиалга хийх", // Header title for booking
          headerBackVisible: false,
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
              disabled={loading} // Disable back button while loading
            >
              <AntDesign name="left" size={24} color="#2F58CD" />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: "#F5F7FA",
          },
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 18,
          },
          headerTitleAlign: "center",
        }}
      />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollViewContent}
      >
        <Text style={styles.headerTitle}>Захиалгын Мэдээлэл</Text>

        {/* Booking Date Input */}
        <Text style={styles.inputLabel}>Огноо:</Text>
        <TextInput
          style={styles.textInput} // Reuse text input style
          placeholder="YYYY-MM-DD"
          placeholderTextColor="#999"
          value={bookingDate}
          onChangeText={setBookingDate}
          keyboardType="numbers-and-punctuation" // Suggest keyboard for date
          editable={!loading} // Disable while loading
        />

        {/* Booking Time Input */}
        <Text style={styles.inputLabel}>Цаг:</Text>
        <TextInput
          style={styles.textInput} // Reuse text input style
          placeholder="HH:MM"
          placeholderTextColor="#999"
          value={bookingTime}
          onChangeText={setBookingTime}
          keyboardType="numbers-and-punctuation" // Suggest keyboard for time
          editable={!loading} // Disable while loading
        />

        {/* Booking Location Input */}
        <Text style={styles.inputLabel}>Байршил (Хаяг):</Text>
        <TextInput
          style={styles.textInput} // Reuse text input style
          placeholder="Захиалга авах байршил..."
          placeholderTextColor="#999"
          value={location}
          onChangeText={setLocation}
          editable={!loading} // Disable while loading
        />

        {/* Booking Duration Input */}
        <Text style={styles.inputLabel}>Үргэлжлэх хугацаа (цаг):</Text>
        <TextInput
          style={styles.textInput} // Reuse text input style
          placeholder="Үргэлжлэх хугацаа (цагаар)..."
          placeholderTextColor="#999"
          value={duration}
          onChangeText={setDuration}
          keyboardType="number-pad" // Suggest number pad
          editable={!loading} // Disable while loading
        />

        {/* Additional Notes Input */}
        <Text style={styles.inputLabel}>Нэмэлт тайлбар:</Text>
        <TextInput
          style={[styles.textInput, styles.notesInput]} // Reuse text input style, add height
          placeholder="Нэмэлт шаардлага, тайлбар..."
          placeholderTextColor="#999"
          value={notes}
          onChangeText={setNotes}
          multiline
          editable={!loading} // Disable while loading
          textAlignVertical="top" // Align text to top for multiline
        />

        {/* Submit Booking Button */}
        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]} // Apply disabled style when loading
          onPress={handleSubmitBooking}
          disabled={loading} // Disable button while submitting
        >
          {loading ? (
            <ActivityIndicator color="#fff" /> // Show loader inside button
          ) : (
            <Text style={styles.submitButtonText}>Захиалга үүсгэх</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Consistent background
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20, // Apply horizontal padding
    paddingTop: 20, // Adjust top padding
    paddingBottom: 30, // Adjust bottom padding
  },
  headerTitle: {
    // Style for the screen title inside ScrollView (Renamed from header)
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
    // fontFamily: "Poppins_600SemiBold", // Add font family if available
  },
  centered: {
    // Style for full screen loading/error
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  loadingErrorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F", // Error color
    marginBottom: 20,
    // fontFamily: "Poppins_400Regular", // Add font family if available
    lineHeight: 22,
  },
  retryButton: {
    // Style for retry/go back button in error states (reused)
    backgroundColor: "#1ea5b0",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  retryButtonText: {
    // Style for retry/go back button text (reused)
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    // fontFamily: "Poppins_600SemiBold", // Add font family if available
  },
  messageText: {
    // Style for loading messages (reused)
    marginTop: 10,
    // fontFamily: "Poppins_400Regular", // Add font family if available
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    lineHeight: 22,
  },

  // --- Form Styles ---
  inputLabel: {
    // Style for labels above inputs
    fontSize: 16,
    color: "#333", // Darker color for labels
    marginBottom: 8, // Slightly more space below label
    marginTop: 15, // Space above each input section
    // fontFamily: "Poppins_600SemiBold", // Make labels bold if font available
  },
  textInput: {
    // Common style for TextInputs
    backgroundColor: "#fff",
    borderRadius: 10, // Rounded corners
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333", // Darker text color
    marginBottom: 15, // Space below input
    borderWidth: 1,
    borderColor: "#eee", // Lighter border color
    // Add shadow for depth like other screens
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    // fontFamily: "Poppins_400Regular", // Add font family if available
  },
  notesInput: {
    // Specific style for notes description
    height: 120, // Taller height for notes
    textAlignVertical: "top", // Align text to top for multiline
    marginBottom: 20, // More space after input
  },

  // --- Submit Button Styles ---
  submitButton: {
    // Style for the booking submit button - Match EventDetail button
    backgroundColor: "#2F58CD", // Primary button color
    borderRadius: 10, // Rounded corners
    paddingVertical: 14, // Vertical padding
    paddingHorizontal: 25, // Horizontal padding
    alignItems: "center", // Center text horizontally
    justifyContent: "center", // Center text vertically
    minHeight: 50, // Minimum height
    marginTop: 30, // More space above button to separate from inputs
    shadowColor: "#000", // Shadow for depth
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  submitButtonText: {
    // Style for the submit button text - Match EventDetail button text
    color: "#fff", // White text color
    fontSize: 18, // Font size
    fontWeight: "bold", // Bold font weight
    // fontFamily: "Poppins_600SemiBold", // Add font family if available
  },
  submitButtonDisabled: {
    // Style for disabled button
    backgroundColor: "#ccc", // Grey out when disabled
  },
});

export default BookingScreen;
