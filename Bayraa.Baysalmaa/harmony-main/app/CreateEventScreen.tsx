import React, { useState, useEffect, useCallback } from "react"; // useEffect, useCallback импортлосон
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Alert,
  ActivityIndicator, // Added for loading state
  ScrollView, // Added for better layout on smaller screens
  Platform, // For potential platform specific styles/behavior
} from "react-native";
import { useRouter } from "expo-router";
import { Picker } from "@react-native-picker/picker"; // Picker импортлосон

import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Needed for token
import { jwtDecode } from "jwt-decode"; // Needed for token expiry check

const BASE_URL = "http://127.0.0.1:8000"; // Ensure this is your correct backend URL

// Interface for Category (copy from your ArtistScreen)
interface Category {
  id: number;
  name: string;
}

// Helper functions for token management
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
      const token = await refreshToken(); // Ensure refreshToken is defined/imported
      return token;
    } catch (error) {
      console.error(
        "Failed to refresh token (no initial access token):",
        error
      );
      // Consider redirecting to login here if initial token or refresh is missing/fails
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
      // Consider redirecting to login here
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
    await AsyncStorage.multiRemove(["jwt_token", "refreshToken"]);
    // Consider redirecting to login here on refresh failure
    throw new Error("Refresh token invalid or expired. Please log in again.");
  }
};

