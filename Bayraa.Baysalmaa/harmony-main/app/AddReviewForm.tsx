import React, { useState } from "react";
import { View, TextInput, Button, Text } from "react-native";
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/reviews"; // << Та өөрийнхөө API URL-тай солих

type AddReviewFormProps = {
  id: number | string;
  type: "artist" | "event";
  onSubmitted: () => void;
};

const AddReviewForm: React.FC<AddReviewFormProps> = ({
  id,
  type,
  onSubmitted,
}) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState("5");
  const [loading, setLoading] = useState(false);

  const submitReview = async () => {
    try {
      setLoading(true);
      const url = `${API_BASE_URL}/${
        type === "artist" ? "artists" : "events"
      }/${id}/reviews/`;
      await axios.post(url, { comment, rating: parseInt(rating) });
      setComment("");
      setRating("5");
      onSubmitted();
    } catch (e) {
      console.log("Review post error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 16 }}>
      <Text>Rating (1-5):</Text>
      <TextInput
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={{ borderBottomWidth: 1 }}
      />
      <Text>Comment:</Text>
      <TextInput
        value={comment}
        onChangeText={setComment}
        style={{ borderWidth: 1, marginBottom: 8 }}
        multiline
        numberOfLines={4}
      />
      <Button
        title={loading ? "Submitting..." : "Submit Review"}
        onPress={submitReview}
      />
    </View>
  );
};

export default AddReviewForm;
