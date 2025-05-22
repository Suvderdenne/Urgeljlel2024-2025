import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const LikeScreen = () => {
  const [isSeen, setIsSeen] = useState(false);

  const handleMarkAsSeen = () => {
    setIsSeen(true);
  };

  return (
    <TouchableOpacity
      style={[styles.notificationCard, isSeen && styles.seen]}
      onPress={handleMarkAsSeen}
    >
      <Image
        source={{ uri: "https://example.com/profile.jpg" }}
        style={styles.profileImage}
      />
      <View style={styles.textContainer}>
        <Text style={styles.notificationText}>
          <Text style={styles.username}>John Doe</Text> has followed you!
        </Text>
        <Text style={styles.timeText}>Just now</Text>
      </View>
      <TouchableOpacity style={styles.viewButton}>
        <Text style={styles.viewButtonText}>View</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  notificationCard: {
    flexDirection: "row",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    borderWidth: 1,
    borderColor: "#ddd",
  },
  seen: {
    backgroundColor: "#f2f2f2", // Background color after being seen
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  notificationText: {
    fontSize: 16,
    color: "#333",
  },
  username: {
    fontWeight: "bold",
  },
  timeText: {
    fontSize: 12,
    color: "#888",
  },
  viewButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#0095F6",
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  viewButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default LikeScreen;
