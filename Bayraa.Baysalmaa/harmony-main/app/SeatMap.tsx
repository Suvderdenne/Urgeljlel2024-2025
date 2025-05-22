// SeatMap.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

export interface Seat {
  row: number;
  col: number;
}

interface SeatMapProps {
  rows: number;
  cols: number;
  bookedSeats: Seat[];
  onSelectionChange: (selectedSeats: Seat[]) => void;
}

const SeatMap: React.FC<SeatMapProps> = ({
  rows,
  cols,
  bookedSeats,
  onSelectionChange,
}) => {
  const [selectedSeats, setSelectedSeats] = React.useState<Seat[]>([]);

  const toggleSeatSelection = (seat: Seat) => {
    const exists = selectedSeats.some(
      (s) => s.row === seat.row && s.col === seat.col
    );
    const updated = exists
      ? selectedSeats.filter((s) => !(s.row === seat.row && s.col === seat.col))
      : [...selectedSeats, seat];
    setSelectedSeats(updated);
    onSelectionChange(updated);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Суудал сонгох</Text>
      <View style={styles.stageContainer}>
        <Text style={styles.stageText}>Тайз</Text>
      </View>
      <View style={styles.seatMap}>
        {Array.from({ length: rows }).map((_, r) => (
          <View key={r} style={styles.row}>
            {Array.from({ length: cols }).map((_, c) => {
              const seat = { row: r + 1, col: c + 1 };
              const isBooked = bookedSeats.some(
                (b) => b.row === seat.row && b.col === seat.col
              );
              const isSelected = selectedSeats.some(
                (s) => s.row === seat.row && s.col === seat.col
              );
              return (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.seat,
                    isBooked && styles.bookedSeat,
                    isSelected && styles.selectedSeat,
                  ]}
                  disabled={isBooked}
                  onPress={() => toggleSeatSelection(seat)}
                >
                  <Text style={styles.seatText}>
                    {seat.row}-{seat.col}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
      {selectedSeats.length > 0 && (
        <View style={styles.selected}>
          <Text style={styles.selectedText}>
            Сонгосон: {selectedSeats.map((s) => `${s.row}-${s.col}`).join(", ")}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 20 },
  stageContainer: {
    backgroundColor: "#FFEB3B",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  stageText: { fontSize: 18, fontWeight: "600" },
  seatMap: { width: "100%" },
  row: { flexDirection: "row", justifyContent: "center", marginBottom: 12 },
  seat: {
    width: 44,
    height: 44,
    backgroundColor: "#E0E0E0",
    margin: 6,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bookedSeat: { backgroundColor: "#B0B0B0" },
  selectedSeat: { backgroundColor: "#4CAF50" },
  seatText: { color: "#fff", fontWeight: "500" },
  selected: { marginTop: 12 },
  selectedText: { fontSize: 16, color: "#4CAF50", fontWeight: "600" },
});

export default SeatMap;
