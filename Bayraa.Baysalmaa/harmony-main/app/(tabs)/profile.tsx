// app/(tabs)/profile/index.tsx
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import React from "react";
import { Stack, useRouter } from "expo-router";
import { MaterialCommunityIcons, Feather, Ionicons } from "@expo/vector-icons"; // Icon library
import AsyncStorage from "@react-native-async-storage/async-storage"; // Required for logout

// Токен удирдлагын функцууд (clearTokens)
// Эдгээр функцүүдийг таны төсөлд хаана байгаагаас хамаарч импорт хийнэ.
// Жишээ нь: import { clearTokens } from '../../utils/auth';
// Хэрэв тусдаа файлгүй бол, энд хэрэгжүүлэлтийг нь оруулна.
const clearTokens = async () => {
  try {
    await AsyncStorage.multiRemove(["jwt_token", "refreshToken"]);
    console.log("Tokens cleared successfully.");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

// Цэсийн зүйлийн бүтэц
interface MenuItem {
  id: string; // Unique ID
  label: string; // Текст
  iconName:
    | keyof typeof MaterialCommunityIcons.glyphMap
    | keyof typeof Feather.glyphMap
    | keyof typeof Ionicons.glyphMap; // Icon нэр
  iconLibrary: "MaterialCommunityIcons" | "Feather" | "Ionicons"; // Icon сан
  route?: string; // Шижих зам
  isLogout?: boolean; // Logout эсэх
}

// Цэсийн зүйлсийн жагсаалт
const menuItems: MenuItem[] = [
  {
    id: "personal_info",
    label: "Хувийн мэдээлэл",
    iconName: "account",
    iconLibrary: "MaterialCommunityIcons",
    // ЭНЭ ЗАМЫГ upprofile.tsx файлын замтай тааруулна УУ!
    // Хэрэв app/upprofile.tsx гэсэн файл бол зам нь "/upprofile" байна.
    // Хэрэв app/(tabs)/upprofile.tsx бол "/(tabs)/upprofile" байна.
    // Таны тохиолдолд upprofile.tsx гэсэн файл үүсгэсэн гэж байгаа тул "/upprofile" гэж таамаглав.
    route: "/upprofile", // <--- upprofile.tsx хуудасны зам
  },

  {
    id: "tickets",
    label: "Тасалбар",
    iconName: "ticket-confirmation-outline",
    iconLibrary: "MaterialCommunityIcons",
    route: "/(tabs)/tickets", // Жишээ зам
  },
  {
    id: "bookings",
    label: "Захиалга",
    iconName: "book-open-outline",
    iconLibrary: "MaterialCommunityIcons",
    // order.tsx файлын зам руу шилжих
    // Хэрэв app/(tabs)/order.tsx бол зам нь "/(tabs)/order" байна.
    route: "/order", // <--- order.tsx хуудасны зам
  },
  // Тусгаарлагч

  {
    id: "attended_events",
    label: "Оролцсон эвэнт",
    iconName: "calendar-check-outline",
    iconLibrary: "MaterialCommunityIcons",
    route: "/(tabs)/my-attended-events", // Жишээ зам
  },
  // Тусгаарлагч
  {
    id: "logout",
    label: "Системээс гарах",
    iconName: "logout",
    iconLibrary: "MaterialCommunityIcons",
    isLogout: true, // Logout
  },
];

const ProfileMenuScreen = () => {
  const router = useRouter();

  // Цэсийн зүйл дээр дарах үед ажиллах функц
  const handleItemPress = async (item: MenuItem) => {
    if (item.isLogout) {
      // Logout үйлдлийг хийнэ
      Alert.alert(
        "Системээс гарах",
        "Та системээс гарахдаа итгэлтэй байна уу?",
        [
          {
            text: "Үгүй",
            style: "cancel",
          },
          {
            text: "Тийм",
            onPress: async () => {
              await clearTokens(); // Tokens-г устгана
              // Login хуудас руу шилжинэ (root зам ихэвчлэн login байдаг)
              router.replace("/login" as any); // <-- Type assertion нэмсэн
            },
          },
        ]
      );
    } else if (item.route) {
      // Харгалзах зам руу шилжинэ
      router.push(item.route as any); // <-- Type assertion нэмсэн
    }
    // Хэрэв route эсвэл isLogout байхгүй зүйл байвал энд нэмэлт логик бичиж болно.
  };

  // Icon рендэрлэх туслах функц
  const renderIcon = (
    name: MenuItem["iconName"],
    library: MenuItem["iconLibrary"],
    color: string,
    size: number
  ) => {
    switch (library) {
      case "MaterialCommunityIcons":
        return (
          <MaterialCommunityIcons
            name={name as keyof typeof MaterialCommunityIcons.glyphMap}
            size={size}
            color={color}
          />
        );
      case "Feather":
        return (
          <Feather
            name={name as keyof typeof Feather.glyphMap}
            size={size}
            color={color}
          />
        );
      case "Ionicons":
        return (
          <Ionicons
            name={name as keyof typeof Ionicons.glyphMap}
            size={size}
            color={color}
          />
        );
      default:
        return null; // Эсвэл default icon харуулж болно
    }
  };

  return (
    <>
      {/* Хуудасны Header */}
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Миний Профайл", // Гарчиг
          headerBackVisible: false, // Буцах товчийг нуух
          // ... бусад header тохиргоо ...
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

      {/* Цэсийн жагсаалтыг харуулах ScrollView */}
      <ScrollView style={styles.container}>
        {/* menuItems массивыг давтаж цэсийн зүйл тус бүрийг харуулна */}
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id} // Key нь давхардахгүй байх ёстой
            style={[
              styles.menuItem, // Ерөнхий стил
              item.isLogout && styles.logoutMenuItem, // Logout бол нэмэлт стил
              index === 0 && styles.firstMenuItem, // Эхний зүйлд зориулсан стил
              index === menuItems.length - 1 && styles.lastMenuItem, // Хамгийн сүүлийн зүйлд зориулсан стил
            ]}
            onPress={() => handleItemPress(item)} // Дарахад функц дуудна
          >
            <View style={styles.menuItemContent}>
              {/* Icon рендэрлэнэ */}
              <View style={styles.iconContainer}>
                {renderIcon(
                  item.iconName,
                  item.iconLibrary,
                  item.isLogout ? "#f44336" : "#555",
                  24
                )}{" "}
                {/* Icon өнгө */}
              </View>
              {/* Текст харуулна */}
              <Text
                style={[
                  styles.menuItemText,
                  item.isLogout && styles.logoutMenuItemText,
                ]}
              >
                {item.label}
              </Text>
            </View>
            {/* Навигаци хийх зүйлсэд баруун сум харуулна (logout-оос бусад) */}
            {!item.isLogout && (
              <Ionicons name="chevron-forward-outline" size={24} color="#ccc" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </>
  );
};

// Стилүүд
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7", // Цэсийн background
    paddingTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff", // Зүйл тус бүрийн background
    borderBottomWidth: 1,
    borderBottomColor: "#eee", // Тусгаарлах шугам
  },
  firstMenuItem: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderTopWidth: 1,
    borderColor: "#eee",
    marginTop: 10,
  },
  lastMenuItem: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderBottomWidth: 0, // Хамгийн сүүлийн зүйл дээр доод шугам байхгүй
    marginBottom: 10,
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    marginRight: 15,
    width: 30,
    alignItems: "center",
  },
  menuItemText: {
    fontSize: 16,
    color: "#333",
  },
  logoutMenuItem: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    borderBottomWidth: 1,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  logoutMenuItemText: {
    color: "#f44336", // Улаан өнгө
    fontWeight: "bold",
  },
});

export default ProfileMenuScreen;
