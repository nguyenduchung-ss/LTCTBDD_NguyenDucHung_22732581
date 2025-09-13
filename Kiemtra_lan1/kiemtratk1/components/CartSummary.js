import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function CartSummary({ cart }) {
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <View style={styles.cartInfo}>
      <Text style={styles.cartText}>{cart.length} sản phẩm</Text>
      <Text style={styles.cartText}>
        Tổng tiền: {totalPrice.toLocaleString("vi-VN")} đ
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  cartInfo: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 6,
    elevation: 2,
    marginBottom: 12,
  },
  cartText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
});
