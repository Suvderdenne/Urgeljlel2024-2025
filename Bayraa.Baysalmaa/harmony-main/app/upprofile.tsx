// app/upprofile.tsx
import {
  View,
  Text,
  StyleSheet, // Import StyleSheet
  ScrollView, // Scroll хийх боломжтой View
  ActivityIndicator, // Loading Indicator
  Alert, // Мессеж харуулах
  TextInput, // Текст оруулах талбар
  TouchableOpacity, // Товчлуур
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios"; // API дуудлага хийх
import { Stack, useRouter } from "expo-router"; // Навигаци хийх

// --- ТОКЕН УДИРДЛАГАТАЙ ХОЛБООТОЙ ИМПОРТ болон ФУНКЦҮҮД ---
// Эдгээр нь Backend API-тай холбогдох, Authentication хийхэд ЗААВАЛ хэрэгтэй.
// Хэрэв та эдгээрийг тусдаа файл дээр тодорхойлсон бол, доорх хэрэгжүүлэлтийн оронд import хийнэ.

import AsyncStorage from "@react-native-async-storage/async-storage"; // AsyncStorage хэрэгтэй
import { jwtDecode } from "jwt-decode"; // JWT token декод хийх хэрэгтэй

// --- BASE_URL тогтмол утга ---
const BASE_URL = "http://127.0.0.1:8000"; // <--- Backend серверийн URL хаягаа энд ЗӨВ тохируулна УУ!

// --- Токен удирдлагын функцүүдийн хэрэгжүүлэлт ---
// Эдгээр функцууд таны төсөлд байхгүй бол, энэ кодыг ашиглана.
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

// clearTokens функц logout хийхэд хэрэгтэй болно, энд оруулж болно эсвэл utility файлаас импортлоно.
const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove(["jwt_token", "refreshToken"]);
    console.log("Tokens cleared successfully.");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

// --- ТОКЕН УДИРДЛАГАТАЙ ХОЛБООТОЙ КОД ЭНД ДУУСНА ---

// --- UserProfile Interface ---
// Энэ interface таны Backend-ийн User Serializer-ээс ирж буй датаны бүтэцтэй ЯГ таарч байх ёстой!
// first_name, last_name, phone_number зэрэг талбарууд Backend Serializer-ээс ирэхгүй бол эндээс ХАСНА.
interface UserProfile {
  id: number;
  username: string;
  email: string;
  first_name?: string; // Backend Serializer-ээс ирж байвал үлдээнэ
  last_name?: string; // Backend Serializer-ээс ирж байвал үлдээнэ
  phone_number?: string; // Backend Serializer-ээс ирж байвал үлдээнэ
  // ... бусад талбарууд ...
}

// --- Styles ---
// Stylesheet-ийг энд тодорхойлно. UpprofilePage компонентийн return хэсгээс дээш байрлана.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Ерөнхий background
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

  // Хувийн мэдээлэл хэсгийн стилүүд
  profileInfoSection: {
    marginTop: 10,
    marginBottom: 20,
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
  inputLabel: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    marginTop: 15,
  },
  textInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  updateButton: {
    backgroundColor: "#2F58CD",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 50,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  updateButtonDisabled: {
    backgroundColor: "#ccc",
  },

  // Хэрэв захиалгын жагсаалтыг upprofile.tsx дээр харуулах бол захиалгын стилүүдийг энд нэмнэ
  // bookingsSection: { ... }, bookingItem: { ... }, ... г.м.
});

