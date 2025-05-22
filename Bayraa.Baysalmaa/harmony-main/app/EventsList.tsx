import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { jwtDecode } from "jwt-decode";
import moment from "moment";

const BASE_URL = "http://127.0.0.1:8000";

interface Event {
  id: number;
  image: string;
  button_text: string;
  location: string;
  price: string;
  date: string;
}

const getTokenExpiry = (token: string): number | null => {
  try {
    const decoded: any = jwtDecode(token);
    return decoded?.exp ? decoded.exp * 1000 : null;
  } catch {
    return null;
  }
};

const isTokenExpired = (expiryTime: number | null): boolean =>
  expiryTime === null || Date.now() >= expiryTime;

const EventsList = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const getValidAccessToken = async (): Promise<string | null> => {
    let token = await AsyncStorage.getItem("jwt_token");

    if (token) {
      const expiryTime = getTokenExpiry(token);
      if (isTokenExpired(expiryTime)) {
        try {
          token = await refreshToken();
        } catch {
          return null;
        }
      }
    } else {
      try {
        token = await refreshToken();
      } catch {
        return null;
      }
    }

    return token;
  };

  const refreshToken = async () => {
    const refresh = await AsyncStorage.getItem("refreshToken");
    if (!refresh) throw new Error("Missing refresh token");

    const res = await axios.post(`${BASE_URL}/api/token/refresh/`, {
      refresh,
    });

    const newAccessToken = res.data.access;
    await AsyncStorage.setItem("jwt_token", newAccessToken);
    return newAccessToken;
  };

  const fetchEvents = async () => {
    try {
      const token = await getValidAccessToken();
      const res = await axios.get(`${BASE_URL}/events/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchEvents();
    setRefreshing(false);
  };

  const renderItem = ({ item }: { item: Event }) => {
    const formattedDate = moment(item.date).format("MMMM D, YYYY • HH:mm");

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: "/EventDetail",
            params: { event: JSON.stringify(item) },
          })
        }
      >
        <View style={styles.row}>
          <Image
            source={{ uri: `${BASE_URL}${item.image}` }}
            style={styles.image}
          />
          <View style={styles.content}>
            <Text style={styles.title}>{item.button_text}</Text>
            <Text style={styles.datetime}>{formattedDate}</Text>
            <Text style={styles.location}>{item.location}</Text>
            <View style={styles.priceTag}>
              <Text style={styles.price}>{item.price}65000₮</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backButton}>← Буцах</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </>
  );
};

export default EventsList;

const styles = StyleSheet.create({
  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
  },
  backButton: {
    color: "#2F58CD",
    fontSize: 16,
    fontWeight: "bold",
  },
  list: {
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    paddingBottom: 40,
  },
  card: {
    marginVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 10,
    resizeMode: "cover",
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0B2B6C",
    marginBottom: 6,
  },
  datetime: {
    fontSize: 14,
    color: "#333",
    marginBottom: 3,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginBottom: 6,
  },
  priceTag: {
    backgroundColor: "#EDF1FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  price: {
    color: "#2F58CD",
    fontWeight: "600",
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
