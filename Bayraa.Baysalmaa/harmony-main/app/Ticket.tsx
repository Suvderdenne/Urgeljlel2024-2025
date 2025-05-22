// app/Ticket.tsx
import {
  View,
  Text,
  StyleSheet, // Import StyleSheet
  ScrollView, // Scroll хийх боломжтой View
  ActivityIndicator, // Loading Indicator
  Alert, // Мессеж харуулах
  FlatList, // Жагсаалт харуулах
  TouchableOpacity, // Товчлуур
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // API дуудлага хийх
import { Stack, useRouter, useLocalSearchParams } from "expo-router"; // Навигаци хийх болон params авах
import { AntDesign } from "@expo/vector-icons"; // Icon ашиглах
import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage хэрэгтэй
import { jwtDecode } from "jwt-decode"; // jwtDecode хэрэгтэй

// TicketCard компонент импорт хийх
import TicketCard from "./TicketCard"; // <--- TicketCard.tsx файлын замтай тааруулна УУ!

// --- ТОКЕН УДИРДЛАГАТАЙ ХОЛБООТОЙ ИМПОРТ болон ФУНКЦҮҮД ---
// Эдгээр нь Backend API-тай холбогдох, Authentication хийхэд ЗААВАЛ хэрэгтэй.
// Upprofile.tsx болон Order.tsx файлтай ижил токен удирдлагыг ашиглана.
// Хэрэв та эдгээрийг тусдаа файл дээр тодорхойлсон бол, доорх хэрэгжүүлэлтийн оронд import хийнэ.

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

// --- Interfaces for Ticket Page Data ---
// Backend-ээс эвэнтийн дэлгэрэнгүй болон тасалбарын төрлүүд хамт ирж байвал
interface EventTicketDetails {
  id: number; // Event ID
  title: string; // Event Title (header-т харуулахад хэрэгтэй)
  ticket_types: TicketOption[]; // Боломжит тасалбарын төрлүүдийн жагсаалт
  // ... бусад хэрэгтэй мэдээлэл ...
}

// Тасалбарын төрөл бүрийн Interface
interface TicketOption {
  id: number; // Ticket Type ID (захиалга хийхэд хэрэгтэй)
  name: string; // Тасалбарын нэр (Жишээ нь: VIP, Standard)
  price: number; // Тасалбарын үнэ
  description?: string; // Нэмэлт тайлбар
  discount_price?: number; // Хямдралтай үнэ (TicketCard-д дамжуулахын тулд нэмсэн)
  discount_until?: string; // Хямдралын хугацаа (TicketCard-д дамжулахын тулд нэмсэн)
  available_quantity?: number; // Боломжит тоо ширхэг (Backend-ээс ирж байвал)
}

const TicketPage = () => {
  // Компонентийн нэр
  const router = useRouter();
  // EventDetail хуудаснаас дамжуулсан eventId-г авна
  const { eventId } = useLocalSearchParams<{ eventId: string }>();

  // --- State Variables ---
  const [eventTicketData, setEventTicketData] =
    useState<EventTicketDetails | null>(null);
  const [loading, setLoading] = useState(true); // Ачааллах төлөв
  const [error, setError] = useState<string | null>(null); // Алдааны төлөв

  const [selectedTicketType, setSelectedTicketType] =
    useState<TicketOption | null>(null); // Сонгосон тасалбарын төрөл
  const [quantity, setQuantity] = useState(1); // Сонгосон тоо ширхэг
  const [isBooking, setIsBooking] = useState(false); // Захиалга хийж буй эсэх төлөв

  // --- Fetch Ticket Options Function ---
  // Тухайн эвэнтийн тасалбарын мэдээллийг татаж авах функц
  const fetchTicketOptions = useCallback(
    async (id: string) => {
      setLoading(true);
      setError(null);
      setEventTicketData(null); // Өмнөх датаг цэвэрлэх

      try {
        const token = await getValidAccessToken(); // Токен удирдлагын функц дуудсан

        if (!token) {
          setError(
            "Нэвтрэх эрхгүй байна. Тасалбарын мэдээллийг харах боломжгүй."
          );
          setLoading(false);
          // router.replace('/login'); // Нэвтрэх эрхгүй бол логин руу шилжүүлж болно.
          return;
        }

        // Backend дээр тухайн эвэнтийн тасалбарын мэдээллийг татах API endpoint руу GET хүсэлт илгээх
        // ЭНЭ ЗАМЫГ ТАНЫ BACKEND-ИЙН ЖИНХЭНЭ ТУХАЙН ЭВЭНТИЙН ТАСАЛБАРЫГ QUERY PARAMETER-ЭЭР БУЦААДАГ ENDPOINT-ТЭЙ ТААРУУЛЖ ӨӨРЧИЛНӨ.
        // Энэ нь таны urls.py дээр ticket-types/ Endpoint байсан тул ийнхүү өөрчилсөн.
        const response = await axios.get(
          `${BASE_URL}/ticket-types/?event=${id}`,
          {
            // <--- ЗӨВ ЗАМ: QUERY PARAMETER АШИГЛАСАН
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        // Backend тал зөвхөн тасалбарын төрлүүдийн жагсаалт Array of TicketOption объектыг буцааж байна гэж үзвэл:
        if (response.status === 200 && Array.isArray(response.data)) {
          const ticketTypes: TicketOption[] = response.data;

          // Event-ийн title Backend-ээс ирэхгүй байвал, та Event Detail-ээс дамжуулах эсвэл өөр дуудлагаар авах хэрэгтэй
          // Одоохондоо Event ID-г ашиглан дутуу EventTicketDetails объект үүсгэе
          const dummyEventData: EventTicketDetails = {
            id: parseInt(id, 10), // Event ID
            title: `Event ID: ${id}`, // Эвэнтийн нэрBackend-ээс ирэхгүй тул ID-г харуулъя.
            ticket_types: ticketTypes, // Татагдсан тасалбарын төрлүүд
          };
          setEventTicketData(dummyEventData);

          // Эхний тасалбарын төрлийг анхдагчаар сонгох (хэрэв байгаа бол)
          if (ticketTypes.length > 0) {
            setSelectedTicketType(ticketTypes[0]);
            setQuantity(1); // Тоо ширхэгийг 1 болгох
          } else {
            setSelectedTicketType(null);
            setQuantity(0);
          }
        } // Backend эвэнтийн дэлгэрэнгүй болон тасалбарын төрлүүдийг нэг дор буцааж байвал энд logic өөрчлөгдөнө.
        // Жишээ нь: if (response.status === 200 && response.data && response.data.ticket_types) { setEventTicketData(response.data); ... }
        else {
          // Хариулт массив биш байвал эсвэл статус 200 биш байвал
          setError(
            `Тасалбарын мэдээллийг татахад алдаа гарлаа (Статус: ${response.status}).`
          );
          if (response.data)
            console.error(
              "Ticket options fetch response data is not an array:",
              response.data
            );
        }
      } catch (err: any) {
        console.error("Error fetching ticket options:", err);
        let errorMessage = "Тасалбарын мэдээллийг татахад алдаа гарлаа.";
        if (axios.isAxiosError(err)) {
          if (err.response) {
            const backendError =
              err.response.data?.detail || JSON.stringify(err.response.data);
            if (err.response.status === 401) {
              errorMessage = "Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.";
            } else if (err.response.status === 404) {
              // Хэдийгээр бид 404 Backend дээр зассан ч, дахин гарвал:
              errorMessage = `Серверийн алдаа: ${err.response.status} - Endpoint олдсонгүй эсвэл Эвэнт/Тасалбар олдсонгүй (${backendError})`;
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
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    [getValidAccessToken]
  ); // Dependency

  // --- Handle Booking Function ---
  // Тасалбар захиалах/авах үйлдэл хийх функц
  const handleBooking = async () => {
    if (!selectedTicketType) {
      Alert.alert("Анхааруулга", "Тасалбарын төрлөө сонгоно уу.");
      return;
    }
    if (quantity <= 0) {
      Alert.alert("Анхааруулга", "Тасалбарын тоо ширхэг 1-ээс багагүй байна.");
      return;
    }
    if (!eventId) {
      Alert.alert("Алдаа", "Эвэнтийн мэдээлэл дутуу байна.");
      return;
    }
    // EventId нь useLocalSearchParams-ээс string эсвэл string[] ирэх боломжтой тул шалгана
    const eventIdString = Array.isArray(eventId) ? eventId[0] : eventId;
    if (!eventIdString) {
      Alert.alert("Алдаа", "Эвэнтийн ID буруу байна.");
      return;
    }

    setIsBooking(true); // Захиалга хийж эхэллээ
    setError(null); // Өмнөх алдааг цэвэрлэх

    try {
      const token = await getValidAccessToken(); // Токен удирдлагын функц дуудсан

      if (!token) {
        Alert.alert(
          "Нэвтрэх алдаа",
          "Захиалга хийхэд нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү."
        );
        setIsBooking(false);
        // router.replace('/login');
        return;
      }

      // Backend рүү илгээх захиалгын өгөгдөл (payload)
      // ЭНЭ Payload-ийн бүтцийг ТАНЫ BACKEND-ИЙН BOOKING CREATE ENDPOINT-ийн хүлээж авдаг бүтэцтэй ЯГ тааруулна УУ!
      const payload = {
        event: parseInt(eventIdString, 10), // Event ID-г number болгож илгээх
        ticket_type: selectedTicketType.id, // Сонгосон тасалбарын төрлийн ID
        quantity: quantity, // Сонгосон тоо ширхэг
        // ... Нэмэлт мэдээлэл (Хэрэв Backend хүлээж авдаг бол) ...
      };

      // Backend дээр захиалга үүсгэх API endpoint руу POST хүсэлт илгээх
      // ЭНЭ ЗАМЫГ ТАНЫ BACKEND-ИЙН ЖИНХЭНЭ ЗАХИАЛГА ҮҮСГЭХ ENDPOINT-ТЭЙ ТААРУУЛЖ ӨӨРЧИЛНӨ.
      // Ихэвчлэн /api/bookings/create/ эсвэл /bookings/ гэсэн замтай байна.
      const response = await axios.post(
        `${BASE_URL}/bookings/create/`,
        payload,
        {
          // <--- ЗАХИАЛГА ҮҮСГЭХ ENDPOINT-ИЙН ЗАМ
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Backend-ээс ирэх хариултыг шалгана (ихэвчлэн 201 Created эсвэл 200 OK)
      if (response.status === 201 || response.status === 200) {
        Alert.alert("Амжилттай", "Захиалга амжилттай хийгдлээ!");
        // Амжилттай бол захиалгын жагсаалт руу эсвэл баталгаажуулалтын хуудас руу шилжиж болно.
        router.replace("/order"); // Захиалгын жагсаалт руу шилжсэн
      } else {
        Alert.alert(
          "Алдаа",
          `Захиалга хийхэд алдаа гарлаа (Статус: ${response.status}).`
        );
      }
    } catch (err: any) {
      console.error("Error creating booking:", err);
      let errorMessage = "Захиалга хийхэд алдаа гарлаа. Дахин оролдоно уу.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const backendError =
            err.response.data?.detail || JSON.stringify(err.response.data);
          if (err.response.status === 401) {
            errorMessage = "Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.";
          } else if (err.response.status === 400) {
            // Validation алдаа эсвэл боломжит тоо ширхэг хүрэлцэхгүй байх
            errorMessage = `Хүсэлт буруу байна: ${backendError}`;
          } else if (err.response.status === 404) {
            errorMessage = `Серверийн алдаа: ${err.response.status} - Endpoint олдсонгүй (${backendError})`;
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
      Alert.alert("Алдаа", errorMessage);
    } finally {
      setIsBooking(false); // Захиалга хийж дууслаа
    }
  };

  // --- useEffect Hook ---
  // Хуудас анх ачаалагдах үед болон eventId өөрчлөгдөхөд тасалбарын мэдээллийг татаж авах
  useEffect(() => {
    // eventId нь useLocalSearchParams-ээс undefined байх боломжтой тул шалгасан
    if (eventId) {
      // EventDetail хуудаснаас дамжуулсан eventId string эсвэл string[] хэлбэртэй ирнэ
      const id = Array.isArray(eventId) ? eventId[0] : eventId;
      fetchTicketOptions(id);
    } else {
      setError("Эвэнтийн ID олдсонгүй.");
      setLoading(false);
    }
  }, [eventId, fetchTicketOptions]); // Dependency

  // --- UI Rendering --- (return хэсэг)
  return (
    <>
      {" "}
      {/* Нэг үндсэн элементээр ороосон */}
      <Stack.Screen
        options={{
          headerShown: true,
          // Event data ачаалагдаж дуусссаны дараа эвэнтийн гарчгийг header-т харуулна
          title: eventTicketData?.title || "Тасалбар сонгох", // Гарчиг
          headerLeft: () => (
            // Custom буцах товч
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginLeft: 10 }}
            >
              <AntDesign name="left" size={24} color="#2F58CD" />
            </TouchableOpacity>
          ),
          // ... бусад header тохиргоо ...
        }}
      />
      {/* Ачааллах, Алдаа, Дата байхгүй үеийн UI */}
      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#1ea5b0" />
          <Text style={styles.messageText}>
            Тасалбарын мэдээллийг ачааллаж байна...
          </Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          {/* Дахин ачаалах товчлуур */}
          {eventId && ( // eventId байвал дахин ачаалах товчийг харуулна
            <TouchableOpacity
              style={styles.retryButton}
              onPress={() => {
                const id = Array.isArray(eventId) ? eventId[0] : eventId;
                fetchTicketOptions(id); // fetchTicketOptions-г eventId-гаар дуудсан
              }}
            >
              <Text style={styles.retryButtonText}>Дахин ачаалах</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : !eventTicketData ||
        !eventTicketData.ticket_types ||
        eventTicketData.ticket_types.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.noDataText}>
            Энэ эвэнтийн тасалбарын мэдээлэл олдсонгүй.
          </Text>
        </View>
      ) : (
        // --- Тасалбар сонгох UI (Дата амжилттай татагдсан үед) ---
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollViewContent}
        >
          <Text style={styles.sectionTitle}>
            {eventTicketData.title} - Тасалбар сонгох
          </Text>{" "}
          {/* Эвэнтийн нэрийг гарчигт нэмсэн */}
          {/* Тасалбарын төрлүүдийн жагсаалт */}
          <FlatList
            data={eventTicketData.ticket_types}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                key={item.id} // TouchableOpacity дээр key нэмсэн
                style={[
                  styles.ticketOptionItem,
                  selectedTicketType?.id === item.id &&
                    styles.selectedTicketOptionItem, // Сонгогдсон бол стилийг өөрчлөх
                ]}
                onPress={() => setSelectedTicketType(item)} // Тасалбарын төрлийг сонгох
              >
                {/* TicketCard компонент ашиглан тасалбарын мэдээллийг харуулна */}
                <TicketCard
                  title={item.name}
                  price={item.price}
                  discountPrice={item.discount_price}
                  discountUntil={item.discount_until}
                  description={item.description} // description дамжуулсан
                  // isSelected={selectedTicketType?.id === item.id} // Сонгогдсон эсэхийг TicketCard дотор удирдаж болно
                  // onPress={() => setSelectedTicketType(item)} // Карт дээр дарах үйлдэл
                />
                {/* Сонгогдсон эсэхийг харуулах тэмдэг (карт дотор ч байж болно) */}
                {selectedTicketType?.id === item.id && (
                  <AntDesign
                    name="checkcircle"
                    size={20}
                    color="#1ea5b0"
                    style={{ marginLeft: 10 }}
                  />
                )}
              </TouchableOpacity>
            )}
            scrollEnabled={false} // ScrollView ашиглаж байгаа тул FlatList-ийн scroll-г хаасан
          />
          {/* Сонгосон тасалбарын мэдээлэл болон тоо ширхэг */}
          {selectedTicketType && (
            <View style={styles.selectedTicketInfoContainer}>
              <Text style={styles.selectedTicketTitle}>Сонгосон тасалбар:</Text>
              <Text style={styles.selectedTicketName}>
                {selectedTicketType.name}
              </Text>
              <Text style={styles.selectedTicketPriceTotal}>
                Нэгж үнэ: {selectedTicketType.price} ₮
              </Text>

              {/* Тоо ширхэг сонгох */}
              <View style={styles.quantitySelector}>
                <Text style={styles.quantityLabel}>Тоо ширхэг:</Text>
                <TouchableOpacity
                  onPress={() => setQuantity(Math.max(1, quantity - 1))} // 1-ээс багагүй
                  style={styles.quantityButton}
                  disabled={quantity <= 1 || isBooking} // 1 байвал болон захиалга хийж байвал disable хийх
                >
                  <Text style={styles.quantityButtonText}>-</Text>
                </TouchableOpacity>
                <View style={styles.quantityInputContainer}>
                  <Text style={styles.quantityText}>{quantity}</Text>
                  {/* Та энд TextInput ашиглаж гараас оруулах боломжтой болгож болно */}
                </View>
                <TouchableOpacity
                  onPress={() => setQuantity(quantity + 1)}
                  style={styles.quantityButton}
                  disabled={
                    isBooking ||
                    (selectedTicketType.available_quantity !== undefined &&
                      quantity >= selectedTicketType.available_quantity)
                  } // Захиалга хийж байвал болон боломжит тооноос хэтэрвэл disable хийх
                >
                  <Text style={styles.quantityButtonText}>+</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.totalPrice}>
                Нийт үнэ:{" "}
                {(selectedTicketType.price * quantity).toLocaleString("mn-MN")}{" "}
                ₮ {/* Нийт үнийг тооцоолж форматласан */}
              </Text>
            </View>
          )}
          {/* --- Захиалга хийх товчлуур --- */}
          <TouchableOpacity
            style={[
              styles.bookButton,
              (!selectedTicketType || quantity <= 0 || isBooking) &&
                styles.bookButtonDisabled,
            ]} // Тасалбар сонгоогүй эсвэл тоо ширхэг 0 байвал эсвэл захиалга хийж байвал disable хийх
            onPress={handleBooking}
            disabled={!selectedTicketType || quantity <= 0 || isBooking} // Disabled логик давхардуулж бичсэн нь илүү баталгаатай
          >
            {isBooking ? (
              <ActivityIndicator color="#fff" /> // Захиалга хийж байхад loader харуулах
            ) : (
              <Text style={styles.bookButtonText}>Захиалга хийх</Text>
            )}
          </TouchableOpacity>
        </ScrollView> // ScrollView хаасан
      )}
    </>
  );
};

// Компонентийн нэр

// --- Styles ---
// Stylesheet-ийг энд тодорхойлно. TicketPage компонентийн return хэсгээс дээш байрлана.
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
    // Хэсгийн гарчиг
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    marginTop: 10,
  },
  // Loading, Error, No Data-д зориулсан стилүүд
  centered: {
    // Loading/Error/No data-г голлуулах
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingContainer: {
    // Loading-д зориулсан (centered ашиглаж болно)
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  errorContainer: {
    // Error-д зориулсан (centered ашиглаж болно)
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff0f0",
    borderRadius: 10,
    marginBottom: 15,
  },
  messageText: {
    // Loading үеийн текст
    marginTop: 10,
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },
  errorText: {
    // Алдааны текст
    marginTop: 10,
    fontSize: 16,
    textAlign: "center",
    color: "#D32F2F",
    lineHeight: 22,
    marginBottom: 15,
  },
  retryButton: {
    // Дахин ачаалах товчлуур
    backgroundColor: "#1ea5b0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  retryButtonText: {
    // Дахин ачаалах товчлуурн текст
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  noDataContainer: {
    // Дата байхгүй үеийн (centered ашиглаж болно)
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    marginBottom: 15,
  },
  noDataText: {
    // Дата байхгүй үеийн текст
    fontSize: 16,
    color: "#555",
    textAlign: "center",
  },

  // Тасалбарын төрөл тус бүрийг харуулах стилүүд
  ticketOptionItem: {
    // Нэг тасалбарын төрөлд зориулсан container
    backgroundColor: "#fff", // Background
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTicketOptionItem: {
    // Сонгогдсон тасалбарын стил
    borderColor: "#1ea5b0", // Хүрээний өнгийг өөрчлөх
    borderWidth: 2,
  },
  // TicketCard компонентийн стилүүдийг TicketCard.tsx файл дотор тодорхойлсон
  // Энд TicketPage-д хамаарах стилүүд байна

  // Сонгосон тасалбарын мэдээлэл болон тоо ширхэг сонгох хэсэг
  selectedTicketInfoContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  selectedTicketTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  selectedTicketName: {
    fontSize: 16,
    color: "#555",
    marginTop: 10,
    marginBottom: 5,
  },
  selectedTicketPriceTotal: {
    // Нэгж үнэ
    fontSize: 16,
    fontWeight: "500",
    color: "#555",
    marginBottom: 15,
  },
  quantitySelector: {
    // Тоо ширхэг сонгох хэсэг
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Төвд байрлуулах
    marginBottom: 20,
  },
  quantityLabel: {
    // Тоо ширхэгийн label
    fontSize: 16,
    color: "#333",
    marginRight: 10,
  },
  quantityButton: {
    // '+' '-' товч
    backgroundColor: "#eee",
    borderRadius: 20, // Дугуй хэлбэр
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    // '+' '-' товчны текст
    fontSize: 18,
    fontWeight: "bold",
    color: "#555",
  },
  quantityInputContainer: {
    // Тоо ширхэгийг харуулах container
    minWidth: 40, // Бага зэрэг зай авах
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 10,
  },
  quantityText: {
    // Тоо ширхэгийн текст
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  totalPrice: {
    // Нийт үнэ
    fontSize: 18,
    fontWeight: "bold",
    color: "#1ea5b0", // Нийт үнийн онцлох өнгө
    textAlign: "center", // Төвд байрлуулах
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },

  // Захиалга хийх товчлуур
  bookButton: {
    backgroundColor: "#2F58CD", // Товчны өнгө
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    marginTop: 30, // Агаар зай
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 4,
  },
  bookButtonText: {
    // Товчны текст
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  bookButtonDisabled: {
    // Товч disabled үеийн стил
    backgroundColor: "#ccc", // Саарал өнгө
  },
});

export default TicketPage; // Компонентийн нэр
