// // app/ticket/[sectionId].tsx
// import React, { useEffect, useState } from "react";
// import { View, Text, FlatList, StyleSheet } from "react-native";
// import { useLocalSearchParams } from "expo-router";
// import axios from "axios";
// import TicketCard from "./TicketCard";

// interface Ticket {
//   id: number;
//   name: string;
//   price: number;
//   discount_price?: number;
//   discount_until?: string;
// }

// export default function TicketSection() {
//   const params = useLocalSearchParams<{
//     sectionId: string;
//     sectionName: string;
//   }>();
//   const { sectionId, sectionName } = params;
//   const [tickets, setTickets] = useState<Ticket[]>([]);

//   useEffect(() => {
//     axios
//       .get(`http://127.0.0.1:8000/ticket-types/?section=${sectionId}`)
//       .then((res) => setTickets(res.data.data))
//       .catch(console.error);
//   }, [sectionId]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>{sectionName}</Text>
//       <FlatList
//         data={tickets}
//         keyExtractor={(t) => t.id.toString()}
//         renderItem={({ item }) => (
//           <TicketCard
//             title={item.name}
//             price={item.price}
//             discountPrice={item.discount_price}
//             discountUntil={item.discount_until}
//           />
//         )}
//         contentContainerStyle={{ paddingBottom: 24 }}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 16, backgroundColor: "#F0F2F5" },
//   title: {
//     fontSize: 22,
//     fontWeight: "700",
//     marginBottom: 16,
//     color: "#111827",
//   },
// });
