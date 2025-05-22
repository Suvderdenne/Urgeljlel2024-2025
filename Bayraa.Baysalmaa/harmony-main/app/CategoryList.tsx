import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// Category type
interface Category {
  id: number;
  name: string;
  icon: string;
}

// Категори татах функц (JWT token ашиглан)
const fetchCategories = async (): Promise<Category[]> => {
  const token = await AsyncStorage.getItem("jwt_token");
  const response = await axios.get(
    "http://your-backend-ip-address:8000/api/categories/",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const CategoriesScreen = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (error) {
        console.error("Категори татаж чадсангүй:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  const renderCategory = ({ item }: { item: Category }) => (
    <TouchableOpacity style={styles.card}>
      <Image
        source={{ uri: `http://your-backend-ip-address:8000${item.icon}` }}
        style={styles.image}
      />
      <Text style={styles.name}>{item.name}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text>Уншиж байна...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderCategory}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  card: {
    alignItems: "center",
    margin: 10,
    flex: 1,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 12,
  },
  name: {
    marginTop: 8,
    fontWeight: "bold",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CategoriesScreen;