export default function CreateEventScreen() {
  // Input States
  const [title, setTitle] = useState(""); // Title state
  const [description, setDescription] = useState(""); // Description state
  const [image, setImage] = useState<string | null>(null);
  const [location, setLocation] = useState(""); // Location state
  const [date, setDate] = useState(""); // Date state (using simple TextInput for now)
  const [price, setPrice] = useState(""); // Price state (using simple TextInput for now)

  // Data States
  const [categories, setCategories] = useState<Category[]>([]);
  // selectedCategoryId state-ийг string эсвэл null хадгалахаар болгосон
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null
  );

  // Loading & Error States
  const [loading, setLoading] = useState(false); // State for event creation loading
  const [loadingCategories, setLoadingCategories] = useState(true); // State for category loading
  const [categoryError, setCategoryError] = useState<string | null>(null); // State for category loading error

  const router = useRouter();

  // fetchCategories функцийг useEffect-ийн ГАДНА тодорхойлж, useCallback-оор ороосон
  const fetchCategories = useCallback(async () => {
    setLoadingCategories(true);
    setCategoryError(null);
    try {
      // getValidAccessToken нь useCallback-ийн dependency болно
      const token = await getValidAccessToken();
      if (!token) {
        setCategoryError(
          "Категори татахад нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү."
        );
        // Consider redirecting to login if token is missing/invalid
        // router.replace('/login');
        setLoadingCategories(false);
        return;
      }
      const response = await axios.get(`${BASE_URL}/categories/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data); // setCategories нь useCallback-ийн dependency болно
      if (response.data.length > 0) {
        // ID-г string болгож хадгална
        setSelectedCategoryId(response.data[0].id.toString()); // .toString() нэмсэн
      } else {
        setSelectedCategoryId(null); // No categories available
      }
    } catch (error: any) {
      console.error("Failed to fetch categories:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        setCategoryError(
          "Категори татахад нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү."
        );
        // Consider redirecting to login on auth error
        // router.replace('/login');
      } else {
        setCategoryError("Категори татахад алдаа гарлаа.");
      }
    } finally {
      setLoadingCategories(false); // setLoadingCategories нь useCallback-ийн dependency болно
    }
  }, [
    setCategories,
    setLoadingCategories,
    setCategoryError,
    setSelectedCategoryId,
    getValidAccessToken,
  ]); // <<< Callback-ийн dependencies: функц дотор ашиглагдсан state setters болон бусад тогтмол бус утгууд

  // Effect нь одоо зөвхөн гадна тодорхойлсон fetchCategories функцийг дуудна
  // Энэ эффект компонент mount болоход болон fetchCategories функц өөрчлөгдөхөд ажиллана.
  // fetchCategories функц useCallback-тай тул түүний dependencies өөрчлөгдөхөд л өөрчлөгдөнө.
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]); // <<< fetchCategories нь useEffect-ийн dependency болно

  const pickImage = async () => {
    const askPermission = async (type: "camera" | "gallery") => {
      if (type === "camera") {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        return status === "granted";
      } else {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        return status === "granted";
      }
    };

    Alert.alert("Зураг сонгох", "Зураг авах эсвэл галерейгаас сонгоно уу", [
      {
        text: "Камераас",
        onPress: async () => {
          const granted = await askPermission("camera");
          if (!granted) {
            Alert.alert("Зөвшөөрөл", "Камерын зөвшөөрөл шаардлагатай байна.");
            return;
          }

          const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3], // Common aspect ratio, adjust if needed
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
          }
        },
      },
      {
        text: "Галерейгаас",
        onPress: async () => {
          const granted = await askPermission("gallery");
          if (!granted) {
            Alert.alert("Зөвшөөрөл", "Галерейн зөвшөөрөл шаардлагатай байна.");
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            // mediaTypes: ImagePicker.MediaType.Images, // Original correct way
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // <--- Using deprecated option as workaround
            allowsEditing: true,
            quality: 1,
            aspect: [4, 3],
          });

          if (!result.canceled && result.assets && result.assets.length > 0) {
            setImage(result.assets[0].uri);
          }
        },
      },
      { text: "Цуцлах", style: "cancel" },
    ]);
  };

  const handleCreateEvent = async () => {
    // Validate required fields
    if (
      !image ||
      !title.trim() ||
      !description.trim() ||
      !location.trim() ||
      !date.trim() ||
      selectedCategoryId === null || // selectedCategoryId одоо string | null
      !price.trim()
    ) {
      // Added check for all required fields
      Alert.alert(
        "Анхааруулга",
        "Бүх талбарыг бөглөж, зураг, категорийг сонгоно уу."
      ); // Updated message
      return;
    }

    // Basic date format validation (YYYY-MM-DD) - Optional but recommended
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date.trim())) {
      Alert.alert("Анхааруулга", "ОгноогYYYY-MM-DD форматаар оруулна уу.");
      return;
    }

    // Basic price validation (numeric) - Optional but recommended
    const priceValue = parseFloat(price.trim());
    if (isNaN(priceValue) || priceValue < 0) {
      Alert.alert("Анхааруулга", "Үнийг тоо болон эерэг утгаар оруулна уу.");
      return;
    }

    setLoading(true); // Start loading for event creation

    try {
      const base64 = await FileSystem.readAsStringAsync(image, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const image_base64 = `data:image/jpeg;base64,${base64}`; // Prefix with mime type

      const token = await getValidAccessToken(); // Get valid token
      if (!token) {
        Alert.alert(
          "Нэвтрэх алдаа",
          "Таны нэвтрэх хугацаа дууссан байна. Дахин нэвтэрнэ үү."
        );
        // Consider redirecting to login if token is missing/invalid
        // router.replace('/login');
        setLoading(false);
        return;
      }

      // Construct payload with all required fields
      const payload = {
        title: title.trim(), // Use title state
        description: description.trim(), // Use description state
        location: location.trim(), // Use location state
        date: date.trim(), // Use date state
        image_base64: image_base64, // Base64 image data
        // selectedCategoryId (string | null) -г parseInt ашиглан number эсвэл null болгож backend руу илгээнэ
        category_id:
          selectedCategoryId !== null ? parseInt(selectedCategoryId, 10) : null, // parseInt() ашигласан
        // Assuming backend Event model directly accepts 'price'.
        // If backend expects EventDetail objects, this needs more complex UI/payload.
        price: priceValue, // Use validated price value
        // Status is handled by backend based on date
        // TicketType, TicketCategory need separate UI/data structures if required
      };

      const response = await axios.post(
        `${BASE_URL}/events/`, // <--- Ensure this is the correct backend URL for POSTing events
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Event creation successful:", response.data);
      // Show success alert, then clear form and potentially navigate
      Alert.alert("Амжилттай", "Эвэнт амжилттай үүслээ.", [
        {
          text: "OK",
          onPress: () => {
            // Clear form
            setTitle("");
            setDescription("");
            setImage(null);
            setLocation("");
            setDate("");
            setPrice("");
            // Reset category picker to first item or null if list changes
            // selectedCategoryId одоо string | null тул reset хийхдээ ID-г string болгоно
            if (categories.length > 0) {
              setSelectedCategoryId(categories[0].id.toString()); // .toString() ашигласан
            } else {
              setSelectedCategoryId(null);
            }
            // Optional: Navigate to another screen after successful creation, e.g., events list
            // router.push('/events-list');
          },
        },
      ]);
    } catch (error: any) {
      console.error("Event creation failed:", error);
      let errorMessage = "Эвэнт үүсгэхэд алдаа гарлаа. Дахин оролдоно уу.";

      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Response data:", error.response.data);
          console.error("Response status:", error.response.status);
          // Handle specific backend errors
          if (error.response.status === 401) {
            errorMessage = "Нэвтрэх эрх хүчингүй байна. Дахин нэвтэрнэ үү.";
            // Consider redirecting to login
            // router.replace('/login');
          } else if (error.response.status === 400) {
            // Handle 400 specifically
            if (
              error.response.data &&
              typeof error.response.data === "object"
            ) {
              const detail = error.response.data.detail;
              const nonFieldErrors = error.response.data.non_field_errors;
              // Convert object errors to string
              const fieldErrors = Object.entries(error.response.data)
                .map(([field, messages]) => {
                  // Handle array of messages or single message
                  const messageString = Array.isArray(messages)
                    ? messages.join(", ")
                    : messages;
                  // Improve field name readability (e.g., category_id -> Category)
                  let readableField = field
                    .replace(/_id$/, "")
                    .replace(/_/g, " ");
                  // Capitalize first letter
                  readableField =
                    readableField.charAt(0).toUpperCase() +
                    readableField.slice(1);
                  return `${readableField}: ${messageString}`;
                })
                .join("\n");

              if (detail) errorMessage = `Алдаа: ${detail}`;
              else if (nonFieldErrors)
                errorMessage = `Алдаа: ${nonFieldErrors.join(", ")}`;
              else if (fieldErrors)
                errorMessage = `Мэдээлэл дутуу эсвэл буруу байна:\n${fieldErrors}`; // Show specific field errors
              else
                errorMessage = `Хүсэлт амжилтгүй боллоо: ${error.response.status}`;
            } else {
              errorMessage = `Хүсэлт амжилтгүй боллоо: ${error.response.status}`;
            }
          } else if (error.response.status === 403) {
            errorMessage = "Эвэнт үүсгэх зөвшөөрөл байхгүй байна."; // Forbidden
          } else {
            errorMessage = `Хүсэлт амжилтгүй боллоо: ${error.response.status}`;
          }
        } else if (error.request) {
          errorMessage =
            "Сервертэй холбогдоход алдаа гарлаа. Интернэт холболтоо шалгана уу.";
        } else {
          errorMessage = `Хүсэлт илгээхэд алдаа гарлаа: ${error}`;
        }
      } else {
        errorMessage = `Алдаа гарлаа: ${error}`;
      }

      Alert.alert("Алдаа", errorMessage);
    } finally {
      setLoading(false); // Stop loading for event creation
    }
  };

  // Show loading or error for categories initially
  if (loadingCategories) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#1ea5b0" />
        <Text style={styles.loadingErrorText}>Категори ачааллаж байна...</Text>
      </View>
    );
  }

  if (categoryError) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingErrorText}>{categoryError}</Text>
        {/* Retry button одоо гадна тодорхойлсон fetchCategories-г дуудна */}
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryButtonText}>Дахин оролдох</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (categories.length === 0 && !loadingCategories) {
    return (
      <View style={styles.centered}>
        <Text style={styles.loadingErrorText}>
          Категори олдсонгүй. Эвэнт үүсгэх боломжгүй.
        </Text>
        {/* Retry button одоо гадна тодорхойлсон fetchCategories-г дуудна */}
        <TouchableOpacity style={styles.retryButton} onPress={fetchCategories}>
          <Text style={styles.retryButtonText}>Дахин ачаалах</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollViewContent}
    >
      {/* Header */}
      <Text style={styles.header}>Шинэ Эвэнт Үүсгэх</Text>

      {/* Image Picker Section */}
      <Text style={styles.inputLabel}>Зураг:</Text>
      <TouchableOpacity
        style={styles.imagePicker}
        onPress={pickImage}
        disabled={loading} // Disable while event is being created
      >
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <AntDesign name="pluscircleo" size={40} color="#aaa" />
            <Text style={styles.placeholderText}>Зураг нэмэх</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Title Input */}
      <Text style={styles.inputLabel}>Гарчиг:</Text>
      <TextInput
        style={styles.textInput} // Use a common text input style
        placeholder="Эвэнтийн гарчиг..."
        placeholderTextColor="#999"
        value={title}
        onChangeText={setTitle}
        editable={!loading}
      />

      {/* Description Input */}
      <Text style={styles.inputLabel}>Тайлбар:</Text>
      <TextInput
        style={[styles.textInput, styles.descriptionInput]} // Use common style + specific height
        placeholder="Эвэнтийн дэлгэрэнгүй тайлбар..."
        placeholderTextColor="#999"
        value={description}
        onChangeText={setDescription}
        multiline
        editable={!loading}
      />

      {/* Location Input */}
      <Text style={styles.inputLabel}>Байршил:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Эвэнтийн байршил..."
        placeholderTextColor="#999"
        value={location}
        onChangeText={setLocation}
        editable={!loading}
      />

      {/* Date Input */}
      <Text style={styles.inputLabel}>Огноо:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Огноо (YYYY-MM-DD)"
        placeholderTextColor="#999"
        value={date}
        onChangeText={setDate}
        editable={!loading}
        keyboardType="number-pad" // Suggest number pad for date input
        // Consider adding auto-formatting or a proper Date Picker component here
      />

      {/* Price Input */}
      <Text style={styles.inputLabel}>Үнэ:</Text>
      <TextInput
        style={styles.textInput}
        placeholder="Эвэнтийн үнэ (₮)"
        placeholderTextColor="#999"
        value={price}
        onChangeText={setPrice}
        editable={!loading}
        keyboardType="decimal-pad" // Suggest decimal pad for price
        // Consider adding input validation/formatting to only allow numbers/decimals
      />
      {/* TODO: If multiple ticket types needed, this UI is more complex */}

      {/* Category Picker Section */}
      <Text style={styles.inputLabel}>Категори сонгох:</Text>
      <View style={styles.pickerContainer}>
        {/* Disable picker while loading event or categories */}
        <Picker
          selectedValue={selectedCategoryId}
          // Picker-ээс ирэх утга string байна, шууд selectedCategoryId (string | null)-д хадгална
          onValueChange={(itemValue) => setSelectedCategoryId(itemValue)}
          style={styles.picker}
          enabled={!loading && !loadingCategories && categories.length > 0}
          // itemStyle is primarily for iOS
          itemStyle={Platform.OS === "ios" ? styles.pickerItem : undefined}
        >
          {/* Add a disabled placeholder item for Android */}
          {Platform.OS === "android" && (
            <Picker.Item
              label="-- Категори сонгоно уу --"
              value={null}
              enabled={false}
              color="#999"
            />
          )}
          {/* Map categories */}
          {categories.map((category) => (
            // Категорийн ID-г string болгож value болгож өгнө
            <Picker.Item
              key={category.id}
              label={category.name}
              value={category.id.toString()}
            /> // .toString() ашигласан
          ))}
        </Picker>
      </View>

      {/* Create Event Button */}
      <TouchableOpacity
        style={styles.postButton}
        onPress={handleCreateEvent}
        disabled={
          loading || selectedCategoryId === null || categories.length === 0
        } // Disable if loading, no category selected, or no categories available
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.postButtonText}>Эвэнт Үүсгэх</Text>
        )}
      </TouchableOpacity>

      {/* Button to navigate to Create Artist Screen */}
      <TouchableOpacity
        style={[styles.postButton, styles.secondaryButton]}
        onPress={() => router.push("/CreateArtistScreen")} // Assumes app/CreateArtistScreen.tsx exists
        disabled={loading} // Disable this button too while event is being created
      >
        <Text style={styles.postButtonText}>Уран бүтээлч Үүсгэх</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7fdfd",
    paddingHorizontal: 20,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingTop: 20, // Adjust padding top, consider SafeAreaView in layout
    paddingBottom: 30,
  },
  centered: {
    // Style for initial loading/error states
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7fdfd",
    padding: 20,
  },
  loadingErrorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F",
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
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputLabel: {
    // Style for labels above inputs
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
    marginTop: 10, // Space above each input section
  },
  textInput: {
    // Common style for TextInputs
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12, // Slightly more vertical padding
    fontSize: 16,
    color: "#333",
    marginBottom: 15, // Space below input
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  descriptionInput: {
    // Specific style for description
    height: 100, // Taller height
    textAlignVertical: "top", // Align text to top for multiline
    marginBottom: 20, // More space after description
  },
  imagePicker: {
    height: 200,
    backgroundColor: "#e0e0e0",
    borderRadius: 10, // Match other inputs
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15, // Match other inputs
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd", // Match other inputs
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  placeholder: {
    alignItems: "center",
  },
  placeholderText: {
    marginTop: 8,
    color: "#666",
    fontSize: 16,
  },
  pickerContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    backgroundColor: "#fff",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
    // backgroundColor: '#fff', // Background should be on container for border radius
  },
  pickerItem: {
    // Style for iOS picker items
    fontSize: 16,
  },
  postButton: {
    backgroundColor: "#1ea5b0",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  postButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  secondaryButton: {
    backgroundColor: "#2F58CD",
    marginTop: 15,
  },
});
