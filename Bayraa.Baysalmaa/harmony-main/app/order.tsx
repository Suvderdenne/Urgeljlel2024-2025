// app/(tabs)/order.tsx
import {
  View,
  Text,
  StyleSheet, // Import StyleSheet
  ScrollView, // Scroll хийх боломжтой View (хэрэв FlatList scroll хийхгүй бол)
  ActivityIndicator, // Loading Indicator
  Alert, // Мессеж харуулах
  FlatList, // Жагсаалт харуулах
  TouchableOpacity, // Товчлуур
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // API дуудлага хийх
import { Stack, useRouter } from "expo-router"; // Навигаци хийх

// --- ТОКЕН УДИРДЛАГАТАЙ ХОЛБООТОЙ ИМПОРТ болон ФУНКЦҮҮД ---
// Эдгээр нь Backend API-тай холбогдох, Authentication хийхэд ЗААВАЛ хэрэгтэй.
// Хэрэв та эдгээрийг тусдаа файл дээр тодорхойлсон бол, доорх хэрэгжүүлэлтийн оронд import хийнэ.
// Upprofile.tsx файлтай ижил токен удирдлагыг ашиглана.

import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage хэрэгтэй
import { jwtDecode } from "jwt-decode"; // jwtDecode хэрэгтэй

// --- BASE_URL тогтмол утга ---
const BASE_URL = "http://127.0.0.1:8000"; // <--- Backend серверийн URL хаягаа энд ЗӨВ тохируулна УУ!

// --- Токен удирдлагын функцүүдийн хэрэгжүүлэлт ---
// getValidAccessToken, refreshToken функцууд Upprofile.tsx файлтай ижил байна.
// Эдгээр функцууд таны төсөлд байхгүй бол, доорх кодыг ашиглана.
// Хэрэв байгаа бол, доорх хэрэгжүүлэлтийн оронд импорт хийнэ.

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
        const newToken = await refreshToken(); // refreshToken функц доор тодорхойлогдсон байна
        return newToken;
      } catch (error) {
        console.error("Failed to refresh token:", error);
        // Токен сэргээх амжилтгүй бол логин руу шилжүүлж болно
        // router.replace('/login'); // router хувьсагч компонентийн дотор байдаг тул энд шууд ашиглах боломжгүй
        return null;
      }
    }
  } else {
    console.log(
      "No access token found, attempting refresh (first time or after logout)."
    );
    try {
      const newToken = await refreshToken(); // refreshToken функц доор тодорхойлогдсон байна
      return newToken; // Сэргээсэн токеныг буцаана
    } catch (error) {
      console.error(
        "Failed to refresh token (no initial access token):",
        error
      );
      // router.replace('/login'); // Uncomment if critical auth failure should redirect
      return null;
    }
  }
  return token; // Хүчинтэй хэвээр байгаа токеныг буцаана
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
    await AsyncStorage.multiRemove(["jwt_token", "refreshToken"]); // Амжилтгүй бол токенудыг цэвэрлэнэ
    // router.replace('/login'); // Uncomment if critical auth failure should redirect
    throw new Error("Refresh token invalid or expired. Please log in again.");
  }
};

// clearTokens функц logout хийхэд хэрэгтэй болно, хэрэв ашиглах бол энд оруулна эсвэл utility файлаас импортлоно.
// const clearTokens = async () => { ... }

// --- ТОКЕН УДИРДЛАГАТАЙ ХОЛБООТОЙ КОД ЭНД ДУУСНА ---

// --- Booking Interface ---
// Энэ interface таны Backend-ийн Booking Serializer-ээс ирж буй датаны бүтэцтэй ЯГ таарч байх ёстой!
interface Booking {
  id: number;
  artist: number; // Assuming artist is just the ID in the list view
  booking_date: string;
  booking_time: string;
  location: string;
  duration_hours: number;
  notes?: string;
  status: string;
  created_at: string;
  artist_name?: string; // Backend Serializer-ээс ирж байвал нэмнэ
}

// Helper to format date and time for display
const formatBookingDateTime = (dateString: string, timeString: string) => {
  if (!dateString || !timeString) return "Огноо/Цаг буруу байна";
  try {
    const dateTimeString = `${dateString}T${timeString}:00`;
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) return "Огноо/Цаг буруу байна";
    return date.toLocaleString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (e) {
    console.error("Error formatting date/time:", e);
    return "Огноо/Цаг буруу байна";
  }
};