const UpprofilePage = () => {
  // Таны компонентийн нэр upprofile.tsx файлын нэрээс хамаарна
  const router = useRouter(); // Expo Router ашиглаж байвал

  // --- State Variables ---
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Засах боломжтой талбаруудын state
  const [editableUsername, setEditableUsername] = useState("");
  const [editableEmail, setEditableEmail] = useState("");
  const [editableFirstName, setEditableFirstName] = useState(""); // Backend Serializer-ээс ирэхгүй бол энийг болон холбогдох кодуудыг хасна.
  const [editableLastName, setEditableLastName] = useState(""); // Backend Serializer-ээс ирэхгүй бол энийг болон холбогдох кодуудыг хасна.
  const [editablePhoneNumber, setEditablePhoneNumber] = useState(""); // phone_number Backend Serializer-ээс ирэхгүй бол энийг болон холбогдох кодуудыг хасна.
  // ... бусад editable state-үүд ...

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false); // Шинэчилж байгаа үеийн төлөв

  // --- Fetch User Profile Function ---
  const fetchUserProfile = useCallback(async () => {
    setLoadingProfile(true);
    setProfileError(null);
    try {
      const token = await getValidAccessToken(); // Токен удирдлагын функц дуудсан

      if (!token) {
        setProfileError(
          "Нэвтрэх эрхгүй байна. Хувийн мэдээллийг татах боломжгүй."
        );
        setLoadingProfile(false);
        // router.replace('/login'); // Нэвтрэх эрхгүй бол логин руу шилжүүлж болно.
        return;
      }

      // Backend дээрх хэрэглэгчийн профайлыг татах API endpoint руу GET хүсэлт илгээх
      // ЭНЭ ЗАМЫГ ӨӨРИЙН BACKEND-ИЙН ЖИНХЭНЭ ЗАМТАЙ ТААРУУЛЖ ӨӨРЧИЛНӨ.
      const response = await axios.get(`${BASE_URL}/users/me/`, {
        // BASE_URL ашигласан
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 && response.data) {
        const profileData = response.data;
        setUserProfile(profileData);
        // Editable state-үүдийг татагдсан датагаар дүүргэх
        setEditableUsername(profileData.username || "");
        setEditableEmail(profileData.email || "");
        // Optional chaining ?. ашиглаж TypeScript-ийн анхааруулгыг зассан
        setEditableFirstName(profileData.first_name || "");
        setEditableLastName(profileData.last_name || "");
        setEditablePhoneNumber(profileData.phone_number || "");
        // ... бусад editable state-үүдийг дүүргэх ...
      } else {
        setProfileError(
          `Хувийн мэдээллийг татахад алдаа гарлаа (Статус: ${response.status}).`
        );
      }
    } catch (err: any) {
      console.error("Error fetching user profile:", err);
      let errorMessage = "Хувийн мэдээллийг татахад алдаа гарлаа.";
      // Алдааг дэлгэрэнгүй харуулах (өмнө нь бид ярилцсан)
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const backendError =
            err.response.data?.detail || JSON.stringify(err.response.data);
          if (err.response.status === 401) {
            errorMessage = "Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.";
          } else if (err.response.status === 404) {
            errorMessage = `Серверийн алдаа: ${err.response.status} - Профайл Endpoint олдсонгүй (${backendError})`; // 404 тохиолдолд тодорхой болгож болно
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
      setProfileError(errorMessage);
    } finally {
      setLoadingProfile(false);
    }
  }, [
    getValidAccessToken, // Dependency
    setUserProfile,
    setLoadingProfile,
    setProfileError,
    setEditableUsername,
    setEditableEmail,
    setEditableFirstName,
    setEditableLastName,
    setEditablePhoneNumber,
  ]);

  // --- Update User Profile Function ---
  const handleUpdateProfile = async () => {
    // Талбаруудын утгын шалгалт (Validate) хийнэ
    if (!editableUsername.trim() || !editableEmail.trim()) {
      Alert.alert(
        "Анхааруулга",
        "Хэрэглэгчийн нэр болон И-мэйл хаягийг заавал бөглөнө үү."
      );
      return;
    }
    // И-мэйл хаягийн форматыг шалгаж болно

    setIsUpdatingProfile(true);
    setProfileError(null); // Өмнөх алдааг цэвэрлэх

    try {
      const token = await getValidAccessToken(); // Токен удирдлагын функц дуудсан

      if (!token) {
        Alert.alert(
          "Нэвтрэх алдаа",
          "Профайлыг шинэчлэхэд нэвтрэх эрхгүй байна. Дахин нэвтэрнэ үү."
        );
        setIsUpdatingProfile(false);
        // router.replace('/login'); // Нэвтрэх эрхгүй бол логин руу шилжүүлж болно.
        return;
      }

      // Backend руу илгээх өгөгдөл (payload)
      // Backend Serializer-ийн хүлээн авдаг талбаруудыг оруулна.
      // first_name, last_name, phone_number талбарууд Backend дээр шинэчлэх боломжгүй бол эндээс хасна.
      const payload = {
        username: editableUsername.trim(),
        email: editableEmail.trim(),
        first_name: editableFirstName.trim(), // Backend дээр шинэчлэхгүй бол хасна
        last_name: editableLastName.trim(), // Backend дээр шинэчлэхгүй бол хасна
        phone_number: editablePhoneNumber.trim(), // Backend дээр шинэчлэхгүй бол хасна
        // ... бусад шинэчлэх талбарууд ...
      };

      // Backend дээрх хэрэглэгчийн профайлыг шинэчлэх API endpoint руу PATCH хүсэлт илгээх
      // ЭНЭ ЗАМЫГ ӨӨРИЙН BACKEND-ИЙН ЖИНХЭНЭ ЗАМТАЙ ТААРУУЛЖ ӨӨРЧИЛНӨ.
      // PATCH эсвэл PUT аль method-г ашиглахаа Backend-тэй тааруулна.
      const response = await axios.patch(`${BASE_URL}/api/users/me/`, payload, {
        // BASE_URL ашигласан
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Чухал
        },
      });

      if (response.status === 200) {
        // Амжилттай үед 200 OK ихэвчлэн ирнэ
        Alert.alert("Амжилттай", "Хувийн мэдээлэл амжилттай шинэчлэгдлээ.");
        // Backend-ээс ирсэн шинэчлэгдсэн датагаар state-ээ шинэчилж болно
        setUserProfile(response.data);
        // Editable талбаруудыг буцаж ирсэн датагаар дахин дүүргэх нь сайн
        setEditableUsername(response.data.username || "");
        setEditableEmail(response.data.email || "");
        setEditableFirstName(response.data.first_name || "");
        setEditableLastName(response.data.last_name || "");
        setEditablePhoneNumber(response.data.phone_number || "");
        // ... бусад editable state-үүдийг шинэчлэх ...
      } else {
        // Амжилттай боловч 200 биш статус ирвэл
        Alert.alert(
          "Алдаа",
          `Хувийн мэдээлэл шинэчлэхэд алдаа гарлаа (Статус: ${response.status}).`
        );
      }
    } catch (err: any) {
      console.error("Error updating user profile:", err);
      let errorMessage =
        "Хувийн мэдээлэл шинэчлэхэд алдаа гарлаа. Дахин оролдоно уу.";
      // Алдааг дэлгэрэнгүй харуулах (өмнө нь бид ярилцсан)
      if (axios.isAxiosError(err)) {
        if (err.response) {
          const backendError =
            err.response.data?.detail || JSON.stringify(err.response.data);
          if (err.response.status === 401) {
            errorMessage = "Нэвтрэх эрх хүчингүй болсон. Дахин нэвтэрнэ үү.";
          } else if (err.response.status === 400) {
            // Validation алдаа гарвал
            errorMessage = `Мэдээлэл буруу байна: ${backendError}`;
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
      setIsUpdatingProfile(false); // Шинэчлэх loading-г зогсоох
    }
  };

  // --- useEffect Hook ---
  // Хуудас анх ачаалагдах үед хэрэглэгчийн мэдээллийг татаж авах
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]); // fetchUserProfile функцийг dependency болгож оруулна.

  // --- UI Rendering --- (return хэсэг)
  return (
    // Энд таны upprofile.tsx хуудасны үндсэн UI байна
    // Expo Router ашиглаж байвал Header-г энд тохируулж болно
    <>
      {" "}
      {/* Нэг үндсэн элементээр ороосон */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Хувийн мэдээлэл шинэчлэх", // Хуудасны гарчиг
          // headerBackTitleVisible гэсэн option байхгүй тул хассан
          // ... бусад header тохиргоо ...
        }}
      />
      {/* ScrollView-г нэг үндсэн View-ээр ороосон */}
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {/* Дата ачааллаж байгаа үед */}
          {loadingProfile ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#1ea5b0" />{" "}
              {/* size="large" болгож болно */}
              <Text style={styles.messageText}>
                Мэдээллүүдийг ачааллаж байна...
              </Text>
            </View>
          ) : profileError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{profileError}</Text>
              {/* Дахин ачаалах товчлуур */}
              <TouchableOpacity
                style={styles.retryButton}
                onPress={fetchUserProfile} // Дахин ачаалах үйлдлийг холбох
              >
                <Text style={styles.retryButtonText}>Дахин ачаалах</Text>
              </TouchableOpacity>
            </View>
          ) : userProfile ? (
            <View style={styles.profileInfoSection}>
              {" "}
              {/* Input талбаруудыг profileInfoSection дотор оруулсан */}
              <Text style={styles.sectionTitle}>Хувийн мэдээлэл</Text>{" "}
              {/* Гарчиг нэмсэн */}
              <Text style={styles.inputLabel}>Хэрэглэгчийн нэр:</Text>
              <TextInput
                style={styles.textInput}
                value={editableUsername}
                onChangeText={setEditableUsername}
                editable={!isUpdatingProfile} // Шинэчилж байхад засахыг хориглох
              />
              <Text style={styles.inputLabel}>И-мэйл:</Text>
              <TextInput
                style={styles.textInput}
                value={editableEmail}
                onChangeText={setEditableEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isUpdatingProfile} // Шинэчилж байхад засахыг хориглох
              />
              {/* first_name талбар (Backend Serializer-ээс ирж байвал харуулна) */}
              {/* Optional chaining ?. ашиглан null байх магадлалыг шалгасан */}
              {userProfile?.first_name !== undefined && (
                <View>
                  {" "}
                  {/* Элементүүдийг View-ээр ороосон */}
                  <Text style={styles.inputLabel}>Эхний нэр:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Эхний нэр..."
                    value={editableFirstName}
                    onChangeText={setEditableFirstName}
                    editable={!isUpdatingProfile}
                  />
                </View>
              )}
              {/* last_name талбар (Backend Serializer-ээс ирж байвал харуулна) */}
              {userProfile?.last_name !== undefined && (
                <View>
                  {" "}
                  {/* Элементүүдийг View-ээр ороосон */}
                  <Text style={styles.inputLabel}>Эцэг/Эхийн нэр:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Эцэг/Эхийн нэр..."
                    value={editableLastName}
                    onChangeText={setEditableLastName}
                    editable={!isUpdatingProfile}
                  />
                </View>
              )}
              {/* phone_number талбар (Backend Serializer-ээс ирж байвал харуулна) */}
              {userProfile?.phone_number !== undefined && (
                <View>
                  {" "}
                  {/* Элементүүдийг View-ээр ороосон */}
                  <Text style={styles.inputLabel}>Утасны дугаар:</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Утасны дугаар..."
                    value={editablePhoneNumber}
                    onChangeText={setEditablePhoneNumber}
                    keyboardType="phone-pad"
                    editable={!isUpdatingProfile}
                  />
                </View>
              )}
              {/* --- Шинэчлэх товчлуур --- */}
              <TouchableOpacity
                style={[
                  styles.updateButton,
                  isUpdatingProfile && styles.updateButtonDisabled,
                ]}
                onPress={handleUpdateProfile}
                disabled={isUpdatingProfile} // Шинэчилж байхад disable хийх
              >
                {isUpdatingProfile ? (
                  <ActivityIndicator color="#fff" /> // Шинэчилж байхад loader харуулах
                ) : (
                  <Text style={styles.updateButtonText}>Шинэчлэх</Text>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.noDataContainer}>
              <Text style={styles.noDataText}>
                Хэрэглэгчийн мэдээлэл олдсонгүй.
              </Text>
            </View>
          )}

          {/* Бусад хэсгүүд (жишээ нь, Захиалгын жагсаалт) */}
          {/* Хэрэв Захиалгын жагсаалтыг энд харуулах бол, холбогдох кодыг энд нэмнэ. */}
        </ScrollView>{" "}
        {/* ScrollView-г хаасан */}
      </View>{" "}
      {/* Үндсэн View-г хаасан */}
    </>
  );
};

export default UpprofilePage; // Таны компонентийн нэр upprofile.tsx файлын нэрээс хамаарна
