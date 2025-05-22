// app/TicketCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

// TicketCard компонентийн хүлээж авах props-ын Interface
interface TicketCardProps {
  title: string; // Тасалбарын нэр (жишээ нь, Standard, VIP)
  price: number; // Ерөнхий үнэ
  discountPrice?: number; // Хямдралтай үнэ (байхгүй байж болно)
  discountUntil?: string; // Хямдралын хугацаа (байхгүй байж болно)
  description?: string; // Тасалбарын тайлбар (нэмсэн)
  // Энд та нэмэлт props нэмж болно, жишээ нь:
  // onPress?: () => void; // Карт дээр дарах үед хийгдэх үйлдэл
  // isSelected?: boolean; // Сонгогдсон эсэх
}

// TicketCard компонент
const TicketCard: React.FC<TicketCardProps> = ({
  title,
  price,
  discountPrice,
  discountUntil,
  description, // description нэмсэн
  // onPress, // Хэрэв ашиглах бол энд оруулна
  // isSelected, // Хэрэв ашиглах бол энд оруулна
}) => {
  // Хямдралтай эсэхийг шалгах (discountPrice байгаа бөгөөд ерөнхий үнээс бага бол)
  const hasDiscount =
    discountPrice !== undefined &&
    discountPrice !== null &&
    discountPrice < price;

  return (
    // Та энд TouchableOpacity ашиглаж карт дээр дарах боломжтой болгож болно
    // <TouchableOpacity onPress={onPress} style={[styles.cardContainer, isSelected && styles.selectedCard]}>
    <View style={styles.cardContainer}>
      <View style={styles.infoContainer}>
        <Text style={styles.ticketTitle}>{title}</Text>

        {description &&
          description.trim().length > 0 && ( // Тайблар байвал харуулна
            <Text style={styles.ticketDescription}>{description}</Text>
          )}

        {hasDiscount ? (
          // Хямдралтай үнэ байвал харуулах
          <View style={styles.priceContainer}>
            <Text style={styles.discountPrice}>{discountPrice} ₮</Text>
            <Text style={styles.originalPrice}>{price} ₮</Text>
          </View>
        ) : (
          // Хямдралгүй үнэ
          <Text style={styles.price}>{price} ₮</Text>
        )}

        {/* Хямдралын хугацаа байвал харуулах */}
        {hasDiscount && discountUntil && discountUntil.trim().length > 0 && (
          // Та энд discountUntil string-г огноо хэлбэрт форматлах функц ашиглаж болно
          <Text style={styles.discountUntil}>Хүчинтэй: {discountUntil}</Text>
        )}

        {/* Та энд тасалбарын тоо ширхэг сонгох хэсэг нэмж болно */}
      </View>
      {/* Та энд тасалбар сонгох check box эсвэл товчлуур нэмж болно */}
    </View>
    // </TouchableOpacity>
  );
};

// Стилүүд (Та үүнийг өөрийн загварт тааруулж өөрчилнө)
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 0, // Ticket.tsx дотор FlatList-ийн contentContainerStyle padding ашиглаж байгаа тул энд 0 болгосон
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row", // Агуулгыг зэрэгцүүлэх
    justifyContent: "space-between", // Агуулгыг сарниах
    alignItems: "center", // Босоогоор голлуулах
  },
  selectedCard: {
    // Сонгогдсон үед нэмэгдэх стил
    borderColor: "#005BFF", // Сонгогдсон үед хүрээний өнгө
    borderWidth: 2,
  },
  infoContainer: {
    flex: 1, // Байгаа зайг эзлэх
  },
  ticketTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  ticketDescription: {
    // Тасалбарын тайлбарын стил
    fontSize: 13,
    color: "#555",
    marginBottom: 5,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountPrice: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#E91E63", // Хямдралтай үнийн өнгө (Улаан ягаан)
    marginRight: 5,
  },
  originalPrice: {
    fontSize: 13,
    color: "#999",
    textDecorationLine: "line-through", // Зурж харуулах
  },
  price: {
    // Хямдралгүй үнийн стил
    fontSize: 15,
    fontWeight: "bold",
    color: "#4CAF50", // Ногоон
  },
  discountUntil: {
    fontSize: 12,
    color: "#777", // Саарал
    marginTop: 5,
  },
  // Сонгох Checkbox эсвэл товчлуур нэмэх бол энд стилийг нь тодорхойлно
});

export default TicketCard; // Компонентийг экспорт хийх