// --- Styles ---
// Stylesheet-ийг энд тодорхойлно. OrderPage компонентийн return хэсгээс дээш байрлана.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Хуудасны background
  },
  scrollViewContent: {
    flexGrow: 1,
    padding: 20, // Ерөнхий padding
    paddingTop: 10,
    paddingBottom: 30,
  },
  sectionTitle: {
    // Хэсгийн гарчиг (хэрэв ашиглах бол)
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 20,
  },
  // Loading, Error, No Data-д зориулсан стилүүд
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    marginBottom: 15,
  },
  messageText: {
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F",
    lineHeight: 22,
    marginBottom: 15,
  },
  retryButton: {
    backgroundColor: "#1ea5b0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 15,
  },
  noDataText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },

  // Захиалгын жагсаалтын зүйлсийн стилүүд
  bookingItem: {
    // Нэг захиалгын зүйлд зориулсан container
    backgroundColor: "#fff", // Background
    borderRadius: 8,
    padding: 15,
    marginBottom: 10, // Зүйлсийн хоорондох зай
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  bookingArtist: {
    // Уран бүтээлчийн нэр
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  bookingDateTime: {
    // Огноо цаг
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  bookingLocation: {
    // Байршил
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  bookingDuration: {
    // Үргэлжлэх хугацаа
    fontSize: 14,
    color: "#555",
    marginBottom: 8,
  },
  bookingNotes: {
    // Тайлбар
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontStyle: "italic",
  },
  bookingStatus: {
    // Төлөв
    fontSize: 14,
    fontWeight: "bold",
    marginTop: 5,
  },
  // Төлөвөөс хамаарах өнгөт стилүүд (Backend-ээс ирж буй status-тай ижил нэртэй байх ёстой)
  status_pending: {
    // "pending" төлөвт зориулсан стил
    color: "#ff9800", // Жул шар
  },
  status_confirmed: {
    // "confirmed" төлөвт зориулсан стил
    color: "#4caf50", // Ногоон
  },
  status_completed: {
    // "completed" төлөвт зориулсан стил
    color: "#2196f3", // Цэнхэр
  },
  status_cancelled: {
    // "cancelled" төлөвт зориулсан стил
    color: "#f44336", // Улаан
  },
});

const OrderPage = () => {
  // Компонентийн нэр
  const router = useRouter(); // Expo Router ашиглаж байвал

  // --- State Variables for Bookings ---
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);

  // --- Fetch User's Bookings Function ---
  const fetchMyBookings = useCallback(async () => {
    setLoadingBookings(true);
    setBookingError(null);
    try {
      const token = await getValidAccessToken(); // Токен удирдлагын функц дуудсан

      if (!token) {
        setBookingError(
          "Нэвтрэх эрхгүй байна. Захиалгын жагсаалтыг харах боломжгүй."
        );
        setLoadingBookings(false);
        // router.replace('/login'); // Нэвтрэх эрхгүй бол логин руу шилжүүлж болно.
        return;
      }

      // Backend дээрх хэрэглэгчийн захиалгуудыг татах API endpoint руу GET хүсэлт илгээх
      // ЭНЭ ЗАМЫГ ТАНЫ BACKEND-ИЙН ЖИНХЭНЭ ЗАХИАЛГЫН ENDPOINT-ТЭЙ ТААРУУЛЖ ӨӨРЧИЛНӨ.
      // Ихэвчлэн /api/bookings/ эсвэл /bookings/ гэсэн замтай байна.
      const response = await axios.get(`${BASE_URL}/bookings/`, {
        // <--- ЗАХИАЛГЫН ENDPOINT-ИЙН ЗАМ
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && Array.isArray(response.data)) {
        // Хариулт массив хэлбэрээр ирэхийг шалгасан
        // Assuming the backend returns a list of booking objects
        // console.log("Fetched bookings:", response.data); // Татагдсан датаг харах
        setMyBookings(response.data);
      } else {
        setBookingError(
          `Захиалгын жагсаалтыг татахад алдаа гарлаа (Статус: ${response.status}).`
        );
        // Хариулт массив биш байвал алдаа мөн харуулж болно
        if (response.data)
          console.error(
            "Bookings fetch response data is not an array:",
            response.data
          );
      }
    } catch (err: any) {
      console.error("Error fetching user bookings:", err);
      let errorMessage = "Миний захиалгуудыг татахад алдаа гарлаа.";
      // Алдааг дэлгэрэнгүй харуулах
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const backendError =
            err.response.data?.detail || JSON.stringify(err.response.data);
          if (err.response.status === 401) {
            errorMessage = "Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.";
          } else if (err.response.status === 404) {
            errorMessage = `Серверийн алдаа: ${err.response.status} - Захиалгын Endpoint олдсонгүй (${backendError})`;
          } else {
            errorMessage = `Серверийн алдаа: ${err.response.status} - ${backendError}`;
          }
        } else if (err.request) {
          errorMessage =
            "Сервертэй холбогдоход алдаа гарлаа. Интернэт холболтоо шалгана уу.";
        } else {
          errorMessage = `Хүсэлт илгээхэд алдаа гарлаа: ${err.message}`;
        }
      } else {
        errorMessage = `Үл мэдэгдэх алдаа: ${err}`;
      }
      setBookingError(errorMessage);
    } finally {
      setLoadingBookings(false);
    }
  }, [getValidAccessToken, setMyBookings, setLoadingBookings, setBookingError]); // Dependency

  // --- useEffect Hook ---
  // Хуудас анх ачаалагдах үед захиалгуудыг татаж авах
  useEffect(() => {
    fetchMyBookings();
  }, [fetchMyBookings]); // fetchMyBookings функцийг dependency болгож оруулна.

  // --- UI Rendering --- (return хэсэг)
  return (
    // Энд таны order.tsx хуудасны үндсэн UI байна
    <>
      {" "}
      {/* Нэг үндсэн элементээр ороосон */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Миний захиалгууд", // Хуудасны гарчиг
          // ... бусад header тохиргоо ...
        }}
      />
      {/* Захиалгын жагсаалтыг харуулах хэсэг */}
      <View style={styles.container}>
        {" "}
        {/* Ерөнхий container */}
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Гарчиг - Захиалга */}
          {/* Та захиалгын хэсэгтээ ч гарчиг өгч болно */}
          {/* <Text style={styles.sectionTitle}>Миний захиалгууд</Text> */}

          {/* Дата ачааллаж байгаа үед */}
          {loadingBookings ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1ea5b0" />
              <Text style={styles.messageText}>
                Захиалгуудыг ачааллаж байна...
              </Text>
            </View>
          ) : bookingError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{bookingError}</Text>
              {/* Дахин ачаалах товчлуур */}
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchMyBookings} // Дахин ачаалах үйлдлийг холбох
              >
                <Text style={styles.retryButtonText}>Дахин ачаалах</Text>
              </TouchableOpacity>
            </View>
          ) : myBookings.length === 0 ? (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Та захиалга хийгээгүй байна.
              </Text>
            </View>
          ) : (
            <FlatList
              data={myBookings}
              keyExtractor={(item) => item.id.toString()} // Захиалгын ID-г key болгосон
              renderItem={(
                { item } // Зүйл тус бүрийг render хийх
              ) => (
                <View style={styles.bookingItem}>
                  {" "}
                  {/* Зүйл тус бүрийн container */}
                  {/* Захиалгын дэлгэрэнгүй мэдээлэл */}
                  <Text style={styles.bookingArtist}>
                    Уран бүтээлч: {item.artist_name || `ID: ${item.artist}`}{" "}
                    {/* Artist-ийн нэр байвал нэрийг, байхгүй бол ID-г харуулна */}
                  </Text>
                  <Text style={styles.bookingDateTime}>
                    🗓️{" "}
                    {formatBookingDateTime(
                      item.booking_date,
                      item.booking_time
                    )}{" "}
                    {/* Огноо, цагийг форматлаж харуулах */}
                  </Text>
                  <Text style={styles.bookingLocation}>📍 {item.location}</Text>
                  <Text style={styles.bookingDuration}>
                    ⏳ {item.duration_hours} цаг
                  </Text>
                  {item.notes &&
                    item.notes.trim().length > 0 && ( // Notes байвал харуулна
                      <Text style={styles.bookingNotes}>
                        Тайлбар: {item.notes}
                      </Text>
                    )}
                  {/* Захиалгын төлөв. Стилийг төлөвөөс хамааруулж өөрчилнө */}
                  <Text
                    style={[
                      styles.bookingStatus,
                      styles[item.status as keyof typeof styles], // styles объект дотор status-тай ижил нэртэй style байгаа гэж үзэж хандсан
                    ]}
                  >
                    Төлөв: {item.status}
                  </Text>
                </View>
              )}
              scrollEnabled={false}
            />
          )}
        </ScrollView>
      </View>
    </>
  );
};

export default OrderPage; // Компонентийн нэр
