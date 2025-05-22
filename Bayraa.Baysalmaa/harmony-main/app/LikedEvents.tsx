import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLiked } from "./LikedContext";

const LikedEventsScreen = () => {
  const { likedEvents } = useLiked();

  return (
    <ScrollView>
      <View>
        <Text style={{ fontSize: 24, fontWeight: "bold" }}>Liked Events</Text>
        {likedEvents.length === 0 ? (
          <Text>No liked events</Text>
        ) : (
          likedEvents.map((eventId) => (
            <Text key={eventId}>Event ID: {eventId}</Text>
          ))
        )}
      </View>
    </ScrollView>
  );
};

export default LikedEventsScreen;
